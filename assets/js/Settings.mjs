---
---
import AsyncUtil from "./AsyncUtil.mjs";

const THEME_TRANSITION_TIME = 500; // ms

class Settings {
    THEME_AUTO = 'auto';
    THEME_DARK = 'dark';
    THEME_LIGHT = 'light';

    FONT_DEFAULT = 'default';
    FONT_SANS = 'sans';
    FONT_SERIF = 'serif';

    FONT_SIZE_SMALL = 'small';
    FONT_SIZE_MEDIUM = 'medium';
    FONT_SIZE_LARGE = 'large';
    FONT_SIZE_DEFAULT = 'default';

    FONT_SIZE_KEY_ = 'hematite-setting-font-size';
    FONT_FAMILY_KEY_ = 'hematite-setting-font-family';
    THEME_KEY_ = 'hematite-setting-theme';

    constructor() {
    }

    getSetting_(key) {
        return localStorage.getItem(key);
    }

    setSetting_(key, val) {
        localStorage.setItem(key, val);
        this.applySettings();
    }

    getTheme() {
        return this.getSetting_(this.THEME_KEY_) ?? this.THEME_AUTO;
    }

    getFontFamily() {
        return this.getSetting_(this.FONT_FAMILY_KEY_) ?? this.FONT_DEFAULT;
    }

    getFontSize() {
        return this.getSetting_(this.FONT_SIZE_KEY_) ?? this.FONT_SIZE_DEFAULT;
    }

    setFontSize(sizeOption) {
        this.setSetting_(this.FONT_SIZE_KEY_, sizeOption);
    }

    setFontFamily(familyOption) {
        this.setSetting_(this.FONT_FAMILY_KEY_, familyOption);
    }

    setTheme(themeOption) {
        this.setSetting_(this.THEME_KEY_, themeOption);
    }

    getFontSizePt_() {
        let fontSizeOption = this.getFontSize();

        if (fontSizeOption == this.FONT_SIZE_SMALL) {
            return {{ site.hematite.user_config.font_size_small | default: "9" }};
        }

        if (fontSizeOption == this.FONT_SIZE_MEDIUM) {
            return {{ site.hematite.user_config.font_size_medium | default: "13" }};
        }

        if (fontSizeOption == this.FONT_SIZE_LARGE) {
            return {{ site.hematite.user_config.font_size_large | default: "16" }};
        }
    }

    usingNonDefaultFontFamily_() {
        return this.getFontFamily() != this.FONT_DEFAULT;
    }

    usingNonDefaultFontSize_() {
        return this.getFontSize() != this.FONT_SIZE_DEFAULT;
    }

    forcingDarkTheme_() {
        return this.getTheme() == this.THEME_DARK;
    }

    forcingLightTheme_() {
        return this.getTheme() == this.THEME_LIGHT;
    }

    async applySettings() {
        document.documentElement.classList.add("changingTheme");

        // Clean up previous changes. We might be re-applying styles.
        document.documentElement.classList.remove("lightTheme");
        document.documentElement.classList.remove("darkTheme");

        if (!this.style_) {
            this.style_ = document.createElement("style");
        } else {
            this.style_.remove();
        }


        let styleHTML =
        `
            :root.changingTheme * {
                transition: ${THEME_TRANSITION_TIME}ms ease all;
            }
        `;

        // Font family
        if (this.usingNonDefaultFontFamily_()) {
            styleHTML +=
            `
                :root {
                    --main-font-family: var(--${this.getFontFamily()}-font-family);
                }
            `;
        }

        // Font size
        if (this.usingNonDefaultFontSize_()) {
            styleHTML +=
            `
                :root {
                    --main-font-size: ${this.getFontSizePt_()}pt;
                }
            `;
        }

        this.style_.innerHTML = styleHTML;
        document.documentElement.appendChild(this.style_);

        // Theme
        if (this.forcingDarkTheme_()) {
            document.documentElement.classList.add("darkTheme");
        }
        else if (this.forcingLightTheme_()) {
            document.documentElement.classList.add("lightTheme");
        }

        await AsyncUtil.waitMillis(THEME_TRANSITION_TIME);
        document.documentElement.classList.remove("changingTheme");
    }
}

export default (new Settings());
