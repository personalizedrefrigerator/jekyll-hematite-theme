import { stringLookup } from "./strings.mjs";
import { announceForAccessibility } from "./PageAlert.mjs";

function handleSidebar() {
    const toggleBtn = document.querySelector(`button#toggle_sidebar_btn`);
    const sidebar = document.querySelector(`nav#sidebar`);
    const mainContainer = document.querySelector(`.main-container`);

    // True if sidebar has been toggled by user at least once.
    let sidebarToggled = false;

    const setBtnLabel = (text) => {
        toggleBtn.setAttribute(`title`, text);
    };

    const setSidebarOpen = (open) => {
        if (!open) {
            sidebar.classList.remove(`open`);
            document.scrollingElement?.classList.remove(`hasOpenSidebar`);
        }
        else {
            sidebar.classList.add(`open`);
            document.scrollingElement?.classList.add(`hasOpenSidebar`);
        }
    };

    const isSidebarOpen = () => sidebar.classList.contains(`open`);

    const updateBtn = () => {
        if (sidebar.classList.contains(`open`)) {
            toggleBtn.classList.add(`close_btn`);
            setBtnLabel(stringLookup(`close_sidebar`));
        } else {
            toggleBtn.classList.remove(`close_btn`);
            setBtnLabel(stringLookup(`open_sidebar`));
        }
    };

    // Expand the sidebar with/without animation.
    const autoExpandSidebar = (noAnimations) => {
        if (noAnimations) {
            // Don't animate the sidebar if auto-expanding.
            sidebar.style.transition = "none";
        }

        let remainingSpace = window.innerWidth - mainContainer.clientWidth;
        let spaceOnLeft = remainingSpace / 2;

        // If there's enough space for the sidebar
        if (sidebar.clientWidth < spaceOnLeft) {
            setSidebarOpen(true);
        } else {
            setSidebarOpen(false);
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
        setSidebarOpen(!isSidebarOpen());

        sidebarToggled = true;
        updateBtn();

        if (isSidebarOpen()) {
            announceForAccessibility(stringLookup(`sidebar_opened_announcement`));
        }
        else {
            announceForAccessibility(stringLookup(`sidebar_closed_announcement`));
        }
    };

    updateBtn();


    // Auto-set whether the sidebar is open.
    if (mainContainer) {
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
