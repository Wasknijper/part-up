// jscs:disable
/**
 * Render focuspoint widget
 *
 * @module client-focuspoint
 * @param {?} view_elm      ?
 * @param {?} focuspoint    ?
 * @param {?} unset         ?
 * @param {?} loading       ?
 *
 * @example
    {{> Focuspoint
    view_elm=focuspointView
    focuspoint=setFocuspoint
    unset=unsetFocuspoint
    loading=loading }}
 */
// jscs:enable
/*************************************************************/
/* Widget on created */
/*************************************************************/
Template.Focuspoint.onCreated(function() {
    var template = this;
    template.dragged = new ReactiveVar(false);
});

/*************************************************************/
/* Widget on rendered */
/*************************************************************/
Template.Focuspoint.onRendered(function() {
    var template = this;

    // Function to find image
    var findImage = function() {

        // Set focuspoint when image is found in mongo
        template.dragged.set(false);
        if (!template.data.imageId) return;

        // Find image
        var image = Images.findOne({_id: template.data.imageId});
        if (!image) return;

        // Set dragged to true if the values aren't exactly 0.5
        if (image.focuspoint && mout.lang.isNumber(image.focuspoint.x) && mout.lang.isNumber(image.focuspoint.y)) {
            if (template.focuspoint) {
                template.focuspoint.set(image.focuspoint.x, image.focuspoint.y);
            }

            if (image.focuspoint.x !== 0.5 || image.focuspoint.y !== 0.5) {
                template.dragged.set(true);
            }
        }
    };

    // Initialize focuspoint
    var focuspoint_edit = template.find('[data-focuspoint-edit]');
    if (focuspoint_edit) {
        Meteor.setTimeout(function() {
            var view_elms = template.data.view_elm.template.findAll(template.data.view_elm.selector);
            var button_elm = template.find('[data-focuspoint-button]');

            template.focuspoint = new Focuspoint.Edit(focuspoint_edit, {
                view_elm: view_elms || undefined,
                button_elm: button_elm || undefined
            });

            template.focuspoint.on('drag:start', function(x, y) {
                template.dragged.set(true);
            });

            template.focuspoint.on('drag:move', function(x, y) {
                if (mout.lang.isFunction(template.data.move)) {
                    template.data.move(x, y);
                }
            });

            template.focuspoint.on('drag:end', function(x, y) {
                if (mout.lang.isFunction(template.data.update)) {
                    template.data.update(x, y);
                }
            });

            // Extend focuspoint with a reset function
            template.focuspoint.reset = function() {
                template.dragged.set(false);
                template.focuspoint.set(0.5, 0.5);
            };

            // Set focuspoint
            template.data.focuspoint(template.focuspoint);

            // Set focuspoint when image is found in mongo
            template.autorun(findImage);
        });
    }
});

/*************************************************************/
/* Widget on destroyed */
/*************************************************************/
Template.Focuspoint.onDestroyed(function() {
    var template = this;

    if (template.focuspoint) {
        template.focuspoint.kill();
        template.data.unset();
    }
});

/*************************************************************/
/* Widget helpers */
/*************************************************************/
Template.Focuspoint.helpers({
    dragged: function() {
        return Template.instance().dragged.get();
    }
});

Template.Focuspoint.events({
    'click [data-focuspoint-button]': function(event, template) {
        event.preventDefault();
    }
});
