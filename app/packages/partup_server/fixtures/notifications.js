Meteor.startup(function() {
    if (process.env.NODE_ENV.match(/development|staging/)) {
        if (!Notifications.find().count()) {

            /* 1 */
            Notifications.insert({
                '_id' : 'zBWjQJLbB3s6XJbi7',
                'for_upper_id' : 'K5c5M4Pbdg3B82wQH',
                'type' : 'partups_supporters_added',
                'type_data' : {
                    'partup' : {
                        '_id': 'gJngF65ZWyS9f3NDE',
                        'name' : 'Crowd funding Part-up organiseren',
                        'slug' : 'crowd-funding-part-up-organiseren-gJngF65ZWyS9f3NDE'
                    },
                    'supporter' : {
                        '_id' : 'K5c5M4Pbdg3B82wQI',
                        'name' : 'John Partup',
                        'image' : 'cHhjpWKo9DHjXQQjy'
                    }
                },
                'created_at' : new Date('2015-07-21T14:08:02.831Z'),
                'new' : true,
                'clicked': false
            });

            /* 2 */
            Notifications.insert({
                '_id' : '924QY78LuAhmr3g8P',
                'for_upper_id' : 'K5c5M4Pbdg3B82wQI',
                'type' : 'partups_contributions_accepted',
                'type_data' : {
                    'accepter': {
                        '_id': 'K5c5M4Pbdg3B82wQH',
                        'name': 'Default User',
                        'image': 'oQeqgwkdd44JSBSW5'
                    },
                    'activity': {
                        '_id': 'ruvTupX9WMmqFTLuL',
                        'name': 'crowd funding platform selectie'
                    },
                    'partup' : {
                        '_id': 'gJngF65ZWyS9f3NDE',
                        'name' : 'Crowd funding Part-up organiseren',
                        'slug' : 'crowd-funding-part-up-organiseren-gJngF65ZWyS9f3NDE'
                    }
                },
                'created_at' : new Date('2015-07-21T14:09:44.629Z'),
                'new' : true,
                'clicked': false
            });

            /* 3 */
            Notifications.insert({
                '_id' : 'RLAuZh7JtqAD9qzHh',
                'for_upper_id' : 'K5c5M4Pbdg3B82wQI',
                'type' : 'contributions_ratings_inserted',
                'type_data' : {
                    'rater' : {
                        '_id' : 'K5c5M4Pbdg3B82wQH',
                        'name' : 'Default User',
                        'image' : 'oQeqgwkdd44JSBSW5'
                    },
                    'partup' : {
                        '_id': 'gJngF65ZWyS9f3NDE',
                        'name' : 'Crowd funding Part-up organiseren',
                        'slug' : 'crowd-funding-part-up-organiseren-gJngF65ZWyS9f3NDE'
                    }
                },
                'created_at' : new Date('2015-07-21T14:09:50.912Z'),
                'new' : true,
                'clicked': false
            });

            /* 4 */
            Notifications.insert({
                '_id' : 'rizKNF2EnSHp8naRd',
                'for_upper_id' : 'K5c5M4Pbdg3B82wQH',
                'type' : 'partups_supporters_added',
                'type_data' : {
                    'partup' : {
                        '_id': 'gJngF65ZWyS9f3NDE',
                        'name' : 'Crowd funding Part-up organiseren',
                        'slug' : 'crowd-funding-part-up-organiseren-gJngF65ZWyS9f3NDE'
                    },
                    'supporter' : {
                        '_id' : 'a7qcp5RHnh5rfaeW9',
                        'name' : 'Judy Partup',
                        'image' : 'bMTGT9oSDGzxCL3r4'
                    }
                },
                'created_at' : new Date('2015-07-21T14:11:51.761Z'),
                'new' : true,
                'clicked': false
            });

            /* 5 */
            Notifications.insert({
                '_id' : '2Ls7pgz7oAiyg5X2N',
                'for_upper_id' : 'K5c5M4Pbdg3B82wQI',
                'type' : 'partups_supporters_added',
                'type_data' : {
                    'partup' : {
                        '_id': 'gJngF65ZWyS9f3NDE',
                        'name' : 'Crowd funding Part-up organiseren',
                        'slug' : 'crowd-funding-part-up-organiseren-gJngF65ZWyS9f3NDE'
                    },
                    'supporter' : {
                        '_id' : 'a7qcp5RHnh5rfaeW9',
                        'name' : 'Judy Partup',
                        'image' : 'bMTGT9oSDGzxCL3r4'
                    }
                },
                'created_at' : new Date('2015-07-21T14:11:51.763Z'),
                'new' : true,
                'clicked': false
            });

            /* 6 */
            Notifications.insert({
                '_id' : 'ERwBsEAExaN95yZ3y',
                'for_upper_id' : 'K5c5M4Pbdg3B82wQH',
                'type' : 'partups_networks_invited',
                'type_data' : {
                    'inviter' : {
                        '_id' : 'q63Kii9wwJX3Q6rHS',
                        'name' : 'Admin User',
                        'image' : 'CxEprGKNWo6HdrTdq'
                    },
                    'network' : {
                        '_id' : 'kRCjWDBkKru3KfsjW',
                        'name' : 'ING (invite)',
                        'image' : 'efDuvuTzpqH65P9DF',
                        'slug' : 'ing-invite'
                    }
                },
                'created_at' : new Date('2015-07-22T09:00:30.168Z'),
                'new' : true,
                'clicked': false
            });

            /* 7 */
            Notifications.insert({
                '_id' : 'o9E59Hsi4FLZmcfhy',
                'for_upper_id' : 'a7qcp5RHnh5rfaeW9',
                'type' : 'partups_networks_invited',
                'type_data' : {
                    'inviter' : {
                        '_id' : 'q63Kii9wwJX3Q6rHS',
                        'name' : 'Admin User',
                        'image' : 'CxEprGKNWo6HdrTdq'
                    },
                    'network' : {
                        '_id': 'kRCjWDBkKru3KfsjW',
                        'name' : 'ING (invite)',
                        'image' : 'efDuvuTzpqH65P9DF',
                        'slug' : 'ing-invite'
                    }
                },
                'created_at' : new Date('2015-07-22T09:11:08.083Z'),
                'new' : true,
                'clicked': false
            });

            /* 8 */
            Notifications.insert({
                '_id' : 'qK2d2j4PBoNzKrqPA',
                'for_upper_id' : 'K5c5M4Pbdg3B82wQI',
                'type' : 'partups_networks_invited',
                'type_data' : {
                    'inviter' : {
                        '_id' : 'q63Kii9wwJX3Q6rHS',
                        'name' : 'Admin User',
                        'image' : 'CxEprGKNWo6HdrTdq'
                    },
                    'network' : {
                        '_id': 'wfCv4ZdPe5WNT4xfg',
                        'name' : 'ING (closed)',
                        'image' : 'PnYAg3EX5dKfEnkdn',
                        'slug' : 'ing-closed'
                    }
                },
                'created_at' : new Date('2015-07-22T09:12:46.323Z'),
                'new' : true,
                'clicked': false
            });

            /* 9 */
            Notifications.insert({
                '_id' : 'yhkbye8nzLzxN7399',
                'for_upper_id' : 'K5c5M4Pbdg3B82wQI',
                'type' : 'partups_networks_accepted',
                'type_data' : {
                    'network' : {
                        '_id': 'wfCv4ZdPe5WNT4xfg',
                        'name' : 'ING (closed)',
                        'image' : 'PnYAg3EX5dKfEnkdn',
                        'slug' : 'ing-closed'
                    }
                },
                'created_at' : new Date('2015-07-22T09:23:58.070Z'),
                'new' : true,
                'clicked': false
            });

            /* 10 */
            Notifications.insert({
                '_id' : 'xWx3q5f8Wviq6tuSD',
                'for_upper_id' : 'a7qcp5RHnh5rfaeW9',
                'type' : 'partups_networks_invited',
                'type_data' : {
                    'inviter' : {
                        '_id' : 'q63Kii9wwJX3Q6rHS',
                        'name' : 'Admin User',
                        'image' : 'CxEprGKNWo6HdrTdq'
                    },
                    'network' : {
                        '_id': 'wfCv4ZdPe5WNT4xfg',
                        'name' : 'ING (closed)',
                        'image' : 'PnYAg3EX5dKfEnkdn',
                        'slug' : 'ing-closed'
                    }
                },
                'created_at' : new Date('2015-07-22T09:31:48.389Z'),
                'new' : true,
                'clicked': false
            });

            /* 11 */
            Notifications.insert({
                '_id' : 'zBWjQJLbB3s6XJci8',
                'for_upper_id' : 'K5c5M4Pbdg3B82wQH',
                'type' : 'partups_ratings_reminder',
                'type_data' : {
                    'partup' : {
                        '_id': 'gJngF65ZWyS9f3NDE',
                        'name' : 'Crowd funding Part-up organiseren',
                        'slug' : 'crowd-funding-part-up-organiseren-gJngF65ZWyS9f3NDE'
                    }
                },
                'created_at' : new Date('2015-07-21T14:08:02.831Z'),
                'new' : true,
                'clicked': false
            });
        }
    }
});
