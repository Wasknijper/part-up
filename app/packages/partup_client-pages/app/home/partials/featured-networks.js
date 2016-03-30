Template.FeaturedNetworks.onCreated(function() {
    var template = this;

    var firstNetwork = template.data.networks[0];
    template.selectedSlug = new ReactiveVar(firstNetwork.slug);
});

Template.FeaturedNetworks.helpers({
    selectedNetwork: function() {
        var template = Template.instance();

        return mout.object.find(template.data.networks, {
            slug: template.selectedSlug.get()
        });
    },
    networkLogo: function() {
        var network = this;

        if (network.logoObject) {
            return Partup.helpers.url.getImageUrl(network.logoObject, '360x360');
        } else if (network.imageObject) {
            return Partup.helpers.url.getImageUrl(network.imageObject, '360x360');
        }

        return '';
    }
});

Template.FeaturedNetworks.events({
    'click [data-select]': function(event, template) {
        event.preventDefault();
        var slug = event.currentTarget.dataset.select;
        template.selectedSlug.set(slug);
    }
});
