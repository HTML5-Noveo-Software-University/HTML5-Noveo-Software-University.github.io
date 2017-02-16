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
