/*************************************************************/
/* Page helpers */
/*************************************************************/
Template.modal_create.helpers({
    partupId: function() {
        return Session.get('partials.create-partup.current-partup');
    },
    partup: function() {
        return Partups.findOne({_id: this.partupId});
    }
});

/*************************************************************/
/* Page events */
/*************************************************************/
Template.modal_create.events({
    'click [data-skip]': function(event, template) {
        event.preventDefault();

        var partup = template.data.partup;

        switch (Router.current().route.getName()) {

            case 'create':
                Router.go('create-activities', {_id: partup._id});
                break;
            case 'create-activities':
                Router.go('create-promote', {_id: partup._id});
                break;
            case 'create-promote':
                Session.set('partials.create-partup.current-partup', undefined);
                Router.go('partup', {slug: partup.slug});
                break;
        }
    }
});
