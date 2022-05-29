---
permalink: assets/js/search.mjs
---

import { stringLookup } from "./strings.mjs";
import { expandContainingDropdowns } from "./dropdownExpander.mjs";
import AnimationUtil from "./AnimationUtil.mjs";
import AsyncUtil from "./AsyncUtil.mjs";
import UrlHelper from "./UrlHelper.mjs";

const PAGE_DATA_URL = `{{ "/assets/search_data.json" | relative_url }}`;
const MATCHING_TITLE_PRIORITY_INCREMENT = 15;
const ALREADY_SEEN_PRIORITY_DECREMENT = 100;
const SEARCH_CONTEXT_LEN = 40;

/// Handles fetching page data, caching it, etc.
class Searcher {
    constructor() {
        this.cachedData_ = null;
    }

    async getPageData_() {
        if (this.cachedData_ == null) {
            let response = await fetch(PAGE_DATA_URL);

            // If the server responded, but something went wrong,
            if (!response.ok) {
                throw new Error(
                    `While fetching search data from “${PAGE_DATA_URL}”:` +
                    ` Server responded with code ${response.status}/${response.statusText}.`
                );
            }

            let json = await (response).json();
            this.cachedData_ = json;
        }

        return this.cachedData_;
    }

    filterContent_(content) {
        return content
        // Remove tags that have attributes < 20 characters long (total)
                .replaceAll(/[<][/]?\w+\s*[^>]{0,20}[>]/g, "")
        // Remove tags with known attributes
                .replaceAll(/[<]\w+(?:\s+(?:href|class|id|src)\s*[=]\s*["'].*['"])+[>]/g, "")
        // Replace escape sequences
                .replaceAll(/[&]lt;/g, "<")
                .replaceAll(/[&]gt;/g, ">")
                .replaceAll(/[&]ldquo;/g, '"')
                .replaceAll(/[&]rdquo;/g, '"')
                .replaceAll(/[&]amp;/g, "&")
        // Remove the astrisks around **bolded** text
                .replaceAll(/(\s|^)[*]{2}[^*]+[*]{2}(\s|$)/g, "$1$2$3")
        // Remove the backticks around `text` that is code-formatted
                .replaceAll(/(\s|^)[`]([^`]+)[`](\s|$)/g, "$1$2$3") // `
                .replaceAll(/\s+/g, ' ');

    }

    filterQuery_(query) {
        return query
            .toLowerCase()
            .replaceAll(/\s+/g, ' ');
    }

    /// Get number of full matches for [query] in [text].
    /// @precondition [text] is already in a searchable (i.e.
    /// filtered) form.
    getNumberOfMatches(query, text) {
        query = this.filterQuery_(query);

        return text.toLowerCase().split(query).length - 1;
    }

    /// Get the index of the first full match for [query] in
    /// [text], starting at [startPos]. Returns -1 if no match
    /// is found.
    /// @precondition [text] is already in a searchable form.
    getIdxOfFirstMatch(query, text, startPos) {
        query = this.filterQuery_(query);

        return text.toLowerCase().indexOf(query, startPos);
    }

    /// Get the container element for the [n]th search
    /// result for [query] in the given [elem].
    /// Returns an Element.
    getNthResultIn(elem, query, n) {
        var recurse = (elem) => {
            let isElement = elem.tagName != undefined;

            if (n < 0) {
                return null;
            }

            // The element must actually contain the query.
            // [elem] may not be an Element (we only require that it be a Node),
            // so use textContent.
            let searchText = this.filterContent_(isElement ? elem.innerHTML : elem.textContent);
            searchText = searchText.toLowerCase();

            if (searchText.indexOf(query) == -1) {
                return null;
            }

            // If the current node is a leaf,
            if (elem.childNodes.length == 0) {
                let numMatches = this.getNumberOfMatches(query, searchText);
                n -= numMatches;

                // If we've considered enough matches,
                if (n < 0) {
                    return elem;
                }
            }

            for (const child of elem.childNodes) {
                let res = recurse(child);

                if (res) {
                    let resIsElement = res.tagName != undefined;

                    if (isElement && !resIsElement) {
                        return elem;
                    }
                    return res;
                }
            }

            return null;
        };

        return recurse(elem);
    }

    async runSearch(query) {
        let data = await this.getPageData_();
        let results = [];

        query = query
            .replaceAll(/\s+/g, ' ')
            .toLowerCase();

        for (const page of data) {
            // Remove HTML tags.
            let content = this.filterContent_(page.content);
            content += '\n' + (page.title ?? "");

            let pageData = {
                title: page.title,
                url: page.url,
                numMatches: 0,
                titleMatches: (page.title?.toLowerCase()?.indexOf(query) != -1)
            };


            // TODO: Improve search!
            let toSearch = content.toLowerCase();
            let matchLoc = toSearch.indexOf(query);
            let startPos = 0;
            let index = 0;
            while (matchLoc !== -1 && startPos < toSearch.length) {
                let context = content.substring(
                        matchLoc - SEARCH_CONTEXT_LEN,
                        matchLoc + SEARCH_CONTEXT_LEN
                );

                // If content was clipped,
                if (matchLoc - SEARCH_CONTEXT_LEN > 0) {
                    context = '…' + context;
                }
                if (matchLoc + SEARCH_CONTEXT_LEN < content.length) {
                    context += '…';
                }

                results.push({
                    index,
                    context,
                    pageData,
                });

                index ++;
                pageData.numMatches ++;
                startPos = matchLoc + query.length;
                matchLoc = this.getIdxOfFirstMatch(query, toSearch, startPos);
            }
        }

        // Prioritize results
        let includedPages = {};
        for (let i = 0; i < results.length; i++) {
            let result = results[i];

            result.priority = result.pageData.numMatches;

            if (result.pageData.titleMatches) {
                result.priority += MATCHING_TITLE_PRIORITY_INCREMENT;
            }

            // If we already are including a copy of the page, this result
            // is just for another match in the same page. Deprioritize
            if (includedPages[result.pageData.title]) {
                result.priority -= ALREADY_SEEN_PRIORITY_DECREMENT;
            }
            includedPages[result.pageData.title] = true;
        }

        results.sort((a, b) => {
            return b.priority - a.priority;
        });

        return results;
    }
}

/// Extract a search query and index from the current page's URL.
function getUrlQuery() {
    let query, resultIndex;

    let urlArgs = UrlHelper.getPageArgs();
    let pageHash = UrlHelper.getPageHash();

    if (urlArgs === null) {
        return;
    }

    // The page's hash also causes scrolling. Don't focus
    // if the page has a hash.
    if (pageHash != null) {
        return;
    }

    query = urlArgs.query;
    resultIndex = parseInt(urlArgs.index);

    if (urlArgs.index === undefined) {
        resultIndex = 0;
    }

    return { query, resultIndex };
}

/// Scrolls to and shows the search result for the given [query]
/// If neither [query] nor [resultIndex] are given, attempt to get them from
/// the page's arguments (i.e. from https://example.com/...?search=...,n=...).
function focusSearchResult(searcher, elem, query, resultIndex) {
    if (elem === undefined) {
        console.warn(`focusSearchResult requires [elem] to function. Not focusing a result.`);
        return;
    }

    if (query === undefined && resultIndex === undefined) {
        let pageArgs = getUrlQuery();

        // No args, nothing to focus.
        if (!pageArgs) {
            return;
        }

        resultIndex = pageArgs.resultIndex;
        query = pageArgs.query;

        if (isNaN(resultIndex)) {
            console.warn("Unable to navigate to result. Given idx is NaN");
            return;
        }
    }

    resultIndex ??= 0;

    if (query === undefined) {
        return;
    }

    let result = searcher.getNthResultIn(elem, query, resultIndex);
    if (result) {
        console.log("Scrolling", result, "into view...");

        expandContainingDropdowns(result);

        result.focus();
        result.scrollIntoView();
    }
}

/// Set up inputs/events using the given [searcher]. If [null], a new
/// [Searcher] is created.
function handleSearch(searcher) {
    const searchInput = document.querySelector(".search-container > #search_input");
    const searchBtn = document.querySelector(".search-container > #search_btn");
    const searchResults = document.querySelector("#sidebar .search-results");

    searchInput.setAttribute("placeholder", stringLookup(`search_site_placeholder`));
    searchBtn.disabled = true;

    searcher ??= new Searcher();
    focusSearchResult(searcher, document.querySelector("main"));

    const showResults = (query, results) => {
        let descriptionElem = document.createElement("div");
        descriptionElem.innerText =
                stringLookup(`found_search_results`, results.length);
        descriptionElem.classList.add(`results-description`);

        searchResults.replaceChildren(descriptionElem);

        for (const result of results) {
            let link = document.createElement("a");
            let context = document.createElement("div");
            context.classList.add('context');

            link.innerText = result.pageData.title ?? stringLookup(`untitled`);
            link.href =
                result.pageData.url + `?query=${escape(query)},index=${result.index}`;
            context.innerText = result.context;

            link.appendChild(context);
            searchResults.appendChild(link);
        }

        AnimationUtil.expandInVert(searchResults);
        searchResults.classList.remove(`hidden`);

        return { descriptionElem };
    };

    const showError = (error) => {
        let errorDescription = document.createElement("div");
        errorDescription.innerText = stringLookup(`search_error`, `${error}`);

        searchResults.replaceChildren(errorDescription);

        AnimationUtil.expandInVert(searchResults);
        searchResults.classList.remove(`hidden`);

        return { errorDescription };
    };

    const hideResults = () => {
        AnimationUtil.collapseOutVert(searchResults);
        searchResults.classList.add(`hidden`);
    };

    const areSearchResultsHidden = () =>
        searchResults.classList.contains('hidden');

    let lastQuery;
    const updateSearchBtn = () => {
        let searchText = searchInput.value;
        let newLabel = stringLookup(`search_disabled_no_content`);
        let shouldDisable = (searchText == "");
        shouldDisable &&= !searchBtn.classList.contains('close_search');

        searchBtn.disabled = shouldDisable;
        if (!shouldDisable) {
            newLabel = stringLookup(`search_site_action`, searchText);
        }

        // The search button's action is to search
        if (lastQuery == searchText && !areSearchResultsHidden()) {
            searchBtn.classList.add('close_search');
            newLabel = stringLookup(`hide_search_results_action`, searchText);
        }
        else {
            searchBtn.classList.remove('close_search');
        }

        searchBtn.setAttribute("title", newLabel);
    };

    searchBtn.onclick = async () => {
        let query = searchInput.value;

        // If the user hasn't changed the input from their last search,
        // we want to close the search view. Otherwise,
        if (query != lastQuery || areSearchResultsHidden()) {
            lastQuery = searchInput.value;

            try {
                let results = await searcher.runSearch(query);

                showResults(query, results);
            } catch (e) {
                console.error(e);

                showError(e);
            }
        } else {
            hideResults();
        }

        updateSearchBtn();
    };

    // Enter: causes searching to happen
    searchInput.addEventListener("keyup", (evt) => {
        if (evt.key == "Enter") {
            searchBtn.click();
        }

        updateSearchBtn();
    });

    searchInput.addEventListener("input", (evt) => {
        updateSearchBtn();
    });

    updateSearchBtn();
}

export default handleSearch;
export { handleSearch, getUrlQuery, Searcher };
