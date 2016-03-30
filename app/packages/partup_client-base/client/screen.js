/**
 * Reactive screen size source
 *
 * @class screen
 * @memberof Partup.client
 */

Partup.client.screen = {

    _initialized: false,
    init: function() {
        if (!window) return;

        var self = this;
        if (this._initialized) return console.warn('screen.js: cannot initialize multiple times');

        this._initialized = true;

        // Debounced update function
        var d = lodash.debounce(function() {
            self.triggerUpdate.apply(self);
        }, 30);

        // Trigger a size update when the user resizes the screen
        $(window).on('resize orientationchange', d);

        // Trigger a size update once
        Meteor.defer(d);
    },

    /**
     * Current size reactive dict
     *
     * @memberof Partup.client.screen
     */
    size: new ReactiveDict(),

    /**
     * Trigger a size update
     *
     * @memberof Partup.client.screen
     */
    triggerUpdate: function() {
        Partup.client.screen.size.set('width', window.innerWidth);
        Partup.client.screen.size.set('height', window.innerHeight);
    }
};

Partup.client.screen.triggerUpdate();
