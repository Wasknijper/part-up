/**
 * Element Helpers to check if an element is somewhere below another element
 *
 * @class elements
 * @memberof Partup.client
 */
Partup.client.elements = {

    /**
     *
     * @memberof elements
     * @param {Element} target element to look below
     * @param {String} selector for element to search
     * @returns {Boolean} whether the element is somewhere below
     */
    checkIfElementIsBelow: function(currentElement, selector) {
        $element = $(currentElement);
        var self = false;
        $(selector).each(function(idx, match) {
            if (!self) {
                self = $element.get(0) === match;
                return;
            }
        });
        var parents = $element.parents(selector);
        return (!!parents.length || self);
    },

    /**
     *
     * @memberof elements
     * @param {Elements} target elements
     * @param {Callback} callback when the user clicks outside
     * @returns {Handler} handler for unbinding
     */
    onClickOutside: function(elements, callback) {
        var handler = function(event) {
            // Match test: element is target ?
            var match = !!lodash.find(elements, function(element) {
                return event.target === element;
            });

            // Match test: element is one of target parents ?
            if (!match) {
                var parents = $(event.target).parents();
                match = lodash.intersection(parents, elements).length > 0;
            }

            // If still no match, the user clicked outside the element
            if (!match) {
                callback();
            }

        };
        document.documentElement.addEventListener('click', handler);

        return handler; // return handler to be able to unbind in future
    },

    /**
     * Unbind document handler created by 'onClickOutside'
     *
     * @memberof elements
     * @param {Handler} handler Returned by your onClickOutside
     */
    offClickOutside: function(handler) {
        document.documentElement.removeEventListener('click', handler);
    }
};
