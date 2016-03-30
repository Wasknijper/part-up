Template.registerHelper('partupLoading', function() {
    var types = arguments;
    var template = Template.instance();
    if (!template.loading) template.loading = new ReactiveDict();

    var isLoading = false;
    lodash.each(types, function (type) {
        if (template.loading.get(type)) {
            isLoading = true;
            return; // break
        }
    });

    return isLoading;
});

Template.registerHelper('partupRefreshed', function() {
    return Meteor.status().retryCount === 0;
});
