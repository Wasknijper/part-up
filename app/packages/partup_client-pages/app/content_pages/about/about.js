Template.app_about.helpers({
    shrinkHeader: function() {
        return Partup.client.scroll.pos.get() > 40;
    },
});
