/**
 @namespace Contribution transformer service
 @name partup.transformers.contribution
 @memberof Partup.transformers
 */
 var hasValue = function(value) {
    return (typeof value == 'number');
};

Partup.transformers.contribution = {
    /**
     * Transform contribution to form
     *
     * @memberof Partup.transformers.contribution
     * @param {object} contribution
     */
    'toFormContribution': function(contribution) {
        return contribution ? contribution : undefined;
    },

    /**
     * Transform form to contribution fields
     *
     * @memberof Partup.transformers.contribution
     * @param {mixed[]} fields
     */
    'fromFormContribution': function(fields) {
        var hours = hasValue(fields.hours) ? fields.hours : null;
        var rate = hasValue(fields.rate) ? fields.rate : null;
        return {
            hours: hours,
            rate: rate,
            currency: fields.currency,
            motivation: fields.motivation || null
        };
    }
};
