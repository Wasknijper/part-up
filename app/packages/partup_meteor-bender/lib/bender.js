var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

this.Bender = (function() {
    function Bender() {}

    Bender.animations = [];

    Bender.current = null;

    Bender.initialize = function(_at_el, startCallback, endCallback) {
        this.el = _at_el;
        this.current = new this.animations[0];
        return this.el._uihooks = {
            insertElement: _.bind(this.insertElement, this),
            removeElement: _.bind(this.removeElement, this)
        };
    };

    Bender.animate = function(animation, startCallback, endCallback) {
        var item;
        item = _.find(Bender.animations, function(item) {
            return __indexOf.call(item.animations, animation) >= 0;
        });

        return Bender.current = new item(animation, startCallback, endCallback);
    };

    Bender.insertElement = function(node, next) {
        return this.current.insertElement(node, next);
    };

    Bender.removeElement = function(node) {
        return this.current.removeElement(node);
    };

    Bender.go = function(routeNameOrPath, params, options) {
        if (options && (options.animation != null)) {
            Bender.animate(options.animation);
            delete options.animation;
        }
        return Router.go(routeNameOrPath, params, options);
    };

    return Bender;

})();
