Template.update_partups_message_added.helpers({
    messageContent: function() {
        var self = this;
        return Partup.client.strings.emojify(
            Partup.client.strings.newlineToBreak(Partup.helpers.mentions.decode(Partup.client.sanitize(self.type_data.new_value)))
        );
    },

    hasNoComments: function() {
        if (this.comments) {
            return this.comments.length <= 0;
        } else {
            return true;
        }
    },
    editMessagePopupId: function() {
        return 'edit-message-' + this._id;
    }
});
