
import { generateHeaderLinks } from "./linkButtonGenerator.mjs";
import handleSidebar from "./sidebar.mjs";
import autoExpandDropdowns from "./dropdownExpander.mjs";

addEventListener("load", () => {
    generateHeaderLinks(document.querySelector("main"));

    // Expand/collapse the sidebar
    handleSidebar();

    // Expand dropdowns on print, etc.
    autoExpandDropdowns();
});

