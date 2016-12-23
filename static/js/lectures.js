function Nav() {
    this.$win = $(window);
    this.$html = $('html');
    this.$htmlBody = $('html, body');
    this.$el = $('.aside-nav');
    this.mobileBtnSelector = '.aside-nav__btn';
    this.$mobileBtn = $(this.mobileBtnSelector);
    this.$parent = this.$el.prev();
    this.$footer = $('footer');
    this.initialText = this.$mobileBtn.text();
    this.closeText = this.$mobileBtn.data('closeText');
    this.mobileBreakpoint = 900;
    this.wideScreenBreakpoint = 1440;
    this.mobileBtn = 210;

    this.init = function() {
        this.setAttrs();
        this.stick();
        this.mobile();
        this.styleOffsetWide();
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
        this.offsetTop = this.$el.offset().top;
        this.parentHeight = this.$parent.height();
        this.footerOffset = this.$footer.offset().top;
        if (this.isMobile) return;
        this.height = this.$el.height();
        this.offsetBottom = this.parentHeight - this.height;
    }

    this.styleOffsetWide = function() {
        if (this.winWidth > this.wideScreenBreakpoint) {
            this.$el.css({
                "border-right-width": (this.winWidth - this.wideScreenBreakpoint) / 2
            });
        }
    }

    this.stick = function() {
        var lastScrtop = 0;
        var scrollDirection = 'down';

        this.$win.scroll(function() {
            scrtop = this.$win.scrollTop();
            scrollDirection = (scrtop > lastScrtop) ? 'down' : 'up';
            lastScrtop = scrtop;
            this.styleStick(scrollDirection, scrtop)

        }.bind(this));
    }

    this.styleStick = function(direction, scrolled) {
        if (this.height > this.parentHeight) {
            this.$el.removeClass('--sticky');
            return;
        }

        if (this.isMobile && !this.$el.hasClass('--hidden-mobile')) {
            this.$el.removeClass('--sticky');
            return;
        }

        var isSticky = this.$el.hasClass('--sticky');
        this.$el.addClass('--sticky');

        setTimeout(function() {
            if (!isSticky) this.setAttrs(); /* Height might change after position changes */

            // Header is visible for user
            if (this.offsetTop > scrolled) {
                this.$el.removeClass('--fixed');
                this.$el.removeClass('--bottom');

                // Header is not visible && wide screen
            } else if (!this.isMobile) {
                if (scrolled > this.offsetTop && scrolled < this.footerOffset - this.winHeight) {
                    if (direction === 'down' &&
                        (scrolled - this.offsetTop > this.height - this.winHeight)) {
                        this.$el.addClass('--fixed');
                        this.$el.addClass('--bottom');

                    } else if (direction === 'up' &&
                        (scrolled < this.offsetBottom + this.offsetTop) &&
                        this.$el.hasClass('--bottom')) {
                        this.$el.addClass('--fixed');
                        this.$el.removeClass('--bottom');
                    }

                } else {
                    this.$el.removeClass('--fixed');
                    this.$el.addClass('--bottom');
                }

                // Header is not visible && sreen is not wide enough
            } else {
                if (scrolled > this.offsetTop && scrolled < this.footerOffset - this.mobileBtn) {
                    if (direction === 'down') {
                        this.$el.addClass('--fixed')
                        this.$el.removeClass('--bottom');
                    } else {
                        this.$el.addClass('--fixed')
                        this.$el.removeClass('--bottom');
                    }
                } else {
                    this.$el.removeClass('--fixed');
                    this.$el.addClass('--bottom');
                }
            }
        }.bind(this), 0);
    }

    this.mobile = function() {
        this.$el.on('click', this.mobileBtnSelector, function() {
            var isHidden = this.$el.hasClass('--hidden-mobile');
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
        if (isHidden) {
            this.$mobileBtn.text(this.closeText);
            this.$mobileBtn.addClass('--close');
        } else {
            this.$mobileBtn.text(this.initialText);
            this.$mobileBtn.removeClass('--close');
        }
        this.$el.toggleClass('--hidden-mobile');
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
