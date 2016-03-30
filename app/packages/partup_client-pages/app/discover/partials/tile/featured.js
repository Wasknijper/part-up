var MAX_AVATARS = 5;
var AVATAR_RADIUS = 125;
var AVATAR_DISTANCE = 18;

Template.PartupTileFeatured.onCreated(function() {
    var template = this;

    // Transform partup
    var partup = template.data.partup;

    // -- Partup details
    partup.name = Partup.helpers.url.capitalizeFirstLetter(partup.name);
    partup.imageObject = partup.imageObject || Images.findOne({_id: partup.image});
    partup.boundedProgress = partup.progress ? Math.max(10, Math.min(99, partup.progress)) : 10;

    // -- Partup counts
    partup.activityCount = partup.activity_count || Activities.findForPartup(partup).count();
    partup.supporterCount = partup.supporters ? partup.supporters.length : 0;
    partup.dayCount = Math.ceil(((((new Date() - new Date(partup.created_at)) / 1000) / 60) / 60) / 24);

    // -- Partup uppers
    partup.avatars = partup.uppers
        .slice(0, MAX_AVATARS)
        .map(function(avatar, index, arr) {

            // Avatar position
            var coords = Partup.client.partuptile.getAvatarCoordinates(arr.length, index, 0, AVATAR_DISTANCE, AVATAR_RADIUS);
            var position = {
                delay: .03 * index,
                x: Math.round(coords.x + 95),
                y: Math.round(coords.y + 95)
            };

            // Blue avatar, for example: (5+)
            if (partup.uppers.length > arr.length && index + 1 === MAX_AVATARS) {
                return {
                    position: position,
                    data: {
                        remainingUppers: partup.uppers.length - MAX_AVATARS + 1
                    }
                };
            }

            // Default avatar
            var upper = mout.object.find(partup.upperObjects, {_id: avatar}) || Meteor.users.findOne({_id: avatar});
            upper.profile.imageObject = upper.profile.imageObject || Images.findOne({_id: upper.profile.image});

            return {
                position: position,
                data: {
                    upper: upper
                }
            };
        });
});

Template.PartupTileFeatured.onRendered(function() {
    var template = this;

    // Focuspoint in discover image
    if (template.data.partup.image) {
        var image = template.data.partup.imageObject || Images.findOne({_id: template.data.partup.image});

        if (image && image.focuspoint) {
            var focuspointElm = template.find('[data-partup-tile-focuspoint]');
            template.focuspoint = new Focuspoint.View(focuspointElm, {
                x: image.focuspoint.x,
                y: image.focuspoint.y
            });
        }
    }

    var canvasElm = template.find('canvas.pu-sub-radial');
    if (canvasElm) Partup.client.partuptile.drawCircle(canvasElm, {
        background_color: '#f9f9f9',
        border_color_negative: '#ccc'
    });
});

Template.PartupTileFeatured_commentbox.helpers({
    featured_by_user: function() {
        var partup = this;
        if (!partup) return;

        return Meteor.users.findOne(partup.featured.by_upper._id);
    },
    featured_by_user_title: function() {
        return get(Template.instance(), 'data.featured.by_upper.title');
    }
});
