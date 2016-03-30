Template.PartialDropdownProfileSupporterActions.onCreated(function() {
    var template = this;
    template.dropdownToggleBool = 'partial-dropdowns-profile-supporter-actions.opened';
    template.dropdownOpen = new ReactiveVar(false);
    template.selectedOption = template.data.reactiveVar || new ReactiveVar('active');
});

Template.PartialDropdownProfileSupporterActions.onRendered(function() {
    var template = this;
    ClientDropdowns.addOutsideDropdownClickHandler(template, '[data-clickoutside-close]', '[data-toggle-menu]');
});

Template.PartialDropdownProfileSupporterActions.onDestroyed(function() {
    var tpl = this;
    ClientDropdowns.removeOutsideDropdownClickHandler(tpl);
});

Template.PartialDropdownProfileSupporterActions.events({
    'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler,
    'click [data-select-option]': function eventSelectOption(event, template) {
        var key = $(event.currentTarget).data('translate');
        template.selectedOption.set(key.replace('dropdowns-profile-supporteractions-option-', ''));
    }
});

Template.PartialDropdownProfileSupporterActions.helpers({
    menuOpen: function() {
        return Template.instance().dropdownOpen.get();
    },
    selectedAction: function() {
        return TAPi18n.__('dropdowns-profile-supporteractions-option-' + Template.instance().selectedOption.get());
    },
    notSelected: function(a) {
        return a !== 'dropdowns-profile-supporteractions-option-' + Template.instance().selectedOption.get();
    }
});
