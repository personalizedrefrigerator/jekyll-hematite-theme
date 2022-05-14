
import { assertEq } from "./assertions.mjs";
import { LOCALIZED_STRINGS, STRING_TABLE } from "./string_data.mjs";



/// Returns a possibly-localized string corresponding to [key].
function stringLookup(key, ...formatting) {
    let sourceText = LOCALIZED_STRINGS[key] ?? STRING_TABLE[key];

    if (sourceText) {
        return formatText(sourceText, ...formatting);
    }
    else {
        console.warn(`String lookup for key “${key}” not found`);
        return key;
    }
}

function formatText(text, ...formatArgs) {
    let chars = text.split('');
    let escaped = false;
    let i = 0;
    let result = [];
    formatArgs ??= [];

    var consumeNumber = () => {
        let numberRes = "";

        for (; !isNaN(parseInt(text.charAt(i))); ++i) {
            numberRes += text.charAt(i);
        }

        if (numberRes == "") {
            return null;
        }

        return parseInt(numberRes);
    };

    // Consumes a single format specifier in the form
    // {n} for some integer n ∈ [0, formatArgs.length).
    var consumeFormatSpec = () => {
        let initialPoint = i;
        if (!escaped && text.charAt(i) == '{') {
            i++;
            let formatNumber = consumeNumber();

            // If the number is invalid,
            if (formatNumber === null
                    || formatNumber > formatArgs.length
                    || formatNumber < 0
            ) {
                // Unconsume and return
                i = initialPoint;
                return false;
            }

            if (text.charAt(i) != '}') {
                i = initialPoint;
                return false;
            }

            i++;

            result.push(formatArgs[formatNumber]);
            return true;
        }

        return false;
    };

    var consumeEscape = () => {
        if (escaped) {
            escaped = false;
            consumeCharacter();

            return true;
        }

        if (text.charAt(i) == '\\') {
            i++;
            escaped = true;

            return true;
        }

        return false;
    };

    var consumeCharacter = () => {
        result.push(text.charAt(i));
        i++;

        return true;
    };

    for (i = 0; i < text.length;) {
        let current = text.charAt(i);

        consumeEscape() || consumeFormatSpec() || consumeCharacter();
    }

    return result.join('');
}

assertEq("Test single replacement", formatText("{0}", "hello"), "hello");
assertEq("Test no replacement 1", formatText("hello"), "hello");
assertEq("Test no replacement 2",
    formatText("{this is a test}", ":)"),
    "{this is a test}"
);
assertEq("Test no replacement 3",
    formatText("{999}", "okay"),
    "{999}"
);
assertEq("Test no replacement 4",
    formatText("{123"),
    "{123"
);
assertEq("Test double replacement",
    formatText("The second: {1}, the first: {0}", "✅", "⛔"),
    "The second: ⛔, the first: ✅"
);
assertEq("Test escaping",
    formatText("Escape\\d thing"), "Escaped thing");
assertEq("Test escaping 2",
    formatText(" \\\\", ""), " \\");
assertEq("Test escaping 3",
    formatText("\\{0}", 3), "{0}");

export { stringLookup };
export default stringLookup;