var d = Debug('services:partup_popularity_calculator');

/**
 @namespace Partup server partup popularity calculator service
 @name Partup.server.services.partup_popularity_calculator
 @memberof Partup.server.services
 */
Partup.server.services.partup_popularity_calculator = {

    calculatePartupPopularityScore: function(partupId) {
        var partup = Partups.findOneOrFail(partupId);

        var activityScore = this._calculateActivityBasedScore(partup);
        var activityScoreWeight = 0.5;

        var shareScore = this._calculateShareBasedScore(partup);
        var shareScoreWeight = 0.2;

        var partnerScore = this._calculatePartnerBasedScore(partup);
        var partnerScoreWeight = 0.1;

        var supporterScore = this._calculateSupporterBasedScore(partup);
        var supporterScoreWeight = 0.1;

        var viewScore = this._calculateViewBasedScore(partup);
        var viewScoreWeight = 0.1;

        var score = (activityScore * activityScoreWeight) +
            (shareScore * shareScoreWeight) +
            (partnerScore * partnerScoreWeight) +
            (supporterScore * supporterScoreWeight) +
            (viewScore * viewScoreWeight);

        return Math.floor(score);
    },

    _calculateActivityBasedScore: function(partup) {
        var count = 0;
        var now = new Date();
        var two_weeks = 1000 * 60 * 60 * 24 * 14;

        Updates.find({partup_id: partup._id}).forEach(function(update) {
            var updated_at = new Date(update.updated_at);
            if ((now - updated_at) > two_weeks) return; // Don't count the updates that are older than 2 weeks
            count += update.comments_count + 1; // The additional 1 is for the update itself
        });

        if (count > 150) count = 150; // Set limit

        return count / 1.5; // Results in max score of 100%
    },

    _calculateShareBasedScore: function(partup) {
        var count = 0;
        if (!partup.shared_count) return count;
        if (partup.shared_count.facebook) count += partup.shared_count.facebook;
        if (partup.shared_count.twitter) count += partup.shared_count.twitter;
        if (partup.shared_count.linkedin) count += partup.shared_count.linkedin;
        if (partup.shared_count.email) count += partup.shared_count.email;

        return count > 100 ? 100 : count; // Results in max score of 100%
    },

    _calculatePartnerBasedScore: function(partup) {
        var partners = partup.uppers || [];
        var partnerCount = partners.length > 15 ? 15 : partners.length; // Set limit

        return partnerCount / 0.15; // Results in max score of 100%
    },

    _calculateSupporterBasedScore: function(partup) {
        var supporters = partup.supporters || [];

        return supporters.length > 100 ? 100 : supporters.length; // Results in max score of 100%
    },

    _calculateViewBasedScore: function(partup) {
        if (!partup || !partup.analytics) return 0;
        var views = partup.analytics.clicks_total || 0;
        if (views > 500) views = 500;

        return views / 5; // Results in max score of 100%
    }
};
