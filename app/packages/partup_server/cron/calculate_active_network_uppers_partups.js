if (process.env.PARTUP_CRON_ENABLED) {
    SyncedCron.add({
        name: 'Calculate the most active uppers and partups of all networks',
        schedule: function(parser) {
            return parser.text(Partup.constants.CRON_CALCULATE_ACTIVE_NETWORK_UPPERS_PARTUPS);
        },
        job: function() {
            Networks.find().forEach(function(network) {
                Partup.server.services.networks.calculateActiveUppers(network);
                Partup.server.services.networks.calculateActivePartups(network);
            });
        }
    });
}
