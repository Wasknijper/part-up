Template.app_profile_about.onCreated(function() {
    var template = this;

    // Column layout
    template.columnTilesLayout = new Partup.client.constructors.ColumnTilesLayout({

        // Initial amount of columns
        columns: 2,

        // This function will be called for each tile
        calculateApproximateTileHeight: function(tileData, columnWidth) {

            // The goal of this formula is to approach
            // the expected height of a tile as best
            // as possible, synchronously,
            // using the given partup object
            return 1000;
        }

    });
});

Template.app_profile_about.onRendered(function() {
    var template = this;
    var profileId = template.data.profileId;

    template.handle = null;
    template.refresh = function() {
        if (template.handle) template.handle.stop();

        template.handle = template.subscribe('tiles.profile', profileId, {
            onReady: function() {
                var tiles = Tiles.find({upper_id: profileId}).fetch();
                var user = Meteor.users.findOne(profileId);
                var displayTiles = [];

                var meurs = user.profile.meurs || {};

                var profileIsCurrentUser = Meteor.userId() === profileId;
                var profileHasResults = meurs.results && meurs.results.length && meurs.fetched_results;
                var profileDoesNotHaveMediaTiles = !tiles || !tiles.length;

                if (profileHasResults || profileIsCurrentUser) {
                    displayTiles = displayTiles.concat([{
                        type: 'result',
                        profileId: profileId
                    }]);
                }

                if (profileDoesNotHaveMediaTiles && profileIsCurrentUser) {
                    displayTiles = displayTiles.concat([{
                        type: 'image',
                        placeholder: true
                    }]);
                } else {
                    displayTiles = displayTiles.concat(tiles);
                }

                template.columnTilesLayout.clear(function() {
                    template.columnTilesLayout.addTiles(displayTiles);
                });
            }
        });
    };

    // First run
    template.refresh();
});

Template.app_profile_about.helpers({
    columnTilesLayout: function() {
        return Template.instance().columnTilesLayout;
    }
});

Template.app_profile_about.events({
    'click [data-create-tile]': function(event, template) {
        event.preventDefault();
        var type = $(event.currentTarget).closest('[data-create-tile]').data('create-tile');
        Partup.client.popup.open({
            id: 'new-' + type
        }, function(result) {
            template.refresh();
        });
    },
    'click [data-delete]': function(event, template) {
        event.preventDefault();
        var tile = this;
        var tileId = tile._id;
        Partup.client.prompt.confirm({
            title: TAPi18n.__('pages-app-profile-about-tile-prompt-title'),
            message: TAPi18n.__('pages-app-profile-about-tile-prompt-message'),
            onConfirm: function() {
                Meteor.call('tiles.remove', tileId, function(error, result) {
                    if (error) {
                        Partup.client.notify.error(TAPi18n.__(error));
                        return;
                    }
                    Partup.client.notify.success('Tile removed');
                    template.refresh();
                });
            }
        });
    }

});

Template.app_profile_about.helpers({
    firstname: function() {
        var user = Meteor.users.findOne(this.profileId);
        return User(user).getFirstname();
    },
    profileIsCurrentUser: function() {
        return this.profileId === Meteor.userId();
    }
});
