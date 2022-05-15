import { stringLookup } from "./strings.mjs";

function handleSearch() {
    const searchInput = document.querySelector(".search-container > #search_input");
    const searchBtn = document.querySelector(".search-container > #search_btn");

    searchInput.setAttribute("placeholder", stringLookup(`search_site_placeholder`));
    searchBtn.disabled = true;

    const updateSearchBtn = () => {
        let searchText = searchInput.value;
        let newLabel = stringLookup(`search_disabled_no_content`);
        let shouldDisable = (searchText == "");

        searchBtn.disabled = shouldDisable;
        if (!shouldDisable) {
            newLabel = stringLookup(`search_site_action`, searchText);
        }
        
        searchBtn.setAttribute("title", newLabel);
    };


    searchBtn.onclick = () => {
        alert("Not implemented yet!");
    };

    // Enter: causes searching to happen
    searchInput.addEventListener("keyup", (evt) => {
        if (evt.key == "Enter") {
            searchBtn.click();
        }

        updateSearchBtn();
    });

    searchInput.addEventListener("input", (evt) => {
        updateSearchBtn();
    });
}

export default handleSearch;
export { handleSearch };
