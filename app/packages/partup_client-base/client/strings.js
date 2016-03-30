Partup.client.strings = {

    /**
     * Slugify helper
     *
     * @memberof Partup.client
     * @param {String} string to slugify
     */
    slugify: function(stringToSlugify) {

        if (typeof stringToSlugify !== 'string') {
            return stringToSlugify;
        }

        return stringToSlugify
            .replace('.', '-')              // Replace . with -
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '')             // Trim - from end of text
            .toLowerCase();                 // ensure lower case characters
    },

    /**
     * Emoji helper
     *
     * turns text into emojis using emoji.js
     * See: https://github.com/iamcal/js-emoji
     * @memberof Partup.client
     * @param {String} string to emoji
     */
    emojify: function(stringToEmoji) {

        if (typeof stringToEmoji !== 'string') {
            return stringToEmoji;
        }

        return emoji.replace_colons(emoji.replace_emoticons(stringToEmoji));
    },

    tagsStringToArray: function(tagString) {
        if (!tagString) return [];
        return tagsArray = tagString.replace(/\s/g, '').split(',').map(function(tag) {
            return mout.string.slugify(tag);
        });
    },

    newlineToBreak: function(string) {
        return string.replace(/(?:\r\n|\r|\n)/g, '<br />');
    },

    locationToDescription: function(location) {
        var components = [];
        if (location.city) components.push(location.city);
        if (location.country) components.push(location.country);
        return components.join(', ');
    },

    partupSlugToId: function(slug) {
        return slug.split('-').pop();
    }

};
