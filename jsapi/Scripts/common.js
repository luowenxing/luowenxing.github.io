//String.prototype.identifyLink = function () {
//    //var reg = /(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?)/g;
//    //var reg = /((((http|https|ftp)\:\/\/)|www.)([\w-]+\.)+[\w]{1,3}(:[a-zA-Z0-9]*)?\/?([a-zA-Z0-9\-\._\?\,\'/\\\+&%\$#\=~])*)/g
//    //var reg = /(?:<[^\/>]*>.*)((((http|https|ftp)\:\/\/)|www.)([\w-]+\.)+[\w]+(:[a-zA-Z0-9]*)?(\/[\w- ./?%#&=]*)?)(?:([.\n]*<\/)(?!\s*a\s*>))/g
//    var reg = /(?:<[^\/>]*>.*)((((http|https|ftp)\:\/\/)|www.)([\w-]+\.)+[\w]+(:[a-zA-Z0-9]*)?(\/[\w- ./?%#&=]*)?)(?:([.\n]*<\/)(?!\s*a\s*>))/g
//    //var reg = /<[^\/><]*>.*<\/\1>/g;
//    //var reg = /<[^\/><]*>([^\/><]*)<\/[^\/><]*>/g;
    
//    //return this.replace(reg, '<a href="$1" target="_blank">$1</a>');
//    return this.replace(reg, "$1***$2***$3");
//    //alert(this.replace(reg, function () {
//    //    console.log(arguments[0]);
//    //    console.log(arguments[1]);
//    //    return "aaa";
//    //}));
//    //return this.replace(reg, function ($1) {
//    //    console.log($1);
//    //    return "aaa";
//    //});
//    //return this;
//};

var Common = {};
//Common.IsOffine = function () {
//    return Common.getCookie("offlinelogin") == "1" || !navigator.onLine;
//},
Common.isWifi = function () {
    return Common.getCookie("MOA.ISWIFI") == "1";
}
Common.isNoNetWork = function () {
    if (BrowserType.isIOS) {
        return !navigator.onLine;
    }
    else {
        //android判断navigator.onLine有误
        return Common.getCookie("MOA.ISWIFI") == "-1";
    }
}
//首页导航跳转
Common.navigateUrl = function (url) {
    //离线应用不能加随机数
    //if (url.indexOf("?") < 0) {
    //    url += "?tmp=" + Math.random();
    //} else {
    //    url += "&tmp=" + Math.random();
    //}
    $("#frmMain").attr("src", url);
    mDialog.closeAll();
}
Common.WindowClose = function () {
    window.opener = null;
    window.open('', '_top');
    window.close();
}
//获取url参数
Common.getQuery = function (name, url) {
    var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
    if (reg.test(url || location.href)) {
        return decodeURIComponent(RegExp.$2.replace(/\+/g, " "));
    } else {
        return "";
    }
};
Common.getQueryAC = function (name, url) {
    var reg = new RegExp("(^|#|&)" + name + "=([^&]*)(\\s|&|$)", "i");
    if (reg.test(url || location.href)) {
        return decodeURIComponent(RegExp.$2.replace(/\+/g, " "));
    } else {
        return "";
    }
};
//Common.InitInputTip = function () {
//    $(".inputtip").click(function () { $(this).prev().focus(); $(this).hide(); });
//    $(".inputtip").prev().focus(function () {
//        $(this).next().hide();
//    }).blur(function () {
//        if ($(this).val().length == 0) {
//            $(this).next().show();
//        }
//    }).each(function () {
//        if ($(this).val().length == 0) {
//            $(this).next().show();
//        }
//        else {
//            $(this).next().hide();
//        }
//    });
//}
/**
 * 格式化文件大小, 输出成带单位的字符串
 * @method formatSize
 * @grammar Base.formatSize( size ) => String
 * @grammar Base.formatSize( size, pointLength ) => String
 * @grammar Base.formatSize( size, pointLength, units ) => String
 * @param {Number} size 文件大小
 * @param {Number} [pointLength=2] 精确到的小数点数。
 * @param {Array} [units=[ 'B', 'K', 'M', 'G', 'TB' ]] 单位数组。从字节，到千字节，一直往上指定。如果单位数组里面只指定了到了K(千字节)，同时文件大小大于M, 此方法的输出将还是显示成多少K.
 * @example
 * console.log( Base.formatSize( 100 ) );    // => 100B
 * console.log( Base.formatSize( 1024 ) );    // => 1.00K
 * console.log( Base.formatSize( 1024, 0 ) );    // => 1K
 * console.log( Base.formatSize( 1024 * 1024 ) );    // => 1.00M
 * console.log( Base.formatSize( 1024 * 1024 * 1024 ) );    // => 1.00G
 * console.log( Base.formatSize( 1024 * 1024 * 1024, 0, ['B', 'KB', 'MB'] ) );    // => 1024MB
 */
