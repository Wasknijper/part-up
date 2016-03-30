var sidebarDebugger = new Partup.client.Debugger({
    enabled: false,
    namespace: 'sidebar-scroller'
});

var Subs = new SubsManager({
    cacheLimit: 1,
    expireIn: 10
});

Template.app_partup.onCreated(function() {
    var tpl = this;

    tpl.partupId = new ReactiveVar();

    var partup_sub;

    var continueLoadingPartupById = function(id) {
        var partup = Partups.findOne(id);
        if (!partup) return Router.pageNotFound('partup');

        var userId = Meteor.userId();
        if (!partup.isViewableByUser(userId, Session.get('partup_access_token'))) return Router.pageNotFound('partup-closed');

        tpl.partupId.set(id);

        var seo = {
            title: Partup.client.notifications.createTitle(partup.name),
            meta: {
                title: partup.name,
                description: partup.description
            }
        };

        if (partup.image) {
            var image = Images.findOne({_id: partup.image});
            if (image) {
                var imageUrl = Partup.helpers.url.getImageUrl(image, '1200x520');
                if (imageUrl) seo.meta.image = encodeURIComponent(Meteor.absoluteUrl() + imageUrl);
            }
        }
        if (typeof partup._id === 'string') {
            // Reset new updates for current user
            Partup.client.updates.firstUnseenUpdate(partup._id).set();
        }
    };

    tpl.autorun(function() {
        var id = Template.currentData().partupId;
        var accessToken = Session.get('partup_access_token');

        partup_sub = Meteor.subscribe('partups.one', id, accessToken, {
            onReady: function() {
                // it's important the continueLoading logic is done AFTER
                // the subscription is ready to prevent false positives on
                // the 'partup not found' fallback
                continueLoadingPartupById(id);
            }
        }); // subs manager fails here
        Subs.subscribe('activities.from_partup', id, accessToken);
        Subs.subscribe('updates.from_partup', id, {}, accessToken);
    });

    var timeline = null;
    tpl.autorun(function() {
        var reactiveContainerHeight = partupDetailLayout.reactiveContainerHeight.get();

        if (reactiveContainerHeight > 0) {
            Meteor.defer(function() {
                if (!timeline) timeline = tpl.find('.pu-sub-timelineline');
                if (!timeline) return;

                timeline.style.height = reactiveContainerHeight + 'px';
            });
        }
    });
});

Template.app_partup.onRendered(function() {
    var tpl = this;

    tpl.autorun(function(computation) {
        var partup = Partups.findOne(tpl.data.partupId);
        if (!partup) return;

        if (!Partup.client.isMobile.any()) {
            // temp library disabled untill new chrome release
            partupDetailLayout.init.apply(partupDetailLayout);
        }
    });
});

Template.app_partup_updates.helpers({
    containerHeightVar: function() {
        return partupDetailLayout.reactiveContainerHeight;
    }
});

var getScrollTop = function() {
    return window.scrollY ? window.scrollY : document.documentElement.scrollTop;
};

