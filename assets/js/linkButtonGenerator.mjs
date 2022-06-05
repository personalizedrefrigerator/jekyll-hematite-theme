---
---

import { PageAlert } from "./PageAlert.mjs";
import { stringLookup as _L } from './strings.mjs';

const INTERIOR_LINK_CONTENT_HTML = `{% include img/chain-link.svg %}`;
const INTERIOR_LINK_CONTAINER_CLSS = "linkToHeaderContainer";

/// Creates 🔗 buttons for every header with an ID.
function generateHeaderLinks() {
    let headers = document.querySelectorAll("h1,h2,h3,h4,h5,h6");

    for (const header of headers) {
        if (header.getAttribute("id")) {
            let btn = createLinkButton_(header);

            // Add the link button before the header
            header.insertBefore(btn, header.childNodes[0]);
        }
    }
}

function createLinkButton_(header) {
    let container = document.createElement("span");
    let link = document.createElement("a");
    let headerText = header.innerText;

    container.classList.add(INTERIOR_LINK_CONTAINER_CLSS);
    link.title = _L("copy_link_to_header", headerText);
    link.href = `#${header.getAttribute('id')}`;
    link.innerHTML = INTERIOR_LINK_CONTENT_HTML;

    link.onclick = () => {
        navigator.clipboard.writeText(link.href);
        PageAlert.builder()
            .withText(_L("link_to_header_copied_alert", headerText))
            .build()
            .show();
    };


    container.appendChild(link);
    return container;
}

export { generateHeaderLinks };
export default generateHeaderLinks;
