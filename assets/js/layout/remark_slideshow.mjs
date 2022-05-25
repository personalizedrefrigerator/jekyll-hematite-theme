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

        if (matchesFound > targetMatchNo) {
            slideshow.gotoSlide(currentSlideNo);
            return;
        }

        // Now search the notes!
        if (slide.notes) {
            try {
                targetText = (slide.notes.join ?? (() => slide.notes))("\n");
                matchesFound += searcher.getNumberOfMatches(query, targetText);
                if (matchesFound > targetMatchNo) {
                    slideshow.gotoSlide(currentSlideNo);

                    if (!isInPresenterMode(targetWin.document)) {
                        slideshow.togglePresenterMode();
                    }
                    return;
                }
            }
            catch (e) {
                console.error(`Unable to search through notes for slide`, slide, `Error: `, e);
                console.log("Continuing...");
            }
        }
    }

    console.log("Found ", matchesFound,
        " matches, which is less than the target of ", targetMatchNo, ". Remaining on last slide.");
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

async function main(targetWindow, config) {
    if (!targetWindow.remark) {
        // Wait for page load if remark isn't available yet.
        await (new Promise(resolve => {
            targetWindow.addEventListener('load', resolve);
        }));
    }

    // See https://remarkjs.com/#8
    let slideshow = targetWindow.remark.create(config);

    // For debugging
    window.slideshow_debug = slideshow;

    targetWindow.focus();

    addExtendedControls(targetWindow, slideshow);
    focusSearchResultFromUrl(targetWindow, slideshow);

    targetWindow.history.replaceState(null, targetWindow.location.href);
    let targetWinHistory = targetWindow.history.state;

    focusSlideFromHash(slideshow);

    window.addEventListener('hashchange', () => {
        focusSlideFromHash(slideshow);
    });

    slideshow.on('showSlide', function(newSlide) {
        if (!newSlide) {
            return;
        }
        let hashId = newSlide.getSlideIndex() + 1;

        // Update the window's URL to match that of the interior
        // (e.g. slide 3 = #3).
        // Try not to have the forward/back arrows go forward/back in the iframe's history.
        targetWindow.history.replaceState(
            targetWinHistory,
            UrlHelper.withReplacedHash(targetWindow.location.href, hashId));
        window.location.hash = hashId;
    });
}

/// Apply minor adjustments to the default remark layout
function addExtendedControls(targetWindow, slideshow) {
    let slideContainer = targetWindow.document.querySelector(".remark-slides-area");

    // Announce changes to the slide (e.g. going to the next slide).
    slideContainer.setAttribute("aria-live", "polite");

    // Add next/previous buttons
    let nextSlideBtn = targetWindow.document.createElement("button");
    let prevSlideBtn = targetWindow.document.createElement("button");
    let printBtn = targetWindow.document.createElement("button");
    let spacer = targetWindow.document.createElement("div");

    let nav = targetWindow.document.createElement("nav");

    nextSlideBtn.innerText = stringLookup('btn_next_slide');
    prevSlideBtn.innerText = stringLookup('btn_prev_slide');
    printBtn.innerText = stringLookup('btn_print');

    spacer.style.flexGrow = 1;

    nextSlideBtn.onclick = () => {
        slideshow.gotoNextSlide();
    };

    prevSlideBtn.onclick = () => {
        slideshow.gotoPreviousSlide();
    };

    printBtn.onclick = () => {
        targetWindow.print();
    };

    slideshow.on('showSlide', function(newSlide) {
        if (!newSlide) {
            return;
        }

        prevSlideBtn.disabled = (newSlide.getSlideIndex() == 0);
        nextSlideBtn.disabled = (newSlide.getSlideIndex() + 1 >= slideshow.getSlideCount());
    });



    nav.replaceChildren(prevSlideBtn, nextSlideBtn, spacer, printBtn);
    targetWindow.document.body.appendChild(nav);
}

export default { start: main };
