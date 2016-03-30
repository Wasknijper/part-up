/**
 @namespace Profile transformer service
 @name partup.transformers.profile
 @memberof Partup.transformers
 */
Partup.transformers.profile = {
    /**
     * Transform user profile to profile settings form
     *
     * @memberof Partup.transformers.partup
     * @param {object} user
     */
    'toFormProfileSettings': function(user) {
        return {
            '_id': user.profile._id,
            'image': user.profile.image,
            'description': user.profile.description,
            'facebook_url': user.profile.facebook_url,
            'twitter_url': user.profile.twitter_url,
            'instagram_url': user.profile.instagram_url,
            'linkedin_url': user.profile.linkedin_url,
            'website': user.profile.website,
            'phonenumber': user.profile.phonenumber,
            'skype': user.profile.skype,
            'tags_input': Partup.services.tags.tagArrayToInput(user.profile.tags),
            'location_input': Partup.services.location.locationToLocationInput(user.profile.location),
            'name': user.profile.name
        };
    },

    /**
     * Transform profile settings form to user fields
     *
     * @memberof Partup.transformers.user
     * @param {mixed[]} fields
     */
    'fromFormProfileSettings': function(fields) {
        var newFields = {
            profile: {
                'image': fields.image,
                'description': fields.description,
                'tags': Partup.services.tags.tagInputToArray(fields.tags_input),
                'facebook_url': fields.facebook_url,
                'twitter_url': fields.twitter_url,
                'instagram_url': fields.instagram_url,
                'linkedin_url': fields.linkedin_url,
                'phonenumber': fields.phonenumber,
                'website': Partup.services.website.cleanUrlToFullUrl(fields.website),
                'skype': fields.skype,
                'name': fields.name
            }
        };

        var newLocation = Partup.services.location.locationInputToLocation(fields.location_input);
        if (newLocation) newFields.profile.location = newLocation;

        return newFields;
    }
};
