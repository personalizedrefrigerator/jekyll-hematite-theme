
import { assertEq } from "./assertions.mjs";

let htmlReplacements = [
    [ /[&]/g, '&amp;' ],
    [ /[<]/g, '&lt;' ],
    [ /[>]/g, '&gt;' ],
];

var EscapeHelper = {
    escapeHTML(text) {
        for (const item of htmlReplacements) {
            text = text.replace(item[0], item[1]);
        }

        return text;
    },
    // Escape for usage within a regex expression
    escapeRegex(text) {
        return text.replace(/([\*\(\).\[\]\{\}\^\$\-\=\;\:\'\"\\])/g, '\\$1'); //'
    },
    // Escape text for usage within a replacement pattern
    // E.g. "foobar".replaceAll("foo", text);
    escapeReplacePattern(text) {
        return text.replace(/\$/g, '$$$$');
    }
};

assertEq("Test escape <", EscapeHelper.escapeHTML('<'), '&lt;');
assertEq("Test escape multiple <", EscapeHelper.escapeHTML('<a></a>'), '&lt;a&gt;&lt;/a&gt;');
assertEq("Test escape >", EscapeHelper.escapeHTML('>'), '&gt;');
assertEq("Test escape identity", EscapeHelper.escapeHTML('Hello, world.'), 'Hello, world.');
assertEq("Test regex escape simple", EscapeHelper.escapeRegex(".*"), "\\.\\*");
assertEq("Test regex more complicated escape", EscapeHelper.escapeRegex("This, is a test... :)"), "This, is a test\\.\\.\\. \\:\\)");
assertEq("Test replace pattern escape", EscapeHelper.escapeReplacePattern("0$ and 24 cents"), "0$$ and 24 cents");

export default EscapeHelper;
