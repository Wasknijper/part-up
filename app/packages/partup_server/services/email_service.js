var d = Debug('services:emails');

/**
 @namespace Partup server email service
 @name Partup.server.services.emails
 @memberof Partup.server.services
 */
Partup.server.services.emails = {
    /**
     * Send an email
     *
     * @param {Object} options
     * @param {String} options.type
     * @param {Object} options.typeData
     * @param {String} options.toAddress
     * @param {String} options.fromAddress
     * @param {String} options.subject
     * @param {String} options.locale
     * @param {Object} options.userEmailPreferences
     * @param {String|null} options.body
     */
    send: function(options) {
        options = options || {};
        var emailSettings = {};

        if (!options.type) throw new Meteor.Error('Required argument [options.type] is missing for method [Partup.server.services.emails::send]');
        if (!options.typeData) throw new Meteor.Error('Required argument [options.typeData] is missing for method [Partup.server.services.emails::send]');
        if (!options.toAddress) throw new Meteor.Error('Required argument [options.toAddress] is missing for method [Partup.server.services.emails::send]');
        if (!options.fromAddress) options.fromAddress = Partup.constants.EMAIL_FROM;
        if (!options.subject) throw new Meteor.Error('Required argument [options.subject] is missing for method [Partup.server.services.emails::send]');
        if (!options.locale) throw new Meteor.Error('Required argument [options.locale] is missing for method [Partup.server.services.emails::send]');

        // Check if user has disabled this email type
        if (options.userEmailPreferences && !options.userEmailPreferences[options.type]) {
            // This mail is disabled, so end here
            return;
        }

        options.typeData.baseUrl = Meteor.absoluteUrl();

        emailSettings.from = options.fromAddress;
        emailSettings.to = options.toAddress;
        emailSettings.subject = options.subject;

        // Check if locale needs a fallback to provide an existing mail template
        if (options.locale !== 'en' && options.locale !== 'nl') {
            options.locale = 'en';
        }

        var template = 'email-' + options.type + '-' + options.locale;
        emailSettings.html = SSR.render(template, options.typeData);
        emailSettings.headers = {
            'X-Mailgun-Tag': template
        };

        Email.send(emailSettings);
    }
};
