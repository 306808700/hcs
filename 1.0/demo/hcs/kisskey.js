/**
 * @fileoverview 
 * @author 晨辰<cc.ccking@gmail.com>
 * @module KissKey
 **/
KISSY.add('KissKey', function(S){
    var E = S.Event,
        D = S.DOM;

    function KissKey(){

    }
    KissKey.prototype = {
        // 特殊按键的 keycode
        specialKeys: {
            'backspace': 8,
            'tab': 9,
            'enter': 13,
            'pause': 19,
            'capslock': 20,
            'esc': 27,
            'space': 32,
            'pageup': 33,
            'pagedown': 34,
            'end': 35,
            'home': 36,
            'left': 37,
            'up': 38,
            'right': 39,
            'down': 40,
            'insert': 45,
            'delete': 46,
            'f1': 112,
            'f2': 113,
            'f3': 114,
            'f4': 115,
            'f5': 116,
            'f6': 117,
            'f7': 118,
            'f8': 119,
            'f9': 120,
            'f10': 121,
            'f11': 122,
            'f12': 123,
            '?': [191,111], //小键盘上的 /
            // 'minus': S.UA.opera ? [109, 45] : S.UA.firefox ? 109 : [189, 109],
            // 'plus': S.UA.opera ? [61, 43] : S.UA.firefox ? [61, 107] : [187, 107]
            'minus': [189, 109], //小键盘 109
            'plus': [187, 107], //小键盘 107
            'semi': S.UA.firefox ? 59 : 186 ,//分号 ;
            'comma': 188,//逗号 ,
            'dot': [190,110],//句号 .小键盘 110
            'quot': 222, //引号 '
            '[':219,
            ']':221,
            '\\':220,
            '`':192,
            // 小键盘
            'num0':96,
            'num1':97,
            'num2':98,
            'num3':99,
            'num4':100,
            'num5':101,
            'num6':102,
            'num7':103,
            'num8':104,
            'num9':105,
            '*':106

        },

        // 快捷键 list
        shortcutList : {},

        // 可用快捷键 list 
        activeShortcutList: {},

        // 存储按下瞬间的key. Key - key的ASCII码 
        pressedKey: {},

        isStarted : false,

        getKey: function(type, shortcutKeysObj) {
            var key = type;

            if (shortcutKeysObj.ctrl) { key += '_ctrl'; }
            if (shortcutKeysObj.alt) { key += '_alt'; }
            if (shortcutKeysObj.shift) { key += '_shift'; }

            // 生成组合键
            var createKeys = function(key, which) {
                if (which && which !== 16 && which !== 17 && which !== 18) { key += '_' + which; }
                return key;
            };

            if (S.isArray(shortcutKeysObj.which)) {
                var keys = [];
                S.each(shortcutKeysObj.which, function(which) {
                    keys.push(createKeys(key, which));
                });
                return keys;
            } else {
                return createKeys(key, shortcutKeysObj.which);
            }
        },

        getshortcutKeysObject: function(shortcutKeys) {
            var self = this,
                obj = {},
                items = shortcutKeys.split('+');

            S.each(items, function(item) {
                if (item === 'ctrl' || item === 'alt' || item === 'shift') {
                    obj[item] = true;
                } else {
                    obj.which = self.specialKeys[item] || item.toUpperCase().charCodeAt();
                }
            });

            return obj;
        },

        checkIsInput: function(target) {
            var name = target.tagName.toLowerCase();
            var type = target.type;
            return (name === 'input' && S.inArray(type, ['text', 'password', 'file', 'search']) > -1) || name === 'textarea';
        },

        run: function(type, e) {
            if (!this.activeShortcutList) { return; }

            var self = this,
                shortcutKeysObj = {
                    ctrl: e.ctrlKey,
                    alt: e.altKey,
                    shift: e.shiftKey,
                    which: e.which
                };

            var key = self.getKey(type, shortcutKeysObj);
            // 从activeShortcutList 获取快捷键
            var shortcuts = self.activeShortcutList[key]; 

            if (!shortcuts) { return; }

            var isInput = self.checkIsInput(e.target);
            var isPrevented = false;

            S.each(shortcuts, function(shortcut) {
                // 判断input textarea 这些输入框中是否可用快捷键函数
                if (!isInput || shortcut.enableInInput) {
                    if (!isPrevented) {
                        e.preventDefault();
                        isPrevented = true;
                    }
                    // 执行回调函数
                    shortcut.callback(e); 
                }
            });
        },

        
        // 快捷键list 开始生效
        // @param {String} list的名字  默认default  主要用在remove时方便  //TODO
         
        start: function(list) {
            var self = this;

            list = list || 'default';
            // shortcutList --> activeShortcutList.
            self.activeShortcutList = self.shortcutList[list]; 

            // 只绑定一次回调函数
            if (self.isStarted) { return; } 

            E.on(document, 'keydown', function(e) {
                // a-z keydown keyup 是: 65-90 
                // a-z keypress 是 97-122.
                if (e.type === 'keypress' && e.which >= 97 && e.which <= 122) {
                    e.which = e.which - 32;
                }
                if (!self.pressedKey[e.which]) {
                    self.run('down', e);
                }
                self.pressedKey[e.which] = true;
                self.run('hold', e);
            });

            E.on(document, 'keyup', function(e) {
                self.pressedKey[e.which] = false;
                self.run('up', e);
            });

            self.isStarted = true;

            return this;
        },

        // 停止响应快捷键
        stop: function() {
            E.detach(document, 'keypress keydown keyup');
            this.isStarted = false;
            return this;
        },

        /**
         * 添加快捷键
         * @param {Object}   params         快捷键参数对象
         * @param {String}  [params.type]   回调函数运行方式
         *     可用值:
         *     down – keydown (default)
         *     up   – keyup
         *     hold – 按下并且不松开.按下时会立即出发回调函数,并且一直重复直到keyup
         * 
         * @param {String}   params.shortcutKeys    快捷键的组合
         *     各个按键由 "+" 号组合 大小写不敏感
         *     比如: 'shift+1', 'pageDown', 'Alt+up', 'Ctrl+Enter'
         * 
         * @param {Function} params.callback 回调函数
         * @param {String}  [params.list]   自己定义一个快捷键的list 比如  shortcutKeys: '1,3,5,7',  1 3 5 7都会执行同一个回调
         *
         * @param {Boolean} [params.enableInInput] 
         *                  在input textarea 这些输入框中是否可用快捷键函数,默认不可用,可以正常输入  //不完善 @TODO
         */
        add: function(params) {
            if (!params.shortcutKeys) { throw new Error("add: required parameter 'params.shortcutKeys' is undefined."); }
            if (!params.callback) { throw new Error("add: required parameter 'params.callback' is undefined."); }

            var self = this;
            var type = params.type || 'down';
            var listNames = params.list ? params.list.replace(/\s+/g, '').split(',') : ['default'];

            S.each(listNames, function(name) {
                if (!self.shortcutList[name]) { self.shortcutList[name] = {}; }
                var list = self.shortcutList[name];
                var shortcutKeyss = params.shortcutKeys.toLowerCase().replace(/\s+/g, '').split(',');

                S.each(shortcutKeyss, function(shortcutKeys) {
                    var shortcutKeysObj = self.getshortcutKeysObject(shortcutKeys);
                    var keys = self.getKey(type, shortcutKeysObj);
                    if (!S.isArray(keys)) { keys = [keys]; }
        
                    S.each(keys, function(key) {
                        if (!list[key]) { list[key] = []; }
                        list[key].push(params);
                    });
                });
            });

            return this;
        },

        /**
         * 移除快捷键
         * @param {Object}  params       
         * @param {String} [params.type] 默认 'down'
         * @param {String}  params.shortcutKeys  组合键
         * @param {String} [params.list] 要移除的list  默认 'default'
         */
        remove: function(params) {
            if (!params.shortcutKeys) { throw new Error("remove: required parameter 'params.shortcutKeys' is undefined."); }

            var self = this;
            var type = params.type || 'down';
            var listNames = params.list ? params.list.replace(/\s+/g, '').split(',') : ['default'];

            S.each(listNames, function(name) {
                if (!self.shortcutList[name]) { return true; }
                var shortcutKeyss = params.shortcutKeys.toLowerCase().replace(/\s+/g, '').split(',');

                S.each(shortcutKeyss, function(shortcutKeys) {
                    var shortcutKeysObj = self.getshortcutKeysObject(shortcutKeys);
                    var keys = self.getKey(type, shortcutKeysObj);
                    if (!S.isArray(keys)) { keys = [keys]; }

                    S.each(keys, function(key) {
                        delete self.shortcutList[name][key];
                    });
                });
            });

            return this;
        }

    }

    return KissKey;
});



