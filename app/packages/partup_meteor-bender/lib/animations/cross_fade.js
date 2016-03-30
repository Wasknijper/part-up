var CrossFade;
var __bind = function(fn, me) { return function() { return fn.apply(me, arguments); }; };

CrossFade = (function() {
    CrossFade.INSERT = {
        fadeIn: 1,
        fadeOut: 0
    };

    CrossFade.REMOVE = {
        fadeIn: 0,
        fadeOut: 1
    };

    CrossFade.animations = ['fadeIn', 'fadeOut'];

    CrossFade.prototype.animationDuration = 600;

    function CrossFade(_at_animation, startCallback, endCallback) {
        this.animation = _at_animation;
        this.removeElement = __bind(this.removeElement, this);
        this.insertElement = __bind(this.insertElement, this);
        this.startCallback = startCallback;
        this.endCallback = endCallback;
    }

    CrossFade.prototype.insertElement = function(node, next) {
        var start;
        start = this.constructor.INSERT[this.animation];
        if (this.startCallback) this.startCallback();
        $(node).insertBefore(next);
        return $(node).velocity('fadeIn', {
            duration: this.animationDuration,
            easing: 'ease-in-out',
            queue: false
        });
    };

    CrossFade.prototype.removeElement = function(node) {
        var end;
        end = this.constructor.REMOVE[this.animation];
        var endCallback = this.endCallback;
        return $(node).velocity('fadeOut', {
            duration: this.animationDuration,
            easing: 'ease-in-out',
            queue: false,
            complete: function() {
                if (endCallback) endCallback();
                return $(node).remove();
            }
        });
    };

    return CrossFade;

})();

this.Bender.animations.push(CrossFade);
