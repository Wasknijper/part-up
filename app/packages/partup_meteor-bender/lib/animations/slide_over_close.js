var SlideOverClose;
var __bind = function(fn, me) { return function() { return fn.apply(me, arguments); }; };

SlideOverClose = (function() {
    SlideOverClose.REMOVE = {
        slideOverUpClose: '100%',
        slideOverDownClose: '-100%'
    };

    SlideOverClose.animations = ['slideOverUpClose', 'slideOverDownClose'];

    SlideOverClose.prototype.animationDuration = 400;

    function SlideOverClose(_at_animation, startCallback, endCallback) {
        this.animation = _at_animation;
        this.removeElement = __bind(this.removeElement, this);
        this.insertElement = __bind(this.insertElement, this);
        this.startCallback = startCallback;
        this.endCallback = endCallback;
    }

    SlideOverClose.prototype.insertElement = function(node, next) {
        if (this.startCallback) this.startCallback();
        return $(node).insertBefore(next);
    };

    SlideOverClose.prototype.removeElement = function(node) {
        var start;
        start = this.constructor.REMOVE[this.animation];
        var endCallback = this.endCallback;
        return $(node).velocity({
            translateY: [start, 0]
        }, {
            duration: this.animationDuration,
            easing: 'ease-in-out',
            queue: false,
            complete: function() {
                if (typeof endCallback === 'function') endCallback();
                return $(node).remove();
            }
        });
    };

    return SlideOverClose;

})();

this.Bender.animations.push(SlideOverClose);
