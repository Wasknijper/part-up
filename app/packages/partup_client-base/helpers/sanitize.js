Template.registerHelper('partupSanitize', function(text) {
    return Partup.client.sanitize(text);
});
