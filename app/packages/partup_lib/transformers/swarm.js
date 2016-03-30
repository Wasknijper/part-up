/**
 @namespace Swarm transformer service
 @name partup.transformers.swarm
 @memberof Partup.transformers
 */
Partup.transformers.swarm = {
    /**
     * Transform swarm object to swarm form data
     *
     * @memberof Partup.transformers.swarm
     * @param {object} swarm
     */
    'toFormSwarm': function(swarm) {
        return {
            _id: swarm._id,
            title: swarm.title,
            introduction: swarm.introduction,
            description: swarm.description,
            image: swarm.image
        };
    },

    /**
     * Transform swarm form to swarm object
     *
     * @memberof Partup.transformers.swarm
     * @param {mixed[]} fields
     */
    'fromFormSwarm': function(fields) {
        fields.title = sanitizeHtml(fields.title);
        fields.introduction = sanitizeHtml(fields.introduction);
        fields.description = sanitizeHtml(fields.description);

        return fields;
    },

    /**
     * Transform swarm object to swarm form data
     *
     * @memberof Partup.transformers.swarm
     * @param {object} quote
     */
    'toFormQuote': function(quote) {
        return {
            author_id: quote.author._id,
            content: quote.content
        };
    },
};
