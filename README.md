### ![jquery-confirm](https://raw.githubusercontent.com/craftpip/jquery-confirm/master/jquery-confirm.png "jquery-confirm")
*alerts, confirms and dialogs in* ***one.***

v3.3.3

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/bonifacepereira)

A multipurpose plugin for alert, confirm & dialog, with Super powers.

* Listen keyboard keys 
* Directly load content via Ajax 
* Auto-close dialog after a specified time 
* prevent Dialog close on background click
* callback function, and ton more

View Detailed [Documentation & Examples](http://craftpip.github.io/jquery-confirm)

## Installation

Download the latest release [here](https://github.com/craftpip/jquery-confirm/archive/master.zip) and use the files within `dist` folder.

via CDN:  
`<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css">`  
`<script src="//cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js"></script>`

via Bower:  
`$ bower install craftpip/jquery-confirm`

via NPM:  
`$ npm install jquery-confirm`

## Basic Usage

Showing a confirm box.
```js
$.confirm({
    title: 'What is up?',
    content: 'Here goes a little content',
    type: 'green',
    buttons: {   
        ok: {
            text: "ok!",
            btnClass: 'btn-primary',
            keys: ['enter'],
            action: function(){
                 console.log('the user clicked confirm');
            }
        },
        cancel: function(){
                console.log('the user clicked cancel');
        }
    }
});
```

## Demo and Documentation

See Detailed Docs + Example [here](http://craftpip.github.io/jquery-confirm).

## Authors

[Boniface Pereira](https://github.com/craftpip) & [Awesome Contributors](https://github.com/craftpip/jquery-confirm/graphs/contributors).

## Issues

Please post issues and feature request here [Github issues](https://github.com/craftpip/jquery-confirm/issues)

## jconfirm alias

The `$.alert()` , `$.confirm()` & `$.dialog()` are alias of `jconfirm();`.

Checkout the [documentation](http://craftpip.github.io/jquery-confirm) for further information.

## Version changes

(new in 3.3.3) 
* Safari height bug fix. PR by [lanre-ade](https://github.com/lanre-ade)
* Fix isClosed bug for firefox. PR by [loganm](https://github.com/loganm)
* Remove scroll to top when content height changes. PR by [amikot](https://github.com/amikot)
* added support for AMD and commonJS

(new in 3.3.1) 
* Pass 'false' in buttons property to remove all buttons in $.confirm and $.alert

(new in 3.3.0)
* Moved overflow scroll inside modal [#286](https://github.com/craftpip/jquery-confirm/issues/2860)
* Improved draggable
* Added 'animateFromElement' method 
* Added 'smoothScroll' option 
* Added 'hilight' option 
* Added 'showLoading','hideLoading' option 
* Accept jquery dom element in content [#313](https://github.com/craftpip/jquery-confirm/issues/313) 
* Updated docs 
* 'setDialogCenter' method deprecated, dialog centered with CSS tables
* 'alignMiddle' method deprecated
* fixes [#255](https://github.com/craftpip/jquery-confirm/issues/255) [#307](https://github.com/craftpip/jquery-confirm/issues/307) [290](https://github.com/craftpip/jquery-confirm/issues/290)

(new in 3.2.3)
* Added lazyOpen option
* Added button properties isHidden and isDisabled
* setBoxWidth method added

(new in 3.2.1) *untagged
* Fixed autoClose bug decimal point countdown if 1500 milliseconds was provided.

(new in 3.2.0)
* new theme Modern added
* fixed [#242](https://github.com/craftpip/jquery-confirm/issues/242) [#248](https://github.com/craftpip/jquery-confirm/issues/242) 
* themes RTL & supervan fixes

(new in 3.1.1)
* bug fixes

(new in 3.1.0)
* Support for bootstrap v4
* Draggable dialogs
* Added options animateScrollToElement, alignMiddle, offsetTop, offsetBottom and drawWindowGap

(new in 3.0.3)
* Setting defaults fixed
* added docs for prompt dialog
* added setType method
* users can now create custom type styles
* removed the annoying debug console log
* other fixes

(new in 3.0.1)
* Removed bootstrap as dependency
* Added dialog type to identify success, failure, etc.
* Animate scroll to previous focused element
* titleClass option added

(New in 3.0.0) **no backwards compatible with v2.**
* Define multiple buttons
* Define keyboard keys for individual buttons
* Added setContentPrepend, setContentAppend for control over content.
* Added functions to enable, disable, show, hide, and more for buttons.
* Added aliases for columnClass
* Added bgOpacity
* Added containerFluid
* Added backgroundDismiss animations
* Added callbacks, onContentReady, onOpenBefore, onDestroy
* Docs added for custom animations and themes
* Animation fixes when loading via Ajax
* Restructured code
* Bind button to closeIcon event
* Bind button to backgroundDismiss event
* Now created and destroyed instances can be reopened. 
* Bug fixes

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

Copyright (C) 2014-2017 jquery-confirm

Licensed under [the MIT license](LICENSE).
