import { getUrlQuery, Searcher } from "../search.mjs";
import { stringLookup } from "../strings.mjs";
import UrlHelper from "../UrlHelper.mjs";

function isInPresenterMode(targetDoc) {
    return targetDoc.body.classList.contains("remark-presenter-mode");
}

function focusSearchResult(targetWin, query, targetMatchNo, slideshow, searcher) {
    let matchesFound = 0;
    for (const slide of slideshow.getSlides()) {
        let targetText = (slide.content ?? []).join("\n");
        let currentSlideNo = slide.getSlideIndex() + 1;

        matchesFound += searcher.getNumberOfMatches(query, targetText);
        console.log("Considering ", targetText, " with ", matchesFound, "matches found so far");

        if (matchesFound > targetMatchNo) {
            slideshow.gotoSlide(currentSlideNo);
            return;
        }

        // Now search the notes!
        if (slide.notes) {
            targetText = slide.notes.join("\n");
            matchesFound += searcher.getNumberOfMatches(query, targetText);
            if (matchesFound > targetMatchNo) {
                slideshow.gotoSlide(currentSlideNo);

                if (!isInPresenterMode(targetWin.document)) {
                    slideshow.togglePresenterMode();
                }
                return;
            }
        }
    }

    console.log("Found ", matchesFound, " matches, which is less than the target of ", targetMatchNo);
    slideshow.gotoLastSlide();
    return -1;
}

/// Show a search result the user requested through the
/// page's URL.
function focusSearchResultFromUrl(targetWin, slideshow) {
    let { query, resultIndex } = getUrlQuery() ?? {};
    let index = resultIndex;

    if (query === undefined || index === undefined) {
        return;
    }

    console.log("Focusing a search result: ", query, index);

    let searcher = new Searcher();
    focusSearchResult(targetWin, query, index, slideshow, searcher);
}

function focusSlideFromHash(slideshow) {
    let hash = UrlHelper.getPageHash();
    if (!hash) {
        return;
    }

    let targetSlide = parseInt(hash.substring(1));
    if (targetSlide) {
        console.log("Navigating to slide", targetSlide);
        slideshow.gotoSlide(targetSlide);
    }
}

function main(targetWindow, config) {
    // See https://remarkjs.com/#8
    let slideshow = targetWindow.remark.create(config);

    // For debugging
    window.slideshow_debug = slideshow;

    targetWindow.focus();

    applyAccessibilityFixes(targetWindow, slideshow);
    focusSearchResultFromUrl(targetWindow, slideshow);
    focusSlideFromHash(slideshow);

    window.addEventListener('hashchange', () => {
        focusSlideFromHash(slideshow);
    });

    slideshow.on('showSlide', function(newSlide) {
        if (!newSlide) {
            return;
        }

        // Update the window's URL to match that of the interior
        // (e.g. slide 3 = #3).
        window.location.hash = newSlide.getSlideIndex() + 1;
    });
}

/// Apply minor adjustments to the default remark layout
function applyAccessibilityFixes(targetWindow, slideshow) {
    let slideContainer = targetWindow.document.querySelector(".remark-slides-area");

    // Announce changes to the slide (e.g. going to the next slide).
    slideContainer.setAttribute("aria-live", "polite");

    // Add next/previous buttons
    let nextSlideBtn = targetWindow.document.createElement("button");
    let prevSlideBtn = targetWindow.document.createElement("button");
    let nav = targetWindow.document.createElement("nav");

    nextSlideBtn.innerText = stringLookup('btn_next_slide');
    prevSlideBtn.innerText = stringLookup('btn_prev_slide');

    nextSlideBtn.onclick = () => {
        slideshow.gotoNextSlide();
    };

    prevSlideBtn.onclick = () => {
        slideshow.gotoPreviousSlide();
    };

    slideshow.on('showSlide', function(newSlide) {
        if (!newSlide) {
            return;
        }

        prevSlideBtn.disabled = (newSlide.getSlideIndex() == 0);
        nextSlideBtn.disabled = (newSlide.getSlideIndex() + 1 >= slideshow.getSlideCount());
    });



    nav.replaceChildren(prevSlideBtn, nextSlideBtn);
    targetWindow.document.body.appendChild(nav);
}

export default { start: main };
