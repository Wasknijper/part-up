/**
 * Service to open a popup
 *
 * @class popup
 * @memberof Partup.client
 *
 * @example
 * {{#if partupIsPopupActive 'new_message'}}
 *   {{#contentFor 'PopupTitle'}}New message{{/contentFor}}
 *   {{#contentFor 'PopupContent'}}
 *     {{> My Template}}
 *   {{/contentFor}}
 * {{/if}}
 *
 */
Partup.client.popup = {

    /**
     * ReactiveVar which holds the id of the current popup.
     * If no popup is opened, the value will be null.
     *
     * @var {ReactiveVar} current
     * @memberof Partup.client.popup
     */
    current: new ReactiveVar(),
    currentType: new ReactiveVar(),
    imageIndex: new ReactiveVar(0),
    totalImages: new ReactiveVar(0),

    /**
     * Open a popup
     *
     * @param {Object} options
     * @param {String} options.id The identifier for your popup
     * @param {String} options.type The type for your popup, undefined if default, 'gallery' if gallery type
     * @param {Function} callback   A popup-close callback
     * @memberof Partup.client.popup
     */
    open: function(options, callback) {
        if (!options || !options.id) console.error('a unique options.id must be defined');

        var id = options.id;
        if (!id || !mout.lang.isString(id)) throw 'id must be a string';

        var type = options.type || undefined;
        var totalImages = options.totalImages || 0;
        var imageIndex = options.imageIndex || 0;
        // Open popup
        this.current.set(id);
        this.currentType.set(type);
        this.imageIndex.set(imageIndex);
        this.totalImages.set(totalImages);

        // Add class to body
        $('body').addClass('pu-state-popupopen');

        // Save callback
        if (callback) {
            if (!mout.lang.isFunction(callback)) throw 'callback must be a function';
            this._closeCallback = callback;
        }
    },

    /**
     * Close the current popup
     *
     * @param Arguments you want to pass to the callback to optionally passed with `open()`
     * @memberof Partup.client.popup
     */
    close: function() {
        // Get current popup
        var current = this.current.curValue;
        if (!current) throw '[Partup.client.popup.close] No current popup found';

        // Close popup
        this.current.set(null);
        this.totalImages.set(0);
        this.imageIndex.set(0);

        // Remove class to body
        $('body').removeClass('pu-state-popupopen');

        // Save callback
        var callback = this._closeCallback;

        // Delete callback before executing, because otherwise you should not be able
        // to open a new popup within the callback
        this._closeCallback = null;

        // Execute callback
        if (mout.lang.isFunction(callback)) {
            callback.apply(window, arguments);
        }
    },

    /**
     * Close the current popup
     *
     * @param Arguments you want to pass to the callback to optionally passed with `open()`
     * @memberof Partup.client.popup
     *
     */
    _closeCallback: null
};
