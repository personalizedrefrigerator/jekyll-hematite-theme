
import { generateHeaderLinks } from "./linkButtonGenerator.mjs";
import autoExpandDropdowns from "./dropdownExpander.mjs";

addEventListener("load", () => {
    generateHeaderLinks(document.querySelector("main"));

    // Expand dropdowns on print, etc.
    autoExpandDropdowns();
});

