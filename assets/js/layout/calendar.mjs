---
---

import { stringLookup } from "../strings.mjs";
import DateUtil from "../DateUtil.mjs";

const DATE_SPEC_ELEM_TAG = "h1";
const LIST_SPEC_ELEM_TAG = "ul";

// Used for generating unique IDs
let nextViewModeSelectorId = 0;

/// Pull calendar data from [elem]. If [formatElemLabels], apply special calendar markup
/// to the contents of [elem], changing [elem].
function getCalendarData(elem, formatElemLabels) {
    let result = [];

    // Last date set by a header we've encountered
    let lastDate = null;
    let lastHeaderId = "";

    for (const child of elem.children) {
        let tagName = child.tagName.toLowerCase();

        if (tagName == DATE_SPEC_ELEM_TAG) {
            // Remove '-rd' and '-th' suffixes.
            let dateText = child.innerText.replaceAll(/(\d)(?:rd|th)/g,
                (fullMatch, group0) => group0);

            try {
                lastDate = new Date(child.innerText);
                lastHeaderId = child.getAttribute("id");
            }
            catch (e) {
                child.innerText = stringLookup(`invalid_date`, dateText);
                lastDate = null;
            }
        }

        if (tagName == LIST_SPEC_ELEM_TAG && lastDate) {
            let listItems = [];

            for (const item of child.children) {
                if (item.tagName.toLowerCase() == "li") {
                    let agendaItem = new AgendaItem(item.innerHTML);
                    listItems.push(agendaItem);

                    // Reformat tags in the item, if requested.
                    if (formatElemLabels) {
                        let itemTags = document.createElement('span');
                        let itemContent = document.createElement('span');

                        for (const tag of agendaItem.tags) {
                            let tagLink = document.createElement('a');
                            tagLink.classList.add('tag');

                            tagLink.href = `{{ 'assets/html/all_tags.html' | relative_url }}#tag__${escape(tag)}`;
                            tagLink.innerText = tag;
                            tagLink.classList.add(AgendaItem.getTagClass(tag));

                            itemTags.appendChild(tagLink);
                        }

                        itemContent.innerHTML = agendaItem.html;
                        item.replaceChildren(itemTags, itemContent);
                    }
                }
            }

            result.push({
                agenda: listItems,
                date: lastDate,
                link: `#${lastHeaderId}`
            });
        }
    }

    result.sort((a, b) => {
        if (a.date < b.date) {
            return -1;
        }

        if (a.date > b.date) {
            return 1;
        }

        return 0;
    });

    return result;
}

class AgendaItem {
    /// Creates an AgendaItem from text [data] which is made up of
    /// HTML and leading format tags.
    constructor(data) {
        let htmlStart = 0;

        this.tags = [];
        for (const match of data.matchAll(/[\[](\w+)[\]]/g)) {
            this.tags.push(match[1]);
            htmlStart = match.index + match[0].length;
        }
        this.html = data.substring(htmlStart);
    }
}

AgendaItem.getTagClass = (tag) => {
    return `calendarTag__${tag}`;
};

class Calendar {
    VIEW_MODE_MONTH = 1;
    VIEW_MODE_WEEK = 2;
    VIEW_MODE_DAY = 3;

    constructor(data, containerElem) {
        this.mode_ = this.VIEW_MODE_WEEK;
        this.container_ = document.createElement("div");
        this.data_ = data;
        this.anchorDate_ = new Date();

        this.updateLayout_();

        containerElem.appendChild(this.container_);
    }

    /// Get an item in [data_] from [date], if [searchDate]
    /// is the same day as the requested item. If there
    /// are multiple matches, one of them is returned.
    lookupItem_(searchDate) {
        let i = Math.floor(this.data_.length / 2);
        let lastI;
        let searchStart = 0;
        let searchStop = this.data_.length;

        // Binary search
        do {
            lastI = i;

            // Bounds check
            if (0 > i || i >= this.data_.length) {
                break;
            }

            let current = this.data_[i];
            if (DateUtil.datesAreOnSameDay(current.date, searchDate)) {
                return current;
            }

            if (current.date > searchDate) {
                searchStop = i;
            }
            else if (current.date < searchDate) {
                searchStart = i + 1;
            }

            i = Math.floor((searchStart + searchStop) / 2);
        }
        while (lastI != i);

        return null;
    }

    createCardForDay_(date) {
        let card = document.createElement("div");
        let header = document.createElement("a");
        let details = document.createElement("ul");

        let content = this.lookupItem_(date);
        card.classList.add("calendar-card");

        let dateOptions = { day: "2-digit", year: "2-digit", month: "2-digit" };
        header.innerText = date.toLocaleDateString(dateOptions);

        if (content) {
            header.href = content.link;

            for (let itemData of content.agenda) {
                let container = document.createElement("li");

                container.innerHTML = itemData.html;
                for (const tag of itemData.tags) {    
                    container.classList.add(AgendaItem.getTagClass(tag));
                }

                details.appendChild(container);
            }
        }

        if (DateUtil.dateIsToday(date)) {
            card.classList.add("today");
        }

        card.appendChild(header);
        card.appendChild(details);
        return card;
    }

