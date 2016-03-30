/**
 * Partup transformer service
 * @name partup.transformers.partup
 * @memberOf Partup.transformers
 */
Partup.transformers.partup = {
    /**
     * Transform partup to start partup form
     *
     * @memberOf Partup.transformers.partup
     * @param {Object} partup
     */
    'toFormStartPartup': function(partup) {
        // Find image for focuspoint
        var image = Images.findOne({_id: partup.image});

        var fields = {
            partup_name: partup.name,
            _id: partup._id,
            description: partup.description,
            type: partup.type,
            type_commercial_budget: partup.type_commercial_budget,
            type_organization_budget: partup.type_organization_budget,
            currency: partup.currency,
            end_date: partup.end_date,
            location_input: Partup.services.location.locationToLocationInput(partup.location),
            name: partup.name,
            tags_input: Partup.services.tags.tagArrayToInput(partup.tags),
            focuspoint_x_input: image ? (mout.object.get(image, 'focuspoint.x') || 0) : 0,
            focuspoint_y_input: image ? (mout.object.get(image, 'focuspoint.y') || 0) : 0,
            phase: partup.phase
        };

        // Determine privacy type
        if (partup.privacy_type === Partups.PUBLIC) {
            fields.privacy_type_input = 'public';
        } else if (partup.privacy_type === Partups.PRIVATE) {
            fields.privacy_type_input = 'private';
        } else if (partup.privacy_type === Partups.NETWORK_PUBLIC ||
            partup.privacy_type === Partups.NETWORK_INVITE ||
            partup.privacy_type === Partups.NETWORK_CLOSED) {
            fields.privacy_type_input = partup.network_id;
        }

        return fields;
    },

    /**
     * Transform startpartup form to partup
     *
     * @memberOf Partup.transformers.partup
     * @param {mixed[]} fields
     */
    'fromFormStartPartup': function(fields) {
        var partup = {
            // form fields
            name: fields.partup_name,
            description: fields.description,
            type: fields.type,
            type_commercial_budget: fields.type_commercial_budget,
            type_organization_budget: fields.type_organization_budget,
            currency: fields.currency,
            end_date: fields.end_date,
            image: fields.image,
            tags: Partup.services.tags.tagInputToArray(fields.tags_input),
            language: Partup.server.services.google.detectLanguage(fields.description),
            phase: fields.phase
        };

        var newLocation = Partup.services.location.locationInputToLocation(fields.location_input);
        if (newLocation) partup.location = newLocation;

        // Determine privacy type
        if (fields.privacy_type_input === 'public') {
            partup.privacy_type = Partups.PUBLIC;
        } else if (fields.privacy_type_input === 'private') {
            partup.privacy_type = Partups.PRIVATE;
        } else if (fields.privacy_type_input === 'network') {
            var network = Networks.findOneOrFail(fields.network_id);
            partup.network_id = network._id;
            switch (network.privacy_type) {
                case Networks.NETWORK_PUBLIC:
                    partup.privacy_type = Partups.NETWORK_PUBLIC;
                    break;
                case Networks.NETWORK_INVITE:
                    partup.privacy_type = Partups.NETWORK_INVITE;
                    break;
                case Networks.NETWORK_CLOSED:
                    partup.privacy_type = Partups.NETWORK_CLOSED;
                    break;
            }
        }

        // Save focuspoint
        Partup.server.services.images.storeFocuspoint(partup.image, fields.focuspoint_x_input || 0, fields.focuspoint_y_input || 0);

        return partup;
    }
};
