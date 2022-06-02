---
---
import { stringLookup } from "../strings.mjs";
import DateUtil from "../DateUtil.mjs";

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

    // Don't show the tag container if there aren't any tags
    if (!page.tags || page.tags.length == 0) {
        container.style.display = "none";
        return;
    }

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
    postDateContainer.innerText = DateUtil.toString(new Date(page.date));
}

function initPost(pageData) {
    createNextPrevLinks(pageData);
    createTagLinks(pageData);

    fillDate(pageData);
}

export { initPost };
export default initPost;
