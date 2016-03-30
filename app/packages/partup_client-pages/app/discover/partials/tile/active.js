Template.PartupTile_active.helpers({
    avatarPosition: function() {
        return Template.instance().data.hovering.get() ? this.position.hover : this.position.default;
    }
});
