/**
 * Helper for updates page
 *
 * @class updates
 * @memberOf Partup.client
 */
Partup.client.updates = {

    /**
     * List of updates caused by the current user
     *
     * @memberOf Partup.client.updates
     */
    updates_causedby_currentuser: new ReactiveVar([]),

    waitForUpdateBool: new ReactiveVar(false),

    // these were unnessesary, but maybe usefull in the future
    setWaitForUpdate: function(bool) {
        var self = this;
        if (bool) {
            self.waitForUpdateBool.set(true);
        } else {
            Meteor.defer(function() {
                self.waitForUpdateBool.set(false);
            });
        }
    },

    waitForUpdate: function(template, callback) {
        var self = this;
        Tracker.nonreactive(function() {
            template.autorun(function(c) {
                var wait = self.waitForUpdateBool.get();
                if (!wait) {
                    c.stop();
                    callback();
                }
            });
        });
    },

    /**
     * Add update to list of updates caused by the current user
     *
     * @memberOf Partup.client.updates
     * @param {String} update_id _id of the update caused by the current user
     */
    addUpdateToUpdatesCausedByCurrentuser: function(update_id) {
        var current_list = this.updates_causedby_currentuser.get();
        current_list.push(update_id);
        this.updates_causedby_currentuser.set(current_list);
    },

    /**
     * Reset the caused-by-current-user array
     *
     * @memberOf Partup.client.updates
     */
    resetUpdatesCausedByCurrentuser: function() {
        this.updates_causedby_currentuser.set([]);
    },

    /**
     * Determine first unseen update helper
     *
     * @memberof Partup.client.updates
     * @param partupId {String}
     */
    firstUnseenUpdate: function(partupId) {
        var partup = Partups.findOne(partupId);
        var userId = Meteor.userId();
        var self = this;
        return {
            /**
             * gets the first unseen update id
             *
             * @memberof Partup.client.updates.firstUnseenUpdate
             */
            get: function() {
                if (!userId) return false;
                return self._firstUnseenUpdatesInPartups.get(partupId);
            },
            /**
             * set the first unseen update
             *
             * @memberof Partup.client.updates.firstUnseenUpdate
             */
            set: function() {
                if (!userId) {
                    self._firstUnseenUpdatesInPartups.set(partup._id, false);
                    return;
                }
                partup.upper_data.forEach(function(data) {
                    if (data._id === Meteor.userId()) {
                        self._firstUnseenUpdatesInPartups.set(partup._id, data.new_updates[0]);
                        Meteor.call('partups.reset_new_updates', partupId);
                    }
                });
            },
            /**
             * reset the first unseen update
             *
             * @memberof Partup.client.updates.firstUnseenUpdate
             */
            reset: function() {
                self._firstUnseenUpdatesInPartups.set(partupId, false);
            },
        };
    },
    _firstUnseenUpdatesInPartups: new ReactiveDict() // {partup_id: update_id}
};
