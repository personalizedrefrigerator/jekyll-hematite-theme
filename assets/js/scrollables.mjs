/// Wrap elements that can be too wide in scrollable containers

const SCROLLABLE_CONTAINER_CLSS = "scrollable-container";

function makeScrollable() {
    // Make tables scrollable
    let elems = document.querySelectorAll("main > table");

    for (const elem of elems) {
        let container = document.createElement("div");
        elem.parentElement.insertBefore(container, elem);
        elem.remove();

        container.classList.add(SCROLLABLE_CONTAINER_CLSS);
        container.appendChild(elem);
    }

    // Make display math scrollable
    elems = document.querySelectorAll("main > span > .katex-display");
    for (const elem of elems) {
        let container = elem.parentElement;

        if (container.children.length == 1) {
            container.classList.add(SCROLLABLE_CONTAINER_CLSS);
        }
    }
}

export default makeScrollable;
