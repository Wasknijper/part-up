/**
 * Base Tag schema
 * @name tagBaseSchema
 * @memberof Partup.schemas
 * @private
 */
var tagBaseSchema = new SimpleSchema({
    _id: {
        type: String,
        max: 50
    }
});

/**
 * Tag entity schema
 * @name tag
 * @memberof Partup.schemas.entities
 */
Partup.schemas.entities.tag = new SimpleSchema([tagBaseSchema, {
    count: {
        type: Number,
        min: 0
    },
    created_at: {
        type: Date,
        defaultValue: new Date()
    }
}]);

/**
 * tag form schema
 * @name tag
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.tag = new SimpleSchema([tagBaseSchema, {
    //
}]);
