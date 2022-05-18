---
---
import { stringLookup } from "../strings.mjs";

const NEXT_POST_ID = "next_post_link_btn";
const PREV_POST_ID = "prev_post_link_btn";

function createNextPrevLinks(page) {
    let nextLink = document.createElement("a");
    let prevLink = document.createElement("a");
    let container = document.querySelector("#post_next_prev");

    if (page.previous) {
        prevLink.innerText = stringLookup(`prev_post`, page.previous.title);
        prevLink.href = page.previous.url + `#${PREV_POST_ID}`;;

        prevLink.setAttribute("id", PREV_POST_ID);
        prevLink.classList.add(`prev-post-link`);

        container.appendChild(prevLink);
    }

    if (page.next) {
        nextLink.innerText = stringLookup(`next_post`, page.next.title);
        nextLink.href = page.next.url + `#${NEXT_POST_ID}`;

        nextLink.setAttribute("id", NEXT_POST_ID);
        nextLink.classList.add(`next-post-link`);

        container.appendChild(nextLink);
    }
}

function createTagLinks(page) {
    let container = document.querySelector("#post_tags");
    let label = document.querySelector("#post_tags > #tag_header_lbl");
    label.innerText = stringLookup(`tags`);

    for (const tag of page.tags) {
        let tagElem = document.createElement("a");
        tagElem.style.display = "inline-block";
        tagElem.classList.add(`post-tag`);

        tagElem.href = `{{ 'assets/html/all_tags.html' | relative_url }}#tag__${escape(tag)}`;
        tagElem.innerText = tag;

        container.appendChild(tagElem);
    }
}

function fillDate(page) {
    let postDateContainer = document.querySelector(`#post_date`);
    let dateOptions = {{ site.hematite.date_format | default: nil | jsonify }};
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    // for other formatting options.
    dateOptions ??= {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    };

    postDateContainer.innerText = new Date(page.date).toLocaleDateString(undefined, dateOptions);
}

function initPost(pageData) {
    createNextPrevLinks(pageData);
    createTagLinks(pageData);

    fillDate(pageData);
}

export { initPost };
export default initPost;
