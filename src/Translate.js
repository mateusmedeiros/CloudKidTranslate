/**
*  @module cloudkid
*/
(function(window, $){

	/**
	*  Internationalization/translation object with convenient jquery plugin
	*  @class Translate
	*  @static
	*/
	var Translate = {};

	/**
	*  The current version of the plugin
	*  @class VERSION
	*  @static
	*  @readOnly
	*/
	Translate.VERSION = "${version}";

	/**
	*  The full language dictionary containing all languages as keys
	*  @property {object} _dict
	*  @private
	*  @static
	*/
	var _dict = null,

	/**
	*  The current set of translations to use
	*  @property {object} _current
	*  @private
	*  @static
	*/
	_current = null,

	/**
	*  The currently selected locale
	*  @property {String|Array} _locale
	*  @private
	*  @static
	*/
	_locale = null,

	/**
	*  The fallback locale if no translation is found
	*  @property {String} _fallbackLocale
	*  @private
	*  @static
	*/
	_fallbackLocale = null,

	/**
	*  Reference to the slice method
	*  @property {function} _slice
	*  @private
	*  @static
	*/
	_slice = Array.prototype.slice;

	/**
	*  Load the full dictionary containing all translations, this can also be used to load
	*  separate JSON files which contain the translation. Each JSON file must contain a key
	*  matching the locale which to use;
	*
	*	// Load using JSON
	*	Translate.load("lang.json", function(){ 
	*		// Finished loading
	*	});
	*	
	*	// or load the object directly
	*	var dict = {
	*		"en" : {
	*			"title" : "My Site"
	*		}
	*	};
	*	Translate.load(dict);
	*
	*  @method load
	*  @static
	*  @param {object|String} dict The translation dictionary or file path to the translation dictionary
	*  @param {function} [callback] The methond to callback if we're loading a file
	*  @return {Translate} The Translate object for chaining
	*/
	Translate.load = function(dict, callback)
	{
		// Load the file
		if (typeof dict == "string")
		{
			var onLoaded = function(data)
			{
				Translate.load(data);
				if (callback)
					callback();
			};
			// Load the JSON
			$.get(dict, onLoaded, "json");
		}
		else
		{
			if (_dict !== null)
			{
				$.extend(_dict, dict);
			} 
			else 
			{
				_dict = dict;
			}
			refresh();
		}
		return Translate;
	};

	/**
	*  Remove all of the current dictionaries stored and the saved locale
	*  @method reset
	*  @static
	*  @return {Translate} The Translate object for chaining
	*/
	Translate.reset = function()
	{
		_dict = 
		_locale = 
		_fallbackLocale = 
		_current = null;

		return Translate;
	};

	/**
	*  Auto detect the locale based on the window navigator object
	*  @method autoDetect
	*  @static
	*  @return {Array} The new locale selected
	*/
	Translate.autoDetect = function()
	{
		var lang = (window.navigator.userLanguage || window.navigator.language);

		_locale = [lang, lang.substr(0,2)];
		refresh();
		
		return _locale;
	};

	/**
	*  The optional fallback locale to use in all cases
	*  @property {String} fallbackLocale
	*  @static
	*/
	Object.defineProperty(Translate, "fallbackLocale", 
	{
		set: function(locale)
		{
			_fallbackLocale = locale;
			refresh();
		},
		get: function()
		{
			return _fallbackLocale;
		}
	});

	/**
	*  The current ISO-639-1 two-letter language locale
	*  @property {String|Array} locale
	*  @static
	*/
	Object.defineProperty(Translate, "locale", 
	{
		set: function(locale)
		{
			_locale = locale;
			refresh();
		},
		get: function()
		{
			return _locale;
		}
	});

	/**
	*  Rebuild the current dictionary of translations to use
	*  @method refresh
	*  @static
	*  @private
	*/
	var refresh = function()
	{
		// Ignore if no locale or dictionary is set
		if (!_locale || !_dict) return;

		_current = {};

		// Select the locale
		var locales = getLocales();

		// Add the locale starting at the end first
		for (var i = locales.length - 1; i >= 0; i--)
		{
			var lang = locales[i];
			$.extend(_current, _dict[lang] || {});
		}

		// Do the automatic localizations
		$("[data-localize]")._t();
		$("[data-localize-file")._f();
	};

	/**
	*  Get the locales with the fallback
	*  @method getLocales
	*  @static
	*  @private
	*  @return {Array} The collection of locales where the first index is the highest priority
	*/
	var getLocales = function()
	{
		// Select the locale
		var locales = (typeof _locale == "string") ? [_locale] : _locale.slice(0);

		// Add the fallback
		if (_fallbackLocale && locales.indexOf(_fallbackLocale) == -1)
		{
			locales.push(_fallbackLocale);
		}
		return locales;
	};

	/**
	*  Looks the given string up in the dictionary and returns the translation if
	*  one exists. If a translation is not found, returns the original word.
	*  @method translateString
	*  @static
	*  @private
	*  @param {string} key The translation key look-up to translate.
	*  @param {object} params.. params for using printf() on the string.
	*  @return {string} Translated word.
	*/
	var translateString = function(key)
	{
		if (!_current)
		{
			throw 'Must call Translate.load() before getting the translation';
		}

		if (_current.hasOwnProperty(key))
		{
			key = _current[key];
		}
		else
		{
			throw "No translation string found matching '" + key + "'";
		}

		args = _slice.call(arguments);
		args[0] = key;

		// Substitute any params
		return printf.apply(null, args);
	};

	/**
	*  Converts a file to a localized version using the first locale. If no locale
	*  is set, returns the original file.
	*  @method translateFile
	*  @private
	*  @param {string} file The file path
	*  @param {string} [separator="_"] The string to use before the locale
	*  @return {string} The updated file path containing local
	*/
	var translateFile = function(file, separator)
	{
		// Bail out
		if (!_locale) return file;

		separator = separator || "_";
		
		var locales = getLocales(),
			index = file.lastIndexOf("."),
			http = new XMLHttpRequest(),
			url,
			lang;

		// Add the locale starting at the end first
		for (var i = 0, len = locales.length; i < len; i++)
		{
			lang = locales[i];
			url = file.substring(0, index) + separator + lang + file.substring(index, file.length);
			
			http.open('HEAD', url, false);
			http.send();

			// If the file exists, return
			if (http.status != 404)
			{
				return url;
			}
		}
		// No language or fallback, then return the original file
		return file; 
	};

	/**
	*  Substitutes %s with parameters given in list. %%s is used to escape %s.
	*  @method printf
	*  @private
	*  @param {string} str String to perform printf on.
	*  @param {string} args	Array of arguments for printf.
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
	*  Allows you to translate a jQuery selector. See window._t for more information.
	*
	*	$('h1')._t('some text')
	*
	*  @method $.fn._t
	*  @static
	*  @param {string} key The string to translate .
	*  @param {mixed} [params] Params for using printf() on the string.
	*  @return {element} Chained and translated element(s).
	*/
	$.fn._t = function()
	{
		// Capture the arguments
		var args = arguments;
		
		return this.each(function(){

			var self = $(this);
			var localArgs = _slice.call(args, 0);

			if (localArgs.length === 0)
			{
				var key = self.data('localize');
				var values = self.data('localize-values');

				if (!key)
				{
					throw "Must either pass in a key to localize or use the data-localize attribute";
				}
				Array.prototype.push.call(localArgs, key);

				if (values)
				{
					localArgs = localArgs.concat(values.split(","));
				}
			}
			return self.html(translateString.apply(null, localArgs));
		});		
	};

	/**
	*  Allows you to swap an localized file path with jQuery selector. See window._f for more information.
	*
	*	$('img#example')._f()
	*
	*  @method $.fn._t
	*  @static
	*  @param {string} [attr="src"] The attribute to change the file for
	*  @param {string} [separator="_"] The optional string to use before the locale,
	*     for instance "myfile.png" becomes "myfile_en-US.png"
	*  @return {element} Chained and translated element(s).
	*/
	$.fn._f = function(attr, separator)
	{
		var self = $(this);
		
		if (self.length === 0) return;

		var file = self.data('localize-file') || self.attr('src');
		self.data('localize-file', file);

		return self.attr(attr || "src", translateFile(file, separator));
	};

	/**
	*  Looks the given string up in the dictionary and returns the translation if
	*  one exists. If a translation is not found, returns the original word.
	*  @method window._t
	*  @static
	*  @param {string} str The string to translate.
	*  @param {object} params.. params for using printf() on the string.
	*  @return {string} Translated word.
	*/
	window._t = translateString;

	/**
	*  Converts a file to a localized version using the locale preferences. If no locale
	*  is set or no valid files are found, returns the original file.
	*  @method window._f
	*  @static
	*  @param {string} file The file path
	*  @param {string} [separator="_"] The optional string to use before the locale,
	*     for instance "myfile.png" becomes "myfile_en-US.png"
	*  @return {string} The updated file path containing local
	*/
	window._f = translateFile;

	// Assign to namespace
	namespace('cloudkid').Translate = Translate;

})(window, jQuery);
