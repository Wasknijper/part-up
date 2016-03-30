// adds a reactive var that is true when a template
// is rendered usefull for helpers that need to fire on render
Template.onCreated(function() {
    this.partupTemplateIsRendered = new ReactiveVar(false);
});
Template.onRendered(function() {
    var template = this;
    Meteor.setTimeout(function() {
        template.partupTemplateIsRendered.set(true);
    }, 500);
});
Template.onDestroyed(function() {
    this.partupTemplateIsRendered.set(false);
});

// fires the 'pu:componentRendered' event whenever something new is rendered
Template.onRendered(function() {
    var tpl = this;

    tpl.autorun(function() {
        var data = Template.currentData();
        Meteor.defer(function() {
            $(window).trigger('pu:componentRendered');
        });
    });

});
