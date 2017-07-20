/*
* mDialog V 1.0
* Author: zxh
* Date: 2014/3/24
*/
function mScroll(id, options) {
    this.options = {
        startY: 0,
        startX: 0,
        scrollY: true,
        scrollX: false,
        //锁定方向，使横向滑动不触发纵向滚动
        lockDirection: true,
        isShowScroll: true,
        //是否用css3，不用top,left
        useTransform: true,
        //是否用css动画，不用js改变位置
        useTransition: true,
        //是否根据滑动的速度，加速一段距离。
        //如果snap每次滑动一格，则设为false，比如大图切换设为false，模仿下拉框选择，则设为true
        momentum: true,
        //超出边界时候是否还能拖动，现在定死了允许拖动
        //bounce: true,
        //超出边界还原时间点
        bounceTime: 600,
        //是否启用硬件加速
        HWCompositing: true,
        preventDefault: true,
        //stopPropagation:false,
        preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A|LI|LABEL)$/ },
        preventDefaultExceptionEnd: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A|LI|LABEL)$/ },
        preventDefaultExceptionOther: function (obj) { return false; },//如果return true则也属于例外，不阻止默认事件
        //用于snap
        //是否每次滑动的长度是单步距离的倍数，或者指定类型，可传入true，或者满足js选择器的string选择符
        //如果设置的是选择器字符串，那就无需设置snapStepX和snapStepY
        snap: null,
        //x方向每步的长度
        snapStepX: null,
        //y方向每步的长度
        snapStepY: null,
        //计算是否移到的边界值用，例如，传入50，表示移动距离超过50像素则移动；传入0.334，则用每步移动距离乘以该值得到临界值
        snapThreshold: 0.334,
        snapCurrentPageX: 0,
        snapCurrentPageY: 0,
        //end snap
        //两指缩放
        zoom: false,
        zoomMin: 1,
        zoomMax: 4,
        startZoom: 1,
        isSetZoomMinInWrapper: false,
        //end
        //触摸开始回调   
        onTouchStart: function () { },
        //移动位置发生改变回调，更多加载的情况useTransition得设为false
        onScrollMove: function () { },
        //触摸中的回调
        onTouchMove: function () { },
        //触摸结束开始（touchend）的回调
        onTouchEnd: function () { },
        ////触摸结束结束（touchend）的回调
        //onTouchEndAfter:function(){},
        //触摸结束无move的回调，单击
        onTap: function () { },
        //滚动结束回调
        onScrollEnd: function () { },
        //单击（与双击配套使用的时候用这个，否则用onTap）
        onSingleTap: function () { },
        //双击
        onDoubleTap: function () { },
        //用于snap回调
        onGoPage: function (currentPage) { },
        onZoomStart: function () { },
        onZoom: function () { },
        onZoomEnd: function () { },
        wnd: window,
        exchangeData: null,
        bindEvent: true,
        //该值表示，wrapper元素距离body的距离，如：{left:0,top:0}，一般情况下该值无需设置，代码中会自动计算偏移量。
        //但如果需要zoom，且其上级元素中也含有mScroll，则代码中的偏移量会计算错误（需修改为减去上级mScroll元素的top，left或者transform的值，比较麻烦），所以直接设置此值
        wrapperOffset: null,
        scrollerOffsetX: 0,
        scrollerOffsetY: 0,
        //滚动被禁用，但依旧执行onTap事件
        disableButTouchEnd: false,
        checkIsMove: function () { return true; }
    };
    for (var i in options) {
        this.options[i] = options[i];
    }
    this.id = id;
    this.wrapper = this.options.wnd.document.getElementById(id);  //document.querySelector(id);
    if (!this.wrapper || !this.wrapper.children || this.wrapper.children.length == 0)
        return;
    this.scroller = this.wrapper.children[0];
    this.scrollerStyle = this.scroller.style;
    this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';//this.options.HWCompositing &&注释掉是否启用硬件加速，默认启用了，以后有需要再加此属性
    this.options.useTransition = utils.hasTransition && this.options.useTransition;
    this.options.useTransform = utils.hasTransform && this.options.useTransform;

    //用于两指缩放
    this.scale = Math.min(Math.max(this.options.startZoom, this.options.zoomMin), this.options.zoomMax);
    this.scaled = false;
    //end
    this.animateTimer = null;
    this.x = 0;
    this.y = 0;
    this.lockDirection = this.options.lockDirection;
    this.reset(true);
    this._init();
    this.enable();
    if (!this.options.snap) {
        this._scrollTo(this.options.startX, this.options.startY);
    }
}