Common.FileFormatSize = function (size, pointLength, units) {
    try{
        var unit;

        units = units || ['B', 'K', 'M', 'G', 'TB'];

        while ((unit = units.shift()) && size > 1024) {
            size = size / 1024;
        }
        size = (unit === 'B' ? size : size.toFixed(pointLength || 0));
        size = parseFloat(size);//去0    
        return size + unit;
    }
    catch (e) {
        return "";
    }
};

//Common.ShowMsg = function(msg, focusObj) {
//    if (top.jDialog) {
//        top.jDialog.alert(msg, function() {
//            $(focusObj).focus(); return true;
//        }, function() {
//            $(focusObj).focus(); return true;
//        })
//    } else {
//        alert(msg);
//        $(focusObj).focus();
//    }
//};

//设置cookie
Common.setCookie = function (name, value, expiresDay, domain, path, secure) {
    if (value === null) {
        //删除cookie
        value = '';
        expiresDay = -1;
    }
    var expires = '';
    if (typeof expiresDay == 'number') {
        var date = new Date();
        //expiresDay 为过期天数
        date.setTime(date.getTime() + (expiresDay * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    var path = path ? '; path=' + path : '';
    var domain = domain ? '; domain=' + domain : '';
    var secure = secure ? '; secure' : '';
    document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
};
//获取cookie
Common.getCookie = function (name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = $.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};
//删除cookie
Common.delCookie = function (name) {
    CostUse.setCookie(name, null);
};

/*
* 方法名：format
* 作  用：格式化字符串。扩展js功能，与C#的String.format功能相同
* eg.
*   var str = format("<option value='{0}'>{1}</option>", this.Value, this.Name)
*/
Common.format = function (text) {
    if (arguments.length == 0)
        return "";
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
};

/*
* 关闭窗体：处理窗体用jDialog打开情况，兼容不用jDialog打开情况。
*/
//Common.closeWin = function() {
//    if (parent != window && parent.jDialog) {
//        var p = parent.document.getElementById("jd_iframe");
//        if (p && p.contentWindow == window) {
//            parent.jDialog.close();
//            return;
//        }
//    }
//    window.close();
//}

Common.ChangeJsonDateFormat = function (time) {
    if (time != null) {
        var date = new Date(parseInt(time.replace("/Date(", "").replace(")/", ""), 10));
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        return date.getFullYear() + "-" + month + "-" + currentDate;
    }
    return "";
}
Common.ChangeJsonDateTimeFormat = function (time) {
    if (time != null) {
        var date = new Date(parseInt(time.replace("/Date(", "").replace(")/", ""), 10));
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return date.getFullYear() + "-" + month + "-" + currentDate + "T" + hour +":" + min ;
    }
    return "";
}

//获取url传过来的参数
Common.getUrlParam = function (paramName) {
    var url = $.trim(window.location.href);
    var n = url.indexOf(paramName);
    if (n == -1) {
        return '';
    }
    var start = url.indexOf("=", n) + 1;
    if (start == 0) {
        return '';
    }
    var n2 = url.indexOf("&", start);
    var end = ((n2 == -1) ? url.length : n2);
    return $.trim(url.substring(start, end));
}

Common.IEKeyBoardInitEvent = function (deep) {
    if (browser.isIE()) {
        $('input[type=text],input[type=date],input[type=datetime],input[type=datetime-local],input[type=email],input[type=number],input[type=password],input[type=search],input[type=tel],input[type=time],input[type=url],textarea').click(function (event) {
            var _y = event.clientY;
            var source = event.target;
            var screenHeight = window.screen.height;
            try {
                if (deep && deep != '') {
                    deep = parseInt(deep);
                }
                if (deep == 0) {
                    window.external.InvokeVirtualKeyboard(_y, screenHeight, source);
                }
                else if (deep == 1) {
                    window.parent.window.external.InvokeVirtualKeyboard(_y, screenHeight, source);
                }
                else if (deep == 2) {
                    window.parent.window.parent.window.external.InvokeVirtualKeyboard(_y, screenHeight, source);
                }
            }
            catch (e) { }
        });
        $('input[type=text],input[type=date],input[type=datetime],input[type=datetime-local],input[type=email],input[type=number],input[type=password],input[type=search],input[type=tel],input[type=time],input[type=url],textarea').blur(function (event) {
            var source = event.target;
            try {
                if (deep && deep != '') {
                    deep = parseInt(deep);
                }
                if (deep == 0) {
                    window.external.HideVirtualKeyboard(source);
                }
                else if (deep == 1) {
                    window.parent.window.external.HideVirtualKeyboard(source);
                }
                else if (deep == 2) {
                    window.parent.window.parent.window.external.HideVirtualKeyboard(source);
                }
            }
            catch(e){}
        });
    }
}

/////////////////////////////////////////////////
//方法名：formatDate
//作 用 ：将时间字符串转换按照时间日期为“今天、昨天、前天”格式进行转换
//参 数 ：strDate：待转换的时间字符串，例如2015-2-25 12:35:40
//做 成 ：陈吉庐
//日 期 ：2015.2.25
/////////////////////////////////////////////////
Common.formatDate = function(strDate) {
    var str = strDate.replace(/-/g, "/");
    var date = new Date(str);
    return date.Format2();
}

//function refreshParent(execFunc) {
//    try {
//        if (parent != window && parent.jDialog) {
//            var p = parent.document.getElementById("jd_iframe");
//            if (p && p.contentWindow == window) {
//                try {
//                    if (parent.refreshContentWindow) {
//                        parent.refreshContentWindow(execFunc || "refreshList");
//                    } else {
//                        parent[execFunc || "refreshList"]();
//                    }
//                } finally {
//                    //fix ie9下 String”未定义。
//                    //  jquery错误消息: “Date”未定义，“String”未定义 
//                    //  使用setTimeout(function(){发生错误的代码},0)
//                    setTimeout(function() {
//                        parent.jDialog.close();
//                    }, 0);
//                }
//            }
//        } else if (window.opener != null) {
//            try {
//                window.opener[execFunc || "refreshList"]();
//                window.close();
//            } catch (e) { };
//        }
//    } catch (e) { };
//};


/////////////////////////////////////////////////
//方法名：getsubstr
//作 用 ：正确截取单字节和双字节混和字符串
//参 数 ：str：要截取的字符串 leng：限制的长度
//做 成 ：秦念雷
//日 期 ：2008.8.21
/////////////////////////////////////////////////
Common.getsubstr = function(str, len) {
    if (!str || !len) { return ''; }

    //预期计数：中文2字节，英文1字节 
    var a = 0;

    //循环计数 
    var i = 0;

    //临时字串 
    var temp = '';

    for (i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
            //按照预期计数增加2 
            a += 2;
        }
        else {
            a++;
        }
        //如果增加计数后长度大于限定长度，就直接返回临时字符串 
        if (a > len) { return temp; }

        //将当前内容加到临时字符串 
        temp += str.charAt(i);
    }
    //如果全部是单字节字符，就直接返回源字符串 
    return str;
}

/////////////////////////////////////////////////
//方法名：CheckByteLength
//作 用 ：校验长度
//参 数 ：str：要校验的字符串 leng：限制的长度
//做 成 ：吉晶
//日 期 ：2008.8.15
/////////////////////////////////////////////////
Common.CheckByteLength = function(objId, leng) {
    var obj = document.getElementById(objId);
    var str = obj.value;
    if (((escape(str).length - str.length) / 5 + str.length) > leng) {
        //alert("您输入的数据超过最大长度限制!");
        obj.value = this.getsubstr(str, leng);
        obj.focus();
    }
}

/*
* 超过指定的程度，设置title属性
*/
function setTitle(target, len) {
    if (target == undefined || target == '') {
        return
    }
    //set default length
    if (len == undefined || len <= 0) {
        len = 16;
    }

    var txt = target.text();
    if (txt != undefined && txt.length >= 16) {
        var subTxt = txt.substring(0, len) + "...";
        target.text(subTxt);
        target.attr("title", txt);
    }
}

Date.prototype.Format = function (formatStr) {
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];
    var currentMonth = this.getMonth() + 1;

    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

    str = str.replace(/MM/, currentMonth > 9 ? currentMonth.toString() : '0' + currentMonth);
    str = str.replace(/M/g, currentMonth);

    str = str.replace(/w|W/g, Week[this.getDay()]);

    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());

    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());

    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    str = str.replace(/s|S/g, this.getSeconds());

    return str;
}

