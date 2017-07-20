
function AnchorTab(options) {
    this.options = {
        speed: 20,
        navs: "#navMenu a",
        sections: "#sections div",
        selectedClassName: "selected",
        callback: function (nowIndex, navs, sections) { }
    };
    for (var i in options) {
        this.options[i] = options[i];
    }

    //this.followTop = document.getElementById(this.follow).offsetTop;
    this.topArray = new Array();
    this.sections = document.querySelectorAll(this.options.sections);
    for (var i = 0; i < this.sections.length; i++) {
        this.top = this.sections[i].offsetTop;
      this.topArray.push(this.top);
    };
    this.navs = document.querySelectorAll(this.options.navs);
    for (var j = 0; j < this.navs.length; j++) {
      var that = this; (function(i) {
          that.navs[j].onclick = function () {
          that.bodyTop = window.pageYOffset || document.body.scrollTop || 0;
          that.scrollFn(0, that.bodyTop, that.topArray[i], that.options.speed);
          return false;
        }
      })(j)
    };

    this.init();
  };
AnchorTab.prototype = {
    init: function () {
        var that = this;
        //if (window.addEventListener) {
        window.addEventListener("scroll",
        function () {
            that.move.call(that);
        },
        false);
        //} else {
        //  window.attachEvent("onscroll",
        //  function() {
        //    that.move.call(that);
        //  });
        //};
        that.move.call(that);
    },
    move: function () {
        var that = this;
        that.bodyTop = window.pageYOffset || document.body.scrollTop || 0;
        var index = that.getIndex(that.bodyTop);
        if (that.nowIndex == index) return;
        that.nowIndex = index;
        that.navSelect(that.nowIndex);
        that.options.callback.call(null, that.nowIndex, that.navs, that.sections);
    },
    //返回值从0开始
    getIndex: function (top) {
        var that = this;
        top += document.documentElement.clientHeight / 2 - 40;//200;
        for (i = 0; i < that.sections.length; i++) {
            if (i == that.sections.length - 1) {
                if (that.topArray[i] <= top) return i;
            } else {
                if (that.topArray[i] <= top && that.topArray[i + 1] > top) {
                    return i;
                }
            }
        };
    },
    navSelect: function (no) {
        var that = this;
        for (var i = 0; i < that.navs.length; i++) {
            that.reg = new RegExp('(\\s|^)' + that.options.selectedClassName + '(\\s|$)');
            that.navs[i].className = that.navs[i].className.replace(that.reg, '');
        }
        that.navs[no].className += ' ' + that.options.selectedClassName;
    },
    scrollFn: function (t, b, c, speed) {
        var that = this;
        clearTimeout(that.timer);
        function _run() {
            if (t < speed) {
                t++;
                that.moTop = Math.ceil((c - b) * t / speed + b);
                window.scrollTo(0, that.moTop);
                that.timer = setTimeout(_run, 10)
            } else {
                window.scrollTo(0, c);
            }
        }
        _run();
    }
}