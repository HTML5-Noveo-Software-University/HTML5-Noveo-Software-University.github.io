function Tech(options) {
    this.onToggleFilter = options.onToggleFilter;
    this.$listItems = options.listItems;
    this.filteredByTech = false;
    this.$technologies = $('.aside-nav__tech');
    this.$filteredBy = $('.aside-nav__filtered-by');

    this.bindTechFilter = function() {
        this.$technologies.on('click', function(e) {
            var tech = $(e.currentTarget).attr('data-tech');
            if (this.filteredByTech === tech) {
                this.removeFilters();
                return;

            }
            var $toShow = this.$listItems.has('.-' + tech);
            var $toHide = this.$listItems.not(this.$listItems.has('.-' + tech));

            $toShow.removeClass('-slide-out');
            $toHide.addClass('-slide-out');
            this.$filteredBy.html('<span class="-'+tech+'"><svg class="icon icon-filter"><use xlink:href="#icon-filter"></use></svg><span>'+tech+'</span><svg class="icon icon-cancel-circle"><use xlink:href="#icon-cancel-circle"></use></svg></span>');
            this.filteredByTech = tech;
            this.onToggleFilter(700, 'down');

        }.bind(this));
    };


    this.removeFilters = function() {
        this.$listItems.removeClass('-slide-out');
        this.$filteredBy.html('');
        this.filteredByTech = false;
        this.onToggleFilter(700, 'down');
    };

    this.init = function() {
        this.bindTechFilter();
        this.$filteredBy.on('click', function(){
            this.removeFilters();
        }.bind(this));
    }
}

function List(options) {
    this.parent = options.parent;
    this.$listItems = options.listItems;
    this.$subthemes = $('.-subtheme a');

    this.toggleListItem = function() {
        this.$listItems.on('click', function(e){
            if($(e.currentTarget).hasClass('-mobile-open')) {
                $(e.currentTarget).removeClass('-mobile-open');
                this.parent.recalcAfter(100);
                return;
            }

            this.$listItems.not($(e.currentTarget)).removeClass('-mobile-open');
            $(e.currentTarget).addClass('-mobile-open');
            this.parent.recalcAfter(100);
        }.bind(this));
    };

    this.handleAncorClickMobile = function() {
        this.$subthemes.on('click', function(e){
            e.stopPropagation();
            if (!this.parent.isMobile) return;
            this.parent.handleMobileClasses(false);
        }.bind(this));
    };

    this.init = function() {
        this.handleAncorClickMobile();
        this.toggleListItem();
    }
}

function Aside(options) {
    this.$el = options.el;
    this.parent = options.parent;

    this.styleStick = function(direction, scrolled) {
        if (this.parent.slidesLayout) {
            return;
        }

        if (this.parent.height > this.parent.mainHeight) {
            this.$el.removeClass('-sticky');
            return;
        }

        if (this.parent.isMobile && !this.$el.hasClass('-hidden-mobile')) {
            this.$el.removeClass('-sticky');
            return;
        }

        var isSticky = this.$el.hasClass('-sticky');
        this.$el.addClass('-sticky');

        setTimeout(function() {
            this._stick(direction, scrolled);
        }.bind(this), 0);
    }

    this._stick = function(direction, scrolled) {
        var lastState;

        if (!this.parent.isSticky) this.parent.setAttrs(); /* Height might change after position changes */

        // Header is visible
        if (scrolled <= this.parent.offsetTop) {
            this.removeFb(lastState);
            return;
        }

        // Header is not visible && wide screen
        if (!this.parent.isMobile) {
            // If small height, stick to top
            if (this.parent.hDiff < 0) {
                this.addFremoveB(lastState);
                return;
            }

            // Scrolling between header and magicBottom
            if (scrolled <= this.parent.magicBottom) {
                if (direction === 'down') {
                    if(scrolled >= this.parent.magicTop) {
                        this.addFb(lastState);
                        return;
                    }
                    this.removeFb(lastState);
                    return;
                }

                if (direction === 'up') {
                    if (scrolled < this.parent.footerOffset - this.parent.height) {
                        if (this.$el.hasClass('-bottom')) {
                            this.addFremoveB(lastState);
                        }
                        return;
                    }

                    this.removeFaddB(lastState);
                    return;
                }
                return;
            }

            this.removeFaddB(lastState);
            return;
        }

        // Header is not visible && sreen is not wide enough
        if (scrolled > this.parent.offsetTop && scrolled < this.parent.bottomMobile) {
            this.addFremoveB(lastState);
            return;
        }

        this.removeFaddB(lastState);
        return;
    }

    this.removeFb = function(lastState) {
        if (lastState !== "removeFb") {
            lastState = "removeFb";
            this.$el.removeClass('-fixed');
            this.$el.removeClass('-bottom');
        }
    }

    this.addFb = function(lastState) {
        if (lastState !== "addFb") {
            lastState = "addFb";
            this.$el.addClass('-fixed');
            this.$el.addClass('-bottom');
        }
    }

    this.addFremoveB = function(lastState) {
        if (lastState !== "addFremoveB") {
            lastState = "addFremoveB";
            this.$el.addClass('-fixed');
            this.$el.removeClass('-bottom');
        }
    }

    this.removeFaddB = function(lastState) {
        if (lastState !== "removeFaddB") {
            lastState = "removeFaddB";
            this.$el.removeClass('-fixed');
            this.$el.addClass('-bottom');
        }
    }
}

function MobileSwitcher(options) {
    this.mobileBtnSelector = '.aside-nav__btn';
    this.$mobileBtn = $(this.mobileBtnSelector);
    this.initialText = this.$mobileBtn.text();
    this.closeText = this.$mobileBtn.data('closeText');
    this.$el = options.el;
    this.$htmlBody = $('html, body');
    this.$html = options.html;
    this.recalcState = options.recalcState;
    this.isMobile = options.isMobile;


    this.handleMobileClasses = function(isHidden) {
        if (!this.isMobile()) {
            this.hide();
            this.$el.addClass('-hidden-mobile');
            this.$html.removeClass('-show-aside');
            return;
        }
        if (isHidden) {
            this.show();
        } else {
            this.hide();
        }
        this.$el.toggleClass('-hidden-mobile');
        this.$html.toggleClass('-show-aside');
    };

    this.show = function() {
        this.$mobileBtn.text(this.closeText);
        this.$mobileBtn.parent().addClass('-close');
    };

    this.hide = function() {
        this.$mobileBtn.text(this.initialText);
        this.$mobileBtn.parent().removeClass('-close');
    }

    this.init = function() {
        this.$el.on('click', this.mobileBtnSelector, function() {
            var isHidden = this.$el.hasClass('-hidden-mobile');
            if (isHidden) {
                this.$htmlBody.animate({
                    scrollTop: 0
                }, 300);
            }
            this.handleMobileClasses(isHidden);
            setTimeout(function() {
                this.$mobileBtn.blur();
                this.recalcState();
            }.bind(this), 500);
        }.bind(this));
    }
}