Date.prototype.Format2 = function () {
    var str = "yyyy-MM-dd";
    var currentDate = new Date();

    if (this.getFullYear() === currentDate.getFullYear() && this.getMonth() === currentDate.getMonth())
    {
        var d = this.getDate() - currentDate.getDate();
        if (d === 0)
            str = "今天 HH:mm";
        else if (d === -1)
            str = "昨天 HH:mm";
        else if (d === -2)
            str = "前天 HH:mm";
    }

    return this.Format(str);
}

//解决js浮点数计算bug，如6500*1.1
var Float = {
    //浮点数加法运算   
    Add: function (arg1, arg2) {
        var r1, r2, m;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2))
        return (arg1 * m + arg2 * m) / m;
    },
    //浮点数减法运算   
    Sub: function (arg1, arg2) {
        var r1, r2, m, n;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2));
        //动态控制精度长度   
        n = (r1 >= r2) ? r1 : r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    },
    //浮点数乘法运算   
    Mul: function (arg1, arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try { m += s1.split(".")[1].length } catch (e) { }
        try { m += s2.split(".")[1].length } catch (e) { }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    },
    //浮点数除法运算   
    Div: function (arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
        try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
        try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
        with (Math) {
            r1 = Number(arg1.toString().replace(".", ""))
            r2 = Number(arg2.toString().replace(".", ""))
            return (r1 / r2) * pow(10, t2 - t1);
        }
    }
}



