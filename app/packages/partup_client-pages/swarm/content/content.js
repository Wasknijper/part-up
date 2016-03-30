Template.swarm_content.onCreated(function() {
    var template = this;
    template.clicked = new ReactiveVar(false);
});

Template.swarm_content.onDestroyed(function() {
    // this.scrollElement.off('mousewheel DOMMouseScroll', this.mouseWheelHandler);
});

Template.swarm_content.helpers({
    clickedOnce: function() {
        return Template.instance().clicked.get();
    }
});
