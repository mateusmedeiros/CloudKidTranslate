/**
*  @module cloudkid
*/
(function(window, $, undefined){

	/**
	*  Internationalization/translation object with convenient jquery plugin
	*  @class Translate
	*  @static
	*/
	var Translate = {};

	/**
	*  The full language dictionary containing all languages as keys
	*  @property {object} _dict
	*  @private
	*/
	var _dict = null;

	/**
	*  The current set of translations to use
	*  @property {object} _current
	*  @private
	*/
	var _current = null;

	/**
	*  The currently selected locale
	*  @property {String|Array} _locale
	*  @private
	*/
	var _locale = null;

	/**
	*  Reference to the slice method
	*  @property {function} _slice
	*  @private
	*/
	var _slice = Array.prototype.slice;

	/**
	*  Load the full dictionary containing all translations
	*  @method load
	*  @static
	*  @property {object} dict The dictionary of all files
	*  @property {String|Array} [locale] The single ISO-639-1 code to use or a 
	*     collection of locale in order of preference (e.g. "en_US", "en", "dev")
	*     where "en" then "dev" is the fallback if "en_US" doesn't exist.
	*     If not locale is set, we fallback to using the language as defined
	*     by the window.navigator object (e.g. "en-US" => ["en_US", "en"])
	*/
	Translate.load = function(dict, locale)
	{
		if (_dict !== null)
		{
			$.extend(_dict, dict);
		} 
		else 
		{
			_dict = dict;
		}
		if (locale !== undefined)
		{
			_locale = locale;
			Translate._refresh();
		}
		else
		{
			Translate.autoDetect();
		}
	};

	/**
	*  Auto detect the locale based on the window navigator object
	*  @method autoDetect
	*  @return {Array} The new locale selected
	*/
	Translate.autoDetect = function()
	{
		var lang = (window.navigator.userLanguage || window.navigator.language);
		_locale = [lang, lang.substr(0,2)];

		Translate._refresh();

		return _locale;
	};

	/**
	*  The current ISO-639-1 two-letter language locale
	*  @property {String|Array} locale ISO-639-1 two-letter locale
	*  @static
	*/
	Object.defineProperty(Translate, "locale", 
	{
		set: function(locale)
		{
			_locale = locale;
			Translate._refresh();
		},
		get: function()
		{
			return _locale;
		}
	});

	/**
	*  Rebuild the current dictionary of translations to use
	*  @method _refresh
	*  @static
	*  @private
	*/
	Translate._refresh = function()
	{
		_current = {};

		// Select the locale
		var locale = (typeof _locale == "string") ? [_locales] : _locales;

		// Add the locale starting at the end first
		for (var i = locale.length - 1; i >= 0; i--)
		{
			var lang = locale[i];
			$.extend(_current, _dict[lang] || {});
		}
	};

	/**
	*  Looks the given string up in the dictionary and returns the translation if
	*  one exists. If a translation is not found, returns the original word.
	*  @method _
	*  @static
	*  @param {string} str The string to translate.
	*  @param {object} params.. params for using printf() on the string.
	*  @return {string} Translated word.
	*/
	Translate._ = function(str)
	{
		if (_current && _current.hasOwnProperty(str))
		{
			str = _current[str];
		}

		args = _slice.call(arguments);
		args[0] = str;

		// Substitute any params
		return printf.apply(null, args);
	};

	/**
	*  Substitutes %s with parameters given in list. %%s is used to escape %s.
	*
	*  @param {string} str String to perform printf on.
	*  @param {string} args	Array of arguments for printf.
	*
	*  @return {string} Substituted string
	*/
	var printf = function(str, args)
	{
		if (arguments.length < 2) return str;
		args = $.isArray(args) ? args : _slice.call(arguments, 1);

		return str.replace(
			/([^%]|^)%(?:(\d+)\$)?s/g, 
			function(p0, p, position)
			{
				if (position)
				{
					return p + args[parseInt(position)-1];
				}
				return p + args.shift();
			}
		).replace(/%%s/g, '%s');
	};

	/**
	*  Allows you to translate a jQuery selector.
	*
	*	$('h1')._t('some text')
	*
	*  @method $.fn._t
	*  @param {string} str The string to translate .
	*  @param {mixed} [params] Params for using printf() on the string.
	*  @return {element} Chained and translated element(s).
	*/
	$.fn._t = function(str, params)
	{
		return $(this).html(Translate._.apply(null, arguments));
	};

	/**
	*  Global access to the translate method
	*  @method window._t
	*  @static
	*  @param {string} str The string to translate.
	*  @param {object} params.. params for using printf() on the string.
	*  @return {string} Translated word.
	*/
	window._t = Translate._;

	// Assign to namespace
	namespace('cloudkid').Translate = Translate;

})(window, jQuery);