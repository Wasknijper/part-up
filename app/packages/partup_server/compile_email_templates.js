var locales = ['en', 'nl'];
var templates = [
    'dailydigest',
    'invite_upper_to_network',
    'invite_email_address_to_network',
    'invite_upper_to_partup_activity',
    'invite_email_address_to_partup_activity',
    'invite_upper_to_partup',
    'invite_email_address_to_partup',
    'upper_mentioned_in_partup',
    'partup_created_in_network',
    'partups_networks_new_pending_upper',
    'partups_networks_accepted',
    'partups_new_comment_in_involved_conversation',
    'partups_networks_new_upper',
    'partups_networks_upper_left',
    'custom',
    'verify_account',
    'reset_password'
];

/**
 * Pre-compile all template combinations so it only happens once
 */
templates.forEach(function(type) {
    locales.forEach(function(locale) {
        SSR.compileTemplate('email-' + type + '-' + locale, [
            Assets.getText('private/emails/header.' + locale + '.html'),
            Assets.getText('private/emails/' + type + '.' + locale + '.html'),
            Assets.getText('private/emails/footer.' + locale + '.html')
        ].join(''));
    });
});

