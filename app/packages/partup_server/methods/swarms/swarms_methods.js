Meteor.methods({
    /**
     * Insert a Swarm
     *
     * @param {mixed[]} fields
     */
    'swarms.insert': function(fields) {
        check(fields, Partup.schemas.forms.swarmCreate);

        var user = Meteor.user();
        if (!user || !User(user).isAdmin()) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            var swarm = {};
            swarm.name = sanitizeHtml(fields.name);
            swarm.slug = Partup.server.services.slugify.slugify(fields.name);
            swarm.networks = [];
            swarm.admin_id = user._id;
            swarm.quotes = [];
            swarm.stats = {
                activity_count: 0,
                network_count: 0,
                partup_count: 0,
                supporter_count: 0,
                upper_count: 0
            };
            swarm.shared_count = {
                facebook: 0,
                twitter: 0,
                linkedin: 0,
                email: 0
            };
            swarm.created_at = new Date();
            swarm.updated_at = new Date();
            swarm.refreshed_at = new Date(); // For the shared_count cron job

            swarm._id = Swarms.insert(swarm);

            return {
                _id: swarm._id
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'swarm_could_not_be_inserted');
        }
    },

    /**
     * Update a Swarm
     *
     * @param {String} swarmId
     * @param {mixed[]} fields
     */
    'swarms.update': function(swarmId, fields) {
        check(swarmId, String);
        check(fields, Partup.schemas.forms.swarmUpdate);

        var user = Meteor.user();
        var swarm = Swarms.findOneOrFail(swarmId);

        if (!user || !swarm.isAdmin(user._id)) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            var newSwarmFields = Partup.transformers.swarm.fromFormSwarm(fields);

            Swarms.update(swarmId, {$set: newSwarmFields});

            return {
                _id: swarm._id
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'swarm_could_not_be_updated');
        }
    },

    /**
     * Update privileged swarm fields (superadmin only)
     *
     * @param {String} swarmSlug
     * @param {mixed[]} fields
     */
    'swarms.admin_update': function(swarmSlug, fields) {
        check(swarmSlug, String);
        check(fields, Partup.schemas.forms.swarmEditAdmin);

        var user = Meteor.user();
        if (!user || !User(user).isAdmin()) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        var swarm = Swarms.findOneOrFail({slug: swarmSlug});

        if (fields.admin_id) {
            var adminUser = Meteor.users.findOneOrFail(fields.admin_id);
        }

        try {
            Swarms.update(swarm._id, {$set: {admin_id: adminUser._id}});
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'swarm_could_not_be_updated');
        }
    },

    /**
     * Add a network to the swarm
     *
     * @param {String} swarmId
     * @param {String} networkId
     */
    'swarms.add_network': function(swarmId, networkId) {
        check(swarmId, String);
        check(networkId, String);

        var user = Meteor.user();
        if (!User(user).isSwarmAdmin(swarmId) || !User(user).isAdmin()) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            // Make sure the swarm and network exist
            var swarm = Swarms.findOneOrFail({_id: swarmId});
            var network = Networks.findOneOrFail({_id: networkId});

            // They do, so let's add
            swarm.addNetwork(network._id);

            // All done, now all we need to do is to update the stats
            Event.emit('partups.swarms.networks.updated', user._id, swarm);
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_could_not_be_added_to_swarm');
        }
    },

    /**
     * Remove a network from the swarm
     *
     * @param {String} swarmId
     * @param {String} networkId
     */
    'swarms.remove_network': function(swarmId, networkId) {
        check(swarmId, String);
        check(networkId, String);

        var user = Meteor.user();
        if (!User(user).isSwarmAdmin(swarmId) || !User(user).isAdmin()) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            // Make sure the swarm and network exist
            var swarm = Swarms.findOneOrFail({_id: swarmId});
            var network = Networks.findOneOrFail({_id: networkId});

            // They do, so let's remove
            swarm.removeNetwork(network._id);

            // All done, now all we need to do is to update the stats
            Event.emit('partups.swarms.networks.updated', user._id, swarm);
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_could_not_be_removed_from_swarm');
        }
    },

    /**
     * Remove a Swarm
     *
     * @param {String} swarmId
     */
    'swarms.remove': function(swarmId) {
        check(swarmId, String);

        var user = Meteor.user();
        if (!user || !User(user).isAdmin()) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        var swarm = Swarms.findOneOrFail(swarmId);
        if (swarm.networks.length > 1) {
            throw new Meteor.Error(400, 'swarm_contains_networks');
        }

        try {
            Swarms.remove(swarmId);

            return {
                _id: swarmId
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'swarm_could_not_be_removed');
        }
    },

    /**
     * Increase email share count
     *
     * @param {String} swarmId
     */
    'swarms.increase_email_share_count': function(swarmId) {
        check(swarmId, String);

        try {
            var swarm = Swarms.findOneOrFail(swarmId);
            swarm.increaseEmailShareCount();
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'swarm_email_share_count_could_not_be_updated');
        }
    },

    /**
     * Add a quote to a swarm
     *
     * @param {String} swarmId
     * @param {mixed[]} fields
     */
    'swarms.add_quote': function(swarmId, fields) {
        check(swarmId, String);
        check(fields, Partup.schemas.forms.swarmQuote);

        var user = Meteor.user();
        if (!user || !User(user).isAdmin() || !User(user).isSwarmAdmin(swarmId)) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        var swarm = Swarms.findOneOrFail(swarmId, {fields: {quotes: 1}});
        if (swarm.quotes.length >= 3) {
            throw new Meteor.Error(400, 'swarm_quote_limit_reached');
        }

        try {
            var upper = Meteor.users.findOne(fields.author_id);
            var quote = {
                _id: Random.id(),
                content: sanitizeHtml(fields.content),
                author: {
                    _id: upper._id,
                    name: upper.profile.name,
                    image: upper.profile.image
                },
                created_at: new Date(),
                updated_at: new Date()
            };

            Swarms.update(swarmId, {$push: {quotes: quote}});
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'swarm_quote_could_not_be_added');
        }
    },

    /**
     * Update a quote in a swarm
     *
     * @param {String} swarmId
     * @param {String} quoteId
     * @param {mixed[]} fields
     */
    'swarms.update_quote': function(swarmId, quoteId, fields) {
        check(swarmId, String);
        check(quoteId, String);
        check(fields, Partup.schemas.forms.swarmQuote);

        var user = Meteor.user();
        if (!user || !User(user).isAdmin() || !User(user).isSwarmAdmin(swarmId)) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            var upper = Meteor.users.findOne(fields.author_id);

            Swarms.update({_id: swarmId, 'quotes._id': quoteId}, {
                $set: {
                    'quotes.$.author': {
                        _id: upper._id,
                        name: upper.profile.name,
                        image: upper.profile.image
                    },
                    'quotes.$.content': sanitizeHtml(fields.content),
                    'quotes.$.updated_at': new Date()
                }
            });
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'swarm_quote_could_not_be_updated');
        }
    },

    /**
     * Remove a quote from a swarm
     *
     * @param {String} swarmId
     * @param {String} quoteId
     */
    'swarms.remove_quote': function(swarmId, quoteId) {
        check(swarmId, String);
        check(quoteId, String);

        var user = Meteor.user();
        if (!user || !User(user).isAdmin() || !User(user).isSwarmAdmin(swarmId)) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            Swarms.update({_id: swarmId, 'quotes._id': quoteId}, {$pull: {quotes: {_id: quoteId}}});
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'swarm_quote_could_not_be_removed');
        }
    },

    /**
     * Find related uppers for a specific user
     *
     * @param {String} swarmSlug
     * @param {Number} amount
     */
    'swarms.get_related_uppers': function(swarmSlug, amount) {
        check(swarmSlug, String);

        amount = amount || 16;

        try {
            var swarm = Swarms.findOneOrFail({slug: swarmSlug}, {fields: {networks: 1}});
            var swarm_networks = swarm.networks || [];
            var swarm_uppers = [];

            // Get all the uppers of the swarm in one array
            swarm_networks.forEach(function(networkId) {
                var network = Networks.findOne(networkId, {fields: {uppers: 1}});
                var network_uppers = network.uppers || [];
                swarm_uppers.push.apply(swarm_uppers, network_uppers);
            });

            // Create empty list for the following actions
            var upper_list = [];

            // Now do something with the uppers depending if the current user is logged in or not
            var upper = Meteor.user();

            if (!upper) {
                // User is not logged in, so return random uppers from swarm
                upper_list = swarm_uppers;
            } else {
                // User is logged in, so get a list of all uppers of the current user's partups
                var upper_partup_uppers = [];
                var upper_partups = upper.upperOf || [];
                upper_partups.forEach(function(partupId) {
                    var partup = Partups.findOne(partupId, {fields: {uppers: 1}});
                    var partup_uppers = partup.uppers || [];
                    upper_partup_uppers.push.apply(upper_partup_uppers, partup_uppers);
                });

                // We now have a list of all 'known' uppers and a list of all swarm uppers, so we need to match them
                upper_list = lodash.intersection(swarm_uppers, upper_partup_uppers);

                // Check if we have enough uppers
                if (upper_list.length < amount) {
                    // Append swarm uppers list
                    upper_list.push.apply(upper_list, swarm_uppers);
                }
            }

            // Shorten the list if there are not enough uppers
            if (upper_list.length < amount) amount = upper_list.length;

            // Initialize response
            var related_uppers = [];

            // Randomize the list
            for (var i = 0; i < amount; i++) {
                var random_index = Math.floor(Math.random() * upper_list.length);
                // Store the random upper
                related_uppers.push(upper_list[random_index]);

                // We don't want duplicate uppers in our list, so remove them from source
                upper_list.splice(random_index, 1);
            }

            // Remove duplicates
            related_uppers = lodash.unique(related_uppers);

            // Create response
            var response = [];
            Meteor.users.find({_id: {$in: related_uppers}}).fetch().forEach(function(upper) {
                response.push({
                    _id: upper._id,
                    image: upper.profile.image
                });
            });

            // And there we have it
            return response;
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'related_uppers_could_not_be_given');
        }
    },

    /**
     * Find related uppers for a specific user
     *
     * @param {String} swarmSlug
     */
    'swarms.get_related_networks': function(swarmSlug) {
        check(swarmSlug, String);

        try {
            var swarm = Swarms.findOneOrFail({slug: swarmSlug});
            var swarm_networks = swarm.networks || [];

            var upper = Meteor.user();
            if (!upper) return swarm_networks;
            var upper_tags = upper.tags || [];

            // Loop through networks to sort by common tags
            return swarm_networks
                .sort(function(networkId) {
                    var network = Networks.findOne(networkId);
                    var network_tags = network.tags || [];
                    return lodash.intersection(upper_tags, network_tags).length;
                });
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'related_networks_could_not_be_given');
        }
    },

    /**
     * Check to see if a swarm with the swarmSlug parameter exists
     *
     * @param {String} slug
     */
    'swarms.slug_is_swarm_or_network': function(slug) {
        check(slug, String);
        var swarm = Swarms.findOne({slug: slug});
        var network = Networks.findOne({slug: slug});
        return {
            is_swarm: swarm ? true : false,
            is_network: network ? true : false
        };
    }
});
