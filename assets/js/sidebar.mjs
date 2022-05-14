
function handleSidebar() {
    const toggleBtn = document.querySelector(`button#toggle_sidebar_btn`);
    const sidebar = document.querySelector(`nav#sidebar`);

    const updateBtn = () => {
        if (sidebar.classList.contains(`open`)) {
            toggleBtn.classList.add(`close_btn`);
        } else {
            toggleBtn.classList.remove(`close_btn`);
        }
    };

    toggleBtn.onclick = () => {
        sidebar.classList.toggle(`open`);
        updateBtn();
    };

    updateBtn();
}

export { handleSidebar };
export default handleSidebar;
