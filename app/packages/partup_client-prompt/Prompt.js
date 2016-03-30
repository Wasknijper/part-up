// jscs:disable
/**
 * Renders the prompt container, overlay and dismiss handlers
 *
 * @module client-prompt
 */
// jscs:enable

Template.Prompt.onDestroyed(function() {
    Partup.client.prompt._reset();
});

Template.Prompt.helpers({
    promptActive: function() {
        return Partup.client.prompt._active.get();
    },
    title: function() {
        return Partup.client.prompt.title.get();
    },
    message: function() {
        return Partup.client.prompt.message.get();
    },
    cancelButton: function() {
        return Partup.client.prompt.cancelButton.get();
    },
    confirmButton: function() {
        return Partup.client.prompt.confirmButton.get();
    }
});

Template.Prompt.events({
    'click [data-confirm]': function(event, template) {
        event.preventDefault();
        Partup.client.prompt.onConfirm();
    },
    'click [data-cancel]': function(event, template) {
        event.preventDefault();
        Partup.client.prompt.onCancel();
    }

});
