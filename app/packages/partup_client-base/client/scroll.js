/**
 * Helpers for scroll behaviour
 *
 * @class scroll
 * @memberof Partup.client
 */
var INFINITE_SCROLL_OFFSET = 0;
var INFINITE_SCROLL_DEBOUNCE = 40;

Partup.client.scroll = {

    _initialized: false,
    init: function() {
        if (!window) return;

        var self = this;
        if (this._initialized) return console.warn('scroll.js: cannot initialize multiple times');

        this._initialized = true;

        // Debounced update function
        var d = lodash.debounce(function() {
            self.triggerUpdate.apply(self);
        }, 10);

        // Trigger a position update when the user scrolls
        $(window).scroll(d);

        // Trigger a position update when every template is being rendered
        Template.onRendered(function() {
            Meteor.defer(d);
        });
    },

    /**
     * Current scroll position reactive var
     *
     * @memberof Partup.client.scroll
     */
    pos: new ReactiveVar(0),

    /**
     * Current maxscroll
     *
     * @memberof Partup.client.scroll
     */
    maxScroll: function() {
        return document.body.scrollHeight - window.innerHeight;
    },

    /**
     * Trigger a scroll pos update
     *
     * @memberof Partup.client.scroll
     */
    triggerUpdate: function() {
        var pos = typeof window.scrollY !== 'undefined' ? window.scrollY : document.documentElement.scrollTop;
        Partup.client.scroll.pos.set(pos);
    },

    /**
     * Infinite scroll functionality
     *
     * @memberof Partup.client.scroll
     * @param options {Object}           Options for the infinite scroll
     * @param options.template {Blaze}   A template where the infinite scroll runs in
     * @param options.element  {Element} The container element (growing when content increases)
     * @param callback {Function}        Infinite scroll callback
     */
    infinite: function(options, callback) {
        var self = this;

        options = options || {};
        options.offset = mout.lang.isNumber(options.offset) ? options.offset : INFINITE_SCROLL_OFFSET;
        if (!options.template) return;
        if (!options.element) return;

        var trigger = function() {
            var bottomPosition = options.element.getBoundingClientRect().bottom;
            var bottomInView = bottomPosition - window.innerHeight;
            if (bottomInView < options.offset) {
                if (!options.template.view.isDestroyed) callback();
            }
        };
        var debounced_trigger = lodash.debounce(trigger, INFINITE_SCROLL_DEBOUNCE);

        options.template.autorun(function() {
            self.pos.get();
            Tracker.nonreactive(debounced_trigger);
        });
    },

    /**
     * Check if an element is in view
     *
     * @memberof Partup.client.scroll
     * @param element  {Element}
     * @returns inView {Boolean} Whether the given element is in view
     */
    inView: function(element) {
        if (!element) return false;

        // Call the this.pos.get() function to make this function reactive
        this.pos.get();

        // Return whether the element is completely in viewport
        return element.offsetTop >= 0 && element.offsetTop + element.clientHeight <= window.innerHeight;
    },

    /**
     * Scroll to an element with optional offset
     *
     * @memberof Partup.client.scroll
     * @param element  {Element}
     * @param offset   {Number}
     * @param options  {Object}
     * @param options.duration {Number} Scroll animation duration. Defaults to zero for no animation.
     * @param options.callback {Function} Getting called when the animation ends.
     */
    to: function(element, offset, options) {
        element = element || null;
        offset = offset || 0;
        options = options || {};

        // Options
        var duration = options.duration || 0;
        var callback = typeof options.callback === 'function' ? options.callback : undefined;

        // Calculate position
        var position = 0;
        if (element) position += element.offsetTop || 0;
        position += offset;

        // Limit position
        position = Math.min(position, this.maxScroll());

        // Trigger scroll
        $('html, body').animate({
            scrollTop: position
        }, duration, 'swing', function() {
            if (callback) callback.apply(window);
        });
    },
    scrollToAndFocusErrorField: function() {
      // wait for .invalid class to be presented in the DOM
      Meteor.setTimeout(function(){
        try {
          var $invalid = $('.pu-state-invalid:first');
          var $label = $invalid.parent().find('.pu-label');
          var $progressPager = $('.pu-progresspager');
          var $header = $('.pu-header');
          var extraOffsetTop = 10;
          var offsetTop = ($progressPager.length && $header.length)
          // we have to substract the height of header and progress page if
          // the elements are visible on the page
          ? $label.offset().top - extraOffsetTop - ( $header.outerHeight() + $progressPager.outerHeight() )
          // else we have no offset
          : 0;
          Partup.client.scroll.to($label.get(0), offsetTop, { duration: 100 });
          $input = $invalid.find('input:visible, textarea:visible').first();
          $input.get(0).focus();
        } catch(e) {}
      }, 100); // should be enough to wait and scroll to the element
    }
};

Partup.client.scroll.triggerUpdate();
