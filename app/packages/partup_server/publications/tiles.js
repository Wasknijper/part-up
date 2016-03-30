Meteor.publishComposite('tiles.profile', function(upperId) {
    check(upperId, String);

    this.unblock();

    return {
        find: function() {
            return Tiles.find({upper_id: upperId});
        },
        children: [
            {find: Images.findForTile}
        ]
    };
});
