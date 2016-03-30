Template.Ring.onCreated(function() {
    var template = this;
    template.rings = new ReactiveVar([]);
    template.pages = new ReactiveVar([]);
    template.placeholder = new ReactiveVar([]);
    template.currentPage = new ReactiveVar(0);
    template.totalPages = 0;

    // helpers
    template.randomBoolean = function() {
        return !(+new Date() % 2); // faux-randomness
    };

    // preset the configuration
    // to prevent recalculation in autorun
    template.getPresets = function() {
        // var startAngle = lodash.random(0, 360);
        return {
            inner: {
                radius: 30,
                startAngle: lodash.random(0, 360),
                animate: true
            },
            outer: {
                radius: 75,
                startAngle: lodash.random(0, 360),
                animate: true
            }
        };
    };
});

Template.Ring.onRendered(function() {
    var template = this;
    template.container = template.find('.pu-ring');
    template.mouseMoveHandler = function(e) {
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var xPercent = 100 / windowWidth * e.clientX;
        var yPercent = 100 / windowHeight * e.clientY;
        $(template.container).css({
            perspectiveOrigin: xPercent + '% ' + yPercent + '%',
            perspectiveOriginX: xPercent + '%',
            perspectiveOriginY: yPercent + '%'
        });
    };

    template.debouncedMouseMoveHandler = _.throttle(template.mouseMoveHandler, 100, true);
    if (!Partup.client.isMobile.isTabletOrMobile()) $('.pu-swarm > header').on('mousemove', template.debouncedMouseMoveHandler);

    template.createRing = function(ringElement, options) {
        // options readout
        var items = options.items || [];
        var radius = options.radius || 100;
        var startAngle = typeof options.startAngle === 'number' ? options.startAngle : lodash.random(0, 360);
        var skipAngle = options.skipAngle || false;
        var offset = options.offset || {};
        var offsetTop = offset.top || 0;
        var offsetLeft = offset.left || 0;
        var animate = options.animate || false;
        // randomly decide direction of circle (clockwise or counter-clockwise)
        var reverse = options.reverse || false;

        // calculation constants
        var PI = Math.PI;
        var TAU = PI * 2;
        var totalItems = items.length;

        // x-axis calculations
        var ringXDiameter = ringElement.offsetWidth;
        var ringXDiameterPercentage = 100 / ringXDiameter;
        var ringXRadius = ringXDiameter / 2;
        var ringXRadiusPercentage = (ringXRadius / 100) * radius;

        // y-axis calculations
        var ringYDiameter = ringElement.offsetHeight;
        var ringYDiameterPercentage = 100 / ringYDiameter;
        var ringYRadius = ringYDiameter / 2;
        var ringYRadiusPercentage = (ringYRadius / 100) * radius;

        // calculate starting angle
        var angle = (TAU / 360) * startAngle;

        // calculate item angle offset
        var angleIncrement = TAU / totalItems;

        var skipChunk = function() {
            var skip = (100 / 360) * skipAngle;
            var skipTotal = Math.round((totalItems / 100) * skip);
            angleIncrement = TAU / (totalItems + skipTotal);
            for (var i = 0; i < skipTotal; i++) {
                angle += angleIncrement;
            };
        };
        var getNumberInsideRange = function(min, max, input) {
            if (input > max) input = min + (input - max);
            return input;
        };
        // skip a chunk if this is specified in options
        if (skipAngle) skipChunk();

        // loop through each item and calculate the position on ring
        items.forEach(function(item, i) {
            var x = ringXDiameterPercentage * (ringXRadiusPercentage * Math.cos(angle) + ringXRadius) + (offsetLeft);
            var y = ringYDiameterPercentage * (ringYRadiusPercentage * Math.sin(angle) + ringYRadius) + (offsetTop);
            if (reverse) x = 100 - x;
            var positioning = new ReactiveVar({
                x: x,
                y: y
            });
            item.positioning = positioning;
            item.classNumber = getNumberInsideRange(0, 36, Math.round((Math.abs(((360 / TAU) * angle))) / 10));
            angle += angleIncrement;
        });

        return items;
    };

    template.autorun(function(c) {
        var data = Template.currentData();
        if (data.rings instanceof Array) {
            c.stop();
            var pages = [];
            template.totalPages = data.rings.length;
            Tracker.nonreactive(function() {
                _.each(data.rings, function(ring, index) {
                    var page = [];
                    var presets = template.getPresets();
                    _.each(presets, function(preset, key) {
                        preset.items = ring[key] || [];
                        page = page.concat(template.createRing(template.container, preset));
                    });
                    pages.push({
                        index: index,
                        rings: page
                    });
                });
                template.pages.set(pages);
            });
        } else {
            c.stop();
            var rings = [];
            Tracker.nonreactive(function() {
                var presets = template.getPresets();
                _.each(presets, function(preset, key) {
                    preset.items = data.rings[key] || [];
                    rings = rings.concat(template.createRing(template.container, preset));
                });
                template.rings.set(rings);
            });
        }
    });

});

Template.Ring.onDestroyed(function() {
    var template = this;
    $('.pu-swarm > header').off('mousemove', template.debouncedMouseMoveHandler);
});

Template.Ring.events({
    'click [data-right]': function(event, template) {
        event.preventDefault();
        var currentPage = template.currentPage.get();
        var totalPages = template.totalPages - 1;
        var nextPage = Math.min((currentPage + 1), totalPages);
        template.currentPage.set(nextPage);
    },
    'click [data-left]': function(event, template) {
        event.preventDefault();
        var currentPage = template.currentPage.get();
        var totalPages = template.totalPages - 1;
        var nextPage = Math.max((currentPage - 1), 0);
        template.currentPage.set(nextPage);
    }
});

Template.Ring.helpers({
    state: function() {
        var template = Template.instance();
        return {
            currentPage: function() {
                return template.currentPage.get();
            },
            firstPage: function() {
                return template.currentPage.get() === 0;
            },
            lastPage: function() {
                return template.currentPage.get() === (template.totalPages - 1);
            },
            side: function() {
                return template.currentPage.get() ? 'right' : 'left';
            }
        };
    },
    data: function() {
        var template = Template.instance();
        return {
            rings: function() {
                return template.rings.get();
            },
            pages: function() {
                return template.pages.get();
            },
            placeholder: function() {
                return template.placeholder.get();
            }
        };
    }
});
