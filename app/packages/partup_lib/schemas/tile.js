/**
 * Tile form schema
 * @name tile
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.tile = new SimpleSchema({
    image_id: {
        type: String,
        optional: true,
        regEx: SimpleSchema.RegEx.Id
    },
    description: {
        type: String,
        max: 650,
        optional: true
    },
    type: {
        type: String,
        allowedValues: ['image', 'video']
    },
    video_url: {
        type: String,
        optional: true,
        custom: function() {
            if (this.value && !Partup.services.validators.isVideoUrl(this.value)) {
                return 'invalidVideoUrl';
            }
        }
    }
});
