!function(window, $) {
    var Translate = {};
    Translate.VERSION = "1.0.2", Translate._dict = null;
    var _current = null, _locale = null, _fallbackLocale = null, _slice = Array.prototype.slice;
    Translate.load = function(dict, callback) {
        if ("string" == typeof dict) {
            var onLoaded = function(data) {
                Translate.load(data), callback && callback();
            };
            $.get(dict, onLoaded, "json");
        } else null !== _dict ? $.extend(_dict, dict) : _dict = dict, refresh();
        return Translate;
    }, Translate.autoDetect = function() {
        var lang = window.navigator.userLanguage || window.navigator.language;
        return _locale = [ lang, lang.substr(0, 2) ], refresh(), _locale;
    }, Object.defineProperty(Translate, "fallbackLocale", {
        set: function() {
            _fallbackLocale = fallbackLocale, refresh();
        },
        get: function() {
            return _fallbackLocale;
        }
    }), Object.defineProperty(Translate, "locale", {
        set: function(locale) {
            _locale = locale, refresh();
        },
        get: function() {
            return _locale;
        }
    });
    var refresh = function() {
        if (_locale && _dict) {
            _current = {};
            var locale = "string" == typeof _locale ? [ _locale ] : _locale;
            _fallbackLocale && locale.push(_fallbackLocale);
            for (var i = locale.length - 1; i >= 0; i--) {
                var lang = locale[i];
                $.extend(_current, _dict[lang] || {});
            }
        }
    }, translateString = function(key) {
        if (!_current) throw "Must call Translate.load() before getting the translation";
        if (!_current.hasOwnProperty(key)) throw "No translation string found matching '" + key + "'";
        return str = _current[key], args = _slice.call(arguments), args[0] = key, printf.apply(null, args);
    }, translateFile = function(file) {
        if (!_locale) return file;
        var lang = $.isArray(_locale) ? _locale[0] : _locale, index = file.lastIndexOf(".");
        return file.substring(0, index) + "_" + lang + file.substring(index, file.length);
    }, printf = function(str, args) {
        return arguments.length < 2 ? str : (args = $.isArray(args) ? args : _slice.call(arguments, 1), 
        str.replace(/([^%]|^)%(?:(\d+)\$)?s/g, function(p0, p, position) {
            return position ? p + args[parseInt(position) - 1] : p + args.shift();
        }).replace(/%%s/g, "%s"));
    };
    $.fn._t = function() {
        return $(this).html(translateString.apply(null, arguments));
    }, window._t = translateString, window._f = translateFile, namespace("cloudkid").Translate = Translate;
}(window, jQuery);