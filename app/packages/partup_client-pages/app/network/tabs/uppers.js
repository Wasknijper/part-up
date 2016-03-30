var PAGING_INCREMENT = 32;

var getAmountOfColumns = function(screenwidth) {
    return screenwidth > Partup.client.grid.getWidth(11) + 80 ? 4 : 3;
};

Template.app_network_uppers.onCreated(function() {
    var template = this;

    // States such as loading states
    template.states = {
        loading_infinite_scroll: false,
        paging_end_reached: new ReactiveVar(false),
        count_loading: new ReactiveVar(false)
    };

    // Partup result count
    template.count = new ReactiveVar();

    // Get count
    template.states.count_loading.set(true);
    HTTP.get('/networks/' + template.data.networkSlug + '/uppers/count' + mout.queryString.encode({
        userId:  Meteor.userId(),
        token:  Accounts._storedLoginToken()
    }), function(error, response) {
        template.states.count_loading.set(false);
        if (error || !response || !mout.lang.isString(response.content)) { return; }

        var content = JSON.parse(response.content);
        template.count.set(content.count);
    });

    // Column layout
    template.columnTilesLayout = new Partup.client.constructors.ColumnTilesLayout({

        // This function will be called for each tile
        calculateApproximateTileHeight: function(tileData, columnWidth) {

            // The goal of this formula is to approach
            // the expected height of a tile as best
            // as possible, synchronously,
            // using the given upper object
            return 500;
        }
    });
});

Template.app_network_uppers.onRendered(function() {
    var template = this;

    // When the screen size alters
    template.autorun(function() {
        var screenWidth = Partup.client.screen.size.get('width');
        var columns = getAmountOfColumns(screenWidth);

        if (columns !== template.columnTilesLayout.columns.curValue.length) {
            template.columnTilesLayout.setColumns(columns);
        }
    });

    // When the page changes due to infinite scroll
    template.page = new ReactiveVar(false, function(previousPage, page) {

        // Add some parameters to the query
        var query = {};
        query.limit = PAGING_INCREMENT;
        query.skip = page * PAGING_INCREMENT;

        // Update state(s)
        template.states.loading_infinite_scroll = true;

        // Call the API for data
        HTTP.get('/networks/' + template.data.networkSlug + '/uppers' + mout.queryString.encode(query), {
            headers: {
                Authorization: 'Bearer ' + Accounts._storedLoginToken()
            }
        }, function(error, response) {
            if (error || !response.data.users || response.data.users.length === 0) {
                template.states.loading_infinite_scroll = false;
                template.states.paging_end_reached.set(true);
                return;
            }

            var result = response.data;
            template.states.paging_end_reached.set(result.users.length < PAGING_INCREMENT);

            var tiles = result.users.map(function(user) {
                Partup.client.embed.user(user, result['cfs.images.filerecord']);

                return {
                    user: user
                };
            });

            // Add tiles to the column layout
            template.columnTilesLayout.addTiles(tiles, function callback() {
                template.states.loading_infinite_scroll = false;
            });
        });
    });

    // Trigger first page to load
    template.page.set(0);

    // Infinite scroll
    Partup.client.scroll.infinite({
        template: template,
        element: template.find('[data-infinitescroll-container]'),
        offset: 1500
    }, function() {
        if (template.states.loading_infinite_scroll || template.states.paging_end_reached.curValue) { return; }

        var nextPage = template.page.get() + 1;
        template.page.set(nextPage);
    });
});

Template.app_network_uppers.helpers({
    columnTilesLayout: function() {
        return Template.instance().columnTilesLayout;
    },
    endReached: function() {
        return Template.instance().states.paging_end_reached.get();
    },
    count: function() {
        return Template.instance().count.get();
    },
    countLoading: function() {
        return Template.instance().states.count_loading.get();
    },
});
