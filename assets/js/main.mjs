
import { generateHeaderLinks } from "./linkButtonGenerator.mjs";

addEventListener("load", () => {
    generateHeaderLinks(document.querySelector("main"));
});
