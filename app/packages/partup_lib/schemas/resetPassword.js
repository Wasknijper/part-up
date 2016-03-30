/**
 * Register Form Required
 * @name registerRequired
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.resetPassword = new SimpleSchema({
    password: {
        type: String,
        max: 255,
        regEx: Partup.services.validators.password
    },
    confirmPassword: {
        type: String,
        custom: function() {
            if (this.value !== this.field('password').value) {
                return 'passwordMismatch';
            }
        }
    }
});
