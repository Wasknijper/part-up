/**
 * Sanitize an HTML text
 *
 * @class sanitize
 * @memberof Partup.client
 */

Partup.client.sanitize = function(text) {
    return $('<div/>').text(text).html();
};
