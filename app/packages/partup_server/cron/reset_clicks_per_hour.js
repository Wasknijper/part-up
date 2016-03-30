if(process.env.PARTUP_CRON_ENABLED) {
    SyncedCron.add({
        name: 'Reset the clicks per hour on partups',
        schedule: function(parser) {
            return parser.text(Partup.constants.CRON_RESET_CLICKS);
        },
        job: function() {
            var hour = (new Date).getHours();

            var data = {};
            data['analytics.clicks_per_hour.' + hour] = 0;

            Partups.update({}, {$set: data}, {multi: true});
        }
    });
}
