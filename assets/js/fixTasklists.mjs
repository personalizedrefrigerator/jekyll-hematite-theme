
export default () => {
    const taskLists = document.querySelectorAll('.task-list-item > input.task-list-item-checkbox');

    for (const input of taskLists) {

        // Disabled checkboxes have styling that make their values hard
        // to see. Effectively disable them, without actually setting the
        // disabled property.
        input.setAttribute('aria-disabled', 'true');
        input.removeAttribute('disabled');

        const origValue = input.checked;
        input.addEventListener('input', () => {
            input.checked = origValue;
        });
        input.addEventListener('click', () => {
            input.checked = origValue;
        });
    }
};