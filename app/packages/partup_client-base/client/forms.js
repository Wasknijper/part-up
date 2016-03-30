/**
 * form helpers
 *
 * @class partup.client.forms
 * @memberof Partup.client
 */
Partup.client.forms = {

    /**
     * Add sticky error to field helper
     *
     * @memberof Partup.client.forms
     * @param {Object} form
     * @param {String} fieldName
     * @param {String} errorReason
     */
    addStickyFieldError: function(form, fieldName, errorReason) {
        form.addStickyValidationError(fieldName, errorReason);
    },

    /**
     * Remove sticky error from field
     *
     * @memberof Partup.client.forms
     * @param {Object} form
     * @param {String} fieldName
     */
    removeStickyFieldError: function(form, fieldName) {
        form.removeStickyValidationError(fieldName);
    },

    /**
     * Remove all sticky errors
     *
     * @memberof Partup.client.forms
     * @param {Object} form
     */
    removeAllStickyFieldErrors: function(form) {
        var templateInstanceForForm = AutoForm.templateInstanceForForm(form.formId);
        lodash.each(templateInstanceForForm._stickyErrors, function(value, key) {
            form.removeStickyValidationError(key);
        });
    }

};