var MobileCommon = {
    oldPage: "pageHome",
    Show: function (id, historyTop) {
        var old = this.oldPage;
        if (old == id) {
            $("#" + id).removeClass("slide in").addClass("slide out").removeClass("show");
            setTimeout(function () { $("#" + id).removeClass("slide out").addClass("slide in").addClass("show"); }, 100);
        }
        else {
            $("#" + this.oldPage).removeClass("slide in").addClass("slide out").removeClass("show");
            $("#" + id).removeClass("slide out").addClass("slide in").addClass("show");
        }
        //setTimeout(function() { $("#" + old).hide().removeClass("slide out"); $("#" + id).removeClass("slide in"); }, 1000);
        //        if (id == "pageSearch") {
        //            this.oldStartDate = $("#txtStartDate").val();
        //            this.oldEndDate = $("#txtEndDate").val();
        //            this.oldTitle = $("#txtTitle").val();
        //            this.oldSystemCode = $("#ddlSystem").val();
        //            this.oldTypeCode = $("#ddlType").val();
        //            this.oldStatus = $("#ddlStatus").val();
        //            $("#backTop").hide();
        //            $('#btnGoback').show();
        //        } else if (id == "pageList") {
        //            $("#backTop").show();
        //            $('#btnGoback').hide();
        //        } else if (id == "pageOpen") {
        //            $("#backTop").hide();
        //            $('#btnGoback').show();
        //        }
        if (historyTop) {
            setTimeout(function () { $(window).scrollTop(historyTop); }, 10);
        }
        else {
            setTimeout(function () { $(window).scrollTop(0); }, 10);
        }
        this.oldPage = id;
    },
    GoToUrl: function (url, isNotAddHis) {
        if (!isNotAddHis) { this.AddHistory(); }
        document.getElementById("frmOpen").src = url;
        this.Show("pageOpen");
    },
    BackTop: function (event, obj) {
        event.stopPropagation();
        window.scrollTo(0, 0);
        //$(window).scrollTop(0);
        if (!this.isSupportFix()) {
            var clientHeight = $(window).height();
            var scrollTop = $(window).scrollTop();
            obj.style.position = "absolute";
            obj.style.top = clientHeight - 87 + scrollTop + "px";
        }
    },
    isSupportFix: function () {
        var w = window,
					ua = navigator.userAgent,
					platform = navigator.platform,
        // Rendering engine is Webkit, and capture major version
					wkmatch = ua.match(/AppleWebKit\/([0-9]+)/),
					wkversion = !!wkmatch && wkmatch[1],
					ffmatch = ua.match(/Fennec\/([0-9]+)/),
					ffversion = !!ffmatch && ffmatch[1],
					operammobilematch = ua.match(/Opera Mobi\/([0-9]+)/),
					omversion = !!operammobilematch && operammobilematch[1];
        if (
            // iOS 4.3 and older : Platform is iPhone/Pad/Touch and Webkit version is less than 534 (ios5)
					((platform.indexOf("iPhone") > -1 || platform.indexOf("iPad") > -1 || platform.indexOf("iPod") > -1) && wkversion && wkversion < 534)
					||
            // Opera Mini
					(w.operamini && ({}).toString.call(w.operamini) === "[object OperaMini]")
					||
					(operammobilematch && omversion < 7458)
					||
            //Android lte 2.1: Platform is Android and Webkit version is less than 533 (Android 2.2)
					(ua.indexOf("Android") > -1 && wkversion && wkversion < 533)
					||
            // Firefox Mobile before 6.0 -
					(ffversion && ffversion < 6)
					||
            // WebOS less than 3
					("palmGetResource" in window && wkversion && wkversion < 534)
					||
            // MeeGo
					(ua.indexOf("MeeGo") > -1 && ua.indexOf("NokiaBrowser/8.5.0") > -1)
					||
					(ua.indexOf("IEMobile/9.0") > -1)
				) {
            return false;
        }

        return true;
    }
}
/* 提示消息类 */
var MessageTip = {
    _getElem: function () {
        if ($("#msgtipdiv").length == 0) {
            $('<div id="msgtipdiv"></div> ').appendTo(document.body);
        }
        return $("#msgtipdiv");
        //return $(WebMail.topWin.document.getElementById("msgtipdiv"));
    },
    _timer: null,
    _timerscale:null,
    //清除计时器
    _clearTimer: function () {
        if (this._timerscale) {
            clearTimeout(this._timerscale);
            this._timerscale = null;
        }
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }       
    },
    //显示信息
    info: function (msg) {
        this._getElem().html('<span class="info">' + msg + '</span>').show();
        return this;
    },
    //成功
    success: function (msg) {
        this._getElem().html('<span class="succmsg">' + msg + '</span>').show();
        return this;
    },
    //错误
    error: function (msg) {
        this._getElem().html('<span class="errmsg">' + msg + '</span>').show();
        return this;
    },
    //隐藏
    hide: function (dlay) {
        var _this = this, dlay = dlay || 2500;
        this._clearTimer();
        if (dlay > 1000) {
            this._timerscale = setTimeout(function () {
                _this._getElem().addClass("scale");
            }, 1000);
        }
        this._timer = setTimeout(function () {
            _this._getElem().removeClass("scale");
            _this._getElem().hide();
        }, dlay);
    },
    _tip_timer: null,
    tip: function (msg, cssClass, delay) {
        delay = delay || 2500;
        if (!cssClass)
            cssClass = "info";
        if (this._tip_timer) {
            window.clearTimeout(this._tip_timer);
        }
        $("#mail_msgtip").remove();
        var msgtip = $('<div id="msgtipdiv"><span class="' + cssClass + '">' + msg + '</span></div> ').appendTo(document.body);
        msgtip.show();
        this._tip_timer = window.setTimeout(function () {
            var t = msgtip.position().top - $(document).scrollTop();
            msgtip.css("top", t).animate({ top: (t - 150) }, 1000, function () {
                msgtip.remove(); // msgtip.hide();
                this._tip_timer = null;
            });
        }, delay);
    }
};

