Template.Bubble.onCreated(function() {
    var template = this;
    template.show = new ReactiveVar(false);
    template.animation = new ReactiveVar({});
    template.randomCoordinates = function(min, max) {
        return {
            x: lodash.random(min, max),
            y: lodash.random(min, max)
        };
    };
    template.animation.set(template.randomCoordinates(-2, 2));

    template.id = lodash.uniqueId();
    template.time = lodash.random(4, 8);
    template.active = new ReactiveVar(false);
});

Template.Bubble.onRendered(function() {
    var template = this;
    var delay = lodash.random(100, 700);
    Meteor.setTimeout(function() {
        template.show.set(true);
        Meteor.setTimeout(function() {
            template.active.set(true);
        }, 250);
    }, delay);
});

Template.Bubble.helpers({
    data: function() {
        var template = Template.instance();
        return {
            image: function() {
                return this.image;
            }
        };
    },
    state: function() {
        var template = Template.instance();
        return {
            show: function() {
                return template.show.get();
            },
            type: function() {
                return template.data.type;
            },
            animation: function() {
                return template.animation.get();
            },
            id: function() {
                return template.id;
            },
            time: function() {
                return template.time;
            },
            active: function() {
                return template.active.get();
            },
            isIE: function() {
                var ua = window.navigator.userAgent;
                var msie = ua.indexOf('MSIE ');

                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                    return true;
                }

                if (/Edge/.test(navigator.userAgent)) {
                    // this is Microsoft Edge
                    return true;
                }

                return false;
            }
        };
    }
});

