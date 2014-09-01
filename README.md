##### This is a fork of [CloudKidTranslate](https://github.com/CloudKidStudio/CloudKidTranslate) by Matt Karl made just for a slight quickfix I needed, which was basically accessing nested keys in the provided json with dot notation (data-localize="nested.key") #####

#About 

_Translate_ is an API for doing client-side translations in javascript. It is a fork of [jquery-i18n](https://github.com/recurser/jquery-i18n) by Dave Perrett, and is licensed under the [MIT license](http://www.opensource.org/licenses/mit-license.php).

#Installation

You'll need to download the [jQuery library](http://docs.jquery.com/Downloading_jQuery#Current_Release), and include it before _cloudkid-translate.min.js_ in your HTML source.

This library is also available as a [bower](http://bower.io/) component under the name *cloudkid-translate*.

#Usage

##Setup

Before you can do any translation you have to `load()` the plugin with a dictionary (each language contains a property list mapping keys to their translations).

```js
var translations = {
	"en" : {
		"greeting" : "Welcome",
		"intro" : "My name is %s, I'm %s years old"
	},
	"fr" : {
		"greeting" : "Accueil",
		"intro" : "Je m'appelle %s, je suis âgé de %s ans"
	}
};
Translate.load(translations);
```

The translations can also be loaded with a path to externalized JSON file.
 
```js
Translate.load("locale/lang.json", function(){
	// Optional callback when load finished!
});
```

Or loading a specifc language JSON:

```js
Translate.load("locale/en/lang.json", "en", function(){
	// Optional callback when load finished!
	// The locale is automatically set here to "en"
});
```

Then you must select the locale to use which can be done one of two ways. Either auto-detect method which identifies the locale based on the current browser's `navigator` object, or explicitly setting the locale.

```js
// Auto detect based on navigator object
Translate.autoDetect();

// or explicitly set the locale
Translate.locale = "en";
```

If using `autoDetect()`, it's a good idea to set a fallback locale, in case the language doesn't exist in your dictionary.

```js
Translate.fallbackLocale = "en";
```

##Translating

Once you've initialized it with a dictionary, you can translate strings using the `_t()` function, for example:

```js
$('#example').html(_t('greeting'));
```

Or using the jQuery plugin `$('selector')._t()` method"

```js
$('#example')._t('greeting');
```

Or using the data tag method"

```html
<div data-localize="greeting"></div>
```

##Wildcards

It's straightforward to pass dynamic data into your translations. First, add _%s_ in the translation for each variable you want to swap in :

```js
var translations = {
	'en' : {
		"wildcard example"  : "We have been passed two values : %s and %s."
	}
};
```

Next, pass values in sequence after the dictionary key when you perform the translation :

```js
$('#example').html(_t('wildcard example'), 100, 200));
```

or, again, the jQuery plugin method:

```js
$('#example')._t('wildcard example', 100, 200);
```

This will output: _We have been passed two values: 100 and 200._

If you need to explicitly output the string _%s_ in your translation, use _%%s_ :

```js
var translations = {
	'en' : {
		"wildcard example"  : "I have %s literal %%s character"
	}
};

$('#example')._t('wildcard example', 1);
```

This will output: _I have 1 literal %s character._


Copyright
---------

Copyright (c) 2014 CloudKid Under the MIT License