//var CursorSelection = {
//    get: function () {
//        //if (window.getSelection) {
//            return window.getSelection().getRangeAt(0);
//        //}
//        //else if (document.selection) {//低版本IE
//        //    return document.selection.createRange();
//        //}
//    },
//    set: function (id, range) {
//        document.getElementById(id).focus();
//        if (range) {
//            //if (window.getSelection) {
//            //window.getSelection().addRange(range);
//            range.moveStart('character');
//            //}
//            //else if (document.selection){
//            //    range.select();
//            //}
//        }
//        document.getElementById(id).focus();
//    },
//    addEle: function (ele) {
//        var s = window.getSelection();
//        var r = s.getRangeAt(0);
//        r.insertNode(ele);
//        s.addRange(r);
//        //ie9以下是是range.pasteHTML(html)
//    }
//}

//浏览器判断
var Browser = {
    
}

var BrowserType = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return { //移动终端浏览器版本信息 
            trident: u.indexOf('Trident') > -1, //IE内核 
            presto: u.indexOf('Presto') > -1, //opera内核 
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核 
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核 
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端 
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端 
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器 
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器 
            iPad: u.indexOf('iPad') > -1, //是否iPad 
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部 
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase(),
    isIE: function () {
        return ("ActiveXObject" in window);
    },
    isSmallScreen: function () {
        return ($(window).width() <= 767);
        //return (Math.min(screen.height, screen.width) <= 767)//方便在电脑测试，临时修改
    },
    isIpad: function () { return navigator.userAgent.toLowerCase().match(/ipad/i) == "ipad"; },
    isIphone: function () { return navigator.userAgent.toLowerCase().match(/iphone os/i) == "iphone os"; },
    isAndroid: navigator.userAgent.toLowerCase().match(/android/i) == "android",
    isWindowsMobile: function () { return navigator.userAgent.toLowerCase().match(/windows mobile/i) == "windows mobile"; },
    isIOS: navigator.userAgent.match(/iPhone|iPad/i),
    //是否手机
    isMobile: function () {
        return navigator.userAgent.match(/Mobile|iPhone|iPad|Android/i) || Math.min(screen.height, screen.width) <= 480;
        //return this.isIpad() || this.isIphone() || this.isAndroid() || this.isWindowsMobile();
    },
    isBadAndroid: /Android /.test(window.navigator.appVersion) && !(/Chrome\/\d/.test(window.navigator.appVersion)),
    androidVersion: navigator.userAgent.substr(navigator.userAgent.toLowerCase().indexOf('android') + 8, 3)
}

function getProps(obj) {
    var names = "";
    for (var name in obj) {
        names += name + ":" + obj[name] + ",";
    }
    return names;
}