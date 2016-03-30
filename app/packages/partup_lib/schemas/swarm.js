/**
 * Base Swarm schema
 * @name swarmBaseSchema
 * @memberof Partup.schemas
 * @private
 */
var swarmBaseSchema = new SimpleSchema({
    title: {
        type: String,
        max: 75,
        optional: true
    },
    introduction: {
        type: String,
        max: 260,
        optional: true
    },
    description: {
        type: String,
        max: 700,
        optional: true
    },
    image: {
        type: String,
        optional: true
    }
});

/**
 * Swarm entity schema
 * @name swarmEntity
 * @memberof Partup.schemas.entities
 */
Partup.schemas.entities.swarm = new SimpleSchema([swarmBaseSchema, {
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    admin_id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    created_at: {
        type: Date,
        defaultValue: new Date()
    },
    name: {
        type: String,
        max: 50
    },
    networks: {
        type: [String],
        regEx: SimpleSchema.RegEx.Id
    },
    quotes: {
        type: [Object],
        regEx: SimpleSchema.RegEx.Id
    },
    'quotes._id': {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    'quotes.upper_id': {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    'quotes.content': {
        type: String,
        max: 500
    },
    refreshed_at: {
        type: Date,
        defaultValue: new Date()
    },
    shared_count: {
        type: Object
    },
    'shared_count.facebook': {
        type: Number,
        min: 0
    },
    'shared_count.twitter': {
        type: Number,
        min: 0
    },
    'shared_count.linkedin': {
        type: Number,
        min: 0
    },
    'shared_count.email': {
        type: Number,
        min: 0
    },
    stats: {
        type: Object
    },
    'stats.activity_count': {
        type: Number,
        min: 0
    },
    'stats.network_count': {
        type: Number,
        min: 0
    },
    'stats.partner_count': {
        type: Number,
        min: 0
    },
    'stats.partup_count': {
        type: Number,
        min: 0
    },
    'stats.supporter_count': {
        type: Number,
        min: 0
    },
    'stats.upper_count': {
        type: Number,
        min: 0
    },
    slug: {
        type: String
    },
    updated_at: {
        type: Date,
        defaultValue: new Date()
    }
}]);

/**
 * Swarm create form schema
 * @name swarmCreate
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.swarmCreate = new SimpleSchema({
    name: {
        type: String,
        max: 50
    }
});

/**
 * Swarm update form schema
 * @name swarmUpdate
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.swarmUpdate = new SimpleSchema([swarmBaseSchema, {
    //
}]);

/**
 * Swarm edit form schema
 * @name swarmEditAdmin
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.swarmEditAdmin = new SimpleSchema({
    admin_id: {
        type: String
    }
});

/**
 * Swarm add quote schema
 * @name swarmQuote
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.swarmQuote = new SimpleSchema({
    author_id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    content: {
        type: String,
        min: 15,
        max: 180
    }
});
