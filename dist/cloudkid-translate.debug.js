!function(window, $, undefined) {
    var Translate = {}, _dict = null, _current = null, _locale = null, _slice = Array.prototype.slice;
    Translate.load = function(dict, locale) {
        null !== _dict ? $.extend(_dict, dict) : _dict = dict, locale !== undefined ? (_locale = locale, 
        Translate._refresh()) : Translate.autoDetect();
    }, Translate.autoDetect = function() {
        var lang = window.navigator.userLanguage || window.navigator.language;
        return _locale = [ lang, lang.substr(0, 2) ], Translate._refresh(), _locale;
    }, Object.defineProperty(Translate, "locale", {
        set: function(locale) {
            _locale = locale, Translate._refresh();
        },
        get: function() {
            return _locale;
        }
    }), Translate._refresh = function() {
        _current = {};
        for (var locale = "string" == typeof _locale ? [ _locale ] : _locale, i = locale.length - 1; i >= 0; i--) {
            var lang = locale[i];
            $.extend(_current, _dict[lang] || {});
        }
    }, Translate._ = function(str) {
        return _current && _current.hasOwnProperty(str) && (str = _current[str]), args = _slice.call(arguments), 
        args[0] = str, printf.apply(null, args);
    };
    var printf = function(str, args) {
        return arguments.length < 2 ? str : (args = $.isArray(args) ? args : _slice.call(arguments, 1), 
        str.replace(/([^%]|^)%(?:(\d+)\$)?s/g, function(p0, p, position) {
            return position ? p + args[parseInt(position) - 1] : p + args.shift();
        }).replace(/%%s/g, "%s"));
    };
    $.fn._t = function() {
        return $(this).html(Translate._.apply(null, arguments));
    }, window._t = Translate._, namespace("cloudkid").Translate = Translate;
}(window, jQuery);