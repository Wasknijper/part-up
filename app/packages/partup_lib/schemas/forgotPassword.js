/**
 * Forgot password Form
 * @name forgotPassword
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.forgotPassword = new SimpleSchema({
    email: {
        type: String,
        max: 255,
        regEx: Partup.services.validators.email
    }
});
