Template.swarm_content_networks.onRendered(function() {
    var template = this;
    var mobile = window.outerWidth < 480;

    template.scrollElement = $(template.find('[data-horizontal-scroll]'));
    // remember scrolloffset;
    var oldScrollOffsetLeft = 0;
    // mousewheel handler
    template.mouseWheelHandler = function(e) {
        var scrollLeft = template.scrollElement[0].scrollLeft;
        var scrollEnd = ((template.scrollElement[0].offsetWidth + scrollLeft) > template.scrollElement[0].scrollWidth - 800);
        var scrollDirection = oldScrollOffsetLeft < scrollLeft ? 'right' : 'left';
        oldScrollOffsetLeft = scrollLeft + 10;
        if (e.type === 'mousewheel') {
            this.scrollLeft -= e.originalEvent.wheelDeltaY;
            if (!e.originalEvent.wheelDeltaX) {
                e.preventDefault();
            }
        } else {
            e.preventDefault();
            this.scrollLeft += (e.originalEvent.detail * 5);
        }
    };

    if (!mobile) {
        // template.scrollElement.on('mousewheel DOMMouseScroll', template.mouseWheelHandler);
    }

});

Template.swarm_content_networks.events({
    'click [data-right]': function(event, template) {
        var leftPos = $('[data-horizontal-scroll]').scrollLeft();
        var width = $('[data-horizontal-scroll]').width() - 50;
        $('[data-horizontal-scroll]').animate({scrollLeft: leftPos + width}, 250);
        template.clicked.set(true);
    },
    'click [data-left]': function(event, template) {
        var leftPos = $('[data-horizontal-scroll]').scrollLeft();
        var width = $('[data-horizontal-scroll]').width() - 50;
        $('[data-horizontal-scroll]').animate({scrollLeft: leftPos - width}, 250);
    }
});
