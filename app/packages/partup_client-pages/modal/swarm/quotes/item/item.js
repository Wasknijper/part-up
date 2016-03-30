Template.QuoteItem.onCreated(function() {
    this.state = new ReactiveDict();

    this.state.set('form', false);
    this.state.set('view', this.data.quote ? true : false);
    this.state.set('empty', this.data.quote ? false : true);
    this.defaultState = this.data.quote ? 'view' : 'empty';
    this.setState = function(state) {
        if (state !== 'form') this.state.set('form', false);
        if (state !== 'view') this.state.set('view', false);
        if (state !== 'empty') this.state.set('empty', false);
        this.state.set(state, true);
    };
});

Template.QuoteItem.helpers({
    state: function() {
        var template = Template.instance();
        return {
            form: function() {
                return template.state.get('form');
            },
            view: function() {
                return template.state.get('view');
            },
            empty: function() {
                return template.state.get('empty');
            },
            onAfterSubmit: function() {
                return function() {
                    template.data.onEdit();
                };
            },
            onAfterUpdate: function() {
                return function() {
                    template.setState('view');
                };
            },
            onAfterRemove: function() {
                return function() {
                    template.setState('empty');
                    template.data.quote = false;
                };
            },
            resetState: function() {
                return function() {
                    template.setState(template.defaultState);
                };
            }
        };
    }
});

Template.QuoteItem.events({
    'click [data-edit]': function(event, template) {
        event.preventDefault();
        template.setState('form');
    },
    'click [data-create]': function(event, template) {
        event.preventDefault();
        template.setState('form');
    }
});
