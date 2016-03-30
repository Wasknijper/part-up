/**
 * Base Language schema
 * @name languageBaseSchema
 * @memberof Partup.schemas
 * @private
 */
var languageBaseSchema = new SimpleSchema({
    _id: {
        type: String,
        min: 2,
        max: 10
    },
    native_name: {
        type: String,
        min: 0
    }
});

/**
 * Language entity schema
 * @name language
 * @memberof Partup.schemas.entities
 */
Partup.schemas.entities.language = new SimpleSchema([languageBaseSchema, {
    //
}]);

/**
 * Language form schema
 * @name language
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.language = new SimpleSchema([languageBaseSchema, {
    //
}]);
