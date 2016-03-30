if(process.env.PARTUP_CRON_ENABLED) {
    SyncedCron.add({
        name: 'Calculate the Part-up progress score for partups',
        schedule: function(parser) {
            return parser.text(Partup.constants.CRON_PROGRESS);
        },
        job: function() {
            // TODO: Smarter way to do this, most likely not all
            // partups need a progress score calculation
            Partups.find({}).forEach(function(partup) {
                var score = Partup.server.services.partup_progress_calculator.calculatePartupProgressScore(partup._id);
                Partups.update(partup._id, {'$set': {progress: score}});
            });
        }
    });
}
