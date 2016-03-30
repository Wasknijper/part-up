Template.PartialDropdownProfileUpperActions.onCreated(function() {
    var template = this;
    template.dropdownToggleBool = 'partial-dropdowns-profile-upper-actions.opened';
    template.dropdownOpen = new ReactiveVar(false);
    template.selectedOption = template.data.reactiveVar || new ReactiveVar('active');
});

Template.PartialDropdownProfileUpperActions.onRendered(function() {
    var template = this;
    ClientDropdowns.addOutsideDropdownClickHandler(template, '[data-clickoutside-close]', '[data-toggle-menu]');
});

Template.PartialDropdownProfileUpperActions.onDestroyed(function() {
    var tpl = this;
    ClientDropdowns.removeOutsideDropdownClickHandler(tpl);
});

Template.PartialDropdownProfileUpperActions.events({
    'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler,
    'click [data-select-option]': function eventSelectOption(event, template) {
        var key = $(event.currentTarget).data('translate');
        template.selectedOption.set(key.replace('dropdowns-profile-upperactions-option-', ''));
    }
});

Template.PartialDropdownProfileUpperActions.helpers({
    menuOpen: function() {
        return Template.instance().dropdownOpen.get();
    },
    selectedAction: function() {
        return TAPi18n.__('dropdowns-profile-upperactions-option-' + Template.instance().selectedOption.get());
    },
    notSelected: function(a) {
        return a !== 'dropdowns-profile-upperactions-option-' + Template.instance().selectedOption.get();
    }
});
