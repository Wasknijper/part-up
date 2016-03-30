Template.update_partups_budget_changed.onCreated(function() {
    this.budgetDisplay = function(type, value, currency) {
        var currency = currency || 'EUR';
        if (type === 'charity') {
            return TAPi18n.__('update-budget-type-none');
        } else if (type === 'enterprising') {
            return TAPi18n.__('update-budget-type-none');
        } else if (type === 'commercial') {
            return TAPi18n.__('update-budget-type-money-' + currency, value);
        } else if (type === 'organization') {
            return TAPi18n.__('update-budget-type-money-' + currency, value);
        }
        return TAPi18n.__('update-budget-type-none');
    };
});

Template.update_partups_budget_changed.helpers({
    oldBudget: function() {
        var template = Template.instance();
        return template.budgetDisplay(this.type_data.old_type, this.type_data.old_value, this.type_data.old_currency);
    },

    newBudget: function() {
        var template = Template.instance();
        return template.budgetDisplay(this.type_data.new_type, this.type_data.new_value, this.type_data.new_currency);
    }
});
