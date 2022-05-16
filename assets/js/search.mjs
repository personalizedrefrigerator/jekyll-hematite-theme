---
permalink: /assets/js/search.mjs
---

import { stringLookup } from "./strings.mjs";
import AnimationUtil from "./AnimationUtil.mjs";
import AsyncUtil from "./AsyncUtil.mjs";

const PAGE_DATA_URL = `{{ "/assets/page_data.json" | relative_path }}`;
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

    async runSearch(query) {
        let data = await this.getPageData_();
        let results = [];

        query = query
            .replaceAll(/\s+/g, ' ')
            .toLowerCase();

        for (const page of data) {
            // Remove HTML tags.
            let content = page.content
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
                .replaceAll(/\s+/g, ' ');
            content = page.title + "\n" + content;

            // TODO: Improve search!
            let matchLoc = content.toLowerCase().indexOf(query);
            if (matchLoc !== -1) {
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
                    title: page.title,
                    url: page.url,
                    context
                });
            }
        }

        return results;
    }
}

function handleSearch(searcher) {
    const searchInput = document.querySelector(".search-container > #search_input");
    const searchBtn = document.querySelector(".search-container > #search_btn");
    const searchResults = document.querySelector("#sidebar > .search-results");

    searchInput.setAttribute("placeholder", stringLookup(`search_site_placeholder`));
    searchBtn.disabled = true;

    searcher ??= new Searcher();

    const showResults = (results) => {
        let descriptionElem = document.createElement("div");
        descriptionElem.innerText =
                stringLookup(`found_search_results`, results.length);
        descriptionElem.classList.add(`results-description`);

        searchResults.replaceChildren(descriptionElem);

        for (const result of results) {
            let link = document.createElement("a");
            let context = document.createElement("div");
            context.classList.add('context');

            link.innerText = result.title;
            link.href = result.url;
            context.innerText = result.context;

            link.appendChild(context);
            searchResults.appendChild(link);
        }

        AnimationUtil.expandInVert(searchResults);
        searchResults.classList.remove(`hidden`);
    };

    const showError = (error) => {
        let errorDescription = document.createElement("div");
        errorDescription.innerText = stringLookup(`search_error`, `${error}`);
        searchResults.replaceChildren(errorDescription);

        AnimationUtil.expandInVert(searchResults);
        searchResults.classList.remove(`hidden`);
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
                showResults(results);
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
export { handleSearch };
