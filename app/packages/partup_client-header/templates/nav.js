Template.Header_nav.events({
    'click [data-start]': function(event) {
        event.preventDefault();

        Intent.go({route: 'create'}, function(slug) {
            if (slug) {
                Router.go('partup', {
                    slug: slug
                });
            } else {
                this.back();
            }
        });
    },
});
