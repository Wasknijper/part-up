Template.registerHelper('partupGetImageUrl', function(image, store) {
    if (!image || !store) return;

    return Partup.helpers.url.getImageUrl(image, store);
});

Template.registerHelper('partupHTTP', function(url) {
    return Partup.helpers.url.addHTTP(url);
});

Template.registerHelper('partupCleanUrl', function(url) {
    return Partup.helpers.url.getCleanUrl(url);
});
