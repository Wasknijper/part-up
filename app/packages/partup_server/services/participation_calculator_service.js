var d = Debug('services:participation_calculator');

/**
 @namespace Partup server participation calculator service
 @name Partup.server.services.participation_calculator
 @memberof Partup.server.services
 */
Partup.server.services.participation_calculator = {

    calculateParticipationScoreForUpper: function(upperId) {
        var score = 0;
        var upper = Meteor.users.findOneOrFail(upperId);

        var score1 = this._calculateLoginScore(upper);
        var score1weight = 0.25;
        d('Login score for user [' + upperId + '] is ' + score1 + '/100 and counts for 25% → ' + (score1 * score1weight) + '/100');
        score += score1 * score1weight;

        var score2 = this._calculateSupportsRecentPartupsScore(upper);
        var score2weight = 0.25;
        d('Supports recent partups score for user [' + upperId + '] is ' + score2 + '/100 and counts for 25% → ' + (score2 * score2weight) + '/100');
        score += score2 * score2weight;

        var score3 = this._calculateAverageContributionRatingScore(upper);
        var score3weight = 0.25;
        d('Average contribution rating score for user [' + upperId + '] is ' + score3 + '/100 and counts for 25% → ' + (score3 * score3weight) + '/100');
        score += score3 * score3weight;

        var score4 = this._calculateActiveContributionsScore(upper);
        var score4weight = 0.25;
        d('Active contributions score for user [' + upperId + '] is ' + score4 + '/100 and counts for 25% → ' + (score4 * score4weight) + '/100');
        score += score4 * score4weight;

        d('Total participation score for user [' + upperId + '] is ' + score + '/100');

        return Math.min(100, score);
    },

    _calculateActiveContributionsScore: function(upper) {
        var activeContributionsScore = 0;

        // By using a score delta of 4, an upper can receive the full
        // 100 score of this part by having 25 active contributions
        var scoreDelta = 4;

        var contributions = Contributions.find({upper_id: upper._id, verified:true});

        contributions.forEach(function(contribution) {
            var partup = Partups.findOne(contribution.partup_id);

            if (partup && !partup.hasEnded()) {
                activeContributionsScore += scoreDelta;
            }
        });

        return Math.min(100, activeContributionsScore);
    },

    _calculateAverageContributionRatingScore: function(upper) {
        return Math.min(100, upper.average_rating || 0);
    },

    _calculateSupportsRecentPartupsScore: function(upper) {
        var supports = upper.supporterOf || [];
        var partups = Partups.find({_id: {'$in': supports}});

        var supportsRecentPartupsScore = 0;

        // By using a score delta of 4, an upper can receive the full
        // 100 score of this part by supporting 25 active partups
        var scoreDelta = 4;

        partups.forEach(function(partup) {
            if (!partup.hasEnded()) {
                supportsRecentPartupsScore += scoreDelta;
            }
        });

        return Math.min(100, supportsRecentPartupsScore);
    },

    _calculateLoginScore: function(upper) {
        var logins = upper.logins || [];

        var loginScore = 0;

        // By using a score delta of 4, an upper can receive the full
        // 100 score of this part by logging in 25 days consecutively
        var scoreDelta = 4;

        var day = 24 * 60 * 60 * 1000;
        var now = new Date;
        var createdAt = new Date(upper.createdAt);
        var createdDaysAgo = (now - createdAt) / day;

        var maximumDaysAgoToGiveScore = 25;

        if (createdDaysAgo <= maximumDaysAgoToGiveScore) {
            loginScore += scoreDelta * (maximumDaysAgoToGiveScore - createdDaysAgo);
        }

        logins.forEach(function(login) {
            var daysBetweenLoginAndNow = Math.round(Math.abs((login.getTime() - now.getTime()) / day));

            if (daysBetweenLoginAndNow <= maximumDaysAgoToGiveScore) {
                loginScore += scoreDelta;
            }
        });

        return Math.min(100, loginScore);
    }

};
