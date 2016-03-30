Template.UpperTile.onCreated(function() {
    var user = this.data.user;

    user.participation_scoreReadable = User(user).getReadableScore();
    user.supporterOf = user.supporterOf || [];
    user.upperOf = user.upperOf || [];
    user.profile.imageObject = user.profile.imageObject || Images.findOne({_id: user.profile.image});
});