var partupDetailLayout = {

    HEADER_HEIGHT: 60,
    SCROLL_DEBOUNCE: 100,

    scrolling: false,

    init: function() {
        var self = this;
        if (self.attached) return;
        sidebarDebugger.log('init');

        self.container = document.querySelector('[data-layout-container]');
        if (!self.container) return console.warn('partup scroll logic error: could not find container');

        self.left = self.container.querySelector('[data-layout-left]');
        self.right = self.container.querySelector('[data-layout-right]');
        if (!self.left || !self.right) return console.warn('partup scroll logic error: could not find left and/or right side');

        self.onWindowResize = function() {
            if (window.innerWidth >= 992) {
                self.attach();
            } else {
                self.detach();
            }
        };
        self.scrollTimer;
        self.onScroll = function() {
            if (!self.scrolling) {
                self.scrolling = true;
                $(window).trigger('pu:scrollstart');
            }
            clearTimeout(self.scrollTimer);
            self.scrollTimer = setTimeout(function() {
                self.scrolling = false;
                $(window).trigger('pu:scrollend');
            }, 100);
        };

        window.addEventListener('resize', self.onWindowResize);
        window.addEventListener('resize', self.onResize);

        $(window).on('scroll', self.onScroll);
        $(window).on('pu:scrollstart', self.onScrollStart);

        if (window.innerWidth >= 992) {
            self.attach();
        }
    },

    attach: function() {
        var self = this;
        sidebarDebugger.log('attach');
        if (self.attached) return;
        self.attached = true;

        $(self.container).addClass('pu-partuppagelayout-active');
        self.setContainerHeight();
        self.preScroll();
        self.checkScroll();

        var onReRender = function() {
            self.setContainerHeight();
            self.preScroll();
            self.checkInterval();
        };
        self.debouncedScrollChecker = lodash.debounce(onReRender, 50, {
            leading: true,
            maxWait: 500,
            trailing: true
        });
        $(window).on('pu:componentRendered', self.debouncedScrollChecker);

        self.onScrollStart = function() {
            $(window).off('pu:scrollstart', self.onScrollStart);
            $(window).on('pu:scrollend', self.onScrollEnd);
            self.setContainerHeight();
            self.preScroll();
            self.checkInterval();
        };

        self.onScrollEnd = function() {
            $(window).off('pu:scrollend', self.onScrollEnd);
            $(window).on('pu:scrollstart', self.onScrollStart);
            self.checkInterval();
        };

        $(window).on('pu:scrollstart', self.onScrollStart);
    },

    detach: function() {
        var self = this;
        sidebarDebugger.log('detach');
        self.attached = false;

        self.container.style.height = '';
        self.left.style.position = '';
        self.left.style.top = '';
        self.right.style.position = '';
        self.right.style.top = '';

        window.removeEventListener('resize', self.onWindowResize);
        window.removeEventListener('resize', self.onResize);
        $(window).off('scroll', self.onScroll);
        $(window).off('pu:scrollstart', self.onScrollStart);
        $(window).off('pu:scrollend', self.onScrollEnd);
        $(window).off('pu:componentRendered', self.debouncedScrollChecker);
        self.attached = undefined;
        self.scrolling = undefined;
        self.lastDirection = undefined;
        self.lastScrollTop = undefined;
        self.maxScroll = undefined;
        self.maxPos = undefined;
        self.container = undefined;
        self.right = undefined;
        self.left = undefined;
        self.containerHeight = 0;
        self.reactiveContainerHeight.set(0);
    },

    onResize: function() {
        sidebarDebugger.log('onResize');
        partupDetailLayout.setContainerHeight();
        partupDetailLayout.preScroll();
    },

    getRects: function() {
        if (!this.left) return;
        var lr = this.left.getBoundingClientRect();
        if (!this.right) return;
        var rr = this.right.getBoundingClientRect();

        if (!lr.width) lr.width = lr.right - lr.left;
        if (!lr.height) lr.height = lr.bottom - lr.top;
        if (!rr.width) rr.width = rr.right - rr.left;
        if (!rr.height) rr.height = rr.bottom - rr.top;

        return {left: lr, right: rr};
    },

    setContainerHeight: function() {
        var r = this.getRects();
        if (!r || !r.left || !r.right) return;
        var height = Math.max(r.left.height, r.right.height);
        this.container.style.height = height + 'px';
        this.containerHeight = height;
        this.reactiveContainerHeight.set(height - this.left.top);
    },
    reactiveContainerHeight: new ReactiveVar(0),
    containerHeight: 0,

    checkInterval: function() {
        var self = this;
        requestAnimationFrame(function() {
            self.checkScroll();
            if (self.scrolling) self.checkInterval();
        });
    },

    preScroll: function() {
        var r = this.getRects();
        var br = document.body.getBoundingClientRect();
        var scol;
        var lcol;

        if (!r || !r.left || !r.right) return;
        if (r.left.height > r.right.height) {
            scol = 'right';
            lcol = 'left';
        } else {
            scol = 'left';
            lcol = 'right';
        }

        this.lastScrollTop = getScrollTop();
        this.maxScroll =  r[lcol].height - window.innerHeight + this.HEADER_HEIGHT;
        this.maxPos = this.containerHeight - r[scol].height;
    },

    checkScroll: function() {

        this.lastDirection = this.lastDirection || 'down';
        var scrollTop = getScrollTop();
        var columns = this.getRects();
        var br = document.body.getBoundingClientRect();
        var windowHeight = window.innerHeight;
        var direction = (scrollTop === this.lastScrollTop) ? this.lastDirection : scrollTop > this.lastScrollTop ? 'down' : 'up';
        var top;
        var pos;
        var smallColumn;
        var largeColumn;
        var headerHeight = this.HEADER_HEIGHT;

        // First we have to detemine which column is shorter
        if (!columns || !columns.left || !columns.right) return;
        if (columns.left.height > columns.right.height) {
            smallColumn = 'right';
            largeColumn = 'left';
        } else {
            smallColumn = 'left';
            largeColumn = 'right';
        }

        // column vars
        var smallColumnHeight = columns[smallColumn].height;
        var smallColumnTop = columns[smallColumn].top;
        var smallColumnBottom = columns[smallColumn].bottom;
        var largeColumnBottom = columns[largeColumn].bottom;
        // Going in the same direction as our previous scroll
        if (direction === this.lastDirection) {
            //  Going down and short column bottom is smaller than viewport height
            if (direction === 'down' && smallColumnBottom < windowHeight) {
                pos = 'fixed';
                // Short column height is smaller than viewport
                if (smallColumnHeight < windowHeight) {
                    top = 0;
                // Anchor bottom to viewport bottom
                } else {
                    top = windowHeight - smallColumnHeight;
                }
            // Going up and short column top is larger than initial position on page
            } else if (direction === 'up' && smallColumnTop > headerHeight) {
                pos = 'fixed';
                top = headerHeight;
            }
        } else {
            pos = 'absolute';
            top = scrollTop + smallColumnTop - headerHeight;
        }

        if (scrollTop >= this.maxScroll) {
            pos = 'absolute';
            top = this.maxPos;
        }

        // This fixes very short columns
        //
        // 1. short column height is smaller than viewport height minus initial top position
        // 2. short column bottom has to be smaller than long column bottom
        // 3. short column bottom is inside viewport
        // 4. short column top is larger than initial pos
        if (
            (smallColumnHeight < windowHeight - headerHeight) && // 1
            (
                (
                    (smallColumnBottom < largeColumnBottom) && // 2
                    (smallColumnBottom < windowHeight) // 3
                ) ||
                (
                    (smallColumnTop > headerHeight) // 4
                )
            )
        ) {
            pos = 'fixed';
            top = 0;
        }

        if (pos === 'fixed' && top === 0) {
            top = headerHeight;
        }
        this[smallColumn].style.position = pos;
        this[smallColumn].style.top = top + 'px';

        this[largeColumn].style.position = 'absolute';
        this[largeColumn].style.top = 0 + 'px';

        this.lastDirection = direction;
        this.lastScrollTop = scrollTop;

        // this.checkingScroll = false;
    }
};

Template.app_partup.onDestroyed(function() {
    partupDetailLayout.detach();
});

Template.app_partup.helpers({
    partupIsLoaded: function() {
        return Partups.findOne(this.partupId);
    }
});
