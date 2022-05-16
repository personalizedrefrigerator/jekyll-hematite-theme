import AsyncUtil from "./AsyncUtil.mjs";

const DEFAULT_DURATION = 500;

/// Get the transition style property for a given [duration].
function getTransitionStyleStr_(duration) {
    return [
        `height ${duration}ms ease`,
        `transform ${duration}ms ease`,
        `margin ${duration}ms ease`,
    ].join(', ');
}

/// Vertically collapse, then hide, [elem].
/// Animation [duration] is in milliseconds and optional.
/// Ultimately, [elem].display.
///
/// Clients should not rely on [elem].style for otherwise
/// styling [elem].
async function collapseOutVert(elem, duration) {
    duration ??= DEFAULT_DURATION;

    elem.style.height = `${elem.clientHeight}px`;
    elem.style.transition = getTransitionStyleStr_(duration);
    elem.style.display = getComputedStyle(elem).display;

    await AsyncUtil.nextAnimationFrame();

    elem.style.height = 0;
    elem.style.margin = 0;
    await AsyncUtil.waitMillis(duration);
    elem.style.display = `none`;

    elem.style.height = ``;
    elem.style.transition = ``;
    elem.style.margin = ``;
}

/// Vertically expand [elem]
async function expandInVert(elem, duration) {
    duration ??= DEFAULT_DURATION;
    elem.style.display = ``;
    elem.style.transition = getTransitionStyleStr_(duration);

    // Determine the true size of the element
    elem.style.height = ``;
    elem.style.margin = 0;
    elem.style.opacity = 0;
    elem.style.position = 'absolute';
    elem.style.visibility = 'hidden';

    // Allow the browser to lay out the element.
    await AsyncUtil.nextAnimationFrame();

    let finalHeight = elem.clientHeight;
    elem.style.height = 0;

    await AsyncUtil.nextAnimationFrame();

    elem.style.visibility = '';
    elem.style.position = '';
    elem.style.opacity = '';
    elem.style.height = `${finalHeight}px`;
    elem.style.margin = '';

    await AsyncUtil.waitMillis(duration);

    elem.style.height = ``;
    elem.style.transition = ``;
}

export default { collapseOutVert, expandInVert };