    updateLayout_() {
        this.content_?.remove();
        this.content_ = document.createElement("div");
        this.content_.classList.add("calendar-content");

        let startDate = this.anchorDate_;
        let endDate = DateUtil.nextDay(this.anchorDate_);

        if (this.mode_ == this.VIEW_MODE_WEEK) {
            startDate = DateUtil.beginningOfWeek(this.anchorDate_);
            endDate = DateUtil.nextWeek(startDate);
            this.content_.classList.add("week-display");
        }
        else if (this.mode_ == this.VIEW_MODE_MONTH) {
            startDate = DateUtil.beginningOfMonth(this.anchorDate_);
            endDate = DateUtil.beginningOfMonth(DateUtil.nextMonth(this.anchorDate_));
            this.content_.classList.add("month-display");
        }

        for (const date of DateUtil.daysInRange(startDate, endDate)) {
            this.content_.appendChild(this.createCardForDay_(date));
        }
        this.container_.appendChild(this.content_);
    }

    next() {
        if (this.mode_ == this.VIEW_MODE_WEEK) {
            this.anchorDate_ = DateUtil.nextWeek(this.anchorDate_);
        }
        else if (this.mode_ == this.VIEW_MODE_DAY) {
            this.anchorDate_ = DateUtil.nextDay(this.anchorDate_);
        }
        else {
            this.anchorDate_ = DateUtil.nextMonth(this.anchorDate_);
        }

        this.updateLayout_();
    }

    prev() {
        if (this.mode_ == this.VIEW_MODE_WEEK) {
            this.anchorDate_ = DateUtil.prevWeek(this.anchorDate_);
        }
        else if (this.mode_ == this.VIEW_MODE_DAY) {
            this.anchorDate_ = DateUtil.prevDay(this.anchorDate_);
        }
        else {
            this.anchorDate_ = DateUtil.prevMonth(this.anchorDate_);
        }

        this.updateLayout_();
    }

    setMode(mode) {
        this.mode_ = mode;
        this.updateLayout_();
    }

    getMode() {
        return this.mode_;
    }

    getLocalizedMode() {
        if (this.mode_ == this.VIEW_MODE_WEEK) {
            return stringLookup(`calendar_mode_week`);
        }
        else if (this.mode_ == this.VIEW_MODE_DAY) {
            return stringLookup(`calendar_mode_day`);
        }
        return stringLookup(`calendar_mode_month`);
    }
}


/// Creates a visual calendar, pulling input from [inputElem]
/// and writing output to [outputElem].
function calendarSetup(sourceElem, outputElem) {
    let data = getCalendarData(sourceElem, true);
    let controlsContainer = document.createElement("div");
    controlsContainer.classList.add('controls');

    let calendar = new Calendar(data, outputElem);

    let viewModeContainer = document.createElement("div");
    let viewModeLabel = document.createElement("label");
    let viewModeSelector = document.createElement("select");
    viewModeSelector.innerHTML = `
        <option value='${calendar.VIEW_MODE_DAY}'>${stringLookup('calendar_mode_day')}</option>
        <option value='${calendar.VIEW_MODE_WEEK}'>${stringLookup('calendar_mode_week')}</option>
        <option value='${calendar.VIEW_MODE_MONTH}'>${stringLookup('calendar_mode_month')}</option>
    `;
    viewModeSelector.setAttribute("id", `viewModeSelector${nextViewModeSelectorId}`);
    viewModeLabel.setAttribute("for", `viewModeSelector${nextViewModeSelectorId++}`);

    let nextBtn = document.createElement("button");
    let prevBtn = document.createElement("button");
    viewModeLabel.innerText = stringLookup(`calendar_choose_view_mode`);


    // Update elements/controls based on the current calendar mode.
    let updateModeLabels = () => {
        let mode = calendar.getLocalizedMode();
        nextBtn.innerText = stringLookup(`calendar_next_btn`, mode);
        prevBtn.innerText = stringLookup(`calendar_prev_btn`, mode);

        viewModeSelector.value = calendar.getMode();
    };
    
    updateModeLabels();

    nextBtn.onclick = () => {
        calendar.next();
    };

    prevBtn.onclick = () => {
        calendar.prev();
    };

    viewModeSelector.onchange = () => {
        calendar.setMode(parseInt(viewModeSelector.value));
        updateModeLabels();
    };


    viewModeContainer.replaceChildren(viewModeLabel, viewModeSelector);
    controlsContainer.replaceChildren(prevBtn, viewModeContainer, nextBtn);
    outputElem.appendChild(controlsContainer);
}

export default calendarSetup;
