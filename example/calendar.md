---
title: Example Calendar
layout: calendar

# Include posts in the calendar
include_posts: true

# Get date info from `h1` headers. This is the default,
# so in this case, `calendar_date_elem` could be omitted.
calendar_date_elem: h1
---

This is a sample calendar. [View its source on GitHub](https://github.com/personalizedrefrigerator/jekyll-hematite-theme/blob/236e8d0e5b338db137f7ff52dd6b91fe76045b08/example/calendar.md).

Its frontmatter looks like this:
```
---
title: Example Calendar
layout: calendar

# Show posts in the calendar on the days associated
# with them.
include_posts: true

# Get date info from `h1` headers. This is the default,
# so in this case, `calendar_date_elem` could be omitted.
calendar_date_elem: h1
---
```

By choosing `h1` as the `calendar_date_elem`, we choose to
use toplevel headings to specify dates (`# Toplevel heading`).

List items following the header are associated with it
and added to the calendar.





# April 12, 2022
 * [test] A few months ago.

# May 16, 2022
 * [documentation] Document post layout

# 05/17/2022
 * Finish post layout
 * Start working on calendar layout

# 05/18/22
 * Dates can be formatted differently
 * [test] This is a test...

# Invalid Date, 2022
 * [test] Testing...


<style>
/* In the visual calendar, items with tags are
   given class names in the form calendarTag__tagName.

   For example, above, we have
# April 12, 2022
   - [documentation] Foobar

   A tag is created from [documentation]. The version of Foobar in
   the visual display of the calendar has class 'calendarTag__documentation'.
 */
.calendarTag__test::before {
    content: "🧪";
    float: right;
}
</style>
