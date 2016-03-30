var d = Debug('services:swarms');

/**
 @namespace Partup server swarms service
 @name Partup.server.services.swarms
 @memberof Partup.server.services
 */
Partup.server.services.swarms = {
    /**
     * Update the swarm stats
     *
     * @param {Object} swarm
     */
    updateStats: function(swarm) {
        // Initialize stats counters
        var swarm_stats = {
            activity_count: 0,
            network_count: 0,
            partner_count: 0,
            partup_count: 0,
            supporter_count: 0,
            upper_count: 0
        };
        var unique_swarm_uppers = [];
        var unique_swarm_partners = [];
        var unique_swarm_supporters = [];

        // Get all the network IDs to loop through
        var networks = swarm.networks || [];

        // Set the network count
        swarm_stats.network_count = networks.length;

        // Loop through each of the networks to get all partups
        networks.forEach(function(networkId) {
            // Retrieve the network
            var network = Networks.findOne(networkId);

            // Initialize stats counters
            var network_stats = {
                activity_count: 0,
                partner_count: 0,
                partup_count: 0,
                supporter_count: 0,
                upper_count: 0
            };
            var unique_network_partners = [];
            var unique_network_supporters = [];

            // Store the partup IDs to loop through for the activities
            var partups = Partups.find({network_id: network._id, deleted_at: {$exists: false}, archived_at: {$exists: false}}, {_id: 1}).fetch();
            var network_partups = [];
            partups.forEach(function(partup) {
                network_partups.push(partup._id);
            });

            // Update the partup counter with the amount of partups in this network
            network_stats.partup_count = network_partups.length;
            swarm_stats.partup_count += network_stats.partup_count;

            // Update the upper counter with the amount of uppers in this network
            var network_uppers = network.uppers || [];
            network_stats.upper_count = network_uppers.length;
            unique_swarm_uppers.push.apply(unique_swarm_uppers, network_uppers);

            // Loop through each partup to get activity and supporter count
            network_partups.forEach(function(partupId) {
                // Retrieve the partup
                var partup = Partups.findOne(partupId);

                // Update the activity counter with the amount of activities in this partup
                var partup_activity_count = partup.activity_count || 0;
                network_stats.activity_count += partup_activity_count;
                swarm_stats.activity_count += partup_activity_count;

                // Update the partner array
                var partup_partners = partup.uppers || [];
                unique_network_partners.push.apply(unique_network_partners, partup_partners);
                unique_swarm_partners.push.apply(unique_swarm_partners, partup_partners);

                // And lastly, update the supporter array
                var partup_supporters = partup.supporters || [];
                unique_network_supporters.push.apply(unique_network_supporters, partup_supporters);
                unique_swarm_supporters.push.apply(unique_swarm_supporters, partup_supporters);
            });

            // Deduping the network-level dups
            network_stats.partner_count = lodash.unique(unique_network_partners).length;
            network_stats.supporter_count = lodash.unique(unique_network_supporters).length;

            // Update the network with the new stats
            Networks.update(network._id, {
                $set: {
                    stats: network_stats,
                    updated_at: new Date()
                }
            });
        });

        // Deduping the swarm-level dups
        swarm_stats.upper_count = lodash.unique(unique_swarm_uppers).length;
        swarm_stats.partner_count = lodash.unique(unique_swarm_partners).length;
        swarm_stats.supporter_count = lodash.unique(unique_swarm_supporters).length;

        // Update the swarm with the new stats
        Swarms.update(swarm._id, {
            $set: {
                stats: swarm_stats,
                updated_at: new Date()
            }
        });

        // Return the list of network IDs that have been updated
        return networks;
    }
};
