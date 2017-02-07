function Lect() {
    this.$win = $(window);
    this.$html = $('html');
    this.$main = $('.main');
    this.$el = $('.aside-nav');
    this.$nav = $('.aside-nav__nav'); /**/
    this.$listItems = $('.aside-nav__list-item');
    this.$header = $('header');
    this.mobileBreakpoint = 1280; /* When aside is hidden */
    this.wideScreenBreakpoint = 1600;
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
        $(this).find('p').attr('data-height', Math.round(lect.winHeight * 0.78 / 1.5))
            .closest('.slide__codepen').css('height', Math.round(lect.winHeight * 0.78))
    });
    $('body').append('<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>')

    $('.gif__btn').each(function(){
        var btn = $(this);
        var src = btn.attr('data-gif-source');
        var imageContainer = btn.next();
        var img = new Image();
        img.src = src;
        img.onload = function() {
            imageContainer.css({
                'padding-bottom': (img.height / img.width * 100) + '%',
                'max-width': ((lect.winHeight * 0.78)  / (img.height / img.width)) + 'px'
            });
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
