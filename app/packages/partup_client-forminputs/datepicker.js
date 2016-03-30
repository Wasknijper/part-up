Template.DatePicker.onRendered(function() {
    var template = this;
    var input = template.data.inputSettings.input;
    var options = Partup.client.datepicker.options;
    var autoFormInput = template.data.inputSettings.autoFormInput || 'data-autoform-input';
    options.startDate = template.data.inputSettings.startDate || undefined;

    var dateChangeHandler = function(event) {
        var autoFormInputElement = $('[' + autoFormInput + ']');
        autoFormInputElement.val(event.date);
        autoFormInputElement.trigger('blur');
    };

    var prefillValue = AutoForm.getFieldValue(template.data.inputSettings.prefillValueKey) || null;

    template.end_date_datepicker = template
        .$('[' + input + ']')
        .datepicker(options)
        .datepicker('setDate', prefillValue)
        .on('changeDate clearDate', dateChangeHandler);
});

Template.DatePicker.events({
    'click [data-remove-date]': function(event, template) {
        event.preventDefault();
        template.end_date_datepicker.datepicker('update', '');
    }
});
