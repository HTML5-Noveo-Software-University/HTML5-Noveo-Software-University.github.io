var KEY = {
    space: 32,
    next: 39,
    prev: 37,
    home: 36,
    tab: 9,
    enter: 13,
    backspace: 8,
    escape: 27
}

function Slides(options) {
    this.$win = options.win;
    this.$main = options.main;
    this.$slidesWrap = $('.slides-wrap');
    this.$startBtn = $('#startSlide');
    this.$prevBtn = $('#prevSlide');
    this.$nextBtn = $('#nextSlide');
    this.parent = options.parent;
    this.isSwitchingSlides = false;
    this.currentSlide = 0;
    this.slidesAmount = $('.slide').length;

    this.switchSlides = function(direction) {
        if (direction === 'next') {
            if (this.currentSlide === this.slidesAmount-1) {
                return;
            }

            this.$slidesWrap.css('margin-left', ++this.currentSlide * this.$main.width() * -1)
        } else {
            if (this.currentSlide === 0) {
                return;
            }
            this.$slidesWrap.css('margin-left', --this.currentSlide * this.$main.width() * -1)
        }

        this.setCurrentSlide();
        this.isSwitchingSlides = true;
        setTimeout(function() {
            this.isSwitchingSlides = false;
        }.bind(this), 200);
    }

    this.setCurrentSlide = function() {
        if (!this.$currentSlide || !this.$currentSlide.length) {
            this.$currentSlide = $('#currentSlide');
        }
        this.$currentSlide.html(this.currentSlide + 1 +' / ' + this.slidesAmount)
    }

    this.handleKeydown = function(e) {
        if (!this.parent.slidesLayout || this.isSwitchingSlides) {
            return;
        }

        if (e.keyCode === KEY.space ||
            e.keyCode === KEY.next ||
            e.keyCode === KEY.tab ||
            e.keyCode === KEY.enter) {
            e.preventDefault();
            this.goToNextSlide();
        }

        if (e.keyCode === KEY.prev ||
            e.keyCode === KEY.escape ||
            e.keyCode === KEY.backspace) {
            this.goToPrevSlide();
        }
        if (e.keyCode === KEY.home) {
            this.goToFirstSlide();
        }
    }

    this.handeWheel = function(e) {
        if (!this.parent.slidesLayout || this.isSwitchingSlides) {
            return;
        }
        var direction = (e.originalEvent.wheelDelta > 0 ||
                e.originalEvent.detail < 0) ? 'prev' : 'next';
        this.switchSlides(direction);
    }

    this.goToFirstSlide = function() {
        this.currentSlide = 1;
        this.switchSlides('prev');
    }

    this.goToNextSlide = function() {
        this.switchSlides('next');
    }

    this.goToPrevSlide = function() {
        this.switchSlides('prev');
    }

    this.bind = function() {
        this.$win.on('keydown', this.handleKeydown.bind(this));
        this.$main.on('wheel', this.handeWheel.bind(this));
        this.$startBtn.on('click', this.goToFirstSlide.bind(this));
        this.$prevBtn.on('click', this.goToPrevSlide.bind(this));
        this.$nextBtn.on('click', this.goToNextSlide.bind(this));
    }

    this.unbind = function() {
        this.$win.off('keydown');
        this.$main.off('wheel');
        this.$startBtn.off('click');
        this.$prevBtn.off('click');
        this.$nextBtn.off('click');
    }
}

function LayoutSwitcher(options) {
    this.$html = options.html;
    this.onLayoutChange = options.onLayoutChange;
    this.$layoutSwitcher = $('.view-switcher__icon');

    this.init = function() {
        this.$layoutSwitcher.on('click', function(){
            this.$html.toggleClass('-slides-layout');
            this.onLayoutChange();
        }.bind(this));
    }
}

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

