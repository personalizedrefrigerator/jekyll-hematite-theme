import UrlHelper from "./UrlHelper.mjs";

/// Formats a page for printing
/// For-printing formatting should be done in CSS, if possible.

/// Expands all dropdowns on a page, returns a list of all
/// dropdowns that were opened.
function expandAllDropdowns() {
    let expanded = [];

    for (const dropdown of document.querySelectorAll("details:not([open])")) {
        dropdown.setAttribute("open", true);
        expanded.push(dropdown);
    }

    return expanded;
}

function expandOnPrint() {
    let openedDropdowns = [];

    addEventListener("beforeprint", () => {
        openedDropdowns = expandAllDropdowns();
    });

    addEventListener("afterprint", () => {
        for (const dropdown of openedDropdowns) {
            dropdown.removeAttribute("open");
        }
    });
}

/// Expand all dropdowns containing [elem].
/// [elem] can be either a Node or an Element.
function expandContainingDropdowns(elem) {
    let currentElem = elem;

    // Walk up the DOM tree...
    do {
        // Open all containing details elements.
        if (currentElem.tagName && currentElem.tagName.toLowerCase() == "details") {
            currentElem.setAttribute("open", true);
        }

        currentElem = currentElem.parentElement;
    }
    while (currentElem);
}

function expandBasedOnURL() {
    const doExpansion = (url) => {
        // Determine the hash.
        let hash = UrlHelper.getPageHash();
        if (hash == null) {
            return;
        }

        let targetElem = document.querySelector(hash);
        let currentElem = targetElem;

        expandContainingDropdowns(targetElem);

        targetElem.focus();
    };

    doExpansion(location.href);
    addEventListener("hashchange", ({ newURL }) => {
        doExpansion(newURL);
    });
}

function autoExpandDropdowns() {
    expandOnPrint();
    expandBasedOnURL();
}

export { autoExpandDropdowns, expandContainingDropdowns };
export default autoExpandDropdowns;
