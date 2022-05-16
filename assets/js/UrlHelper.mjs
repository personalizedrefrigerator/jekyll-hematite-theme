
import { assertEq } from "./assertions.mjs";

var UrlHelper = {
    /// Get arguments in [url].
    ///
    /// [url] defaults to the current page's URL.
    /// (e.g. { foo: 5, bar: 2 } from https://localhost/?foo=5,bar=2).
    getPageArgs(url) {
        url ??= location.href;

        let argSepIndex = url.lastIndexOf('?');
        let hashLoc = url.lastIndexOf('#');
        if (argSepIndex == -1) {
            return null;
        }

        // Remove the hash
        if (hashLoc > argSepIndex) {
            url = url.substring(0, hashLoc);
        }

        let argsSegment = url.substring(argSepIndex + 1);
        let args = argsSegment.split(',');
        let result = {};

        for (const part of args) {
            let assignIdx = part.indexOf('=');

            if (assignIdx == -1) {
                result[part] = true;
            }
            else {
                let key = part.substring(0, assignIdx);
                let val = part.substring(assignIdx + 1);
                result[key] = unescape(val);
            }
        }

        return result;
    },

    /// Gets the hash (e.g. #foobar from bob.com#foobar?t=5)
    /// for [url] or the current page (if [url] is not given).
    ///
    /// Return value includes the '#' symbol.
    getPageHash(url) {
        url ??= location.href;

        let hashLoc = url.lastIndexOf('#');
        let argsStart = url.lastIndexOf('?');

        if (hashLoc == -1) {
            return null;
        }

        // If there's no '?' or the '?' is before the '#'...
        if (argsStart == -1 || argsStart < hashLoc) {
            argsStart = url.length;
        }

        return url.substring(hashLoc, argsStart);
    },

    /// Remove metadata encoded in the given URL and returns
    /// it.
    /// If [url] is undefined, uses the page's URL.
    trimMetadata(url) {
        url ??= location.href;

        let hashLoc = url.lastIndexOf('#');
        let argsStart = url.lastIndexOf('?');
        let trimTo = Math.min(hashLoc, argsStart);

        if (trimTo == -1) {
            return url;
        }

        return url.substring(0, trimTo);
    }
};

assertEq("getPageArgs with no args",
    UrlHelper.getPageArgs("https://example.com/foo/bar"),
    null
);

assertEq("getPageArgs with one arg",
    UrlHelper.getPageArgs("https://example.com/foo?test=3").test,
    "3"
);

assertEq("getPageArgs for page with multiple args and hash",
    UrlHelper.getPageArgs("example.com/#testing?a=5,b=6,asdf=8").b,
    "6"
);

assertEq("getPageHash for no hash page",
    UrlHelper.getPageHash("https://example.com/"),
    null
);

assertEq("getPageHash for page with no args, but a hash",
    UrlHelper.getPageHash("https://www.example.org/foo#header"),
    "#header"
);

assertEq("getPageHash for page with args and hash",
    UrlHelper.getPageHash("example.com/?a=5,b=6,asdf=8#testing"),
    "#testing"
);

assertEq("Trimming metadata",
    UrlHelper.trimMetadata("https://example.com/?a=1#no"),
    "https://example.com/"
);

export default UrlHelper;
