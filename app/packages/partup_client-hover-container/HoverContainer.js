// jscs:disable
/**
 * Render a generic hover card
 *
 * @module client-hovercontainer
 */
// jscs:enable

Template.HoverContainer.onCreated(function() {
    var template = this;
    template.settings = new ReactiveVar({});
    template.tile = new ReactiveDict();
});

Template.HoverContainer.onRendered(function() {
    var template = this;

    var showTimeout;
    var $trigger;

    var hide = function() {
        if ($trigger) $trigger.off('mouseleave', hide);

        // Unset settings and user
        template.settings.set({});
        template.tile.set('template', undefined);
        template.tile.set('data', undefined);

        clearTimeout(showTimeout);
    };

    var show = function(event) {
        $trigger = $(this);

        // Gather data for tile
        var tileTemplate = $trigger.data('hovercontainer') || '';
        var tileData = $trigger.data('hovercontainer-context') || {};
        var delay = parseInt($trigger.data('hovercontainer-delay')) || 500;
        var orientation = $trigger.data('hovercontainer-orientation') || 'top-bottom';
        var typeClass = $trigger.data('hovercontainer-class') || '';
        var offset = $trigger.data('hovercontainer-offset') || '';

        // Clear any other hovercontainer timeout
        clearTimeout(showTimeout);

        // Show the card
        var delayedShow = function() {

            var OFFSET = offset || 5;
            var screenWidth = Partup.client.screen.size.get('width');
            var screenHeight = Partup.client.screen.size.get('height');
            var elOffset = $trigger.offset();
            var originX = elOffset.left - $(window).scrollLeft();
            var originY = elOffset.top - $(window).scrollTop();
            var elWidth = $trigger.outerWidth();
            var elHeight = $trigger.outerHeight();

            var set = {
                coords:         {},
                leftSide:       (100 / screenWidth * originX) < 50,
                topHalf:        (100 / screenHeight * originY) > 50,
                orientation:    orientation,
                typeClass:      typeClass
            };

            if (orientation === 'top-bottom') {
                set.coords.left = elWidth / 2 + originX;
                if (set.topHalf)    set.coords.bottom = screenHeight - originY + OFFSET;
                else                set.coords.top = originY + elHeight + OFFSET;
            }

            if (orientation === 'left-right') {
                if (set.leftSide)   set.coords.left = originX + elWidth + OFFSET;
                else                set.coords.right = screenWidth - originX + OFFSET;

                if (set.topHalf)    set.coords.bottom = screenHeight - (elHeight / 2 + originY);
                else                set.coords.top = elHeight / 2 + originY;
            }

            template.settings.set(set);
            template.tile.set('template', tileTemplate);
            template.tile.set('data', tileData);
        };

        // Show the card
        if (delay > 0) {
            showTimeout = setTimeout(delayedShow, delay);
        } else {
            delayedShow();
        }

        // Hide the card on mouse leave
        $trigger.on('mouseleave', hide);
    };

    $('body').on('mouseenter', '[data-hovercontainer]', show);
    Router.onBeforeAction(function() {
        hide();
        this.next();
    });
});

Template.HoverContainer.helpers({
    settings: function() {
        return Template.instance().settings.get();
    },
    tileTemplate: function() {
        return Template.instance().tile.get('template');
    },
    tileData: function() {
        return Template.instance().tile.get('data');
    }
});
