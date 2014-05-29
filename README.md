About
-----

_Translate_ is an API for doing client-side translations in javascript. It is a fork of [jquery-i18n](https://github.com/recurser/jquery-i18n) by Dave Perrett, and is licensed under the [MIT license](http://www.opensource.org/licenses/mit-license.php).

Installation
------------

You'll need to download the [jQuery library](http://docs.jquery.com/Downloading_jQuery#Current_Release), and include it before _cloudkid-translate.min.js_ in your HTML source.

This library is also available as a [bower](http://bower.io/) component under the name *cloudkid-translate*.

Usage
-----

Before you can do any translation you have to initialise the plugin with a 'dictionary' (basically a property list mapping keys to their translations).

```js
var translations = {
	'en' : {
		'some text': 'a translation',
	    'some more text': 'another translation'
	}
};
Translate.load(translations, "en");
```

Once you've initialized it with a dictionary, you can translate strings using the `_t()` function, for example:

```js
$('#example').html(_t('some text'));
```

Or using the jQuery plugin `$('selector')._t()` method

```js
$('#example')._t('some text');
```

Wildcards
---------

It's straightforward to pass dynamic data into your translations. First, add _%s_ in the translation for each variable you want to swap in :

```js
var translations = {
	'en' : {
		"wildcard example"  : "We have been passed two values : %s and %s."
	}
};
Translate.load(translations, "en");
```

Next, pass values in sequence after the dictionary key when you perform the translation :

```js
$('#example').html(_t('wildcard example'), 100, 200));
```

or

```js
$('#example')._t('wildcard example', 100, 200);
```

This will output: _We have been passed two values: 100 and 200._

If you need to explicitly output the string _%s_ in your translation, use _%%s_ :

```js
var translations = {
	'en' : {
		"wildcard example"  : "We have been passed two values : %s and %s."
	}
};
Translate.load(translations, "en");

$('#example')._t('wildcard example', 1);
```

This will output: _I have 1 literal %%s character._


Copyright
---------

Copyright (c) 2014 CloudKid Under the MIT License