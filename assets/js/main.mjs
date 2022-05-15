
import { generateHeaderLinks } from "./linkButtonGenerator.mjs";
import handleSidebar from "./sidebar.mjs";
import handleSearch from "./search.mjs";
import autoExpandDropdowns from "./dropdownExpander.mjs";

// After loading elements, images, css, etc.
addEventListener("load", () => {
    generateHeaderLinks(document.querySelector("main"));
    handleSearch();

    // Expand dropdowns on print, etc.
    autoExpandDropdowns();
});

// After loading elements, but before loading elements like images.
addEventListener("DOMContentLoaded", () => {
    handleSidebar();
});
