if (process.env.PARTUP_CRON_ENABLED) {
    SyncedCron.add({
        name: 'Create tags that are common in the underlying partups of the network',
        schedule: function(parser) {
            return parser.text(Partup.constants.CRON_GET_COMMON_NETWORK_TAGS);
        },
        job: function() {
            Networks.find().forEach(function(network) {
                Partup.server.services.networks.getCommonTags(network);
            });
        }
    });
}
