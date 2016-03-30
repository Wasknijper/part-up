/**
 * Base Rating schema
 * @name ratingBaseSchema
 * @memberof Partup.schemas
 * @private
 */
var ratingBaseSchema = new SimpleSchema({
    feedback: {
        type: String,
        optional: true
    },
    rating: {
        type: Number,
        decimal: true,
        optional: true
    }
});

/**
 * Rating entity schema
 * @name rating
 * @memberof Partup.schemas.entities
 */
Partup.schemas.entities.rating = new SimpleSchema([ratingBaseSchema, {
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    activity_id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    contribution_id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    created_at: {
        type: Date,
        defaultValue: new Date()
    },
    partup_id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    updated_at: {
        type: Date,
        defaultValue: new Date()
    },
    upper_id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    }
}]);

/**
 * Rating Form
 * @name rating
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.rating = new SimpleSchema([ratingBaseSchema, {
    //
}]);
