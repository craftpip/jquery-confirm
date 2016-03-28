### ![jquery-confirm](https://raw.githubusercontent.com/craftpip/jquery-confirm/master/jquery-confirm.png "jquery-confirm")
*alerts, confirms and dialogs in* ***one.***

v2.5.1

A multipurpose plugin for alert, confirm & dialog, with Super powers.

* Keyboard actions. 
* directly load content via Ajax 
* Auto-close dialog after a specified time 
* prevent Dialog close on background click
* callback function, and more

View Detailed [Documentation & Examples](http://craftpip.github.io/jquery-confirm)

## Installation

Download the latest release [here](https://github.com/craftpip/jquery-confirm/archive/master.zip) and use the files within `dist` folder.

via Bower: <br>
`$ bower install craftpip/jquery-confirm` <br>

##Basic Usage

How to respond to user action
```js
$.confirm({
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

[Boniface Pereira](https://github.com/craftpip) & Awesome Contributors.

## Issues

Please post issues and feature request here [Github issues](https://github.com/craftpip/jquery-confirm/issues)

## jconfirm alias

The `$.alert()` , `$.confirm()` & `$.dialog()` are alias of `jconfirm();`.

Checkout the [documentation](http://craftpip.github.io/jquery-confirm) for further information.

## Version changes
(New in 2.5.1)
* Fixes

(New in 2.5.0)
* Added closeIconClass
* Added this.$target
* Changed modal template
* Watches modal for new changes auto set to center
* New documentation
* Added new theme 'material' and 'bootstrap'
* Removed themes 'holodark' and 'hololight'
* Improved performance

(New in 2.0.0)
* Added closeAnimation
* Added $('a').confirm() to emulate confirm();
* Smoother animations
* Changed backgroundDismiss animation
* Updated documentations

(New in 1.7.9)
* Minor bug fixes

(New in 1.7.8)
* RTL support
* Option to select keyboard keys

(New in 1.7.5)
* Callbacks added, onOpen, onClose, onAction
* Improved docs.

(New in 1.7.3)
* Fix show and hide for closeIcon
* Improved animations, more CSS
* setContent method improved.
* setTitle method added.

(New in 1.7.0)
* Option for custom width added (using bootstrap grid)
* Text overflow logic changed, #13
* Documentation & improvements to contentLoaded callback.

(New in 1.6.0)
* Theme 'supervan' added
* Load via URL advanced added. now get control over your ajax calls & callbacks.
* methods setContent, isClosed added
* Improved documentation

(New in 1.5.3)
* Bounce Animation added (kind of elastic).
* Hide title if false.
* Keyboard action, SPACE key added to trigger confirm function.
* Background now has fade animation (open & close).
* Keep a record of opened, closed, currentlyOpened dialogs `jconfirm.record`.
* Tweaks.

(New in 1.5.1)
* Bower added.

(New in 1.5.0)
* Keyboard support to control modal. (ENTER and ESC).
* Control over the dialog via `this`.
* Updated DOCUMENTATION.
* Code optimized.

(New in 1.1.3)
* `$.dialog` alias added.
* Refined animations.
* Removed Blur animation (was buggy).
* Animation speed fixed.
* Ajax-content loading now waits and disabled buttons until loaded.
* Modal center justified on screen.
* Added close icon if buttons are disabled (dialog mode).
* Disabled window scroll on modal open.
* Fixed bugs.

(New in 1.1.0)
* Ajax content loading `content: 'url:loadfrom.html'`.

## Copyright and license

Copyright (C) 2014-2015 jquery-confirm

Licensed under [the MIT license](LICENSE).