mScroll.prototype = {
    isIe: function () {
        try{
            return ("ActiveXObject" in window);
        }
        catch(e){
            return false;
        }
    },
    isMobile: navigator.userAgent.match(/Mobile|iPhone|iPad|Android/i) || Math.min(screen.height, screen.width) <= 480,
    destroy: function (beforeInit) {
        if (!beforeInit) {
            this._scrollTo(0, 0);
        }
        this._destroyEvent();
        if (this.scrollbarY) {
            this.scrollbarY.destroy();
        }
        if (this.scrollbarX) {
            this.scrollbarX.destroy();
        }
    },
    _destroyEvent: function () {
        $(this.wrapper).unbind();
        $(this.scroller).unbind();
        $(this.options.wnd).unbind("mouseup.scroll" + this.id + " mousestop.scroll" + this.id + " touchend.scroll" + this.id + " touchcancel.scroll" + this.id + " resize.scroll" + this.id + " orientationchange.scroll" + this.id);
        if (this.options.wnd != top.window) {
            $(top.window).unbind("mouseup.scroll" + this.id + " mousestop.scroll" + this.id + " touchend.scroll" + this.id + " touchcancel.scroll" + this.id + " resize.scroll" + this.id + " orientationchange.scroll" + this.id);
        }
    },
    _init: function () {
        this.destroy(true);
        this._initScrollBar();
        if (this.options.zoom) {
            this._initZoom();
        }
        if (this.options.snap) {
            this._initSnap(true);
        }
        if (this.options.bindEvent) {
            this._initEvents();
        }
    },
    _initEvents: function () {
        var that = this;
        var startEventName, moveEventName, endEventName;
        if ('ontouchstart' in window) {
            startEventName = "touchstart.scroll";
            moveEventName = "touchmove.scroll";
            endEventName = "touchend.scroll" + this.id + " touchcancel.scroll" + this.id;
        }
        //else if ('onMSPointerDown' in window) {
        //    startEventName = "MSPointerDown.scroll";
        //    moveEventName = "MSPointerMove.scroll";
        //    endEventName = "MSPointerUp.scroll" + this.id + " MSPointerCancel.scroll" + this.id;
        //}
        else {
            startEventName = "mousedown.scroll";
            moveEventName = "mousemove.scroll";
            //mousestop
            endEventName = "mouseup.scroll" + this.id + " mousestop.scroll" + this.id;
        }
        $(this.wrapper).bind(startEventName, function (event) {
            that._start(event);
            if (that.options.zoom && event.touches && event.touches.length > 1) {
                that._zoomStart(event);
            }
        });
        $(this.wrapper).bind(moveEventName, function (event) {
            if (that.options.zoom && event.touches && event.touches.length > 1) {
                that._zoom(event);
                return;
            }
            that._move(event);
        });
        if (this.options.useTransition) {
            $(this.scroller).bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function (event) {
                that._transitionEnd(event);
            });
        }

        $(this.options.wnd).bind(endEventName, function (event) {
            if (that.scaled) {
                that._zoomEnd(event);
                return;
            }
            that._end(event);
        });
        if (this.options.wnd != top.window) {
            $(top.window).bind(endEventName, function (event) {
                if (that.scaled) {
                    that._zoomEnd(event);
                    return;
                }
                that._end(event);
            });
        }
        $(this.options.wnd).bind("resize.scroll" + this.id + " orientationchange.scroll" + this.id, function () {
            //$(window).bind("orientationchange.scroll" + this.id, function () {
            that.reset(false);
        });
    },
    _initScrollBar: function () {
        if (this.options.isShowScroll) {
            if (this.options.scrollY) {
                this.scrollbarY = new mScrollbar(this, "v");
            }
            if (this.options.scrollX) {
                this.scrollbarX = new mScrollbar(this, "h");
            }
        }
    },
    reset: function (first) {
        var rf = this.wrapper.offsetHeight; // force refresh
        this.wrapperHeight = this.wrapper.clientHeight;
        this.scrollerHeight = Math.round(this.scroller.offsetHeight * this.scale);
        this.wrapperWidth = this.wrapper.clientWidth;
        this.scrollerWidth = Math.round(this.scroller.scrollWidth * this.scale);
        if (this.options.isSetZoomMinInWrapper) {
            this.options.zoomMin = this.wrapperWidth / this.scroller.scrollWidth;
        }
        //最大移动距离
        this.maxScrollY = this.wrapperHeight - this.scrollerHeight;
        this.hasVerticalScroll = this.maxScrollY < 0;
        this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
        this.hasHorizontalScroll = this.maxScrollX < 0;
        if (!this.hasVerticalScroll) {
            this.maxScrollY = 0;
            this.scrollerHeight = this.wrapperHeight;
        }
        if (!this.hasHorizontalScroll) {
            this.maxScrollX = 0;
            this.scrollerWidth = this.wrapperWidth;
            if (!this.options.lockDirection) {
                this.lockDirection = true;
            }
        }
        else {
            if (!this.options.lockDirection) {
                this.lockDirection = false;
            }
        }
        this.endTime = 0;
        //用于snap
        this.directionX = 0;
        this.directionY = 0;
        //用于zoom
        if (this.options.wrapperOffset) {
            this.wrapperOffset = this.options.wrapperOffset;
        }
        else {
            this.wrapperOffset = utils.offset(this.wrapper);
        }
        //end
        if (!first) {
            if (this.options.isShowScroll) {
                if (this.options.scrollY) {
                    this.scrollbarY.reset();
                }
                if (this.options.scrollX) {
                    this.scrollbarX.reset();
                }
            }
            
            if (this.options.snap) {
                this._initSnap(first);
            }
            //else {
                //if (!this.moved) {
                this.resetPosition();
                //}
            //}
        }
    },
    _initSnap: function (first) {
        if (first) {
            this.currentPage = {};
            this.currentPage.pageX = this.options.snapCurrentPageX;
            this.currentPage.pageY = this.options.snapCurrentPageY;          
        }
        if (typeof this.options.snap == 'string') {
            this.options.snapEle = this.scroller.querySelectorAll(this.options.snap);
        }
        var i = 0, l,
            m = 0, n,
            cx, cy,
            x = 0, y,
            stepX = this.options.snapStepX || this.wrapperWidth,
            stepY = this.options.snapStepY || this.wrapperHeight,
            el;

        this.pages = [];

        if (!this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight) {
            return;
        }

        if (this.options.snap === true) {
            cx = Math.round(stepX / 2);
            cy = Math.round(stepY / 2);

            while (x > -this.scrollerWidth) {
                this.pages[i] = [];
                l = 0;
                y = 0;

                while (y > -this.scrollerHeight) {
                    this.pages[i][l] = {
                        x: Math.max(x, this.maxScrollX),
                        y: Math.max(y, this.maxScrollY),
                        width: stepX,
                        height: stepY,
                        cx: x - cx,
                        cy: y - cy
                    };

                    y -= stepY;
                    l++;
                }

                x -= stepX;
                i++;
            }
        } else {
            el = this.options.snapEle;
            l = el.length;
            n = -1;
            for (; i < l; i++) {
                if (i === 0 || el[i].offsetLeft <= el[i - 1].offsetLeft) {
                    m = 0;
                    n++;
                }

                if (!this.pages[m]) {
                    this.pages[m] = [];
                }

                x = Math.max(-el[i].offsetLeft, this.maxScrollX);
                y = Math.max(-el[i].offsetTop, this.maxScrollY);
                cx = x - Math.round(el[i].offsetWidth / 2);
                cy = y - Math.round(el[i].offsetHeight / 2);

                this.pages[m][n] = {
                    x: x,
                    y: y,
                    width: el[i].offsetWidth,
                    height: el[i].offsetHeight,
                    cx: cx,
                    cy: cy
                };

                if (x > this.maxScrollX) {
                    m++;
                }
            }
        }
        if (first) {
            this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);
        }
        // Update snap threshold if needed
        if (this.options.snapThreshold % 1 === 0) {
            this.snapThresholdX = this.options.snapThreshold;
            this.snapThresholdY = this.options.snapThreshold;
        } else {
            this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
            this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold);
        }
    },
    disable: function () {
        //this.moved = false;
        this.initiated = false;
        this.enabled = false;
        //if (!this.options.disableButTouchEnd && this.options.bindEvent) {
        //    this._destroyEvent();
        //}
    },
    enable: function () {
        this.enabled = true;
        //if (!this.options.disableButTouchEnd && this.options.bindEvent) {
        //    this._initEvents();
        //}
    },
    preventDefaultException: function (el, exceptions) {
        for (var i in exceptions) {
            if (exceptions[i].test(el[i])) {
                return true;
            }
        }
        return false;
    },
    _transitionEnd: function (e) {
        if (e.target != this.scroller || !this.isInTransition) {
            return;
        }
        this._transitionTime();
        if (!this.resetPosition(this.options.bounceTime)) {
            this.isInTransition = false;
            this._exexScrollEndEvent();
            //this._hideScrollbar();
        }
    },
    _hideScrollbar:function(){
        if (this.options.isShowScroll) {
            if (this.options.scrollY) {
                this.scrollbarY.hideScroll();
            }
            if (this.options.scrollX) {
                this.scrollbarX.hideScroll();
            }
        }
    },
    getComputedPosition: function () {
        var matrix = window.getComputedStyle(this.scroller, null),
			x, y;
        if (this.options.useTransform) {
            matrix = matrix[utils.style.transform].split(')')[0].split(', ');
            x = +(matrix[12] || matrix[4]);
            y = +(matrix[13] || matrix[5]);
        } else {
            x = +matrix.left.replace(/[^-\d.]/g, '');
            y = +matrix.top.replace(/[^-\d.]/g, '');
        }
        x -= this.options.scrollerOffsetX;
        y -= this.options.scrollerOffsetY;
        return { x: x, y: y };
    },
    _start: function (e) {
        //if (this.options.stopPropagation) {
        //    e.stopPropagation();
        //}
        if (!this.enabled) {
            return;
        }
        if (this.options.preventDefault
            && !this.preventDefaultException(e.target, this.options.preventDefaultException)
            && (!this.options.preventDefaultExceptionOther || !this.options.preventDefaultExceptionOther.call(null, e.target))
            ) {
            e.preventDefault();
        }
        //iframe部分情况存在文本框移动光标时，存在ios放大镜光标丢失的情况。原因估计是touch事件导致iframe的父窗口获得了焦点。需要focus一下。
        //if (!this.isIe() && e.target.tagName == "INPUT") { $(window).focus(); }
        if (!this.isIe() && this.isMobile) { $(window).focus(); }

        if (this.options.useTransition) {
            this._transitionTime();
        }
        this.startTime = new Date().getTime();
        if (this.options.useTransition && this.isInTransition) {
            this.isInTransition = false;
            pos = this.getComputedPosition();
            this._scrollTo(Math.round(pos.x), Math.round(pos.y));
            this._exexScrollEndEvent();
            //this._hideScrollbar();
        } else if (!this.options.useTransition && this.isAnimating) {
            this.isAnimating = false;
            this._exexScrollEndEvent();
            //this._hideScrollbar();
        }
        //if (this.isAnimating) {
        //    this.isAnimating = false;
        //    if (this.options.isShowScroll) {
        //        if (this.options.scrollY) {
        //            this.scrollbarY.hideScroll();
        //        }
        //        if (this.options.scrollX) {
        //            this.scrollbarX.hideScroll();
        //        }
        //    }
        //}
        if (e.touches)
            e = e.touches[0];
        this.initiated = true;
        this.moved = false;
        //相对开始移动距离
        this.distY = 0;
        this.distX = 0;
        //滚动开始位置top
        this.startY = this.y;
        this.startX = this.x;
        //滚动开始位置，在move的时候不改变此值，用于snap
        this.absStartX = this.x;
        this.absStartY = this.y;
        //触摸开始位置
        this.lastPointY = e.clientY;
        this.lastPointX = e.clientX;
        
        //当前方向，用于锁方向
        this.currentDirection = "";
        //滑动方向
        this.swipeDirection = "";
        //utils.addEvent(window, 'touchmove', this);
        //this.scroller._execEvent('beforeScrollStart');
        if (this.options.onTouchStart)
            this.options.onTouchStart.call(null, e);
    },
    _move: function (e) {
        //if (this.options.stopPropagation) {
        //    e.stopPropagation();
        //}
        if (!this.enabled || !this.initiated) return;
        if (!this.options.checkIsMove()) return;
        if (this.options.preventDefault) {
            e.preventDefault();
        }
        if (e.touches)
            e = e.touches[0];

        var deltaX, deltaY,
        newX, newY;
        var timestamp = new Date().getTime();
        deltaY = e.clientY - this.lastPointY;
        deltaX = e.clientX - this.lastPointX;
        this.lastPointY = e.clientY;
        this.lastPointX = e.clientX;

        this.distY += deltaY;
        this.distX += deltaX;
        var absDistY = Math.abs(this.distY);
        var absDistX = Math.abs(this.distX);
        //移动总距离小于10则不移动
        //if (absDistY < 10 && absDistX < 10) {
        //    return;
        //}
        if (timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10)) {
            return;
        }
        //如果锁定横向滑动不触发纵向滚动
        if (this.lockDirection) {
            if (this.currentDirection == "") {
                var dirt = utils.swipeDirection(this.distX, this.distY);
                this.swipeDirection = dirt;
                //if (absDistX > absDistY + 5) {
                if (dirt == "left" || dirt == "right") {
                    this.currentDirection = "x";
                }
                else {// if (absDistY > absDistX + 5) {
                    this.currentDirection = "y";
                }
            }
            if (this.currentDirection == "x") {
                deltaY = 0; //只要横向动过，后面即使纵向滑也不允许动。
                this._hideScrollbar();
            }
            if (this.currentDirection == "y") {
                deltaX = 0;
                this._hideScrollbar();
            }
        }
        else {
            //设置当前主方向
            var dirt = utils.swipeDirection(this.distX, this.distY);
            this.swipeDirection = dirt;
            //if (absDistX > absDistY + 5) {
            if (dirt == "left" || dirt == "right") {
                this.currentDirection = "x";
            }
            else {// if (absDistY > absDistX + 5) {
                this.currentDirection = "y";
            }
            //if (absDistX > absDistY + 5) {
            //    this.currentDirection = "x";
            //}
            //else if (absDistY > absDistX + 5) {
            //    this.currentDirection = "y";
            //}
        }
        if (!this.moved) {
            if (this.options.isShowScroll) {
                if (this.options.scrollY && deltaY != 0) {
                    this.scrollbarY.showScroll();
                }
                if (this.options.scrollX && deltaX != 0) {
                    this.scrollbarX.showScroll();
                }
            }
            this.moved = true;
        }
        //deltaX = this.hasHorizontalScroll ? deltaX : 0;
        //deltaY = this.hasVerticalScroll ? deltaY : 0;
        deltaX = this.options.scrollX ? deltaX : 0;
        deltaY = this.options.scrollY ? deltaY : 0;
        var touchPixelRatio = 1;
        //出了边界则阻碍运动
        if (this.y > 0 || this.y < this.maxScrollY) {
            touchPixelRatio = 3;
        }
        newY = this.y + deltaY / touchPixelRatio;
        touchPixelRatio = 1;
        //出了边界则阻碍运动
        if (this.x > 0 || this.x < this.maxScrollX) {
            touchPixelRatio = 3;
        }
        newX = this.x + deltaX / touchPixelRatio;
        //用于snap
        this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
        this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;
        //end
        this._scrollTo(newX, newY);
        //MessageTip.error("newY:" + newY + "deltaY:" + deltaY + "y:" + this.y).hide();

        if (timestamp - this.startTime > 300) {
            this.startTime = timestamp;
            this.startX = this.x;
            this.startY = this.y;
        }
        if (this.options.onTouchMove)
            this.options.onTouchMove.call(null, { y: newY, maxScrollY: this.maxScrollY, exchangeData: this.options.exchangeData, directX: deltaX > 0 ? "l" : (deltaX == 0 ? "n" : "r"), directY: deltaY > 0 ? "t" : (deltaY == 0 ? "n" : "b"), isOutEdgeX: (this.x > 0 || this.x < this.maxScrollX), isOutEdgeY: (this.y > 0 || this.y < this.maxScrollY), scale: this.scale, currentDirection: this.currentDirection });
    },
    _end: function (e) {
        var that = this;
        //iframe+touch事件（即使是空事件），必然存在移动光标后文本框无法输入的问题。需要focus一下。
        //if (!this.isIe() && e.target.tagName == "INPUT") { $(window).focus();}//e.stopPropagation();
        //点击div触发input focus的情况，也存在焦点丢失的情况
        if (!this.isIe() && this.isMobile) { $(this.options.wnd).focus(); }
        if (!this.enabled || !this.initiated) {
            if (this.options.disableButTouchEnd && this.options.onTap) {
                if (e.changedTouches)
                    e = e.changedTouches[0];
                this.options.onTap.call(null, e);
            }
            if (this.options.disableButTouchEnd && this.options.onSingleTap) {
                if (e.changedTouches)
                    e = e.changedTouches[0];
                this.options.onSingleTap.call(null, e);
            }
            return;
        }
        if (this.options.preventDefault
            && !this.preventDefaultException(e.target, this.options.preventDefaultExceptionEnd)
            && (!this.options.preventDefaultExceptionOther || !this.options.preventDefaultExceptionOther.call(null, e.target))
            ) {
            e.preventDefault();
        }
        
        ////iframe+touch事件（即使是空事件），必然存在移动光标后文本框无法输入的问题。需要focus一下。
        ////if (!this.isIe() && e.target.tagName == "INPUT") { $(window).focus();}//e.stopPropagation();
        ////点击div触发input focus的情况，也存在焦点丢失的情况
        //if (!this.isIe()) { $(window).focus(); }
        this.isInTransition = false;
        this.initiated = false;
        this.endTime = new Date().getTime();
        var newY = Math.round(this.y);
        var newX = Math.round(this.x);
        if (this.moved) {
            //触摸结束开始的回调
            if (this.options.onTouchEnd) {
                var rtn = this.options.onTouchEnd.call(null, { x: newX, y: newY, maxScrollX: this.maxScrollX, maxScrollY: this.maxScrollY, exchangeData: this.options.exchangeData, isOutEdgeX: (this.x > 0 || this.x < this.maxScrollX), isOutEdgeY: (this.y > 0 || this.y < this.maxScrollY), scale: this.scale });
                if (rtn) {
                    this._exexScrollEndEvent();
                    return;
                }
            }
        }
        if (this.resetPosition(this.options.bounceTime)) {
            if (this.options.snap) {
                var snap = this._nearestSnap(this.x, this.y);
                var oldpage = this.currentPage;
                this.currentPage = snap;
                if (oldpage !== this.currentPage && this.options.onGoPage)
                    this.options.onGoPage.call(null, this.currentPage, this.pages);
            }
            return;
        }
        //if (this.options.lockDirection && this.resetPosition(this.options.bounceTime)) {
        //    return;
        //}
        this._animate(newX, newY);
        if (this.moved) {
            var now = new Date().getTime();
            var duration = now - this.startTime;

            var time = 0;
            var easing = utils.ease.circular;
            //是否根据速度计算距离
            if (this.options.momentum && duration < 300) {
                //计算触摸结束后继续滚动的距离
                var momentumY = this.hasVerticalScroll ? this.momentum(this.y, this.startY, duration, this.maxScrollY, this.wrapperHeight) : { destination: newY, duration: 0 };
                var momentumX = this.hasHorizontalScroll ? this.momentum(this.x, this.startX, duration, this.maxScrollX, this.wrapperWidth) : { destination: newX, duration: 0 };
                newY = momentumY.destination;
                newX = momentumX.destination;
                //time = momentumY.duration;
                time = Math.max(momentumX.duration, momentumY.duration);
                this.isInTransition = true;
            }
            if (this.options.snap) {
                //用于snap
                //var distanceX = Math.abs(newX - this.startX);
                //var distanceY = Math.abs(newY - this.startY);
                //if (duration < 200 && distanceX < 100 && distanceY < 100) {
                //    time = Math.max(
                //        Math.max(
                //            Math.min(Math.abs(this.x - this.startX), 1000),
                //            Math.min(Math.abs(this.y - this.startY), 1000)
                //        ), 300);
                //    this.goToPage(this.currentPage.pageX + this.directionX, this.currentPage.pageY + this.directionY, time);
                //    this.directionX = 0;
                //    this.directionY = 0;
                //    return;
                //}
                var snap = this._nearestSnap(newX, newY);
                time = Math.max(
                        Math.max(
                            Math.min(Math.abs(newX - snap.x), 1000),
                            Math.min(Math.abs(newY - snap.y), 1000)
                        ), 300);
                var oldpage = this.currentPage;
                this.currentPage = snap;
                if (oldpage !== this.currentPage && this.options.onGoPage)
                    this.options.onGoPage.call(null, this.currentPage, this.pages);
                newX = snap.x;
                newY = snap.y;
                this.directionX = 0;
                this.directionY = 0;
                easing = utils.ease.quadratic;//this.bounce;
            }

            if (newX != this.x || newY != this.y) {
                //if (newY > 0 || newY < this.maxScrollY) {
                if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
                    easing = utils.ease.quadratic;
                }
                this._animate(newX, newY, time, easing);
                //if (this.options.onScrollEnd)
                //    this.options.onScrollEnd.call(null, { x: newX, y: newY, maxScrollX: this.maxScrollX, maxScrollY: this.maxScrollY, exchangeData: this.options.exchangeData, isOutEdgeX: (this.x >= 0 || this.x <= this.maxScrollX), isOutEdgeY: (this.y >= 0 || this.y <= this.maxScrollY), scale: this.scale, currentDirection: this.currentDirection });
                return;
            }
            else {
                this.resetPosition(this.options.bounceTime);
            }
            this._exexScrollEndEvent();
            //this._hideScrollbar();
            //if (this.options.onScrollEnd)
            //    this.options.onScrollEnd.call(null, { x: newX, y: newY, maxScrollY: this.maxScrollY, exchangeData: this.options.exchangeData, isOutEdgeX: (this.x >= 0 || this.x <= this.maxScrollX), isOutEdgeY: (this.y >= 0 || this.y <= this.maxScrollY), scale: this.scale, currentDirection: this.currentDirection });
        }
        else {
            if (e.changedTouches)
                e = e.changedTouches[0];
            if (this.options.onTap) {
                that.options.onTap.call(null, e);
            }
            if (this.isClickOneTimes) {
                if (this.tapTimer) {
                    clearTimeout(this.tapTimer);
                }
                this.isClickOneTimes = false;
                if (this.options.zoom) {
                    if (this.scale != this.options.zoomMin) {
                        this.zoom(this.options.zoomMin, undefined, undefined, 0);
                    }
                    else {
                        this.zoom(this.options.zoomMax, undefined, undefined, 0);
                    }
                }
                if (this.options.onDoubleTap)
                    this.options.onDoubleTap.call(null, e);
            }
            else {
                this.isClickOneTimes = true;
                setTimeout(function () { that.isClickOneTimes = false; }, 200);
                if (this.options.onSingleTap)
                    this.tapTimer = setTimeout(function () {
                        that.options.onSingleTap.call(null, e);
                    }, 200);
            }
        }
    },
    _exexScrollEndEvent: function () {
        this._hideScrollbar();
        if (this.options.onScrollEnd) {
            this.options.onScrollEnd.call(null, { x: this.x, y: this.y, maxScrollX: this.maxScrollX, maxScrollY: this.maxScrollY, exchangeData: this.options.exchangeData, isOutEdgeX: (this.x >= 0 || this.x <= this.maxScrollX), isOutEdgeY: (this.y >= 0 || this.y <= this.maxScrollY), scale: this.scale, currentDirection: this.currentDirection, swipeDirection: this.swipeDirection });
        }
    },
    //更新移动窗口位置
    _scrollTo: function (x, y) {
        if (isNaN(x) || isNaN(y)) return;
        y = Math.round(y);
        x = Math.round(x);
        this.y = y;
        this.x = x;
        //MessageTip.error(this.options.scrollerOffsetY + " " + this.options.scrollerOffsetX);
        y += this.options.scrollerOffsetY;
        x += this.options.scrollerOffsetX;
        if (this.options.useTransform) {
            if (this.options.zoom) {
                this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px) scale(' + this.scale + ') ' + this.translateZ;
            }
            else {
                this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;
            }
        }
        else {
            this.scrollerStyle.top = y + 'px';
            this.scrollerStyle.left = x + 'px';
        }
        if (this.options.isShowScroll) {
            if (this.options.scrollY) {
                this.scrollbarY.updatePosition(this.y);
            }
            if (this.options.scrollX) {
                this.scrollbarX.updatePosition(this.x);
            }
        }
        //移动位置发生改变，调用回调方法
        if (this.options.onScrollMove)
            this.options.onScrollMove.call(null, { x: this.x, y: this.y, maxScrollX: this.maxScrollX, maxScrollY: this.maxScrollY, exchangeData: this.options.exchangeData,scaled:this.scaled, isOutEdgeX: (this.x > 0 || this.x < this.maxScrollX), isOutEdgeY: (this.y > 0 || this.y < this.maxScrollY), scale: this.scale });
    },
    //更新滚动条位置
    //updateScrollYPosition: function (y) {
    //    var y = Math.round(this.sizeRatioY * y) || 0;

    //    if (y < this.minBoundaryY) {
    //        this.indicator.height = Math.max(this.indicatorHeight + y * 3, 8);
    //        this.indicatorStyle.height = this.indicator.height + 'px';
    //        y = this.minBoundaryY;
    //    } else if (y > this.maxBoundaryY) {
    //        this.indicator.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
    //        this.indicatorStyle.height = this.indicator.height + 'px';
    //        y = this.maxPosY + this.indicatorHeight - this.height;
    //    } else if (this.indicator.height != this.indicatorHeight) {
    //        this.indicator.height = this.indicatorHeight;
    //        this.indicatorStyle.height = this.indicator.height + 'px';
    //    }
    //    this.indicatorStyle.top = y + 'px';
    //},
    //滑动结束，如果超出边界则复原位置
    resetPosition: function (time) {
        var y = this.y;
        var x = this.x;
        time = time || 0;
        if (!this.hasVerticalScroll || this.y > 0) {
            y = 0;
        } else if (this.y < this.maxScrollY) {
            y = this.maxScrollY;
        }
        if (!this.hasHorizontalScroll || this.x > 0) {
            x = 0;
        } else if (this.x < this.maxScrollX) {
            x = this.maxScrollX;
        }
        //只有一个方向可滚动的情况
        if (!this.options.scrollX || !this.options.scrollY || this.lockDirection) {
            if (x == this.x && y == this.y) {
                return false;
            }
        }
        else {
            if (x == this.x || y == this.y) {
                if (x != this.x || y != this.y) {
                    this._animate(x, y, time, utils.ease.quadratic);
                }
                return false;
            }
        }
        this._animate(x, y, time, utils.ease.quadratic);
        return true;
    },
    _transitionTimingFunction: function (easing) {
        this.scrollerStyle[utils.style.transitionTimingFunction] = easing;
        if(this.scrollbarY)
        {
            this.scrollbarY.transitionTimingFunction(easing);
        }
        if (this.scrollbarX) {
            this.scrollbarX.transitionTimingFunction(easing);
        }
    },
    _transitionTime: function (time) {
        time = time || 0;
        this.scrollerStyle[utils.style.transitionDuration] = time + 'ms';
        if (this.scrollbarY) {
            this.scrollbarY.transitionTime(time);
        }
        if (this.scrollbarX) {
            this.scrollbarX.transitionTime(time);
        }
    },
    _animate: function (destX, destY, time, easing) {
        easing = easing || utils.ease.circular;
        this.isInTransition = this.options.useTransition && time > 0;
        //if (!time || (this.options.useTransition && easing.style)) {
        if (this.options.useTransition && easing.style) {
            this._transitionTimingFunction(easing.style);
            this._transitionTime(time);
            this._scrollTo(destX, destY);
        } else {
            this._animateJs(destX, destY, time, easing.fn);
        }
    },
    _animateJs: function (destX, destY, duration, easingFn) {
        //easingFn = easingFn || this.circular;
        var that = this,
            startX = this.x,
            startY = this.y,
            startTime = new Date().getTime(),
            destTime = startTime + duration;
        var rAF = window.requestAnimationFrame ||
	    window.webkitRequestAnimationFrame ||
	    window.mozRequestAnimationFrame ||
	    window.oRequestAnimationFrame ||
	    window.msRequestAnimationFrame ||
	    function (callback) { window.setTimeout(callback, 1000 / 60); };
        var cAF = window.cancelAnimationFrame ||
	    window.webkitCancelAnimationFrame ||
	    window.mozCancelAnimationFrame ||
	    window.oCancelAnimationFrame ||
	    window.msCancelAnimationFrame ||
	    function (id) { window.clearTimeout(id); };
        function step() {
            var now = new Date().getTime(),
                newX, newY,
                easing;
            if (now >= destTime) {
                that.isAnimating = false;
                that._scrollTo(destX, destY);
                if (!that.resetPosition(that.options.bounceTime)) {
                    //复原结束，隐藏滚动条
                    that._exexScrollEndEvent();
                    //that._hideScrollbar();
                }
                return;
            }
            now = (now - startTime) / duration;
            easing = easingFn(now);
            newY = (destY - startY) * easing + startY;
            newX = (destX - startX) * easing + startX;
            that._scrollTo(newX, newY);
            if (that.isAnimating) {
                if (that.animateTimer) cAF(that.animateTimer);
                that.animateTimer = rAF(step);
                //window.setTimeout(step, 1000 / 60);
            }
        }
        this.isAnimating = true;
        step();
    },
    //lowerMargin:this.maxScrollX,wrapperSize:this.wrapperHeight
    momentum: function (current, start, time, lowerMargin, wrapperSize) {
        var distance = current - start,
			speed = Math.abs(distance) / time,
			destination,
			duration;
        var deceleration = 0.0006;
        destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1);
        duration = speed / deceleration;

        if (destination < lowerMargin) {
            destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
            distance = Math.abs(destination - current);
            duration = distance / speed;
        } else if (destination > 0) {
            destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
            distance = Math.abs(current) + destination;
            duration = distance / speed;
        }
        return {
            destination: Math.round(destination),
            duration: duration
        };
    },
    //用于snap
    _nearestSnap: function (x, y) {
        if (!this.pages.length) {
            return { x: 0, y: 0, pageX: 0, pageY: 0 };
        }

        var i = 0,
			l = this.pages.length,
			m = 0;
        // Check if we exceeded the snap threshold
        if (Math.abs(x - this.absStartX) < this.snapThresholdX &&
			Math.abs(y - this.absStartY) < this.snapThresholdY) {
            return this.currentPage;
        }
        if (x > 0) {
            x = 0;
        } else if (x < this.maxScrollX) {
            x = this.maxScrollX;
        }
        if (y > 0) {
            y = 0;
        } else if (y < this.maxScrollY) {
            y = this.maxScrollY;
        }
        for (; i < l; i++) {
            if (x >= this.pages[i][0].cx) {
                x = this.pages[i][0].x;
                break;
            }
        }
        l = this.pages[i].length;
        for (; m < l; m++) {
            if (y >= this.pages[0][m].cy) {
                y = this.pages[0][m].y;
                break;
            }
        }
        if (i == this.currentPage.pageX) {
            i += this.directionX;
            if (i < 0) {
                i = 0;
            } else if (i >= this.pages.length) {
                i = this.pages.length - 1;
            }
            x = this.pages[i][0].x;
        }
        if (m == this.currentPage.pageY) {
            m += this.directionY;

            if (m < 0) {
                m = 0;
            } else if (m >= this.pages[0].length) {
                m = this.pages[0].length - 1;
            }

            y = this.pages[0][m].y;
        }

        return {
            x: x,
            y: y,
            pageX: i,
            pageY: m
        };
    },
    resetCurrentPage: function () {
        this.goToPage(this.currentPage.pageX, this.currentPage.pageY, undefined, undefined, true);
    },
    goToPage: function (x, y, time, easing, isReset) {
        easing = easing || utils.ease.quadratic;//.bounce;
        if (this.pages.length == 0) {
            if (this.options.onGoPage)
                this.options.onGoPage.call(null, null, this.pages, isReset);
            return;
        }
        if (x >= this.pages.length) {
            x = this.pages.length - 1;
        } else if (x < 0) {
            x = 0;
        }
        if (y >= this.pages[x].length) {
            y = this.pages[x].length - 1;
        } else if (y < 0) {
            y = 0;
        }

        var posX = this.pages[x][y].x,
			posY = this.pages[x][y].y;

        time = time === undefined ? Math.max(
			Math.max(
				Math.min(Math.abs(posX - this.x), 1000),
				Math.min(Math.abs(posY - this.y), 1000)
			), 300) : time;
        this.currentPage = {
            x: posX,
            y: posY,
            pageX: x,
            pageY: y
        };
        if (this.options.onGoPage)
            this.options.onGoPage.call(null, this.currentPage, this.pages, isReset);

        this._animate(posX, posY, time, easing);
    },
    //end
    //用于zoom
    _initZoom: function () {
        this.scrollerStyle[utils.style.transformOrigin] = '0 0';
    },
    _zoomStart: function (e) {
        if (!this.enabled) return;
        var c1 = Math.abs(e.touches[0].clientX - e.touches[1].clientX),
			c2 = Math.abs(e.touches[0].clientY - e.touches[1].clientY);

        this.touchesDistanceStart = Math.sqrt(c1 * c1 + c2 * c2);
        this.startScale = this.scale;

        this.originX = Math.abs(e.touches[0].clientX + e.touches[1].clientX) / 2 + this.wrapperOffset.left - this.x;
        this.originY = Math.abs(e.touches[0].clientY + e.touches[1].clientY) / 2 + this.wrapperOffset.top - this.y;

        //处理scroll比wrapper小的情况
        this.startScrollWidth = this.scroller.scrollWidth * this.startScale;
        this.startScrollHeight = this.scroller.offsetHeight * this.startScale;
        if (this.startScrollWidth > this.wrapperWidth) this.startScrollWidth = this.wrapperWidth;
        if (this.startScrollHeight > this.wrapperHeight) this.startScrollHeight = this.wrapperHeight;
        this.criticalScaleX = this.startScrollWidth / this.wrapperWidth;
        this.criticalScaleY = this.startScrollHeight / this.wrapperHeight;
        //this._execEvent('zoomStart');
        if (this.options.onZoomStart)
            this.options.onZoomStart.call(null, this.scale);
    },
    _zoom: function (e) {
        if (!this.enabled || !this.initiated){//utils.eventType[e.type] !== this.initiated) {
            return;
        }
        if (this.options.preventDefault) {
            e.preventDefault();
        }
        var c1 = Math.abs(e.touches[0].clientX - e.touches[1].clientX),
			c2 = Math.abs(e.touches[0].clientY - e.touches[1].clientY),
			distance = Math.sqrt(c1 * c1 + c2 * c2),
			scale = 1 / this.touchesDistanceStart * distance * this.startScale,
			lastScale,
			x, y;

        this.scaled = true;

        if (scale < this.options.zoomMin) {
            scale = 0.5 * this.options.zoomMin * Math.pow(2.0, scale / this.options.zoomMin);
        } else if (scale > this.options.zoomMax) {
            scale = 2.0 * this.options.zoomMax * Math.pow(0.5, this.options.zoomMax / scale);
        }

        lastScale = scale / this.startScale;

        var scrollerHeight = Math.round(this.scroller.offsetHeight * this.scale);
        var scrollerWidth = Math.round(this.scroller.scrollWidth * this.scale);
        if(scrollerWidth < this.wrapperWidth){
            x = 0;
        }
        else{
            x = this.originX - this.originX * lastScale * this.criticalScaleX + this.startX;
        }
        if (scrollerHeight < this.wrapperHeight) {
            y = 0;
        }
        else {
            y = this.originY - this.originY * lastScale * this.criticalScaleY + this.startY;
        }
        this.scale = scale;
        
        if (this.options.onZoom)
            this.options.onZoom.call(null, this.scale);
        this._scrollTo(x, y);       
    },
    _zoomEnd: function (e) {
        if (!this.enabled || !this.initiated) {//|| utils.eventType[e.type]!== this.initiated
            return;
        }

        if (this.options.preventDefault) {
            e.preventDefault();
        }
        var newX, newY,
			lastScale;

        this.isInTransition = false;
        this.initiated = false;
        var oldScale = this.scale;
        if (this.scale > this.options.zoomMax) {
            this.scale = this.options.zoomMax;
        } else if (this.scale < this.options.zoomMin) {
            this.scale = this.options.zoomMin;
        }
        // Update boundaries
        this.reset(false);
        lastScale = this.scale / this.startScale;

        var scrollerHeight = Math.round(this.scroller.offsetHeight * this.scale);
        var scrollerWidth = Math.round(this.scroller.scrollWidth * this.scale);
        if (scrollerWidth < this.wrapperWidth) {
            newX = 0;
        }
        else {
            newX = this.originX - this.originX * lastScale * this.criticalScaleX + this.startX;
        }
        if (scrollerHeight < this.wrapperHeight) {
            newY = 0;
        }
        else {
            newY = this.originY - this.originY * lastScale * this.criticalScaleY + this.startY;
        }

        //newX = this.originX - this.originX * lastScale + this.startX;
        //newY = this.originY - this.originY * lastScale + this.startY;
        if (newX > 0) {
            newX = 0;
        } else if (newX < this.maxScrollX) {
            newX = this.maxScrollX;
        }
        if (newY > 0) {
            newY = 0;
        } else if (newY < this.maxScrollY) {
            newY = this.maxScrollY;
        };
        if (this.x != newX || this.y != newY || oldScale != this.scale) {
            if (oldScale != this.scale) {
                if (this.options.onZoom)
                    this.options.onZoom.call(null, this.scale);
            }
            this._animate(newX, newY, this.options.bounceTime);           
        }
        this.scaled = false;
        if (this.options.onZoomEnd)
            this.options.onZoomEnd.call(null, this.scale);
        //this._execEvent('zoomEnd');
    },
    zoom: function (scale, x, y, time) {
        if (scale < this.options.zoomMin) {
            scale = this.options.zoomMin;
        } else if (scale > this.options.zoomMax) {
            scale = this.options.zoomMax;
        }
        if (scale == this.scale) {
            return;
        }
        var relScale = scale / this.scale;
        x = x === undefined ? this.wrapperWidth / 2 : x;
        y = y === undefined ? this.wrapperHeight / 2 : y;
        time = time === undefined ? 300 : time;

        x = x + this.wrapperOffset.left - this.x;
        y = y + this.wrapperOffset.top - this.y;

        x = x - x * relScale + this.x;
        y = y - y * relScale + this.y;
        this.scale = scale;

        this.reset();		// update boundaries

        if (x > 0) {
            x = 0;
        } else if (x < this.maxScrollX) {
            x = this.maxScrollX;
        }
        if (y > 0) {
            y = 0;
        } else if (y < this.maxScrollY) {
            y = this.maxScrollY;
        }
        if (this.options.onZoom)
            this.options.onZoom.call(null, this.scale);
        this._animate(x, y, time);       
    },
    //end
    //quadratic: function (k) {//cubic-bezier(0.25, 0.46, 0.45, 0.94)
    //    return k * (2 - k);
    //},
    //circular: function (k) {//cubic-bezier(0.1, 0.57, 0.1, 1)this looks better, it should be (0.075, 0.82, 0.165, 1)
    //    return Math.sqrt(1 - (--k * k));
    //},
    //bounce: function (k) {
    //    if ((k /= 1) < (1 / 2.75)) {
    //        return 7.5625 * k * k;
    //    } else if (k < (2 / 2.75)) {
    //        return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
    //    } else if (k < (2.5 / 2.75)) {
    //        return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
    //    } else {
    //        return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
    //    }
    //},
    getY: function () {
        return this.y;
    }
}

