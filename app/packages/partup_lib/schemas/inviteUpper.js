/**
 * New message Form
 * @name inviteUpper
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.inviteUpper = new SimpleSchema({
    name: {
        type: String
    },
    email: {
        type: String,
        max: 255,
        regEx: Partup.services.validators.email
    },
    message: {
        type: String,
        max: 2500,
        custom: function() {
            if (!Partup.services.validators.containsNoHtml(this.value)) {
                return 'shouldNotContainHtml';
            }

            if (!Partup.services.validators.containsRequiredTags(this.value, ['url', 'name'])) {
                return 'missingRequiredTags';
            }

            if (!Partup.services.validators.containsNoUrls(this.value)) {
                return 'shouldNotContainUrls';
            }
        }
    }
});
