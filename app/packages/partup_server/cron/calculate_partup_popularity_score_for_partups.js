if(process.env.PARTUP_CRON_ENABLED) {
    SyncedCron.add({
        name: 'Calculate the Part-up popularity score for partups',
        schedule: function(parser) {
            return parser.text(Partup.constants.CRON_POPULARITY);
        },
        job: function() {
            Partups.find({}).forEach(function(partup) {
                var score = Partup.server.services.partup_popularity_calculator.calculatePartupPopularityScore(partup._id);
                Partups.update(partup._id, {'$set': {popularity: score}});
            });
        }
    });
}
