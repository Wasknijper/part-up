/**
 * Generic Email Configuration
 */
Accounts.emailTemplates.from = Partup.constants.EMAIL_FROM;
Accounts.emailTemplates.headers = {
    'X-Mailgun-Tag': 'email-accountsmanagement'
};

/**
 * Password Reset Email
 */
Accounts.emailTemplates.resetPassword.subject = function(user) {
    return TAPi18n.__('emails-reset-password-subject', {}, User(user).getLocale());
};
Accounts.emailTemplates.resetPassword.html = function(user, url) {
    return SSR.render('email-reset_password-' + User(user).getLocale(), {
        user: user,
        url: url.replace('/#', '')
    });
};

/**
 * Verify Email
 */
Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return TAPi18n.__('emails-verify-account-subject', {}, User(user).getLocale());
};
Accounts.emailTemplates.verifyEmail.html = function(user, url) {
    return SSR.render('email-verify_account-' + User(user).getLocale(), {
        user: user,
        url: url.replace('/#', ''),
        count: Meteor.users.find().count() - 1
    });
};
