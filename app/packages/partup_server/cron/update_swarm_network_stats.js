if (process.env.PARTUP_CRON_ENABLED) {
    SyncedCron.add({
        name: 'Update the swarm and network stats of Part-up',
        schedule: function(parser) {
            return parser.text(Partup.constants.CRON_UPDATE_SWARM_NETWORK_STATS);
        },
        job: function() {
            var updated_networks = [];

            // Let's begin with the swarms
            Swarms.find().forEach(function(swarm) {
                var swarm_networks = Partup.server.services.swarms.updateStats(swarm);
                updated_networks.push.apply(updated_networks, swarm_networks);
            });

            // Now update the networks that aren't in a network
            Networks.find({_id: {$nin: updated_networks}}).forEach(function(networkId) {
                var network = Networks.findOne(networkId);
                Partup.server.services.networks.updateStats(network);
            });
        }
    });
}
