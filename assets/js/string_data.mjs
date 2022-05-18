import en from "../string_data/en.mjs";
import es from "../string_data/es.mjs";

const STRING_TABLE = {
    en,
    es,
};

// Locales to check if a string isn't localized in any of the
// user's preferred languages.
const DEFAULT_LOCALES = [ 'en' ];

export { STRING_TABLE, DEFAULT_LOCALES };
