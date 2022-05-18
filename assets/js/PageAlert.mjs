/// Builds an alert message that appears at the bottom of the page.

const PAGE_ALERT_DEFAULT_TIMEOUT = 5000; // ms
const PAGE_ALERT_FAST_TIMEOUT = 250;
const PAGE_ALERT_DIALOG_CLSS = "pageAlert";
const PAGE_ALERT_DIALOG_HIDDEN_CLSS = "hidden";

class PageAlertBuilder {
    constructor() {
        this.text_ = "";
        this.timeout_ = PAGE_ALERT_DEFAULT_TIMEOUT;
    }

    /// Sets the alert's text to [text]
    withText(text) {
        this.text_ = text;

        return this;
    }

    /// Destroys the alert after [timeout] ms instead of the
    /// default.
    withTimeout(timeout) {
        this.timeout_ = timeout;

        return this;
    }

    /// Keep the dialog open after its initial appearance.
    withoutTimeout() {
        this.timeout_ = -1;

        return this;
    }

    /// Don't show the announcement to the user. Useful for accessibility-
    ///related announcements.
    invisible() {
        this.invisible_ = true;

        return this;
    }

    /// Build, but don't yet show the alert. Returns an object
    /// with [show] and [destroy] methods.
    build() {
        let destroyTimeout = -1;
        let dialog = document.createElement("div");
        let messageArea = document.createElement("div");

        dialog.classList.add(PAGE_ALERT_DIALOG_CLSS);
        dialog.setAttribute('role', 'alert');

        messageArea.innerText = this.text_;
        dialog.appendChild(messageArea);

        if (this.invisible_) {
            dialog.classList.add(PAGE_ALERT_DIALOG_HIDDEN_CLSS);
            dialog.style.opacity = 0;
            dialog.style.pointerEvents = 'none';
            console.log("PageAlert-invisible", this.text_);
        }

        /// Removes the dialog.
        let destroying = false;
        let destroy = () => {
            if (destroying) {
                return;
            }

            // Fade out.
            dialog.classList.add("closing");
            destroying = true;

            requestAnimationFrame(() => {
                let animDurationStr = getComputedStyle(dialog).getPropertyValue("animation-duration");
                let destroyAnimationDuration;

                // Get the duration in milliseconds.
                let secMatches = /^(\d+\.?\d*)s$/.exec(animDurationStr);
                let millisMatches = /^(\d+)ms$/.exec(animDurationStr);

                if (secMatches) {
                    destroyAnimationDuration = parseFloat(secMatches[1]) * 1000;
                }
                else if (millisMatches) {
                    destroyAnimationDuration = parseInt(millisMatches[1]);
                }

                // If we weren't able to get a reasonable value
                if (isNaN(destroyAnimationDuration)) {
                    console.warn(
                        `${animDurationStr} doesn't seem to be a value in milliseconds or seconds. ` +
                        `Exit animations for alerts may be disabled`
                    );
                    destroyAnimationDuration = 0;
                }

                setTimeout(() => {
                    dialog.remove();
                    dialog = null;
                    destroying = false;

                    if (destroyTimeout !== -1) {
                        clearTimeout(destroyTimeout);
                        destroyTimeout = -1;
                    }
                }, destroyAnimationDuration);
            });
        };

        return {
            show: () => {
                document.body.appendChild(dialog);

                if (this.timeout_ != -1) {
                    destroyTimeout = setTimeout(() => {
                        destroy();
                    }, this.timeout_);
                }
            },
            destroy,
        };
    }
}

var PageAlert = {
    builder() {
        return new PageAlertBuilder();
    }
};

/// Short method for creating an invisible alert with [text].
function announceForAccessibility(text) {
    return PageAlert.builder()
                    .withText(text)
                    .invisible()
                    .withTimeout(PAGE_ALERT_FAST_TIMEOUT)
                    .build().show();
}

export { PageAlert, announceForAccessibility };
export default PageAlert;