function Lect() {
    this.$win = $(window);
    this.$html = $('html');
    this.$main = $('.main');
    this.$el = $('.aside-nav');
    this.$nav = $('.aside-nav__nav'); /**/
    this.$listItems = $('.aside-nav__list-item');
    this.$header = $('header');
    this.mobileBreakpoint = 1100;
    this.wideScreenBreakpoint = 1440;
    this.mobileBtn = 210;
    this.slidesLayout = false;

    this.isMobile = function() {
        return this.isMobile;
    }

    this.recalcAfter = function(time, direction) {
        setTimeout(function(){
            this.setAttrs();
            if (direction) {
                this.Aside.styleStick(direction, this.$win.scrollTop());
            }
        }.bind(this), time);
    };

    this.setAttrs = function() {
        if (this.slidesLayout) {
            return;
        }
        this.winWidth = this.$html.width();
        this.isMobile = this.winWidth <= this.mobileBreakpoint;
        this.winHeight = this.$html.height();
        this.offsetTop = this.$header.outerHeight();
        this.mainHeight = this.$main.outerHeight();
        this.footerOffset = this.offsetTop + this.mainHeight;
        this.magicBottom = this.footerOffset - this.winHeight;
        this.hDiff = this.height - this.winHeight;
        this.magicTop = this.hDiff + this.offsetTop;
        this.bottomMobile = this.footerOffset - this.mobileBtn;
        if (this.isMobile) return;
        this.height = this.$nav.height();
    }

    this.onLayoutChange = function() {
        this.slidesLayout = !this.slidesLayout;
        if (this.slidesLayout) {
            this.Slides.bind();
            this.Slides.setCurrentSlide();
        } else {
            this.Slides.unbind();
        }
    };

    this.styleOffsetWide = function() {
        if (this.winWidth > this.wideScreenBreakpoint) {
            this.$el.css({
                "border-right-width": (this.winWidth - this.wideScreenBreakpoint) / 2 +16
            });
        }
    };

    this.Slides = new Slides({
        win: this.$win,
        main: this.$main,
        parent: this
    });

    this.Aside = new Aside({
        el: this.$el,
        parent: this
    });

    this.List = new List({
        parent: this,
        listItems: this.$listItems,
    });

    this.MobileSwitcher = new MobileSwitcher({
        el: this.$el,
        html: this.$html,
        recalcState: this.setAttrs.bind(this),
        isMobile: this.isMobile.bind(this)
    });

    this.LayoutSwitcher = new LayoutSwitcher({
        html: this.$html,
        onLayoutChange: this.onLayoutChange.bind(this)
    })

    this.Tech = new Tech({
        onToggleFilter : this.recalcAfter.bind(this),
        listItems: this.$listItems
    });

    this.init = function() {
        this.setAttrs();
        this.MobileSwitcher.init();
        this.styleOffsetWide();
        this.List.init();
        this.Tech.init();
        this.LayoutSwitcher.init();
        this.$win.resize(function() {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(function() {
                this.setAttrs();
                this.styleOffsetWide();
                if(!this.isMobile) {
                    this.MobileSwitcher.handleMobileClasses();
                }
            }.bind(this), 200);
        }.bind(this));

        var lastScrtop = 0;
        var scrollDirection = 'down';
        var timer;
        this.$win.on('scroll', function() {
            var scrtop = this.$win.scrollTop();
            scrollDirection = (scrtop > lastScrtop) ? 'down' : 'up';
            lastScrtop = scrtop;
            requestAnimationFrame(function(){
                this.Aside.styleStick(scrollDirection, scrtop);
            }.bind(this))
        }.bind(this));
    }
}

function Gif(el, url, length) {
  this.el = el;
  this.url = url;
  this.length = length;
  this.timer = null;

  this.clear = function() {
    clearTimeout(this.timer);
    document.getElementById(this.el).innerHTML = '';
  }

  this.start = function() {
    this.clear();

    var img = new Image();
    img.src = url+'?'+new Date().getTime();
    document.getElementById(this.el).appendChild(img);

    var gif = this;
    this.timer = setTimeout(function(){ gif.clear() }, this.length);
  }
}

var isTouch = false;


$(document).one('touchstart', function() {
    $('html').addClass('is-touch');
    isTouch = true;
});

$(document).ready(function() {
    var lect = new Lect();
    lect.init();
    $('.highlight code').each(function(i, block) {
        hljs.highlightBlock(block);
    });

    // Style codepens for slides 80vh
    $('.slide__codepen').each(function() {
        $(this).find('p').attr('data-height', Math.round(lect.winHeight * 0.8 / 1.5))
            .closest('.slide__codepen').css('height', Math.round(lect.winHeight * 0.8))
    });
    $('body').append('<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>')

    $('.gif__btn').each(function(){
        var btn = $(this);
        var src = btn.attr('data-gif-source');
        var imageContainer = btn.next();
        var img = new Image();
        img.src = src;
        img.onload = function() {
            imageContainer.css(
                'padding-bottom',
                (img.height / img.width * 100) + '%'
            );
        }

        btn.on('click', function() {
            if (imageContainer.html()) {
                imageContainer.html('');
                btn.removeClass('-stop');
                return;
            }
            btn.addClass('-stop');
            img = new Image();
            imageContainer.append(img)
            setTimeout(function() {
                img.src = src;
            }, 0);
        });
    });
});
