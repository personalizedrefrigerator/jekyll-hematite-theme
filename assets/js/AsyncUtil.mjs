
const AsyncUtil = {
    /// Resolves on the next animation frame
    nextAnimationFrame() {
        return new Promise(resolve => {
            requestAnimationFrame(() => resolve());
        });
    },

    /// Resolve in [duration] milliseconds
    waitMillis(duration) {
        return new Promise(resolve => {
            setTimeout(() => resolve(), duration);
        });
    },
};

export default AsyncUtil;
