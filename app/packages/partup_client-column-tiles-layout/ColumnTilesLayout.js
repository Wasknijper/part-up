Template.ColumnTilesLayout.onRendered(function() {
    this.data.instance._template = this;
});

Template.ColumnTilesLayout.helpers({
    columns: function() {
        return this.instance.columns.get();
    },
    columnWidth: function() {
        return (100 / Template.instance().data.instance.columns.get().length).toFixed(1);
    }
});
