// jscs:disable
/**
 * Render image suggestions gallery
 *
 * @module client-gallery
 *
 * @param {?} loading   ?
 * @param {?} pictures  ?
 * @param {?} current   ?
 * @param {?} setter    ?
 * @param {?} fp_update ?
 *
 * @example
    {{> Gallery
    loading=galleryIsLoading
    pictures=partupImage.availableSuggestions.get
    current=currentSuggestion
    setter=suggestionSetter
    fp_update=onFocuspointUpdate }}
 */
// jscs:enable
/*************************************************************/
/* Widget functions */
/*************************************************************/
Template.Gallery.onCreated(function() {
    var template = this;

    template.setNewCurrent = function(relativePos) {
        var pictures = template.data.pictures;
        var current = template.data.current;
        var newCurrent = current + relativePos;

        if (relativePos > 0 && newCurrent > pictures.length - 1) {
            newCurrent = 0;
        } else if (relativePos < 0 && newCurrent < 0) {
            newCurrent = pictures.length - 1;
        } else if (newCurrent < 0 || newCurrent > pictures.length - 1) {
            newCurrent = 0;
        }

        template.data.setter(newCurrent);
    };

    template.setFocuspoint = function(focuspoint) {
        focuspoint.on('drag:end', template.data.fp_update);
        template.focuspoint = focuspoint;
    };

    template.unsetFocuspoint = function() {
        template.focuspoint = undefined;
    };
});

/*************************************************************/
/* Widget helpers */
/*************************************************************/
Template.Gallery.helpers({
    isCurrent: function() {
        var template = Template.instance();
        return template.data.current === template.data.pictures.indexOf(this.toString());
    },
    setFocuspoint: function() {
        return Template.instance().setFocuspoint;
    },
    unsetFocuspoint: function() {
        return Template.instance().unsetFocuspoint;
    },
    focuspointView: function() {
        return {
            template: Template.instance(),
            selector: '[data-focuspoint-view]'
        };
    }
});

/*************************************************************/
/* Widget events */
/*************************************************************/
Template.Gallery.events({

    'click [data-previous]': function eventsClickNext (event, template) {
        event.preventDefault();
        template.setNewCurrent(-1);
        if (template.focuspoint) template.focuspoint.reset();
    },

    'click [data-next]': function eventsClickNext (event, template) {
        event.preventDefault();
        template.setNewCurrent(1);
        if (template.focuspoint) template.focuspoint.reset();
    }

});
