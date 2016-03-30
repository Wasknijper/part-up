/**
 * Events
 *
 * @class updates
 * @memberof Partup.client
 */
Partup.client.events = {
    /**
     * Attach a new global event listener
     *
     * @param {String} name
     * @param {Function} callback
     */
    on: function(name, callback) {
        jQuery(document.body).on(name, callback);
    },

    /**
     * Detach a new global event listener
     *
     * @param {String} name
     * @param {Function} callback
     */
    off: function(name, callback) {
        jQuery(document.body).off(name, callback);
    },

    /**
     * Emit an event
     *
     * @param {String} name
     * @param {Array} args
     */
    emit: function(name, args) {
        jQuery(document.body).trigger(name, args);
    }
};
