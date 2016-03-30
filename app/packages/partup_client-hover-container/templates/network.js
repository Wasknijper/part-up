Template.HoverContainer_network.onCreated(function() {
    var networkSlug = this.data;
});

Template.HoverContainer_network.helpers({
    networkSlug: function() {
        var networkSlug = Template.instance().data;
        if (!networkSlug) return;
        return networkSlug;
    }
});
