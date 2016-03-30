/*************************************************************/
/* Widget functions */
/*************************************************************/
var continueRegister = function() {

    // Execute intent callback
    Intent.return('register-details', {
        fallback_action: function() {
            Intent.return('register');
        }
    });

};

/*************************************************************/
/* Widget form hooks */
/*************************************************************/
AutoForm.hooks({
    pagesModalRegisterDetailsForm: {
        onSubmit: function(insertDoc, updateDoc, currentDoc) {
            var self = this;

            Meteor.call('users.update', insertDoc, function(error, res) {
                if (error && error.message) {
                    Partup.client.notify.error(error.reason);
                    AutoForm.validateForm(self.formId);
                    self.done(new Error(error.message));
                    return;
                }

                self.done();
                continueRegister();
            });

            return false;
        }
    }
});
