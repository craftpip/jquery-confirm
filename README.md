jquery-confirm
================
An multipurpose alert, confirm plugin, alternative to the native alert() and confirm() functions.
Supports features like auto-close, themes, animations, and more.

## Installation

Download the latest release [here](https://github.com/craftpip/jquery-confirm/archive/master.zip)<br>
A full documentation page is included within the release.

copy the css and js files from `/dist/` to your project, and link them to your HTML page.<br>
and finally via Javascript run `$.alert()` or `$.confirm()`.

##Basic Usage

How to respond to user action
```js
$.alert({
	confirm: function(){
		console.log('the user clicked confirm');
	},
	cancel: function(){
		console.log('the user clicked cancel');
	}
});
```

## Demo and Documentation

See Detailed Docs + Example [here](http://craftpip.github.io/jquery-confirm).

## Authors

[Boniface Pereira](https://github.com/craftpip)

## jconfirm alias

The `$.alert()` & `$.confirm()` are alias of `jconfirm();`.

Checkout the [documentation](http://craftpip.github.io/jquery-confirm) for further information.

## Copyright and license

Copyright (C) 2014-2015 jquery-confirm

Licensed under [the MIT license](LICENSE).
