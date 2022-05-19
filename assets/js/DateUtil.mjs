---
---

import { assertEq } from "./assertions.mjs";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_WEEK = MS_PER_DAY * 7;

var DateUtil = {
    MS_PER_DAY,
    MS_PER_WEEK,

    /// Returns [true] iff [date] is today.
    dateIsToday(date) {
        let now = new Date();

        return DateUtil.datesAreOnSameDay(now, date);
    },

    /// Returns [true] iff [a] and [b] refer to the same day.
    datesAreOnSameDay(a, b) {
        return a.getDate() == b.getDate()
            && a.getFullYear() == b.getFullYear()
            && a.getMonth() == b.getMonth();
    },

    /// Returns a copy of [date] that points to the next day.
    nextDay(date) {
        return new Date(date.getTime() + MS_PER_DAY);
    },

    prevDay(date) {
        return new Date(date.getTime() - MS_PER_DAY);
    },

    /// Returns a copy of [date] that points to the next week.
    nextWeek(date) {
        return new Date(date.getTime() + MS_PER_WEEK);
    },

    prevWeek(date) {
        return new Date(date.getTime() - MS_PER_WEEK);
    },

    /// Return a copy of [date] that points to the next month.
    nextMonth(date) {
        let res = new Date(date);

        if (res.getMonth() == 11) {
            res.setYear(res.getYear() + 1);
            res.setMonth(0);
        }
        else {
            res.setMonth(res.getMonth() + 1);
        }

        return res;
    },

    prevMonth(date) {
        let res = new Date(date);

        if (res.getMonth() == 0) {
            res.setYear(res.getYear() - 1);
            res.setMonth(11);
        }
        else {
            res.setMonth(res.getMonth() - 1);
        }

        return res;
    },

    /// Returns a Date on the beginning of the week containing [date].
    beginningOfWeek(date) {
        let dayOfWeek = date.getDay();

        return new Date(date.getTime() - MS_PER_DAY * dayOfWeek);
    },

    beginningOfMonth(date) {
        let dayOfMonth = date.getDate() - 1;

        return new Date(date.getTime() - MS_PER_DAY * dayOfMonth);
    },

    /// Iterator of days in the range from [start] up to [stop]
    /// inclusive.
    *daysInRange(start, stop) {
        let current = start;

        for (; current < stop; current = DateUtil.nextDay(current)) {
            yield current;
        }
    },

    /// Slightly more intelligent date parsing than new Date(string).
    parse(text) {
        text = text.trim();

        // Remove -th, -rd, -ero suffexes
        text = text.replaceAll(/(\d)(?:rd|st|th|ero)/g,
                (fullMatch, group0) => group0);
        let res = new Date(0);

        let shortMatch = text.match(/^(\d+)\/(\d+)\/(\d{2,})$/);

        // DD/MM/YY+ or MM/DD/YY+
        if (shortMatch) {
            let year = parseInt(shortMatch[3]);
            {% if site.hematite.date_format.parsing.month_first %}
            let month = parseInt(shortMatch[1]);
            let day = parseInt(shortMatch[2]);
            {% else %}
            let month = parseInt(shortMatch[2]);
            let day = parseInt(shortMatch[1]);
            {% endif %}

            if (shortMatch[3].length >= 4) {
                res.setFullYear(year);
            }
            else if (shortMatch[3].length == 2){
                res.setFullYear(2000 + year);
            }
            res.setMonth(month - 1, day);
        }
        else {
            res = new Date(text);
        }

        return res;
    },

    /// Returns true iff the given object is a date object.
    isDate(obj) {
        return typeof (obj) == "object" && obj.__proto__ == (new Date()).__proto__;
    },

    /// Converts the given date to a preferences-based localized string
    toString(date, dateOptions) {
        dateOptions ??= {{ site.hematite.date_format | default: nil | jsonify }};
        // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
        // for other formatting options.
        dateOptions ??= {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        };

        return date.toLocaleString(undefined, dateOptions);
    },
};

assertEq("Check if new Date() is a date",
    DateUtil.isDate(new Date()), true);
assertEq("Check if dates can be parsed",
    DateUtil.parse("01/01/22").getFullYear(), 2022);
assertEq("Same day test 1",
    DateUtil.datesAreOnSameDay(DateUtil.parse("01/02/22"), DateUtil.parse("01/02/2022")), true);
assertEq("Same day test 2",
    DateUtil.datesAreOnSameDay(DateUtil.parse("01/01/22"), DateUtil.parse("January 1st, 2022")), true);

export default DateUtil;
