/*************************************************************/
/* Partial rendered */
/*************************************************************/
Template.app_partup_navigation.onRendered(function() {
    var template = this;
    // Offset to improve window resizing behaviour
    var OFFSET = 100;

    // Find page element
    var pageElm = $('.pu-partuppagelayout');
    if (!pageElm) return;

    // Find left side element
    var leftElm = $('> .pu-sub-partupdetail-left', pageElm);
    if (!leftElm) return;

    // Calculate navigation background width
    template.calculateBackgroundWidth = function() {
        var backgroundWidth = (window.innerWidth - pageElm.width()) / 2 + leftElm.width() + OFFSET;
        Session.set('partials.partup-detail-navigation.background-width', backgroundWidth);
    };

    // Trigger calculations
    window.addEventListener('resize', template.calculateBackgroundWidth);
    template.calculateBackgroundWidth();
    Meteor.defer(template.calculateBackgroundWidth);
});

Template.app_partup_navigation.onDestroyed(function() {
    var template = this;
    window.removeEventListener('resize', template.calculateBackgroundWidth);
});

/*************************************************************/
/* Partial helpers */
/*************************************************************/
Template.app_partup_navigation.helpers({
    partup: function() {
        return Partups.findOne(this.partupId);
    },
    backgroundWidth: function() {
        return Session.get('partials.partup-detail-navigation.background-width') || 0;
    }
});

Template.app_partup_navigation.events({
    'click [data-openpartupsettings]': function(event, template) {
        event.preventDefault();

        var partup = Partups.findOne(template.data.partupId);

        Intent.go({
            route: 'partup-settings',
            params: {
                slug: partup.slug
            }
        });
    }
});
