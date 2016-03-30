var isMobile = new ReactiveVar();

Meteor.startup(function() {
    var onResize = lodash.debounce(function() {
        isMobile.set(window.innerWidth < 992);
    }, 20);

    $(window).on('load resize', onResize);
});

Template.Header.helpers({
    isMobile: function() {
        return Partup.client.responsive.is() && isMobile.get();
    }
});
