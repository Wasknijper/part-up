Meteor.startup(function() {
    if (process.env.NODE_ENV.match(/development|staging/)) {
        if (!Invites.find().count()) {
            /*
            Invites.insert({
                '_id' : 'ztTLaXRyaPimwxdWh',
                'type' : 'activity_existing_upper',
                'activity_id' : 'BiiRy3t7qEjzvZYuE',
                'inviter_id' : 'K5c5M4Pbdg3B82wQH',
                'invitee_id' : 'a7qcp5RHnh5rfaeW9',
                'created_at' : new Date('2015-07-28T11:38:42.311Z')
            });
            */

            Invites.insert({
                '_id' : '92y9E2BTP7uA5WJuo',
                'type' : 'network_existing_upper',
                'network_id' : 'wfCv4ZdPe5WNT4xfg',
                'inviter_id' : 'q63Kii9wwJX3Q6rHS',
                'invitee_id' : 'a7qcp5RHnh5rfaeW9',
                'created_at' : new Date('2015-07-28T11:41:29.134Z')
            });
        }
    }
});
