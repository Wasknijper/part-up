Template.ImageGallery.onCreated(function() {
    var template = this;
});
Template.ImageGallery.helpers({
    popupId: function() {
        return this.updateId + '_gallery';
    }
});

Template.ImageGallery.events({
    'click [data-open-gallery]': function(event, template) {
        var popupId = $(event.currentTarget).data('open-gallery');
        var imageId = $(event.target).closest('[data-image]').data('image');
        Partup.client.popup.open({
            id: popupId,
            type: 'gallery',
            imageIndex: this.images.indexOf(imageId),
            totalImages: this.images.length
        });

    }
});
