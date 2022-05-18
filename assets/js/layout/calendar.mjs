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
            try {
                lastDate = DateUtil.parse(child.innerText);
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

    result.sort(AgendaItem.compare);

    return result;
}

/// Adds post data to the given calendar data item.
function addPostData(data) {
    let postDates = [
        {% for item in site.posts %}
            {{ item.date | date_to_xmlschema | jsonify }},
        {% endfor %}
    ].map((dateItem) =>
        DateUtil.parse(dateItem)
    );
    let postTags = {{ site.posts | map: "tags" | jsonify }};
    let postTitles = {{ site.posts | map: "title" | jsonify }};
    let postLinks = [
        {% for item in site.posts %}
        {{ item.url | relative_url | jsonify }},
        {% endfor %}
    ];

    if (postDates.length != postTitles.length || postLinks.length != postTitles.length) {
        console.warn("Some post data array has a different length, refusing to show posts.");
        return;
    }

    for (let i = 0; i < postDates.length; i++) {
        data.push({
            date: postDates[i],
            agenda: [ AgendaItem.forPost(postTitles[i], postTags[i], postLinks[i]) ],
            link: undefined,
        });
    }

    data.sort(AgendaItem.compare);

    let newData = [];
    let currentItem;

    for (let i = 0; i < data.length; i++) {
        if (!currentItem) {
            currentItem = { date: data[i].date, agenda: [], };
            newData.push(currentItem);
        }

        if (DateUtil.datesAreOnSameDay(currentItem.date, data[i].date)) {
            for (const item of data[i].agenda) {
                currentItem.agenda.push(item);
            }

            currentItem.link ??= data[i].link;
        } else {
            currentItem = data[i];
            newData.push(currentItem);
        }
    }

    return newData;
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

AgendaItem.forPost = (title, tags, url) => {
    let result = new AgendaItem('');
    title = title
        .replaceAll(/[>]/g, '&gt;')
        .replaceAll(/[<]/g, '&lt;');
    result.html = `<a href="${url}">${title}</a>`;

    result.tags = [...tags];

    return result;
};

AgendaItem.getTagClass = (tag) => {
    return `calendarTag__${tag}`;
};

AgendaItem.compare = (a, b) => {
    if (a.date < b.date) {
        return -1;
    }

    if (a.date > b.date) {
        return 1;
    }

    return 0;
};

class Calendar {
    VIEW_MODE_MONTH = 1;
    VIEW_MODE_WEEK = 2;
    VIEW_MODE_DAY = 3;

    constructor(data, containerElem) {
        this.mode_ = this.VIEW_MODE_WEEK;
        this.container_ = document.createElement("div");
        this.data_ = data;
        this.anchorDate_ = this.closestItemDateTo_(new Date())?.date ?? new Date();

        this.updateLayout_();

        containerElem.appendChild(this.container_);
    }

    /// Returns the item with closest date to [searchDate].
    closestItemDateTo_(searchDate) {
        let i = Math.floor(this.data_.length / 2);
        let lastI;
        let searchStart = 0;
        let searchStop = this.data_.length;

        let isBetterMatch = (otherIdx) => {
            if (0 > otherIdx || otherIdx >= this.data_.length) {
                return false;
            }

            let dtOther =
                this.data_[otherIdx].date.getTime() - searchDate.getTime();
            let dtCurrent =
                this.data_[i].date.getTime() - searchDate.getTime();

            if (Math.abs(dtOther) < Math.abs(dtCurrent)) {
                return true;
            }
            return false;
        };


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

        if (0 <= i && i < this.data_.length) {
            if (isBetterMatch(i + 1)) {
                return this.data_[i + 1];
            }
            else if (isBetterMatch(i - 1)) {
                return this.data_[i - 1];
            }
            return this.data_[i];
        }

        return null;
    }

    /// Get an item in [data_] from [date], if [searchDate]
    /// is the same day as the requested item. If there
    /// are multiple matches, one of them is returned.
    lookupItem_(searchDate) {
        let closest = this.closestItemDateTo_(searchDate);
        if (closest == null || !DateUtil.datesAreOnSameDay(closest.date, searchDate)) {
            return null;
        }

        return closest;
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
            if (content.link) {
                header.href = content.link;
            }

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
            startDate = DateUtil.beginningOfWeek(DateUtil.beginningOfMonth(this.anchorDate_));
            endDate = DateUtil.beginningOfMonth(DateUtil.nextMonth(this.anchorDate_));
            this.content_.classList.add("month-display");
        }
        console.log(startDate, endDate);

        for (const date of DateUtil.daysInRange(startDate, endDate)) {
            this.content_.appendChild(this.createCardForDay_(date));
        }
        this.container_.appendChild(this.content_);
    }

    /// Get the next anchor (i.e. advance the anchor by a week, month,
    /// day, etc.
    getNextAnchor_() {
        let result = this.anchorDate_;

        if (this.mode_ == this.VIEW_MODE_WEEK) {
            result = DateUtil.nextWeek(this.anchorDate_);
        }
        else if (this.mode_ == this.VIEW_MODE_DAY) {
            result = DateUtil.nextDay(this.anchorDate_);
        }
        else {
            result = DateUtil.nextMonth(this.anchorDate_);
        }

        return result;
    }

    getPrevAnchor_() {
        let result = this.anchorDate_;

        if (this.mode_ == this.VIEW_MODE_WEEK) {
            result = DateUtil.prevWeek(this.anchorDate_);
        }
        else if (this.mode_ == this.VIEW_MODE_DAY) {
            result = DateUtil.prevDay(this.anchorDate_);
        }
        else {
            result = DateUtil.prevMonth(this.anchorDate_);
        }

        return result;
    }

    /// Transition to the next time unit.
    next() {
        this.anchorDate_ = this.getNextAnchor_();
        this.updateLayout_();
    }

    prev() {
        this.anchorDate_ = this.getPrevAnchor_();
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
/// and writing output to [outputElem]. If [includePosts], all post-formatted
/// articles are also included.
function calendarSetup(sourceElem, outputElem, includePosts) {
    let data = getCalendarData(sourceElem, true);

    if (includePosts) {
        data = addPostData(data);
    }

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
