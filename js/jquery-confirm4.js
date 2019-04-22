/*!
 * jquery-confirm v3.3.4 (http://craftpip.github.io/jquery-confirm/)
 * Author: Boniface Pereira
 * Website: www.craftpip.com
 * Contact: hey@craftpip.com
 *
 * Copyright 2013-2019 jquery-confirm
 * Licensed under MIT (https://github.com/craftpip/jquery-confirm/blob/master/LICENSE)
 */


/**
 * UMD (Universal Module Definition) to support CommonJS, AMD and browser
 * Thanks to https://github.com/umdjs/umd
 */
(function(factory){
    if(typeof define === 'function' && define.amd){
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    }else if(typeof module === 'object' && module.exports){
        // Node/CommonJS
        module.exports = function(root, jQuery){
            if(jQuery === undefined){
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if(typeof window !== 'undefined'){
                    jQuery = require('jquery');
                }else{
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    }else{
        // Browser globals
        factory(jQuery);
    }
}(function($){
    "use strict";

    // locally assign window
    var w = window;
    // w.jconfirm
    // w.Jconfirm;

    $.fn.confirm = function(options, option2){
        if(typeof options === 'undefined') options = {};
        if(typeof options === 'string'){
            options = {
                content: options,
                title: (option2) ? option2 : false
            };
        }
        /*
         *  Alias of $.confirm to emulate native confirm()
         */
        $(this).each(function(){
            var $this = $(this);
            if($this.attr('jc-attached')){
                console.warn('jConfirm has already been attached to this element ', $this[0]);
                return;
            }

            $this.on('click', function(e){
                e.preventDefault();
                var jcOption = $.extend({}, options);
                if($this.attr('data-title'))
                    jcOption['title'] = $this.attr('data-title');
                if($this.attr('data-content'))
                    jcOption['content'] = $this.attr('data-content');
                if(typeof jcOption['buttons'] === 'undefined')
                    jcOption['buttons'] = {};

                jcOption['$target'] = $this;
                if($this.attr('href') && Object.keys(jcOption['buttons']).length === 0){
                    var buttons = $.extend(true, {}, w.jconfirm.pluginDefaults.defaultButtons, (w.jconfirm.defaults || {}).defaultButtons || {});
                    var firstBtn = Object.keys(buttons)[0];
                    jcOption['buttons'] = buttons;
                    jcOption.buttons[firstBtn].action = function(){
                        location.href = $this.attr('href');
                    };
                }
                jcOption['closeIcon'] = false;
                var instance = $.confirm(jcOption);
            });

            $this.attr('jc-attached', true);
        });
        return $(this);
    };
    $.confirm = function(options, option2){
        if(typeof options === 'undefined') options = {};
        if(typeof options === 'string'){
            options = {
                content: options,
                title: (option2) ? option2 : false
            };
        }

        var putDefaultButtons = !(options['buttons'] === false);

        if(typeof options['buttons'] !== 'object')
            options['buttons'] = {};

        if(Object.keys(options['buttons']).length === 0 && putDefaultButtons){
            var buttons = $.extend(true, {}, w.jconfirm.pluginDefaults.defaultButtons, (w.jconfirm.defaults || {}).defaultButtons || {});
            options['buttons'] = buttons;
        }

        /*
         *  Alias of jconfirm
         */
        return w.jconfirm(options);
    };
    $.alert = function(options, option2){
        if(typeof options === 'undefined') options = {};
        if(typeof options === 'string'){
            options = {
                content: options,
                title: (option2) ? option2 : false
            };
        }

        var putDefaultButtons = !(options['buttons'] === false);

        if(typeof options.buttons !== 'object')
            options.buttons = {};

        if(Object.keys(options['buttons']).length === 0 && putDefaultButtons){
            var buttons = $.extend(true, {}, w.jconfirm.pluginDefaults.defaultButtons, (w.jconfirm.defaults || {}).defaultButtons || {});
            var firstBtn = Object.keys(buttons)[0];
            options['buttons'][firstBtn] = buttons[firstBtn];
        }
        /*
         *  Alias of jconfirm
         */
        return w.jconfirm(options);
    };
    $.dialog = function(options, option2){
        if(typeof options === 'undefined') options = {};
        if(typeof options === 'string'){
            options = {
                content: options,
                title: (option2) ? option2 : false,
                closeIcon: function(){
                    // Just close the modal
                }
            };
        }

        options['buttons'] = {}; // purge buttons

        if(typeof options['closeIcon'] === 'undefined'){
            // Dialog must have a closeIcon.
            options['closeIcon'] = function(){
            }
        }
        /*
         *  Alias of jconfirm
         */
        options.confirmKeys = [13];
        return w.jconfirm(options);
    };

    w.jconfirm = function(options){
        if(typeof options === 'undefined') options = {};
        /*
         * initial function for calling.
         */
        var pluginOptions = $.extend(true, {}, w.jconfirm.pluginDefaults);
        if(w.jconfirm.defaults){
            pluginOptions = $.extend(true, pluginOptions, w.jconfirm.defaults);
        }

        /*
         * merge options with plugin defaults.
         */
        pluginOptions = $.extend(true, {}, pluginOptions, options);
        var instance = new w.Jconfirm(pluginOptions);
        w.jconfirm.instances.push(instance);
        return instance;
    };
    w.Jconfirm = function(options){
        /*
         * constructor function Jconfirm,
         * options = user options.
         */
        $.extend(this, options);
        this._init();
    };
    w.Jconfirm.prototype = {
        _prefix: 'jconfirm-',
        _init: function(){
            var that = this;

            if(!w.jconfirm.instances.length)
                w.jconfirm.lastFocused = $('body').find(':focus');

            this._id = Math.round(Math.random() * 99999);
            this.prepare();

            setTimeout(function(){
                that.open();
            }, 100);
        },


        prepare: function(){
            var that = this;
            // prepare the whole modal here.
            this.$el = $(this.template);

            // the container, where this thing will be put.
            this.container = this.container || 'body';
            this.$container = $(this.container);

            this.$jconfirmBoxContainer = this.$el.find('.jconfirm-box-container');

            // the main box.
            this.$body = this.$jconfirmBox = this.$el.find('.jconfirm-box');

            // background div
            this.$jconfirmBg = this.$el.find('.jconfirm-bg');

            // the title container contains the title and icon
            this.$titleContainer = this.$el.find('.jconfirm-title-c');
            this.$title = this.$el.find('.jconfirm-title');
            this.$icon = this.$el.find('.jconfirm-icon-c');

            // the close icon container
            this.$closeIcon = this.$el.find('.jconfirm-closeIcon');

            // buttons container
            this.$buttons = this.$el.find('.jconfirm-buttons');

            /**
             * Mock elements for bootstrap to find the columns width.
             * @type {{$row: (*|number|never|bigint|T|T), $box: (*|number|never|bigint|T|T), $container: (*|number|never|bigint|T|T), $sandbox: (*|number|never|bigint|T|T), $col: (*|number|never|bigint|T|T)}}
             */
            this.$bs = {
                $sandbox: this.$el.find('.jconfirm-bs-sandbox'),
                $container: this.$el.find('.jconfirm-bs-container'),
                $row: this.$el.find('.jconfirm-bs-row'),
                $col: this.$el.find('.jconfirm-bs-col'),
                $box: this.$el.find('.jconfirm-bs.mock')
            };

            this.setTitle(this.title);
            this.setAnimation2(this.animation);

            // set the start animation class
            this.$jconfirmBox.addClass(this.animation);

            this.setIcon(this.icon);
            // this.setOffset('top', this.offsetTop);
            // this.setOffset('bottom', this.offsetBottom);
            this.setCloseAnimation2(this.closeAnimation);
            this.setBackgroundDismissAnimation(this.backgroundDismissAnimation);
            this.setType(this.type);
            this.setTheme2(this.theme);
            var contentPromise = this.setContent2(this.content);
            this.setUseBootstrap(this.useBootstrap);
            this.setColumnClass2(this.columnClass);
            this.setIsTypeAnimated(this.typeAnimated);
            this.setTitleClass(this.titleClass);
            this.setBgOpacity(this.bgOpacity);
            this.setRtl(this.rtl);
            this.setCloseIconClass(this.closeIconClass);
            this.bindCloseIconEvent();
            this.setButtons(this.buttons);
            this.setCloseIcon(this.closeIcon);
            // this.initDraggable();
            this.setAutoClose(this.autoClose);

            var ariaLabel = this._prefix + 'box' + this._id;
            this.$jconfirmBox.attr('aria-labelledby', ariaLabel)
                .attr('tabindex', -1);
            this.$content.attr('id', ariaLabel);
            // set the initial animation, to animate have to remove this class
            this.$jconfirmBox.addClass(this.animation);
            this.$container.append(this.$el);

            if(that.animation == 'none'){
                // seems ok
                this.animationSpeed = 0;
                this.animationBounce = 0;
            }

            this._closeAnimate();
            // that.$body.css(that._getCSS(that.animationSpeed, that.animationBounce));
            // that.$contentPane.css(that._getCSS(that.animationSpeed, 1));
            // that.$jconfirmBg.css(that._getCSS(that.animationSpeed, 1));
            // that.$jconfirmBoxContainer.css(that._getCSS(that.animationSpeed, 1));
        },
        open: function(){
            var that = this;
            // this.setStartingPoint();
            this._openAnimate();
            this._bgShow();
        },
        _openAnimate: function(){
            var that = this;
            this.$body.removeClass(this.animation);
        },
        _closeAnimate: function(){
            var that = this;
            this.$body.addClass(this.closeAnimation);
            setTimeout(function(){
                that.$body.addClass(that.animation);
            }, this.animationSpeed);
        },
        close: function(){
            var that = this;
            this._closeAnimate();
            this._bgHide();

            // @todo: do not check with instances.
            // coz they will be there after closing,
            // check for something else.
            if(!w.jconfirm.instances.length){
                // this is the last one to close.
                if(this.scrollToPreviousElement
                    && w.jconfirm.lastFocused
                    && w.jconfirm.lastFocused.length
                    && $.contains(document, w.jconfirm.lastFocused[0])){

                    // if the clicked element is out of view, lets scroll to it.
                    var $lf = w.jconfirm.lastFocused;
                    var st = $(window).scrollTop();
                    var lft = w.jconfirm.lastFocused.offset().top;
                    var wh = $(window).height();
                    var scrollTo = null;

                    if(!(lft > st && lft < (st + wh))){
                        // the last focused element is not in view.
                        // scroll there!
                        scrollTo = (lft - Math.round((wh / 3)));
                    }

                    if(scrollTo !== null){
                        if(this.scrollToPreviousElementAnimate){
                            // animate please.
                            $('html, body').animate({
                                scrollTop: scrollTo
                            }, this.animationSpeed, 'swing', function(){
                                // gracefully scroll and then focus.
                                $lf.focus();
                            });
                        }else{
                            // no animation!
                            $('html, body').scrollTop(scrollTo);
                            $lf.focus();
                        }
                    }else{
                        $lf.focus();
                    }
                }else{
                    // do not scroll to previous element
                }
            }
        },
        destroy: function(){

            // unbind events, and remove div from dom
            this.unbindEvents();
            this.$el.remove();

            // remove instance from instances records.
            var l = w.jconfirm.instances;
            w.jconfirm.instances = w.jconfirm.instances.filter(function(instance){
                return instance._id != that._id;
            });

        },
        unbindEvents: function(){
            $(window).unbind('resize.' + this._id);
            $(window).unbind('keyup.' + this._id);
            $(window).unbind('jcKeyDown.' + this._id);
            if(this.draggable){
                $(window).unbind('mousemove.' + this._id);
                $(window).unbind('mouseup.' + this._id);
                this.$titleContainer.unbind('mousedown');
            }
        },

        setButtons: function(buttons){
            var totalButtons = 0;
            var that = this;
            $.each(buttons, function(key, button){
                totalButtons++;
                if(typeof button === 'function'){
                    buttons[key] = {
                        action: button,
                    };
                }
                if(typeof button === 'string'){
                    buttons[key] = {
                        text: button,
                    };
                }
                var btn = buttons[key];
                btn.text = button.text || key;
                btn.btnClass = button.btnClass || 'btn-default'; //@todo, make that default, what if i want to have no class on my buttons
                btn.action = button.action || that.noop;
                btn.keys = (button.keys || []).map(function(a){
                    return a.toLowerCase();
                });
                btn.isHidden = button.isHidden || false;
                btn.isDisabled = button.isDisabled || false;

                var buttonElement = $('<button type="button" class="btn">')
                    .html(btn.text)
                    .addClass(btn.btnClass)
                    .prop('disabled', btn.isDisabled)
                    .css({
                        'display': btn.isHidden ? 'none' : null,
                    });
                btn.el = buttonElement;
                btn.el.on('click', function(e){
                    // register handler
                    e.preventDefault();
                    var shouldClose = btn.action.apply(that, [
                        btn,
                    ]);
                    (that.onAction || that.noop).apply(that, [
                        key, btn
                    ]);

                    // that._stopCountDown();
                    if(typeof shouldClose === 'undefined' || shouldClose){
                        that.close();
                    }
                });

                /**
                 * Add button functions
                 * @param text
                 */
                btn.setText = function(text){
                    btn.el.html(text);
                };
                btn.addClass = function(className){
                    btn.el.addClass(className);
                };
                btn.removeClass = function(className){
                    btn.el.removeClass(className);
                };
                btn.disable = function(){
                    btn.isDisabled = true;
                    btn.el.prop('disabled', true);
                };
                btn.enable = function(){
                    btn.isDisabled = false;
                    btn.el.prop('disabled', false);
                };
                btn.show = function(){
                    btn.isHidden = false;
                    btn.el.css({
                        'display': null
                    });
                };
                btn.hide = function(){
                    btn.isHidden = true;
                    btn.el.hide();
                };
                btn.getButton = function(){
                    return btn.el;
                };
                // store the buttons in parent object for quick access
                that['$_' + key] = that['$$' + key] = btn.el;
                that.$buttons.append(btn.el);
            });

            if(totalButtons === 0)
                that.$buttons.hide();
            else
                that.$buttons.show();
        },
        /**
         * Show or hide the close icon
         * If state is provided null, and no buttons are present:
         * the state will turn to true. this is to have an alternative button for user to click on,
         * @param state
         */
        bindCloseIconEvent: function(){
            var that = this;
            this.$closeIcon.on('click.jcCloseIcon', function(e){
                e.preventDefault();
                console.log('clicked');
                var buttonName = false;
                var shouldClose = false;
                console.log(that.closeIcon);
                that.resolveOption(that.closeIcon).then(function(response){
                    console.log(response);
                    if(typeof response === 'string'
                        && that.buttons[response] !== 'undefined'
                    ){
                        // a button with the same name exists.
                        buttonName = response;
                        shouldClose = false; // let the button decide if it wants to close.
                    }else if(typeof response === 'undefined'
                        || !!response === true
                    ){
                        shouldClose = true;
                    }else{
                        shouldClose = false;
                    }

                    // ok
                    if(buttonName){
                        var buttonResponse = that.buttons[buttonName].action.apply(that, [
                            that.buttons[buttonName]
                        ]);
                        shouldClose = (typeof buttonResponse === 'undefined') || !!buttonResponse;
                    }

                    if(shouldClose){
                        that.close();
                    }
                })
            });
        },

        // ********* Drag ******************************************************
        initDraggable: function(){
            var that = this;

            var $t = this.$titleContainer;

            this.resetDrag();
            if(this.draggable){
                $t.on('mousedown', function(e){
                    $t.addClass('jconfirm-hand');
                    that.mouseX = e.clientX;
                    that.mouseY = e.clientY;
                    that.isDrag = true;
                });
                $(window).on('mousemove.' + this._id, function(e){
                    if(that.isDrag){
                        that.movingX = e.clientX - that.mouseX + that.initialX;
                        that.movingY = e.clientY - that.mouseY + that.initialY;
                        that.setDrag();
                    }
                });

                $(window).on('mouseup.' + this._id, function(){
                    $t.removeClass('jconfirm-hand');
                    if(that.isDrag){
                        that.isDrag = false;
                        that.initialX = that.movingX;
                        that.initialY = that.movingY;
                    }
                })
            }
        },
        resetDrag: function(){
            this.isDrag = false;
            this.initialX = 0;
            this.initialY = 0;
            this.movingX = 0;
            this.movingY = 0;
            this.mouseX = 0;
            this.mouseY = 0;
            this.$jconfirmBoxContainer.css('transform', 'translate(' + 0 + 'px, ' + 0 + 'px)');
        },
        setDrag: function(){
            if(!this.draggable)
                return;

            this.alignMiddle = false;
            var boxWidth = this.$jconfirmBox.outerWidth();
            var boxHeight = this.$jconfirmBox.outerHeight();
            var windowWidth = $(window).width();
            var windowHeight = $(window).height();
            var that = this;
            var dragUpdate = 1;
            if(that.movingX % dragUpdate === 0 || that.movingY % dragUpdate === 0){
                if(that.dragWindowBorder){
                    var leftDistance = (windowWidth / 2) - boxWidth / 2;
                    var topDistance = (windowHeight / 2) - boxHeight / 2;
                    topDistance -= that.dragWindowGap;
                    leftDistance -= that.dragWindowGap;

                    if(leftDistance + that.movingX < 0){
                        that.movingX = -leftDistance;
                    }else if(leftDistance - that.movingX < 0){
                        that.movingX = leftDistance;
                    }

                    if(topDistance + that.movingY < 0){
                        that.movingY = -topDistance;
                    }else if(topDistance - that.movingY < 0){
                        that.movingY = topDistance;
                    }
                }

                that.$jconfirmBoxContainer.css('transform', 'translate(' + that.movingX + 'px, ' + that.movingY + 'px)');
            }
        },
        // ********* end Drag ******************************************************

        // ********* utils ******************************************************
        /**
         * calculate and return the width required
         */
        calculateWidth: function(){
            var width;
            if(this.useBootstrap){
                width = this.$bs.$box.css('width');
            }else{
                width = this.boxWidth;
            }

            this.$jconfirmBox.css({
                width: width,
            });

            return width;
        },
        /**
         * Prefix names,
         * @param prefix
         * @param str
         * @returns {string|*|string|*}
         */
        prefix: function(prefix, str){
            if(!str)
                return str;

            if(str.indexOf(prefix) == -1){
                return this._prefix + prefix + str.trim();
            }else{
                return str.trim();
            }
        },
        noop: function(){
        },
        /**
         * Resolving options,
         * string, promises, & functions that return string or promise recursively.
         * @param option
         * @param promise
         * @param context
         * @returns {*}
         */
        resolveOption: function(option, promise, context){
            if(!promise)
                promise = $.Deferred();
            var that = this;
            switch(typeof option){
                case 'undefined':
                    promise.resolve(option);
                    break;
                case 'string':
                    // found a string
                    promise.resolve(option);
                    break;
                case 'object':
                    if(option == null){
                        promise.resolve('');
                    }else if(typeof option.then === 'function'){
                        // found a promise
                        option.then(function(response){
                            promise.resolve(response);
                        }, function(err){
                            console.error('An error occurred while resolving the promise: ', err);
                        });
                    }else{
                        // what is it?
                        promise.resolve(repsonse);
                    }
                    break;
                case 'function':
                    // its a function, execute it.
                    var response;
                    if(!context)
                        response = option();
                    else
                        response = option.apply(context);
                    this.resolveOption(response, promise);
                    break;
                case 'boolean':
                    promise.resolve(option);
                    break;
                case 'number':
                    promise.resolve(option);
                    break;
            }

            return promise;
        },
        _cubic_bezier: '0.36, 0.55, 0.19',
        /**
         * Returns composed styles
         * @param speed
         * @param bounce
         * @returns {{"transition-duration": string, "-webkit-transition-timing-function": string, "transition-timing-function": string, "-webkit-transition-duration": string}}
         * @private
         */
        _getCSS: function(speed, bounce){
            return {
                '-webkit-transition-duration': speed / 1000 + 's',
                'transition-duration': speed / 1000 + 's',
                '-webkit-transition-timing-function': 'cubic-bezier(' + this._cubic_bezier + ', ' + bounce + ')',
                'transition-timing-function': 'cubic-bezier(' + this._cubic_bezier + ', ' + bounce + ')'
            };
        },
        // ********* End utils ******************************************************

        // ********* set functions ******************************************************
        /**
         * Set the close icon. if no buttons are found and value is null, show the close icon
         * else show it.
         * @param state
         * @returns {*}
         */
        setCloseIcon: function(state){
            var that = this;
            return this.resolveOption(state, function(a){
                this.closeIcon = a;

                if(Object.keys(that.buttons).length === 0 && a === null){
                    // if no buttons are found and null is given.
                    a = true;
                }
                if(a){
                    this.$closeIcon.show();
                }else{
                    this.$closeIcon.hide();
                }
            });
        },
        /**
         * Bind event for close icon
         */
        /**
         * Set the close icon's class
         * @param iconClass
         */
        setCloseIconClass: function(iconClass){
            var that = this;
            return this.resolveOption(iconClass, function(a){
                if(a){
                    that.$closeIcon.html('<i class="' + a + '"></i>');
                }else{
                    that.$closeIcon.html('&times;');
                }
                that.closeIconClass = a;
            });
        },
        /**
         * Set the box to rtl or no ?
         * @param state
         */
        setRtl: function(state){
            var that = this;
            return this.resolveOption(state, function(a){
                if(a){
                    that.$el.addClass(that._prefix + 'rtl');
                }else{
                    that.$el.removeClass(that._prefix + 'rtl');
                }
                that.rtl = a;
            });
        },
        setBgOpacity: function(opacity){
            var that = this;
            this.resolveOption(opacity, function(a){
                that.$jconfirmBg.css({
                    'opacity': typeof a === 'number' ? a : null,
                });
                that.opacity = a;
            })
        },
        setTitleClass: function(titleClass){
            var that = this;
            var previousValue = this.titleClass;
            return this.resolveOption(titleClass).then(function(a){
                that.$titleContainer
                    .removeClass(previousValue)
                    .addClass(a);
                that.titleClass = a;
            })
        },
        setIsTypeAnimated: function(state){
            var n = this._prefix + 'type-animated';
            if(state){
                this.$jconfirmBox.addClass(n);
            }else{
                this.$jconfirmBox.removeClass(n);
            }
        },
        /**
         * Set animation is directly setting the animation class.
         * to promises here please.
         * @param animation
         * @returns {*|PromiseLike<T | never>|Promise<T | never>}
         */
        setAnimation2: function(animation){
            var that = this;
            this.animation = (animation || '').split(',').map(function(a){
                // return that._prefix + 'animation-' + $.trim(a);
                return that.prefix('animation-', a);
            }).join(' ');
            return this.animation;
        },
        /**
         * Set close animation no promises
         * @param animation
         */
        setCloseAnimation2: function(animation){
            var that = this;
            return this.closeAnimation = (animation || '').split(',').map(function(a){
                return that.prefix('animation-', a);
            }).join(' ');
        },
        /**
         * Set type class
         * @param type
         * @returns {*|PromiseLike<T | never>|Promise<T | never>}
         */
        setType: function(type){
            var that = this;
            var previousValue = this.type;
            return this.resolveOption(type).then(function(response){
                that.type = that.prefix('type-', response);
                that.$jconfirmBox
                    .removeClass(previousValue)
                    .addClass(that.type);
            });
        },
        /**
         * Set the background dismiss animation class.
         * hilight class is added to activate that class.
         * @param animation
         * @returns {*|PromiseLike<T | never>|Promise<T | never>}
         */
        setBackgroundDismissAnimation: function(animation){
            var that = this;
            var previousValue = this.backgroundDismissAnimation;
            return this.resolveOption(animation).then(function(response){
                that.backgroundDismissAnimation = (response || '').split(',').map(function(a){
                    return that.prefix('hilight-', a);
                }).join(' ');
                that.$jconfirmBox
                    .removeClass(previousValue)
                    .addClass(that.backgroundDismissAnimation);
            });
        },
        /**
         * Set the theme classes.
         * @param theme
         */
        setTheme2: function(theme){
            var that = this;
            var previousValue = typeof this.theme === 'string' ? this.theme : '';
            return this.resolveOption(theme).then(function(response){
                that.theme = (response || '').split(',').map(function(a){
                    return that._prefix + $.trim(a);
                }).join(' ');
                that.$el
                    .removeClass(previousValue)
                    .addClass(that.theme);
            });
        },
        /**
         * Set the content
         * @param content
         * @returns {*|PromiseLike<T | never>|Promise<T | never>}
         */
        setContent2: function(content){
            var that = this;

            if(typeof content === 'string'
                && content.substr(0, 4).toLowerCase() === 'url:'){
                // we need to replace content with $.get promise
                content = $.get(content.substring(4));
            }

            return this.resolveOption(content).then(function(response){
                that.content = response;
                that.$content.html('');
                that.$content.append(that.content);
                // (that.contentLoaded || that.noop)(response);
                // that.onContentReady.apply(that);
                return that.content;
            });
        },
        /**
         * Set the column classes
         * @param columnClass
         */
        setColumnClass: function(columnClass){
            var that = this;
            return this.resolveOption(columnClass, function(a){
                var p;
                switch(a.toLowerCase()){
                    case 'xl':
                    case 'xlarge':
                        p = 'col-md-12';
                        break;
                    case 'l':
                    case 'large':
                        p = 'col-md-8';
                        break;
                    case 'm':
                    case 'medium':
                        p = 'col-md-6';
                        break;
                    case 's':
                    case 'small':
                        p = 'col-md-4';
                        break;
                    case 'xs':
                    case 'xsmall':
                        p = 'col-md-2';
                        break;
                    default:
                        p = a;
                }
                that.columnClass = p;
            });
        },
        /**
         * Set the title
         * @param string
         * @returns {*|PromiseLike<T | never>|Promise<T | never>}
         */
        setTitle: function(string){
            var that = this;
            return this.resolveOption(string).then(function(response){
                that.title = response || '';
                that.$title.html(that.title);
                that._updateTitleIconContainer();
                return that.title;
            });
        },
        /**
         * Set the title icon
         * @param iconClass
         */
        setIcon: function(iconClass){
            var that = this;
            this.resolveOption(iconClass).then(function(response){
                that.icon = response || '';
                that.$icon.html(this.icon ? '<i class="' + this.icon + '"></i>' : '');
                that._updateTitleIconContainer();
            });
        },
        /**
         * If title and icon are not give, hide the title container
         * that contains both the title and icon
         * @private
         */
        _updateTitleIconContainer: function(){
            var that = this;
            if(!that.title && !that.icon){
                that.$titleContainer.hide();
            }else{
                that.$titleContainer.show();
            }
        },
        // ********* END set functions ******************************************************


        // @todo functions

        setStartingPoint: function(){
            var el = false;

            if(this.animateFromElement !== true && this.animateFromElement){
                el = this.animateFromElement;
                w.jconfirm.lastClicked = false;
            }else if(w.jconfirm.lastClicked && this.animateFromElement === true){
                el = w.jconfirm.lastClicked;
                w.jconfirm.lastClicked = false;
            }else{
                return false;
            }

            if(!el)
                return false;

            var offset = el.offset();

            var iTop = el.outerHeight() / 2;
            var iLeft = el.outerWidth() / 2;

            // placing position of jconfirm modal in center of clicked element
            iTop -= this.$jconfirmBox.outerHeight() / 2;
            iLeft -= this.$jconfirmBox.outerWidth() / 2;

            // absolute position on screen
            var sourceTop = offset.top + iTop;
            sourceTop = sourceTop - this._scrollTop();
            var sourceLeft = offset.left + iLeft;

            // window halved
            var wh = $(window).height() / 2;
            var ww = $(window).width() / 2;

            var targetH = wh - this.$jconfirmBox.outerHeight() / 2;
            var targetW = ww - this.$jconfirmBox.outerWidth() / 2;

            sourceTop -= targetH;
            sourceLeft -= targetW;

            // Check if the element is inside the viewable window.
            if(Math.abs(sourceTop) > wh || Math.abs(sourceLeft) > ww)
                return false;

            this.$jconfirmBoxContainer.css('transform', 'translate(' + sourceLeft + 'px, ' + sourceTop + 'px)');
        },
        startAutoCloseCountdown: function(){
            if(!this.autoClose){
                return false;
            }

            var option = this.autoClose.split('|');
            var buttonKey = option[0];
            var time = option[1];

            if(typeof this.buttons[buttonKey] === 'undefined'){
                console.error("AutoClose: could not find button '" + buttonKey + "'");
                return false;
            }

            var seconds = Math.ceil(time / 1000);
        },
        stopAutoCloseCountdown: function(){

        },
        /**
         * @todo this is doubtful
         * @param autoClose
         * @returns {boolean}
         */
        setAutoClose: function(autoClose){
            if(autoClose && autoClose.split('|').length !== 2){
                console.error('Invalid option for autoClose. example \'buttonName|1000\'');
                return false;
            }

            this.autoClose = autoClose;
        },
    };

    w.jconfirm.instances = [];
    w.jconfirm.lastFocused = false;
    w.jconfirm.pluginDefaults = {
        template: `<div class="jconfirm">
    <div class="jconfirm-bg jconfirm-bg-dn"></div>

        <div class="jconfirm-box-container jconfirm-animated">

            <div class="jconfirm-box"
                 role="dialog"
                 aria-labelledby="labelled"
                 tabindex="-1">
                <div class="jconfirm-closeIcon">&times;</div>
                <div class="jconfirm-title-c">
                    <span class="jconfirm-icon-c"></span>
                    <span class="jconfirm-title"></span>
                </div>
                <div class="jconfirm-content-pane">
                    <div class="jconfirm-content"></div>
                </div>
                <div class="jconfirm-buttons">
                </div>
                <div class="jconfirm-clear">
                </div>
            </div>

        </div>
    </div>
    <div class="jconfirm-bs-sandbox">
        <div class="jconfirm-bs-container">
            <div class="jconfirm-bs-row">
                <div class="jconfirm-bs-col">
                    <div class="jconfirm-bs-mock"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- <div class="jconfirm-scrollpane">
         <div class="jconfirm-row">
             <div class="jconfirm-cell">
                 <div class="jconfirm-holder">
                     
                 </div>
             </div>
         </div>
     </div>-->
</div>`,
        title: 'Hello',
        titleClass: '',
        type: 'default',
        typeAnimated: true,
        draggable: true,
        dragWindowGap: 15,
        dragWindowBorder: true,
        animateFromElement: true,
        /**
         * @deprecated
         */
        alignMiddle: true,
        smoothContent: true,
        content: 'Are you sure to continue?',
        buttons: {},
        defaultButtons: {
            ok: {
                action: function(){
                }
            },
            close: {
                action: function(){
                }
            }
        },
        contentLoaded: function(){
        },
        icon: '',
        lazyOpen: false,
        bgOpacity: null,
        theme: 'light',
        animation: 'scale',
        closeAnimation: 'scale',
        animationSpeed: 400,
        animationBounce: 1,
        escapeKey: true,
        rtl: false,
        container: 'body',
        containerFluid: false,
        backgroundDismiss: false,
        backgroundDismissAnimation: 'shake',
        autoClose: false,
        closeIcon: null,
        closeIconClass: false,
        watchInterval: 100,
        columnClass: 'col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-10 col-xs-offset-1',
        boxWidth: '50%',
        scrollToPreviousElement: true,
        scrollToPreviousElementAnimate: true,
        useBootstrap: true,
        offsetTop: 40,
        offsetBottom: 40,
        bootstrapClasses: {
            container: 'container',
            containerFluid: 'container-fluid',
            row: 'row'
        },
        onContentReady: function(){

        },
        onOpenBefore: function(){

        },
        onOpen: function(){

        },
        onClose: function(){

        },
        onDestroy: function(){

        },
        onAction: function(){

        }
    };

    /**
     * This refers to the issue #241 and #246
     *
     * Problem:
     * Button A is clicked (keydown) using the Keyboard ENTER key
     * A opens the jconfirm modal B,
     * B has registered ENTER key for one of its button C
     * A is released (keyup), B gets the keyup event and triggers C.
     *
     * Solution:
     * Register a global keydown event, that tells jconfirm if the keydown originated inside jconfirm
     */
    var keyDown = false;
    $(window).on('keydown', function(e){
        if(!keyDown){
            var $target = $(e.target);
            var pass = false;
            if($target.closest('.jconfirm-box').length)
                pass = true;
            if(pass)
                $(window).trigger('jcKeyDown');

            keyDown = true;
        }
    });
    $(window).on('keyup', function(){
        keyDown = false;
    });
    w.jconfirm.lastClicked = false;
    $(document).on('mousedown', 'button, a, [jc-source]', function(){
        w.jconfirm.lastClicked = $(this);
    });
}));
