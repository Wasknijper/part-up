/**
 * Embed helpers
 *
 * @class embed
 * @memberof Partup.client
 */
Partup.client.embed = {
    partup: function(partup, images, networks, users) {
        var embed = this;

        // Add upperObjects to partup
        if (partup.uppers) {
            partup.upperObjects = partup.uppers.map(function(userId) {
                var upper = mout.object.find(users, {_id: userId});
                if (!upper) return {};

                embed.user(upper, images);

                return upper;
            });
        }

        // Add partup image to partup
        if (partup.image) {
            partup.imageObject = mout.object.find(images, {_id: partup.image});
        }

        // Add network object to partup
        if (partup.network_id) {
            partup.networkObject = mout.object.find(networks, {_id: partup.network_id});

            // Embed network
            if (partup.networkObject) {
                embed.network(partup.networkObject, images, users);
            }
        }
    },
    network: function(network, images, users) {
        var embed = this;

        // Add network iconObject
        if (network.icon) {
            network.iconObject = mout.object.find(images, {_id: network.icon});
        }

        // Add network logoObject
        if (network.logo) {
            network.logoObject = mout.object.find(images, {_id: network.logo});
        }

        // Add network imageObject
        if (network.image) {
            network.imageObject = mout.object.find(images, {_id: network.image});
        }

        // Add featured by user data
        if (users && get(network, 'featured.by_upper._id')) {
            network.featured.by_upperObject = mout.object.find(users, {_id: network.featured.by_upper._id});

            // Embed user
            if (network.featured.by_upperObject) {
                embed.user(network.featured.by_upperObject, images);
            }
        }

    },
    user: function(user, images) {

        // Add imageObject to user image
        if (get(user, 'profile.image')) {
            user.profile.imageObject = mout.object.find(images, {_id: user.profile.image});
        }

    }
};
