### jquery-confirm
*alerts, confirms and dialogs in* ***one.***

v1.5.3

A multipurpose plugin for alert, confirm & dialog, with Extended features.

* Keyboard actions. 
* directly load content via Ajax 
* Auto-close dialog after a specified time 
* prevent Dialog close on background click 
* callback function, and more


View Detailed [Documentation & Examples](http://craftpip.github.io/jquery-confirm)

## Installation

Download the latest release [here](https://github.com/craftpip/jquery-confirm/archive/master.zip) and use the files within `dist` folder.

via Bower:
`$ bower install craftpip/jquery-confirm`
via Npm:
`$ npm install jquery-confirm`

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

[Boniface Pereira](https://github.com/craftpip)

## Issues

Please post issues and feature request here [Github issues](https://github.com/craftpip/jquery-confirm/issues)

## jconfirm alias

The `$.alert()` , `$.confirm()` & `$.dialog()` are alias of `jconfirm();`.

Checkout the [documentation](http://craftpip.github.io/jquery-confirm) for further information.

## version changes

(New in 1.5.3)
&bull; Bounce Animation added (kind of elastic).
&bull; Hide title if false.
&bull; Keyboard action, SPACE key added to trigger confirm function.
&bull; Background now has fade animation (open & close).
&bull; Keep a record of opened, closed, currentlyOpened dialogs `jconfirm.record`.
&bull; Tweaks.

(New in 1.5.1)
&bull; Bower added.

(New in 1.5.0)
&bull; Keyboard support to control modal. (ENTER and ESC).
&bull; Control over the dialog via `this`.
&bull; Updated DOCUMENTATION.
&bull; Code optimized.

(New in 1.1.3)
&bull; `$.dialog` alias added.
&bull; Refined animations.
&bull; Removed Blur animation (was buggy).
&bull; Animation speed fixed.
&bull; Ajax-content loading now waits and disabled buttons until loaded.
&bull; Modal center justified on screen.
&bull; Added close icon if buttons are disabled (dialog mode).
&bull; Disabled window scroll on modal open.
&bull; Fixed bugs.


(New in 1.1.0)
&bull; Ajax content loading `content: 'url:loadfrom.html'`.

## Copyright and license

Copyright (C) 2014-2015 jquery-confirm

Licensed under [the MIT license](LICENSE).
