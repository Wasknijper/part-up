Template.Video.onCreated(function() {
    this.play = new ReactiveVar(false);
});

Template.Video.events({
    'click [data-play]': function(event, template) {
        template.play.set(true);
    }
})

Template.Video.helpers({
    play: function() {
        return Template.instance().play.get();
    }
})
