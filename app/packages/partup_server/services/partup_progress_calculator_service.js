var d = Debug('services:partup_progress_calculator');

/**
 @namespace Partup server partup progress calculator service
 @name Partup.server.services.partup_progress_calculator
 @memberof Partup.server.services
 */
Partup.server.services.partup_progress_calculator = {

    calculatePartupProgressScore: function(partupId) {
        var score = 0;
        var partup = Partups.findOneOrFail(partupId);

        var score1 = this._calculateTimeBasedScore(partup);
        d('Time based partup progress score is ' + score1);
        score += score1;

        var score2 = this._calculateUppersBasedScore(partup);
        var score2weight = 0.1;
        d('Upper based partup progress score is ' + (score2 * score2weight));
        score += (score2 * score2weight);

        var score3 = this._calculateActivitiesBasedScore(partup);
        var score3weight = 0.8;
        d('Activities based partup progress score is ' + (score3 * score3weight));
        score += (score3 * score3weight);

        return Math.max(0, Math.min(100, score));
    },

    _calculateActivitiesBasedScore: function(partup) {
        var score = 0;
        var activities = Activities.findForPartup(partup);

        activities.forEach(function(activity) {
            if (activity.isClosed()) score += 20;
            else score -= 10;
        });

        return Math.min(100, score);
    },

    _calculateUppersBasedScore: function(partup) {
        var uppers = partup.uppers || [];
        var score = (uppers.length * (1 / 3)) * 100;

        return Math.min(100, score);
    },

    _calculateTimeBasedScore: function(partup) {
        if (partup.hasEnded()) return 100;

        var day = 1000 * 60 * 60 * 24;

        var now = new Date();
        var endsAt = new Date(partup.end_date);
        var createdAt = new Date(partup.created_at);

        var daysTotal = (endsAt - createdAt) / day;
        var daysExists = (now - createdAt) / day;

        var percentage = (daysExists / daysTotal) * 100;

        var score = Math.pow((0.0465 * percentage), 3);

        return Math.min(100, score);
    }

};
