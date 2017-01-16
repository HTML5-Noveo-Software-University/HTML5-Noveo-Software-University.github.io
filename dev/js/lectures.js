function Nav() {
    this.$win = $(window);
    this.$html = $('html');
    this.$htmlBody = $('html, body');
    this.$el = $('.aside-nav');
    this.$nav = $('.aside-nav__nav');
    this.mobileBtnSelector = '.aside-nav__btn';
    this.$mobileBtn = $(this.mobileBtnSelector);
    this.$technologies = $('.aside-nav__tech');
    this.$listItems = $('.aside-nav__list-item');
    this.$parent = this.$el.prev();
    this.$footer = $('footer');
    this.$header = $('header');
    this.$filteredBy = $('.aside-nav__filtered-by');
    this.$subtemes = $('.-subtheme a');
    this.$layoutSwitcher = $('.view-switcher__icon');
    this.initialText = this.$mobileBtn.text();
    this.closeText = this.$mobileBtn.data('closeText');
    this.mobileBreakpoint = 900;
    this.wideScreenBreakpoint = 1440;
    this.mobileBtn = 210;
    this.filteredByTech = false;

    this.init = function() {
        this.setAttrs();
        this.stick();
        this.mobile();
        this.styleOffsetWide();
        this.bindTechFilter();
        this.handleAncorClickMobile();
        this.toggleListItem();
        this.handleFilterUnselect();
        this.handleLayoutSwitcher();
        this.$win.resize(function() {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(function() {
                this.setAttrs();
                this.styleOffsetWide();
                if (!this.isMobile) {
                    this.handleMobileClasses(false);
                }
            }.bind(this), 200);
        }.bind(this));
    }

    this.setAttrs = function() {
        this.winWidth = this.$html.width();
        this.isMobile = this.winWidth <= this.mobileBreakpoint;
        this.winHeight = this.$html.height();
        this.offsetTop = this.$header.height();
        this.parentHeight = this.$parent.height();
        this.footerOffset = this.$footer.offset().top;
        if (this.isMobile) return;
        this.height = this.$nav.height();
        this.offsetBottom = this.parentHeight - this.height;
    }

    this.styleOffsetWide = function() {
        if (this.winWidth > this.wideScreenBreakpoint) {
            this.$el.css({
                "border-right-width": (this.winWidth - this.wideScreenBreakpoint) / 2 +16
            });
        }
    }

    this.stick = function() {
        var lastScrtop = 0;
        var scrollDirection = 'down';

        this.$win.scroll(function() {
            var scrtop = this.$win.scrollTop();
            scrollDirection = (scrtop > lastScrtop) ? 'down' : 'up';
            lastScrtop = scrtop;
            this.styleStick(scrollDirection, scrtop)

        }.bind(this));
    }

    this.styleStick = function(direction, scrolled) {
        if (this.height > this.parentHeight) {
            this.$el.removeClass('-sticky');
            return;
        }

        if (this.isMobile && !this.$el.hasClass('-hidden-mobile')) {
            this.$el.removeClass('-sticky');
            return;
        }

        var isSticky = this.$el.hasClass('-sticky');
        this.$el.addClass('-sticky');

        setTimeout(function() {
            if (!isSticky) this.setAttrs(); /* Height might change after position changes */

            // Header is visible for user
            if (this.offsetTop > scrolled) {
                this.$el.removeClass('-fixed');
                this.$el.removeClass('-bottom');

            // Header is not visible && wide screen
            } else if (!this.isMobile) {
                var h = this.height - this.winHeight;
                if (scrolled > this.offsetTop && scrolled < this.footerOffset - this.winHeight) {

                    // If small height, stick to top
                    if (h < 0) {
                        this.$el.addClass('-fixed');
                        this.$el.removeClass('-bottom');
                        return;
                    }

                    if (direction === 'down' && (scrolled - this.offsetTop > h)) {
                            this.$el.addClass('-fixed');
                            this.$el.addClass('-bottom');

                    } else if (direction === 'up') {
                        var s = scrolled < this.offsetBottom + this.offsetTop;
                        if (s && this.$el.hasClass('-bottom')) {
                            this.$el.addClass('-fixed');
                            this.$el.removeClass('-bottom');
                        } else if (!s){
                            this.$el.removeClass('-fixed');
                            this.$el.addClass('-bottom');
                        }
                    }
                } else {
                    // If small height, stick to top
                    if (h < 0 && scrolled < this.offsetBottom) {
                        this.$el.addClass('-fixed');
                        this.$el.removeClass('-bottom');
                        return;
                    }
                    this.$el.removeClass('-fixed');
                    this.$el.addClass('-bottom');
                }

            // Header is not visible && sreen is not wide enough
            } else {
                if (scrolled > this.offsetTop && scrolled < this.footerOffset - this.mobileBtn) {
                    if (direction === 'down') {
                        this.$el.addClass('-fixed')
                        this.$el.removeClass('-bottom');
                    } else {
                        this.$el.addClass('-fixed')
                        this.$el.removeClass('-bottom');
                    }
                } else {
                    this.$el.removeClass('-fixed');
                    this.$el.addClass('-bottom');
                }
            }
        }.bind(this), 0);
    }

    this.mobile = function() {
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
                this.setAttrs();
            }.bind(this), 500);
        }.bind(this));
    }


    this.handleMobileClasses = function(isHidden) {
        if (!this.isMobile) {
            this.$html.removeClass('-show-aside');
            return;
        }
        if (isHidden) {
            this.$mobileBtn.text(this.closeText);
            this.$mobileBtn.parent().addClass('-close');
        } else {
            this.$mobileBtn.text(this.initialText);
            this.$mobileBtn.parent().removeClass('-close');
        }
        this.$el.toggleClass('-hidden-mobile');
        this.$html.toggleClass('-show-aside');
    };

    this.removeFilters = function() {
        this.$listItems.removeClass('-slide-out');
        this.$filteredBy.html('');
        this.filteredByTech = false;
        this.recalcAfter(700, 'down');
    };

    this.recalcAfter = function(time, direction) {
        setTimeout(function(){
            this.setAttrs();
            if (direction) {
                this.styleStick(direction, this.$win.scrollTop());
            }
        }.bind(this), time);
    };

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
            this.recalcAfter(700, 'down');

        }.bind(this));
    };

    this.toggleListItem = function() {
        this.$listItems.on('click', function(e){
            if($(e.currentTarget).hasClass('-mobile-open')) {
                $(e.currentTarget).removeClass('-mobile-open');
                this.recalcAfter(100);
                return;
            }

            this.$listItems.not($(e.currentTarget)).removeClass('-mobile-open');
            $(e.currentTarget).addClass('-mobile-open');
            this.recalcAfter(100);
        }.bind(this));
    };

    this.handleAncorClickMobile = function() {
        this.$subtemes.on('click', function(e){
            e.stopPropagation();
            if (!this.isMobile) return;
            this.handleMobileClasses(false);
        }.bind(this));
    };

    this.handleFilterUnselect = function() {
        this.$filteredBy.on('click', function(){
            this.removeFilters();
        }.bind(this));
    };

    this.handleLayoutSwitcher = function() {
        this.$layoutSwitcher.on('click', function(){
            this.$html.toggleClass('-slides-layout');
        }.bind(this));
    }
}
var isTouch = false;
$(document).one('touchstart', function() {
    $('html').addClass('is-touch');
    isTouch = true;
});

$(document).ready(function() {
    var nav = new Nav();
    nav.init();
});
