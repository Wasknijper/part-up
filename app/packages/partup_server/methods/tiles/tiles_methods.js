Meteor.methods({
    /**
     * Insert a tile
     *
     * @param {mixed[]} fields
     */
    'tiles.insert': function(fields) {
        check(fields, Partup.schemas.forms.tile);

        var upper = Meteor.user();
        if (!upper) throw new Meteor.Error(401, 'unauthorized');

        // Validate video url
        if (fields.video_url && !Partup.services.validators.isVideoUrl(fields.video_url)) {
            throw new Meteor.Error(400, 'video_url_invalid');
        }

        try {
            var latestUpperTile = Tiles.findOne({upper_id: upper._id, sort: {position: -1}});
            if (latestUpperTile) {
                var position = latestUpperTile.position + 1;
            } else {
                var position = 0;
            }
            var tile = {
                _id: Random.id(),
                upper_id: upper._id,
                type: fields.type,
                description: fields.description,
                position: position
            };

            if (fields.type === 'image') {
                tile.image_id = fields.image_id;
            } else if (fields.type === 'video') {
                tile.video_url = fields.video_url;
            }

            Tiles.insert(tile);
            Meteor.users.update(upper._id, {$addToSet: {'profile.tiles': tile._id}});

            // Update profile completion percentage
            Partup.server.services.profile_completeness.updateScore();
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'tile_could_not_be_inserted');
        }
    },

    /**
     * Remove a tile
     *
     * @param {String} tileId
     */
    'tiles.remove': function(tileId) {
        check(tileId, String);

        var upper = Meteor.user();
        if (!upper) throw new Meteor.Error(401, 'unauthorized');

        try {
            Tiles.remove({_id: tileId});
            Meteor.users.update(upper._id, {$pull: {'profile.tiles': tileId}});

            // Update profile completion percentage
            Partup.server.services.profile_completeness.updateScore();
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'tile_could_not_be_removed');
        }
    }
});
