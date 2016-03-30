Template.app_network_start_uppers.onCreated(function() {
    var template = this;
    var upperIds = template.data.uppers.uppers || [];
    template.noUppers = new ReactiveVar(false);
    template.MAX_UPPERS = 7; // 7
    template.subscribe('users.by_ids', template.data.uppers.uppers);
    if (!template.data.uppers.uppers.length) template.noUppers.set(true);
});
Template.app_network_start_uppers.helpers({
    data: function() {
        var template = Template.instance();
        var upperIds = template.data.uppers.uppers || [];
        var upperCount = template.data.uppers.totalUppers;
        return {
            uppers: function() {
                return Meteor.users.find({_id: {$in: upperIds}}, {limit: template.MAX_UPPERS});
            },
            remainingUppers: function() {
                var remaining = upperCount > template.MAX_UPPERS ? upperCount - template.MAX_UPPERS : 0;
                return remaining;
            },
            networkSlug: function() {
                return template.data.uppers.networkSlug;
            }
        };
    },
    state: function() {
        var template = Template.instance();
        return {
            noUppers: function() {
                return template.noUppers.get();
            }
        };
    }
});
