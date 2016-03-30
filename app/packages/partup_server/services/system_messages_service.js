/**
 @namespace Partup server system messages service
 @name Partup.server.services.system_messages
 @memberof Partup.server.services
 */
Partup.server.services.system_messages = {

    /**
     * Create a system message
     *
     * @param  {mixed[]} upper
     * @param  {string} updateId
     * @param  {string} content
     * @param  {object} settings
     * @param  {boolean} settings.update_timestamp defaults to true
     *
     * @return {Update}
     */
    send: function(upper, updateId, content, settings) {
        var _settings = {
            update_timestamp: true
        };

        if (settings && !mout.lang.isUndefined(settings.update_timestamp)) {
            _settings.update_timestamp = !!settings.update_timestamp;
        }

        try {
            var update = Updates.findOneOrFail(updateId);

            // skip the system message if it was the same as the last one
            var lastComment = update.getLastComment();
            if (lastComment.content == content) return false;

            var query = {
                $push: {
                    comments: {
                        _id: Random.id(),
                        content: content,
                        type: 'system',
                        creator: {
                            _id: upper._id,
                            name: upper.profile.name
                        },
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                }
            };

            if (_settings.update_timestamp) mout.object.set(query, '$set.updated_at', new Date());

            Updates.update(update._id, query);
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'system-message-insert-failure');
        }
    }

};
