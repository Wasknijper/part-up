Template.NetworkTile.onCreated(function() {
    var networkSlug = this.data.networkSlug;
    this.subscribe('networks.one', networkSlug);
});

Template.NetworkTile.helpers({
    data: function() {
        var networkSlug = this.networkSlug;
        var network = Networks.findOne({slug: networkSlug});
        return {
            networkLogo: function() {
                var network = this.network;

                if (network.logoObject) {
                    return Partup.helpers.url.getImageUrl(network.logoObject, '360x360');
                } else if (network.imageObject) {
                    return Partup.helpers.url.getImageUrl(network.imageObject, '360x360');
                }

                return '';
            },
            network: function() {
                return network;
            }
        };
    }
});
