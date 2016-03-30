Template.app_notfound.helpers({
    type: function() {
        if (!Iron.controller().state.get('type')) return 'app_notfound_default';
        return 'app_notfound_' + Iron.controller().state.get('type');
    },
    data: function() {
        return Iron.controller().state.get('data');
    }
});
