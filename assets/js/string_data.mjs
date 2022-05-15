---
permalink: /assets/js/string_data.mjs
---

const STRING_TABLE = {
{% for language in site.data.strings %}
    {{ language[0] }}: {
        {% for string in language[1] %}
            "{{ string[0] }}": {{ string[1] | jsonify }},
        {% endfor %}
    },
{% endfor %}
};

// Locales to check if a string isn't localized in any of the
// user's preferred languages.
const DEFAULT_LOCALES = [ 'en' ];

export { STRING_TABLE, DEFAULT_LOCALES };
