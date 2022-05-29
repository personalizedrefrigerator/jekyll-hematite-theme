import { getUrlQuery, Searcher } from "../search.mjs";
import { stringLookup } from "../strings.mjs";
import UrlHelper from "../UrlHelper.mjs";

const GESTURE_MIN_TOUCH_MOVE_DIST = 40; // px

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

/// Returns true iff the slide viewer should only display markdown.
function shouldOnlyDisplayMd() {
    let pageArgs = UrlHelper.getPageArgs();
    if (!pageArgs) {
        return false;
    }

    if (pageArgs.md_only) {
        return true;
    }

    return false;
}

async function main(targetWindow, config) {
    // True if touch navigation is enabled.
    let usingCustomTouchNav = false;

    if (!targetWindow.remark) {
        // Wait for page load if remark isn't available yet.
        await (new Promise(resolve => {
            targetWindow.addEventListener('load', resolve);
        }));
    }

    // If the user has requested that only the page's markdown be shown,
    if (shouldOnlyDisplayMd()) {
        targetWindow.document.body.innerText = config?.source;
        targetWindow.document.body.classList.add('mdSourceView');
        return;
    }

    // Customize touchscreen navigation — the default remark
    // navigation can break buttons, zooming.
    if (config?.navigation?.touch === true
            || config?.navigation?.touch === undefined) {
        config ??= {};
        config.navigation ??= {};
        config.navigation.touch = false;

        usingCustomTouchNav = true;
    }

    // See https://remarkjs.com/#8
    let slideshow = targetWindow.remark.create(config);
    targetWindow.focus();

    // For debugging
    window.slideshow_debug = slideshow;

    addExtendedControls(targetWindow, slideshow);
    focusSearchResultFromUrl(targetWindow, slideshow);
    focusSlideFromHash(slideshow);

    // Create a URL state we can navigate back to/restore to
    targetWindow.history.replaceState(null, targetWindow.location.href);
    let targetWinHistory = targetWindow.history.state;

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

    // Add custom touch events to listen for navigation.
    if (usingCustomTouchNav) {
        let elemContainer = targetWindow.document.body;
        let initialPos = {};
        let handlingGesture = false;

        elemContainer.addEventListener('pointerdown', evt => {
            if (evt.pointerType == 'touch') {
                // Only handle single-touch gestures
                handlingGesture = evt.isPrimary;
                initialPos = {
                    x: evt.clientX,
                    y: evt.clientY,
                };

                if (handlingGesture) {
                    evt.preventDefault();
                    elemContainer.setPointerCapture();
                }
            }
        });

        elemContainer.addEventListener('pointerup', evt => {
            if (evt.pointerType == 'touch' && handlingGesture) {
                let dx = evt.clientX - initialPos.x;

                if (Math.abs(dx) < GESTURE_MIN_TOUCH_MOVE_DIST) {
                    return;
                }

                if (dx < 0) {
                    slideshow.gotoNextSlide();
                } else {
                    slideshow.gotoPreviousSlide();
                }
            }
        });
    }
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

    let updateBtns = (slideIdx) => {
        prevSlideBtn.disabled = (slideIdx == 0);
        nextSlideBtn.disabled = (slideIdx + 1 >= slideshow.getSlideCount());
    };

    slideshow.on('showSlide', function(newSlide) {
        if (!newSlide) {
            return;
        }

        updateBtns(newSlide.getSlideIndex());
    });

    updateBtns(0);

    nav.replaceChildren(prevSlideBtn, nextSlideBtn, spacer, printBtn);
    targetWindow.document.body.appendChild(nav);
}

export default { start: main };
