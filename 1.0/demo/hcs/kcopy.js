/**
 * @fileoverview 请修改组件描述
 * @author Letao<mailzwj@126.com>
 * @module kcopy
 **/
KISSY.add(function (S, Node,Base) {
    var EMPTY = '';
    var $ = Node.all;
    var E = S.Event, D = S.DOM;
    /**
     * 请修改组件描述
     * @class Kcopy
     * @constructor
     * @extends Base
     */

    var _camelizeCssPropName = function() {
        var matcherRegex = /\-([a-z])/g, replacerFn = function(match, group) {
            return group.toUpperCase();
        };
        return function(prop) {
            return prop.replace(matcherRegex, replacerFn);
        };
    }();

    var _getZoomFactor = function() {
        var rect, physicalWidth, logicalWidth, zoomFactor = 1;
        if (typeof document.body.getBoundingClientRect === "function") {
            rect = document.body.getBoundingClientRect();
            physicalWidth = rect.right - rect.left;
            logicalWidth = S.one("body").outerWidth();
            zoomFactor = Math.round(physicalWidth / logicalWidth * 100) / 100;
        }
        return zoomFactor;
    };

    var _getDOMObjectPosition = function(obj) {
        var info = {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            zIndex: 999999999
        };
        var objCopy = S.one(obj);
        obj = obj[0];
        var doc = S.one(document);
        var zi = objCopy.css("zIndex");
        if (zi && zi !== "auto") {
            info.zIndex = parseInt(zi, 10);
        }
        if (obj.getBoundingClientRect) {
            var rect = obj.getBoundingClientRect();
            var pageXOffset, pageYOffset, zoomFactor;
            if ("pageXOffset" in window && "pageYOffset" in window) {
                pageXOffset = window.pageXOffset;
                pageYOffset = window.pageYOffset;
            } else {
                zoomFactor = _getZoomFactor();
                pageXOffset = Math.round(doc.scrollLeft() / zoomFactor);
                pageYOffset = Math.round(doc.scrollTop() / zoomFactor);
            }
            var leftBorderWidth = document.documentElement.clientLeft || 0;
            var topBorderWidth = document.documentElement.clientTop || 0;
            info.left = rect.left + pageXOffset - leftBorderWidth;
            info.top = rect.top + pageYOffset - topBorderWidth;
            info.width = "width" in rect ? rect.width : rect.right - rect.left;
            info.height = "height" in rect ? rect.height : rect.bottom - rect.top;
        }
        return info;
    };

    var _noCache = function(path, options) {
        var useNoCache = !(options && options.useNoCache === false);
        if (useNoCache) {
            return (path.indexOf("?") === -1 ? "?" : "&") + "nocache=" + new Date().getTime();
        } else {
            return "";
        }
    };

    var _vars = function(options) {
        var str = [];
        var origins = [];
        if (options.trustedOrigins) {
            if (typeof options.trustedOrigins === "string") {
                origins = origins.push(options.trustedOrigins);
            } else if (typeof options.trustedOrigins === "object" && "length" in options.trustedOrigins) {
                origins = origins.concat(options.trustedOrigins);
            }
        }
        if (options.trustedDomains) {
            if (typeof options.trustedDomains === "string") {
                origins = origins.push(options.trustedDomains);
            } else if (typeof options.trustedDomains === "object" && "length" in options.trustedDomains) {
                origins = origins.concat(options.trustedDomains);
            }
        }
        if (origins.length) {
            str.push("trustedOrigins=" + encodeURIComponent(origins.join(",")));
        }
        if (typeof options.amdModuleId === "string" && options.amdModuleId) {
            str.push("amdModuleId=" + encodeURIComponent(options.amdModuleId));
        }
        if (typeof options.cjsModuleId === "string" && options.cjsModuleId) {
            str.push("cjsModuleId=" + encodeURIComponent(options.cjsModuleId));
        }
        return str.join("&");
    };

    var _prepGlue = function(elements) {
        if (typeof elements === "string") {
            throw new TypeError("Kcopy doesn't accept query strings.");
        }
        if (!elements.length) {
            return [ elements ];
        }
        return elements;
    };

    var _dispatchCallback = function(func, element, instance, args, async) {
        if (async) {
            setTimeout(function() {
                func.call(element, instance, args);
            }, 0);
        } else {
            func.call(element, instance, args);
        }
    };

    var _defaults = {
        moviePath: "ZeroClipboard.swf",
        trustedOrigins: null,
        text: null,
        hoverClass: "kcopy-is-hover",
        activeClass: "kcopy-is-active",
        allowScriptAccess: "sameDomain",
        useNoCache: true,
        forceHandCursor: false
    };

    var _amdModuleId = null;
    var _cjsModuleId = null;
    var _bridge = function() {
        var client = Kcopy.prototype._singleton;
        var container = S.one("#global-kcopy-html-bridge");
        if (!container) {
            var opts = {};
            opts = S.merge(opts, client.options);
            opts.amdModuleId = _amdModuleId;
            opts.cjsModuleId = _cjsModuleId;
            var flashvars = _vars(opts);
            var html = '      <object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="global-kcopy-flash-bridge" width="100%" height="100%">         <param name="movie" value="' + client.options.moviePath + _noCache(client.options.moviePath, client.options) + '"/>         <param name="allowScriptAccess" value="' + client.options.allowScriptAccess + '"/>         <param name="scale" value="exactfit"/>         <param name="loop" value="false"/>         <param name="menu" value="false"/>         <param name="quality" value="best" />         <param name="bgcolor" value="#ffffff"/>         <param name="wmode" value="transparent"/>         <param name="flashvars" value="' + flashvars + '"/>         <embed src="' + client.options.moviePath + _noCache(client.options.moviePath, client.options) + '"           loop="false" menu="false"           quality="best" bgcolor="#ffffff"           width="100%" height="100%"           name="global-kcopy-flash-bridge"           allowScriptAccess="always"           allowFullScreen="false"           type="application/x-shockwave-flash"           wmode="transparent"           pluginspage="http://www.macromedia.com/go/getflashplayer"           flashvars="' + flashvars + '"           scale="exactfit">         </embed>       </object>';
            container = S.one("<div>");
            container.attr("id", "global-kcopy-html-bridge");
            container.attr("class", "global-kcopy-container");
            container.attr("data-clipboard-ready", false);
            container.css({
                position: "absolute",
                left: "-9999px",
                top: "-9999px",
                width: "15px",
                height: "15px",
                zIndex: "9999"
            });
            container.html(html);
            S.one("body").append(container);
        }
        client.htmlBridge = container[0];
        client.flashBridge = document["global-kcopy-flash-bridge"] || container.children()[0].lastElementChild;
    };

    var _elementMouseOver = function(event) {
        if (!Kcopy.prototype._singleton) {
            return;
        }
        if (!event) {
            event = window.event;
        }
        var target;
        if (this !== window) {
            target = this;
        } else if (event.target) {
            target = event.target;
        } else if (event.srcElement) {
            target = event.srcElement;
        }
        Kcopy.prototype._singleton.setCurrent(target);
    };

    var _setHandCursor = function(enabled) {
        if (this.ready()) {
            this.flashBridge.setHandCursor(enabled);
        }
    };

    var _dispatchCallback = function(func, element, instance, args, async) {
        if (async) {
            setTimeout(function() {
                func.call(element, instance, args);
            }, 0);
        } else {
            func.call(element, instance, args);
        }
    };

    var currentElement, gluedElements = [];
    function Kcopy(element, options) {
        var self = this;
        // self.element = S.one(element);
        if (element) {
            (Kcopy.prototype._singleton || self).glue(S.one(element));
        }
        if (Kcopy.prototype._singleton) {
            return Kcopy.prototype._singleton;
        }
        Kcopy.prototype._singleton = self;
        self.options = {};
        self.options = S.merge(self.options, _defaults, options);
        this.handlers = {};
        if (Kcopy.detectFlashSupport()) {
            _bridge();
        }
        //调用父类构造函数
        Kcopy.superclass.constructor.call(self, options);
    }

    Kcopy.version = "1.0.0";

    Kcopy.detectFlashSupport = function() {
        var hasFlash = false;
        if (typeof ActiveXObject === "function") {
            try {
                if (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) {
                    hasFlash = true;
                }
            } catch (error) {}
        }
        if (!hasFlash && navigator.mimeTypes["application/x-shockwave-flash"]) {
            hasFlash = true;
        }
        return hasFlash;
    };

    Kcopy.dispatch = function(eventName, args) {
        Kcopy.prototype._singleton.receiveEvent(eventName, args);
    };

    Kcopy.setDefaults = function(options) {
        _defaults = S.merge(_defaults, options);
    };

    Kcopy.destroy = function() {
        Kcopy.prototype._singleton.unglue(gluedElements);
        var bridge = Kcopy.prototype._singleton.htmlBridge;
        S.one(bridge).remove();
        delete Kcopy.prototype._singleton;
    };

    S.extend(Kcopy, Base, /** @lends Kcopy.prototype*/{
        resetBridge: function() {
            var hb = S.one(this.htmlBridge)
            hb.css({
                left: "-9999px",
                top: "-9999px"
            });
            hb.removeAttr("title");
            hb.removeAttr("data-clipboard-text");
            S.one(currentElement).removeClass(this.options.activeClass);
            currentElement = null;
            this.options.text = null;
            return this;
        },
        glue: function(ele) {
            elements = _prepGlue(ele);
            S.each(elements, function(ele, i){
                if (S.indexOf(ele, gluedElements) === -1) {
                    gluedElements.push(ele);
                    E.on(ele, "mouseover", _elementMouseOver);
                }
            });
            return this;
        },
        setCurrent: function(ele) {
            ele = S.one(ele);
            currentElement = ele;
            this.reposition();
            var titleAttr = ele.attr("title");
            if (titleAttr) {
                this.setTitle(titleAttr);
            }
            var useHandCursor = this.options.forceHandCursor === true || ele.css("cursor") === "pointer";
            _setHandCursor.call(this, useHandCursor);
            return this;
        },
        reposition: function() {
            if (!currentElement) return false;
            var pos = _getDOMObjectPosition(currentElement);
            var hb = S.one(this.htmlBridge);
            hb.css({
                top: pos.top,
                left: pos.left,
                width: pos.width,
                height: pos.height,
                zIndex: pos.zIndex + 1
            });
            this.setSize(pos.width, pos.height);
            return this;
        },
        setSize: function(width, height) {
            if (this.ready()) {
                this.flashBridge.setSize(width, height);
            }
            return this;
        },
        ready: function() {
            var ready = S.one(this.htmlBridge).attr("data-clipboard-ready");
            return ready === "true" || ready === true;
        },
        setTitle: function(newTitle) {
            if (newTitle && newTitle !== "") {
                S.one(this.htmlBridge).attr("title", newTitle);
            }
            return this;
        },
        setText: function(newText) {
            if (newText && newText !== "") {
                this.options.text = newText;
                if (this.ready()) {
                    this.flashBridge.setText(newText);
                }
            }
            return this;
        },
        on: function(eventName, func) {
            var events = eventName.toString().split(/\s/g);
            for (var i = 0; i < events.length; i++) {
                eventName = events[i].toLowerCase().replace(/^on/, "");
                if (!this.handlers[eventName]) {
                    this.handlers[eventName] = func;
                }
            }
            if (this.handlers.noflash && !Kcopy.detectFlashSupport()) {
                this.receiveEvent("onNoFlash", null);
            }
            return this;
        },
        off: function(eventName, func) {
            var events = eventName.toString().split(/\s/g);
            for (var i = 0; i < events.length; i++) {
                eventName = events[i].toLowerCase().replace(/^on/, "");
                for (var event in this.handlers) {
                    if (event === eventName && this.handlers[event] === func) {
                        delete this.handlers[event];
                    }
                }
            }
            return this;
        },
        receiveEvent: function(eventName, args) {
            eventName = eventName.toString().toLowerCase().replace(/^on/, "");
            var element = S.one(currentElement);
            var performCallbackAsync = true;
            switch (eventName) {
                case "load":
                    if (args && parseFloat(args.flashVersion.replace(",", ".").replace(/[^0-9\.]/gi, "")) < 10) {
                        this.receiveEvent("onWrongFlash", {
                            flashVersion: args.flashVersion
                        });
                        return;
                    }
                    S.one(this.htmlBridge).attr("data-clipboard-ready", true);
                break;

                case "mouseover":
                    element.addClass(this.options.hoverClass);
                    break;

                case "mouseout":
                    element.removeClass(this.options.hoverClass);
                    this.resetBridge();
                    break;

                case "mousedown":
                    element.addClass(this.options.activeClass);
                    break;

                case "mouseup":
                    element.removeClass(this.options.activeClass);
                    break;

                case "datarequested":
                    var targetId = element.attr("data-clipboard-target"), targetEl = !targetId ? null : S.one("#" + targetId);
                    if (targetEl) {
                        var textContent = targetEl.val() || targetEl.textContent || targetEl.text();
                        if (textContent) {
                            this.setText(textContent);
                        }
                    } else {
                        var defaultText = element.attr("data-clipboard-text");
                        if (defaultText) {
                            this.setText(defaultText);
                        }
                    }
                    performCallbackAsync = false;
                    break;

                case "complete":
                    this.options.text = null;
                    break;
            }
            if (this.handlers[eventName]) {
                var func = this.handlers[eventName];
                if (typeof func === "string" && typeof window[func] === "function") {
                    func = window[func];
                }
                if (typeof func === "function") {
                    _dispatchCallback(func, element, this, args, performCallbackAsync);
                }
            }
        },
        unglue: function(elements) {
            elements = _prepGlue(elements);
            S.each(elements, function(ele, i){
                E.detach(ele, "mouseover", _elementMouseOver);
                var arrayIndex = S.indexOf(ele, gluedElements);
                if (arrayIndex != -1) {
                    gluedElements.splice(arrayIndex, 1);
                }
            });
            return this;
        },
        setHandCursor: function(enabled) {
            enabled = typeof enabled === "boolean" ? enabled : !!enabled;
            _setHandCursor.call(this, enabled);
            this.options.forceHandCursor = enabled;
            return this;
        }
    }, {ATTRS : /** @lends Kcopy*/{

    }});
    
    Kcopy.prototype.addEventListener = Kcopy.prototype.on;
    Kcopy.prototype.removeEventListener = Kcopy.prototype.off;

    window.ZeroClipboard = Kcopy;
    return Kcopy;
}, {requires:['node', 'base']});


