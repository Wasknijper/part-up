Template.registerHelper('partupIsPopupActive', function(id) {
    return id === Partup.client.popup.current.get();
});
