Template.Dropdown.onRendered(function() {
    var tpl = this;

    // Find the dropdown containing element
    var dropdown_element = tpl.find('[data-dropdown]');

    // Capture outside click
    tpl.handler = Partup.client.elements.onClickOutside([dropdown_element], function() {
        if (!click_outside_checker_enabled) return;

        // Disable the dropdown
        tpl.data.toggle.set(false);
    });

    // This solves the problem that the dropdown is closed before it could open caused by the onClickOutside handler above
    var click_outside_checker_enabled = false;
    tpl.autorun(function() {
        click_outside_checker_enabled = tpl.data.toggle.get();
    });
});

Template.Dropdown.onDestroyed(function() {
    var tpl = this;
    Partup.client.elements.offClickOutside(tpl.handler);
});

Template.Dropdown.helpers({

    // Hydrate the template data with the 'active'-reactivevar
    templateData: function() {
        var data = this.data;
        data.isActive = this.toggle;
        return data;
    },

    // To be able to toggle a class when the dropdown is active
    isActive: function() {
        return this.toggle.get();
    }
});
