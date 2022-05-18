
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

        if (res.getMonth() == 0) {
            res.setYear(res.getYear() + 1);
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
        // Remove -th, -rd, -ero suffexes
        text = text.replaceAll(/(\d)(?:rd|th|ero)/g,
                (fullMatch, group0) => group0);
        console.log("Parsing", text);

        return new Date(text);
    }
};

export default DateUtil;