function mScrollbar(mscroll, direction) {
    this.mscroll = mscroll;
    this.direction = direction;
    this.createScrollbar();
}

mScrollbar.prototype = {
    createScrollbar: function () {
        var scrollbar = document.createElement('div'),
		indicator = document.createElement('div');
        this.indicator = indicator;
        this.indicatorStyle = indicator.style;
        scrollbar.style.cssText = 'position:absolute;z-index:9999;overflow:hidden;';
        this.indicatorStyle.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.9);border-radius:3px;';
        //垂直滚动条
        if (this.direction == "v") {
            //scrollbar.style.cssText = 'position:absolute;z-index:9999;width:6px;bottom:2px;top:2px;right:1px;overflow:hidden';
            //this.indicatorStyle.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.9);border-radius:3px';
            scrollbar.style.cssText += 'width:6px;bottom:2px;top:2px;right:1px;';
            this.indicatorStyle.width = '100%';
            this.indicatorHeight = Math.max(Math.round(this.mscroll.wrapperHeight * this.mscroll.wrapperHeight / (this.mscroll.scrollerHeight || this.mscroll.wrapperHeight || 1)), 8);
            this.indicatorStyle.height = this.indicatorHeight + 'px';
            if (!this.mscroll.hasVerticalScroll) this.indicatorStyle.display = "none";
            this.indicatorStyle.opacity = "0";
            scrollbar.appendChild(indicator);

            this.minBoundaryY = -this.indicatorHeight + 8;
            this.maxBoundaryY = this.mscroll.wrapperHeight - 8;
            //滚动条最大移动距离
            this.maxPosY = this.mscroll.wrapperHeight - this.indicatorHeight;
            this.sizeRatioY = (this.mscroll.maxScrollY && (this.maxPosY / this.mscroll.maxScrollY));
        }
            //水平滚动条
        else {
            scrollbar.style.cssText += 'height:6px;left:2px;right:2px;bottom:0';
            this.indicatorStyle.height = '100%';
            this.indicatorWidth = Math.max(Math.round(this.mscroll.wrapperWidth * this.mscroll.wrapperWidth / (this.mscroll.scrollerWidth || this.mscroll.wrapperWidth || 1)), 8);
            this.indicatorStyle.width = this.indicatorWidth + 'px';
            if (!this.mscroll.hasHorizontalScroll) this.indicatorStyle.display = "none";
            this.indicatorStyle.opacity = "0";
            scrollbar.appendChild(indicator);

            this.minBoundaryX = -this.indicatorWidth + 8;
            this.maxBoundaryX = this.mscroll.wrapperWidth - 8;
            //滚动条最大移动距离
            this.maxPosX = this.mscroll.wrapperWidth - this.indicatorWidth;
            this.sizeRatioX = (this.mscroll.maxScrollX && (this.maxPosX / this.mscroll.maxScrollX));
        }
        this.mscroll.wrapper.appendChild(scrollbar);
    },
    reset: function () {
        if (this.direction == "v") {
            if (!this.mscroll.hasVerticalScroll) {
                this.indicatorStyle.display = "none";
            }
            else {
                this.indicatorStyle.display = "";
            }

            this.indicatorHeight = Math.max(Math.round(this.mscroll.wrapperHeight * this.mscroll.wrapperHeight / (this.mscroll.scrollerHeight || this.mscroll.wrapperHeight || 1)), 8);
            this.indicatorStyle.height = this.indicatorHeight + 'px';
            if (!this.mscroll.hasVerticalScroll) this.indicatorStyle.display = "none";
            else this.indicatorStyle.opacity = "0";
            this.minBoundaryY = -this.indicatorHeight + 8;
            this.maxBoundaryY = this.mscroll.wrapperHeight - 8;
            this.maxPosY = this.mscroll.wrapperHeight - this.indicatorHeight;
            this.sizeRatioY = (this.mscroll.maxScrollY && (this.maxPosY / this.mscroll.maxScrollY));
        }
        else {
            if (!this.mscroll.hasHorizontalScroll) {
                this.indicatorStyle.display = "none";
            }
            else {
                this.indicatorStyle.display = "";
            }

            this.indicatorWidth = Math.max(Math.round(this.mscroll.wrapperWidth * this.mscroll.wrapperWidth / (this.mscroll.scrollerWidth || this.mscroll.wrapperWidth || 1)), 8);
            this.indicatorStyle.width = this.indicatorWidth + 'px';
            if (!this.mscroll.hasHorizontalScroll) this.indicatorStyle.display = "none";
            else this.indicatorStyle.opacity = "0";
            this.minBoundaryX = -this.indicatorWidth + 8;
            this.maxBoundaryX = this.mscroll.wrapperWidth - 8;
            this.maxPosX = this.mscroll.wrapperWidth - this.indicatorWidth;
            this.sizeRatioX = (this.mscroll.maxScrollX && (this.maxPosX / this.mscroll.maxScrollX));
        }
    },
    updatePosition: function (pos) {
        if (this.direction == "v") {
            var y = Math.round(this.sizeRatioY * pos) || 0;

            if (y < this.minBoundaryY) {
                this.indicator.height = Math.max(this.indicatorHeight + y * 3, 8);
                this.indicatorStyle.height = this.indicator.height + 'px';
                y = this.minBoundaryY;
            } else if (y > this.maxBoundaryY) {
                this.indicator.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
                this.indicatorStyle.height = this.indicator.height + 'px';
                y = this.maxPosY + this.indicatorHeight - this.indicator.height;
            } else if (this.indicator.height != this.indicatorHeight) {
                this.indicator.height = this.indicatorHeight;
                this.indicatorStyle.height = this.indicator.height + 'px';
            }

            if (this.mscroll.options.useTransform) {
                this.indicatorStyle[utils.style.transform] = 'translateY(' + y + 'px)' + this.mscroll.translateZ;
            } else {
                this.indicatorStyle.top = y + 'px';
            }
        }
        else {
            var x = Math.round(this.sizeRatioX * pos) || 0;

            if (x < this.minBoundaryX) {
                this.indicator.width = Math.max(this.indicatorWidth + x * 3, 8);
                this.indicatorStyle.width = this.indicator.width + 'px';
                x = this.minBoundaryX;
            } else if (x > this.maxBoundaryX) {
                this.indicator.width = Math.max(this.indicatorWidth - (x - this.maxPosX) * 3, 8);
                this.indicatorStyle.width = this.indicator.width + 'px';
                x = this.maxPosX + this.indicatorWidth - this.indicator.width;
            } else if (this.indicator.width != this.indicatorWidth) {
                this.indicator.width = this.indicatorWidth;
                this.indicatorStyle.width = this.indicator.width + 'px';
            }
           
            if (this.mscroll.options.useTransform) {
                this.indicatorStyle[utils.style.transform] = 'translateX(' + x + 'px)' + this.mscroll.translateZ;
            } else {
                this.indicatorStyle.left = x + 'px';
            }
        }
    },
    showScroll: function () {
        this.fade(1);
    },
    hideScroll: function () {
        this.fade(0);
    },
    fade: function (val) {
        var objstyle = this.indicatorStyle;

        clearTimeout(this.fadeTimeout);
        this.fadeTimeout = null;

        var delay = val ? 0 : 200;

        this.fadeTimeout = setTimeout(function () {
            objstyle.opacity = (val ? "1" : "0");
        }, delay);
    },
    transitionTime: function (time) {
        time = time || 0;
        this.indicatorStyle[utils.style.transitionDuration] = time + 'ms';
        if (!time) {
            this.indicatorStyle[utils.style.transitionDuration] = '0.001s';
        }
    },
    transitionTimingFunction: function (easing) {
        this.indicatorStyle[utils.style.transitionTimingFunction] = easing;
    },
    destroy: function () {
        this.indicator.parentNode.parentNode.removeChild(this.indicator.parentNode)
    }
}
var utils = (function () {
    var me = {};
    var _elementStyle = document.createElement('div').style;
    var _vendor = (function () {
        var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
			transform,
			i = 0,
			l = vendors.length;

        for (; i < l; i++) {
            transform = vendors[i] + 'ransform';
            if (transform in _elementStyle) return vendors[i].substr(0, vendors[i].length - 1);
        }

        return false;
    })();

    function _prefixStyle(style) {
        if (_vendor === false) return false;
        if (_vendor === '') return style;
        return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
    }
    return {
        hasTransform: _prefixStyle('transform') !== false,
        hasTransition: _prefixStyle('transition') in _elementStyle,
        hasPerspective: _prefixStyle('perspective') in _elementStyle,
        style: {
            transform: _prefixStyle('transform'),
            transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
            transitionDuration: _prefixStyle('transitionDuration'),
            transformOrigin: _prefixStyle('transformOrigin')
        },
        offset: function (el) {
            var left = -el.offsetLeft,
                top = -el.offsetTop;

            while (el = el.offsetParent) {
                left -= el.offsetLeft;
                top -= el.offsetTop;
            }
            return {
                left: left,
                top: top
            };
        },
        swipeDirection: function (distX, distY) {
            return Math.abs(distX) >=
              Math.abs(distY) ? (distX < 0 ? 'left' : 'right') : (distY < 0 ? 'up' : 'down')
        },
        ease: {
            quadratic: {
                style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fn: function (k) {
                    return k * (2 - k);
                }
            },
            circular: {
                style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',	// Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
                fn: function (k) {
                    return Math.sqrt(1 - (--k * k));
                }
            },
            back: {
                style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                fn: function (k) {
                    var b = 4;
                    return (k = k - 1) * k * ((b + 1) * k + b) + 1;
                }
            },
            bounce: {
                style: '',
                fn: function (k) {
                    if ((k /= 1) < (1 / 2.75)) {
                        return 7.5625 * k * k;
                    } else if (k < (2 / 2.75)) {
                        return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
                    } else if (k < (2.5 / 2.75)) {
                        return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
                    } else {
                        return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
                    }
                }
            },
            elastic: {
                style: '',
                fn: function (k) {
                    var f = 0.22,
                        e = 0.4;

                    if (k === 0) { return 0; }
                    if (k == 1) { return 1; }

                    return (e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) * (2 * Math.PI) / f) + 1);
                }
            }
        }
    }
})();