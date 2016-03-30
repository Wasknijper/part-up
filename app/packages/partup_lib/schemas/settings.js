/**
 * Register Form Required
 * @name registerRequired
 * @memberof Partup.schemas.forms
 */
Partup.schemas.entities.settings = new SimpleSchema({
    'locale': {
        type: String,
        min: 2,
        max: 2,
        optional:true
    },
    'email': {
        type: Object,
        optional: true
    },
    'email.dailydigest': {
        type: Boolean,
        optional: true
    },
    'email.upper_mentioned_in_partup': {
        type: Boolean,
        optional: true
    },
    'email.invite_upper_to_partup_activity': {
        type: Boolean,
        optional: true
    },
    'email.invite_upper_to_network': {
        type: Boolean,
        optional: true
    },
    'email.partup_created_in_network': {
        type: Boolean,
        optional: true
    },
    'email.partups_networks_new_pending_upper': {
        type: Boolean,
        optional: true
    },
    'email.partups_networks_accepted': {
        type: Boolean,
        optional: true
    },
    'email.invite_upper_to_partup': {
        type: Boolean,
        optional: true
    },
    'email.partups_new_comment_in_involved_conversation': {
        type: Boolean,
        optional: true
    },
    'email.partups_networks_new_upper': {
        type: Boolean,
        optional: true
    },
    'email.partups_networks_upper_left': {
        type: Boolean,
        optional: true
    }
});
