Meteor.startup(function() {
    $('body').on('click', '.pu-tag', function(event) {
        event.preventDefault();
        if ($(event.currentTarget).hasClass('pu-tag-disableglobalclick')) return;

        Partup.client.discover.setPrefill('textSearch', event.currentTarget.textContent);
        Router.go('discover');
    });
});
