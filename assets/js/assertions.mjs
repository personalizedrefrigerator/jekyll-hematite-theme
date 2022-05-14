
/// Throws an error with [description] if [a] !== [b]
function assertEq(description, a, b) {
    if (a !== b) {
        throw new Error(`Assertion failed (${a} != ${b}): ${description}`);
    }
}

export { assertEq };
