Meteor.startup(function() {
    if (process.env.NODE_ENV.match(/development|staging/)) {

        if (!Activities.find().count()) {

            //first partup
            Activities.insert({
                '_id' : 'ruvTupX9WMmqFTLuL',
                'name' : 'crowd funding platform selectie',
                'description' : 'kickstarter wellicht?',
                'end_date' : new Date('2016-04-21T00:00:00.000Z'),
                'created_at' : new Date('2015-07-21T14:03:49.139Z'),
                'updated_at' : new Date('2015-07-21T14:03:49.139Z'),
                'creator_id' : 'K5c5M4Pbdg3B82wQH',
                'partup_id' : 'gJngF65ZWyS9f3NDE',
                'archived' : false,
                'update_id' : 'rqAFPrKayDd8Ko6YK'
            });

            Activities.insert({
                '_id' : 'SYwR9AHWc7AKsfMrv',
                'name' : 'communicatie campagne bedenken',
                'description' : null,
                'end_date' : null,
                'created_at' : new Date('2015-07-21T14:03:57.905Z'),
                'updated_at' : new Date('2015-07-21T14:03:57.905Z'),
                'creator_id' : 'K5c5M4Pbdg3B82wQH',
                'partup_id' : 'gJngF65ZWyS9f3NDE',
                'archived' : false,
                'update_id' : 'hvL6bnH5ckaA599d4'
            });

        }
    }
});
