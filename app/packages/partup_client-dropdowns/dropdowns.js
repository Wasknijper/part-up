/**
 * Render dropdowns
 *
 * @module client-dropdowns
 */
ClientDropdowns = {
    addOutsideDropdownClickHandler: function(template, dropdownSelector, buttonSelector) {

        // find the dropdown
        var dropdown = template.find(dropdownSelector);

        // find the toggle button
        var button = template.find(buttonSelector);

        // on click outside
        template.onClickOutsideHandler = Partup.client.elements.onClickOutside([dropdown, button], function() {
            template.dropdownOpen.set(false);
        });
    },
    removeOutsideDropdownClickHandler: function(template) {
        Partup.client.elements.offClickOutside(template.onClickOutsideHandler);
    },
    dropdownClickHandler: function(event, template) {
        event.preventDefault(); // prevent href behaviour
        // get current state of the dropdown
        var dropdownOpen = template.dropdownOpen.get();
        template.dropdownOpen.set(!dropdownOpen);
    }
};

Partup.client.ClientDropdowns = ClientDropdowns;
