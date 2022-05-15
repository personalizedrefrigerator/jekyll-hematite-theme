
function handleSidebar() {
    const toggleBtn = document.querySelector(`button#toggle_sidebar_btn`);
    const sidebar = document.querySelector(`nav#sidebar`);
    const mainContent = document.querySelector(`main`);

    // True if sidebar toggled by user
    let sidebarToggled = false;

    const updateBtn = () => {
        if (sidebar.classList.contains(`open`)) {
            toggleBtn.classList.add(`close_btn`);
        } else {
            toggleBtn.classList.remove(`close_btn`);
        }
    };

    // Expand the sidebar with/without animation.
    const autoExpandSidebar = (noAnimations) => {
        if (noAnimations) {
            // Don't animate the sidebar if auto-expanding.
            sidebar.style.transition = "none";
        }

        let remainingSpace = window.innerWidth - mainContent.clientWidth;
        let spaceOnLeft = remainingSpace / 2;

        // If there's enough space for the sidebar
        if (sidebar.clientWidth < spaceOnLeft) {
            sidebar.classList.add(`open`);
        } else {
            sidebar.classList.remove(`open`);
        }


        updateBtn();

        if (noAnimations) {
            // Reset the sidebar's transition.
            requestAnimationFrame(() => {
                sidebar.style.transition = "";
            });
        }
    };

    toggleBtn.onclick = () => {
        sidebar.classList.toggle(`open`);
        sidebarToggled = true;
        updateBtn();
    };

    updateBtn();


    // Auto-set whether the sidebar is open.
    if (mainContent) {
        autoExpandSidebar(true);

        addEventListener('resize', () => {
            if (!sidebarToggled) {
                autoExpandSidebar();
            }
        });
    }
}

export { handleSidebar };
export default handleSidebar;
