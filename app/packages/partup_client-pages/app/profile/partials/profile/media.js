Template.MediaTile.helpers({
    embedSettings: function() {
        return this.embedSettings();
    },

    isCurrentusersMediaTile: function() {
        return this.upper_id === Meteor.userId();
    }
});
