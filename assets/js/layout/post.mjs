import { stringLookup } from "../strings.mjs";

function createNextPrevLinks(page) {
    let nextLink = document.createElement("a");
    let prevLink = document.createElement("a");
    let container = document.querySelector("#post_next_prev");

    if (page.previous) {
        prevLink.innerText = stringLookup(`prev_post`, page.previous.title);
        prevLink.href = page.previous.url;
        prevLink.classList.add(`prev-post-link`);
        container.appendChild(prevLink);
    }

    if (page.next) {
        nextLink.innerText = stringLookup(`next_post`, page.next.title);
        nextLink.href = page.next.url;
        nextLink.classList.add(`next-post-link`);
        container.appendChild(nextLink);
    }
}

function createTagLinks() {
    // TODO
}

function initPost(pageData) {
    createNextPrevLinks(pageData);
    createTagLinks(pageData);
}

export { initPost };
export default initPost;
