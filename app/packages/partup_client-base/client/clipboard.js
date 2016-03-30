/**
 * Copy text to clipboard using flash fallback
 *
 * @class clipboard
 * @memberof Partup.client
 */
Partup.client.clipboard = {

    /**
     * Create a copy to clipboard element width callback
     *
     * @memberof Partup.client.clipboard
     * @param {Element} target element to serve as the clickable element
     * @param {String} text to copy
     * @param {Function} callback
     */
    applyToElement: function(element, text, callback) {
        // Apply clipboard click event
        if (window.PU_IE_VERSION < 0) {
            $(element).clipboard({
                path: '/extra/jquery.clipboard.swf',

                copy: function() {
                    callback();
                    return text;
                }
            });
        }

    }
};
