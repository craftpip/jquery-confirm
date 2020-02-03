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
    /**
     * Our Constructor
     * @param options
     * @constructor
     */
    w.Jconfirm = function(options){
        /*
         * constructor function Jconfirm,
         * options = user options.
         */
        $.extend(this, options);
        this._init();
    };
    w.Jconfirm.prototype = {
        /**
         * Last focused element.
         */
        lastFocused: null,
        /**
         * Store a id for this popup
         */
        _id: null,
        /**
         * @private
         */
        _init: function(){
            var that = this;

            // get the last focused item,
            // this item will be brought back to focus once we close.
            if(!w.jconfirm.instances.length)
                w.jconfirm.lastFocused = $('body').find(':focus');

            this._id = Math.round(Math.random() * 99999);

            this.contentParsed = $('<div>');

            this.prepare();


            // we have to remove the timeout!,

            setTimeout(function(){
                that.open2();
            }, 100);
            // if(!this.lazyOpen){
            // that.open();
            // }
        },
        prepare: function(){
            var that = this;
            // prepare the whole modal here.

            // stores the whole template
            this.$el = $(this.template);
            // this.container = this.container || 'body';
            this.$container = $(this.container || 'body');

            // container that contains the box
            this.$jconfirmBoxContainer = this.$el.find('.jconfirm-box-container');

            // box after the container that contains the box
            this.$body = this.$jconfirmBox = this.$el.find('.jconfirm-box');

            // the background drop after $el
            this.$jconfirmBg = this.$el.find('.jconfirm-bg');

            // contains the title text
            this.$title = this.$el.find('.jconfirm-title');

            // contains the container that contains the title text
            this.$titleContainer = this.$el.find('.jconfirm-title-c');

            // this is where your content lives.
            this.$content = this.$el.find('div.jconfirm-content');

            // container that overflow:hidden your content when animating height
            this.$contentPane = this.$el.find('.jconfirm-content-pane');

            // an icon can explain the whole existence of your popup, art.
            this.$icon = this.$el.find('.jconfirm-icon-c');

            // the close icon can be useful when you use no buttons
            this.$closeIcon = this.$el.find('.jconfirm-closeIcon');

            // this holds the bootstrap's container class
            this.$holder = this.$el.find('.jconfirm-holder');

            // holds list of buttons
            this.$buttons = this.$el.find('.jconfirm-buttons');

            // same as buttons, in case someone might have used it
            this.$btnc = this.$buttons;

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

            // the container main container that overflow:hidden the whole thing
            this.$scrollPane = this.$el.find('.jconfirm-scrollpane');

            this.$widthClone = this.$el.find('.jconfirm-width-clone');

            // event
            this._contentReady = $.Deferred();
            this._modalReady = $.Deferred();
            // we will open the model, once both the above events are complete.


            // this must be done in the end,
            // loading the title and content
            // setting all options that are passed
            var titlePromise = this.setTitle(this.title);
            var contentPromise = this.setContent2(this.content);

            // set other things
            this.setAnimation2(this.animation);
            // we have to set the animated state of the popup first!
            this.$jconfirmBox.addClass(this.animation);

            this.setIcon(this.icon);
            this.setOffset('top', this.offsetTop);
            this.setOffset('bottom', this.offsetBottom);
            this.setCloseAnimation2(this.closeAnimation);
            this.setBackgroundDismissAnimation(this.backgroundDismissAnimation);
            this.setType2(this.type);
            this.setTheme2(this.theme);
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
            this.$jconfirmBox
                .attr('aria-labelledby', ariaLabel)
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

            that.$body.css(that._getCSS(that.animationSpeed, that.animationBounce));
            that.$contentPane.css(that._getCSS(that.animationSpeed, 1));
            that.$jconfirmBg.css(that._getCSS(that.animationSpeed, 1));
            that.$jconfirmBoxContainer.css(that._getCSS(that.animationSpeed, 1));
        },
        open2: function(){
            var that = this;

            // this.setStartingPoint();
            this.$body.removeClass(this.animation); // remove the animation class.
            this.$jconfirmBg.removeClass(this._prefix + 'bg-h');
            // this.$body.focus();
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
        setAutoClose: function(autoClose){
            if(autoClose && autoClose.split('|').length !== 2){
                console.error('Invalid option for autoClose. example \'buttonName|1000\'');
                return false;
            }

            this.autoClose = autoClose;
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

                    that._stopCountDown();
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
        setCloseIcon: function(state){
            var buttonsLength = Object.keys(this.buttons).length;

            if(buttonsLength === 0 && state === null){
                // ok, this is ready to be a dialog
                state = true;
            }

            if(state){
                this.$closeIcon.show();
            }else{
                this.$closeIcon.hide();
            }
            this.closeIcon = state;
        },
        /**
         * Bind event for close icon
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
        /**
         * Set the close icon's class
         * @param iconClass
         */
        setCloseIconClass: function(iconClass){
            if(iconClass){
                this.$closeIcon.html('<i class="' + iconClass + '"></i>');
            }else{
                this.$closeIcon.html('&times;');
            }
            this.closeIconClass = iconClass;
        },
        /**
         * Set the box to rtl or no ?
         * @param state
         */
        setRtl: function(state){
            if(state){
                this.$el.addClass(this._prefix + 'rtl');
            }else{
                this.$el.removeClass(this._prefix + 'rtl');
            }
            this.rtl = state;
        },
        setBgOpacity: function(opacity){
            this.$jconfirmBg.css({
                'opacity': typeof opacity === 'number' ? opacity : null,
            });
        },
        setTitleClass: function(titleClass){
            var previousValue = this.titleClass;
            this.$titleContainer
                .removeClass(previousValue)
                .addClass(titleClass);
            this.titleClass = titleClass;
        },
        setUseBootstrap: function(state){
            var $bsRow = this.$el.find('.jc-bs3-row');
            var $bsContainer = this.$el.find('.jc-bs3-container');
            if(state){
                $bsRow.addClass(this.bootstrapClasses.row)
                    .addClass('justify-content-md-center justify-content-sm-center justify-content-xs-center justify-content-lg-center');

                this.setColumnClass2(this.columnClass);
                this.setContainerFluid(this.containerFluid);
                this.$jconfirmBox.css({
                    'width': null
                });
            }else{
                this.$jconfirmBox.css({
                    'width': this.boxWidth
                });
                this.setColumnClass2(this.columnClass);
                this.setContainerFluid(this.containerFluid);
            }
            this.useBootstrap = state;
        },
        setContainerFluid: function(state){
            var $bsContainer = this.$el.find('.jc-bs3-container');

            $bsContainer.removeClass(this.bootstrapClasses.containerFluid)
                .removeClass(this.bootstrapClasses.container);

            if(this.useBootstrap){
                if(state){
                    $bsContainer.addClass(this.bootstrapClasses.containerFluid);
                }else{
                    $bsContainer.addClass(this.bootstrapClasses.container);
                }
                this.containerFluid = state;
            }
        },
        setIsTypeAnimated: function(state){
            var n = this._prefix + 'type-animated';
            if(state){
                this.$jconfirmBox.addClass(n);
            }else{
                this.$jconfirmBox.removeClass(n);
            }
        },
        animation: '',
        closeAnimation: '',
        /**
         * Set animation is directly setting the animation class.
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
            return (animation || '').split(',').map(function(a){
                return that._prefix + 'animation-' + $.trim(a);
            }).join(' ');
        },
        /**
         * Set the type style of the popup,
         * red, green, orange, rainbow so on
         *
         * @param type
         * @returns {PromiseLike<any> | Promise<any>}
         */
        setType2: function(type){
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
         * This function prefixes the strings given
         * ignores if it already has it.
         */
        prefx: function(prefix, str){
            // rule: prefixes should not contain -,
            // the users string contain -

            var ex = str.split('-');
            if(ex.indexOf(prefix) === -1)
                ex.splice(0, 0, prefix);

            if(ex.indexOf(this._prefix) === -1)
                ex.splice(0, 0, this._prefix);

            // _prefix must be added before prefix

            return ex.join('-');
        },
        /**
         * the background dismiss animation?
         * what css animation should play
         * @param animation
         */
        setBackgroundDismissAnimation: function(animation){
            var that = this;
            var previousValue = this.backgroundDismissAnimation;
            this.resolveOption(animation).then(function(response){
                that.backgroundDismissAnimation = (response || '').split(',').map(function(a){
                    return that.prefix('hilight-', a);
                }).join(' ');
                that.$jconfirmBox
                    .removeClass(previousValue)
                    .addClass(that.backgroundDismissAnimation);
            });
        },
        /**
         * do it or ignore if already done
         * @param prefix
         * @param str
         * @returns {string|*}
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
        /**
         * Set the theme
         *
         * @param theme
         */
        setTheme2: function(theme){
            var that = this;
            var previousValue = typeof this.theme === 'string' ? this.theme : '';
            this.resolveOption(theme).then(function(response){
                that.theme = (response || '').split(',').map(function(a){
                    console.log(that.prefix('', a));
                    console.log(that._prefix + $.trim(a));
                    return that._prefix + $.trim(a);
                }).join(' ');
                that.$el
                    .removeClass(previousValue)
                    .addClass(that.theme);
            });
        },
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
                (that.contentLoaded || that.noop)(response);
                that.onContentReady.apply(that);
                return that.content;
            });
        },
        setColumnClass2: function(columnClass){
            var p = '';
            var previousValue = this.columnClass;
            if(!this.useBootstrap){
                this.$jconfirmBoxContainer.removeClass(previousValue);
                return;
            }
            switch(columnClass.toLowerCase()){
                case 'xl':
                case 'xlarge':
                    p = 'col-md-12';
                    break;
                case 'l':
                case 'large':
                    p = 'col-md-8 col-md-offset-2';
                    break;
                case 'm':
                case 'medium':
                    p = 'col-md-6 col-md-offset-3';
                    break;
                case 's':
                case 'small':
                    p = 'col-md-4 col-md-offset-4';
                    break;
                case 'xs':
                case 'xsmall':
                    p = 'col-md-2 col-md-offset-5';
                    break;
                default:
                    p = columnClass;
            }
            this.columnClass = p;
            this.$jconfirmBoxContainer
                .removeClass(previousValue)
                .addClass(this.columnClass);
        },
        noop: function(){
        },
        /**
         * Set all initial options
         * @param position
         * @param value
         */
        setOffset: function(position, value){
            var o = {};
            o['padding-' + position] = value;
            this.$holder.css(o);
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
        _buildHTML: function(){
            var that = this;

            // prefix the animation string and store in animationParsed
            // this._parseAnimation(this.animation, 'o');
            // this._parseAnimation(this.closeAnimation, 'c');
            // this._parseBgDismissAnimation(this.backgroundDismissAnimation);
            // this._parseColumnClass(this.columnClass);
            // this._parseTheme(this.theme);
            // this._parseType(this.type);

            /*
             * Append html.
             */
            this.$el = $(this.template);
            var template = this.$el;
            // template.find('.jconfirm-box').addClass(this.animationParsed).addClass(this.backgroundDismissAnimationParsed).addClass(this.typeParsed);
            //
            // if(this.typeAnimated)
            //     template.find('.jconfirm-box').addClass('jconfirm-type-animated');
            //
            // if(this.useBootstrap){
            //     template.find('.jc-bs3-row').addClass(this.bootstrapClasses.row);
            //     template.find('.jc-bs3-row').addClass('justify-content-md-center justify-content-sm-center justify-content-xs-center justify-content-lg-center');
            //
            //     template.find('.jconfirm-box-container').addClass(this.columnClassParsed);
            //
            //     if(this.containerFluid)
            //         template.find('.jc-bs3-container').addClass(this.bootstrapClasses.containerFluid);
            //     else
            //         template.find('.jc-bs3-container').addClass(this.bootstrapClasses.container);
            // }else{
            //     template.find('.jconfirm-box').css('width', this.boxWidth);
            // }

            // if(this.titleClass)
            //     template.find('.jconfirm-title-c').addClass(this.titleClass);

            // template.addClass(this.themeParsed);
            // var ariaLabel = 'jconfirm-box' + this._id;
            // template.find('.jconfirm-box').attr('aria-labelledby', ariaLabel).attr('tabindex', -1);
            // template.find('.jconfirm-content').attr('id', ariaLabel);
            // if(this.bgOpacity !== null)
            //     template.find('.jconfirm-bg').css('opacity', this.bgOpacity);
            // if(this.rtl)
            //     template.addClass('jconfirm-rtl');

            // this.$el = template.appendTo(this.container);
            // console.log(this.$el);
            // this.$jconfirmBoxContainer = this.$el.find('.jconfirm-box-container');
            // this.$jconfirmBox = this.$body = this.$el.find('.jconfirm-box');
            // this.$jconfirmBg = this.$el.find('.jconfirm-bg');
            // this.$title = this.$el.find('.jconfirm-title');
            // this.$titleContainer = this.$el.find('.jconfirm-title-c');
            // this.$content = this.$el.find('div.jconfirm-content');
            // this.$contentPane = this.$el.find('.jconfirm-content-pane');
            // this.$icon = this.$el.find('.jconfirm-icon-c');
            // this.$closeIcon = this.$el.find('.jconfirm-closeIcon');
            // this.$holder = this.$el.find('.jconfirm-holder');
            // this.$content.css(this._getCSS(this.animationSpeed, this.animationBounce));
            // this.$btnc = this.$el.find('.jconfirm-buttons');
            // this.$scrollPane = this.$el.find('.jconfirm-scrollpane');

            // that.setStartingPoint();

            // for loading content via URL
            this._contentReady = $.Deferred();
            this._modalReady = $.Deferred();
            // this.$holder.css({
            //     'padding-top': this.offsetTop,
            //     'padding-bottom': this.offsetBottom,
            // });

            // this.setTitle(this.title);
            // this.setIcon(this.icon);
            // this._setButtons();
            // this._parseContent();


            // if(this.isAjax)
            //     this.showLoading(false);

            // @todo: set the content height and watch for changes.
            // $.when(this._contentReady, this._modalReady).then(function(){
            //     if(that.isAjaxLoading)
            //         setTimeout(function(){
            //             that.isAjaxLoading = false;
            //             that.setContent();
            //             that.setTitle();
            //             that.setIcon();
            //             setTimeout(function(){
            //                 that.hideLoading(false);
            //                 that._updateContentMaxHeight();
            //             }, 100);
            //             if(typeof that.onContentReady === 'function')
            //                 that.onContentReady();
            //         }, 50);
            //     else{
            //         // that.setContent();
            //         that._updateContentMaxHeight();
            //         that.setTitle();
            //         that.setIcon();
            //         if(typeof that.onContentReady === 'function')
            //             that.onContentReady();
            //     }
            //
            //     // start countdown after content has loaded.
            //     if(that.autoClose)
            //         that._startCountDown();
            // }).then(function(){
            //     that._watchContent();
            // });

            // if(this.animation === 'none'){
            //     this.animationSpeed = 1;
            //     this.animationBounce = 1;
            // }

            // this.$body.css(this._getCSS(this.animationSpeed, this.animationBounce));
            // this.$contentPane.css(this._getCSS(this.animationSpeed, 1));
            // this.$jconfirmBg.css(this._getCSS(this.animationSpeed, 1));
            // this.$jconfirmBoxContainer.css(this._getCSS(this.animationSpeed, 1));
        },
        _typePrefix: 'jconfirm-type-',
        typeParsed: '',
        _parseType: function(type){
            this.typeParsed = this._typePrefix + type;
        },
        setType: function(type){
            var oldClass = this.typeParsed;
            this._parseType(type);
            this.$jconfirmBox.removeClass(oldClass).addClass(this.typeParsed);
        },
        themeParsed: '',
        _themePrefix: 'jconfirm-',
        setTheme: function(theme){
            var previous = this.theme;
            this.theme = theme || this.theme;
            this._parseTheme(this.theme);
            if(previous)
                this.$el.removeClass(previous);
            this.$el.addClass(this.themeParsed);
            this.theme = theme;
        },
        _parseTheme: function(theme){
            var that = this;
            theme = theme.split(',');
            $.each(theme, function(k, a){
                if(a.indexOf(that._themePrefix) === -1)
                    theme[k] = that._themePrefix + $.trim(a);
            });
            this.themeParsed = theme.join(' ').toLowerCase();
        },
        backgroundDismissAnimationParsed: '',
        _bgDismissPrefix: 'jconfirm-hilight-',
        _parseBgDismissAnimation: function(bgDismissAnimation){
            var animation = bgDismissAnimation.split(',');
            var that = this;
            $.each(animation, function(k, a){
                if(a.indexOf(that._bgDismissPrefix) === -1)
                    animation[k] = that._bgDismissPrefix + $.trim(a);
            });
            this.backgroundDismissAnimationParsed = animation.join(' ').toLowerCase();
        },
        animationParsed: '',
        closeAnimationParsed: '',
        _prefix: 'jconfirm-',
        _animationPrefix: 'jconfirm-animation-',
        setAnimation: function(animation){
            this.animation = animation || this.animation;
            this._parseAnimation(this.animation, 'o');
        },
        _parseAnimation: function(animation, which){
            which = which || 'o'; // parse what animation and store where. open or close?
            var animations = animation.split(',');
            var that = this;
            $.each(animations, function(k, a){
                if(a.indexOf(that._animationPrefix) === -1)
                    animations[k] = that._animationPrefix + $.trim(a);
            });
            var a_string = animations.join(' ').toLowerCase();
            if(which === 'o')
                this.animationParsed = a_string;
            else
                this.closeAnimationParsed = a_string;

            return a_string;
        },
        setCloseAnimation: function(closeAnimation){
            this.closeAnimation = closeAnimation || this.closeAnimation;
            this._parseAnimation(this.closeAnimation, 'c');
        },
        setAnimationSpeed: function(speed){
            this.animationSpeed = speed || this.animationSpeed;
            // this.$body.css(this._getCSS(this.animationSpeed, this.animationBounce));
        },
        columnClassParsed: '',
        setColumnClass: function(colClass){
            if(!this.useBootstrap){
                console.warn("cannot set columnClass, useBootstrap is set to false");
                return;
            }
            this.columnClass = colClass || this.columnClass;
            this._parseColumnClass(this.columnClass);
            this.$jconfirmBoxContainer.addClass(this.columnClassParsed);
        },
        _updateContentMaxHeight: function(){
            var height = $(window).height() - (this.$jconfirmBox.outerHeight() - this.$contentPane.outerHeight()) - (this.offsetTop + this.offsetBottom);
            this.$contentPane.css({
                'max-height': height + 'px'
            });
        },
        setBoxWidth: function(width){
            if(this.useBootstrap){
                console.warn("cannot set boxWidth, useBootstrap is set to true");
                return;
            }
            this.boxWidth = width;
            this.$jconfirmBox.css('width', width);
        },
        _parseColumnClass: function(colClass){
            colClass = colClass.toLowerCase();
            var p;
            switch(colClass){
                case 'xl':
                case 'xlarge':
                    p = 'col-md-12';
                    break;
                case 'l':
                case 'large':
                    p = 'col-md-8 col-md-offset-2';
                    break;
                case 'm':
                case 'medium':
                    p = 'col-md-6 col-md-offset-3';
                    break;
                case 's':
                case 'small':
                    p = 'col-md-4 col-md-offset-4';
                    break;
                case 'xs':
                case 'xsmall':
                    p = 'col-md-2 col-md-offset-5';
                    break;
                default:
                    p = colClass;
            }
            this.columnClassParsed = p;
        },
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
        _scrollTop: function(){
            if(typeof pageYOffset !== 'undefined'){
                //most browsers except IE before #9
                return pageYOffset;
            }else{
                var B = document.body; //IE 'quirks'
                var D = document.documentElement; //IE with doctype
                D = (D.clientHeight) ? D : B;
                return D.scrollTop;
            }
        },
        _watchContent: function(){
            var that = this;
            if(this._timer) clearInterval(this._timer);

            var prevContentHeight = 0;
            this._timer = setInterval(function(){
                if(that.smoothContent){
                    var contentHeight = that.$content.outerHeight() || 0;
                    if(contentHeight !== prevContentHeight){

                        // Commented out to prevent scroll to top when updating the content
                        // (for example when using ajax in forms in content)
                        // that.$contentPane.css({
                        //     'height': contentHeight
                        // }).scrollTop(0);
                        prevContentHeight = contentHeight;
                    }
                    var wh = $(window).height();
                    var total = that.offsetTop + that.offsetBottom + that.$jconfirmBox.height() - that.$contentPane.height() + that.$content.height();
                    if(total < wh){
                        that.$contentPane.addClass('no-scroll');
                    }else{
                        that.$contentPane.removeClass('no-scroll');
                    }
                }
            }, this.watchInterval);
        },
        _overflowClass: 'jconfirm-overflow',
        _hilightAnimating: false,
        highlight: function(){
            this.hiLightModal();
        },
        hiLightModal: function(){
            var that = this;
            if(this._hilightAnimating)
                return;

            that.$body.addClass('hilight');
            var duration = parseFloat(that.$body.css('animation-duration')) || 2;
            this._hilightAnimating = true;
            setTimeout(function(){
                that._hilightAnimating = false;
                that.$body.removeClass('hilight');
            }, duration * 1000);
        },
        _bindEvents: function(){
            var that = this;
            this.boxClicked = false;

            this.$scrollPane.click(function(e){ // Ignore propagated clicks
                if(!that.boxClicked){ // Background clicked
                    /*
                     If backgroundDismiss is a function and its return value is truthy
                     proceed to close the modal.
                     */
                    var buttonName = false;
                    var shouldClose = false;
                    var str;

                    if(typeof that.backgroundDismiss === 'function')
                        str = that.backgroundDismiss();
                    else
                        str = that.backgroundDismiss;

                    if(typeof str === 'string' && typeof that.buttons[str] !== 'undefined'){
                        buttonName = str;
                        shouldClose = false;
                    }else if(typeof str === 'undefined' || !!(str) === true){
                        shouldClose = true;
                    }else{
                        shouldClose = false;
                    }

                    if(buttonName){
                        var btnResponse = that.buttons[buttonName].action.apply(that);
                        shouldClose = (typeof btnResponse === 'undefined') || !!(btnResponse);
                    }

                    if(shouldClose)
                        that.close();
                    else
                        that.hiLightModal();
                }
                that.boxClicked = false;
            });

            this.$jconfirmBox.click(function(e){
                that.boxClicked = true;
            });

            var isKeyDown = false;
            $(window).on('jcKeyDown.' + that._id, function(e){
                if(!isKeyDown){
                    isKeyDown = true;
                }
            });
            $(window).on('keyup.' + that._id, function(e){
                if(isKeyDown){
                    that.reactOnKey(e);
                    isKeyDown = false;
                }
            });

            $(window).on('resize.' + this._id, function(){
                that._updateContentMaxHeight();
                setTimeout(function(){
                    that.resetDrag();
                }, 100);
                that._updateWidthClone();
            });
        },
        updateAnimatedPosition: function(){

        },
        modalWidth: null,
        /**
         * acknowledge the width of our modal
         * @private
         */
        _updateWidthClone: function(){
            var width = this.$widthClone.width();
            this.modalWidth = width;
            console.log(this.modalWidth, 'requriedwidht');
            this.updateAnimatedPosition();
        },
        _cubic_bezier: '0.36, 0.55, 0.19',
        _getCSS: function(speed, bounce){
            return {
                '-webkit-transition-duration': speed / 1000 + 's',
                'transition-duration': speed / 1000 + 's',
                '-webkit-transition-timing-function': 'cubic-bezier(' + this._cubic_bezier + ', ' + bounce + ')',
                'transition-timing-function': 'cubic-bezier(' + this._cubic_bezier + ', ' + bounce + ')'
            };
        },
        _setButtons: function(){
            var that = this;
            /*
             * Settings up buttons
             */

            var total_buttons = 0;
            if(typeof this.buttons !== 'object')
                this.buttons = {};

            $.each(this.buttons, function(key, button){
                total_buttons += 1;
                if(typeof button === 'function'){
                    that.buttons[key] = button = {
                        action: button
                    };
                }

                that.buttons[key].text = button.text || key;
                that.buttons[key].btnClass = button.btnClass || 'btn-default';
                that.buttons[key].action = button.action || function(){
                };
                that.buttons[key].keys = button.keys || [];
                that.buttons[key].isHidden = button.isHidden || false;
                that.buttons[key].isDisabled = button.isDisabled || false;

                $.each(that.buttons[key].keys, function(i, a){
                    that.buttons[key].keys[i] = a.toLowerCase();
                });

                var button_element = $('<button type="button" class="btn"></button>')
                    .html(that.buttons[key].text)
                    .addClass(that.buttons[key].btnClass)
                    .prop('disabled', that.buttons[key].isDisabled)
                    .css('display', that.buttons[key].isHidden ? 'none' : '')
                    .click(function(e){
                        e.preventDefault();
                        var res = that.buttons[key].action.apply(that, [that.buttons[key]]);
                        that.onAction.apply(that, [key, that.buttons[key]]);
                        that._stopCountDown();
                        if(typeof res === 'undefined' || res)
                            that.close();
                    });

                // @todo: m here
                that.buttons[key].el = button_element;
                that.buttons[key].setText = function(text){
                    button_element.html(text);
                };
                that.buttons[key].addClass = function(className){
                    button_element.addClass(className);
                };
                that.buttons[key].removeClass = function(className){
                    button_element.removeClass(className);
                };
                that.buttons[key].disable = function(){
                    that.buttons[key].isDisabled = true;
                    button_element.prop('disabled', true);
                };
                that.buttons[key].enable = function(){
                    that.buttons[key].isDisabled = false;
                    button_element.prop('disabled', false);
                };
                that.buttons[key].show = function(){
                    that.buttons[key].isHidden = false;
                    button_element.css('display', '');
                };
                that.buttons[key].hide = function(){
                    that.buttons[key].isHidden = true;
                    button_element.css('display', 'none');
                };
                /*
                 Buttons are prefixed with $_ or $$ for quick access
                 */
                that['$_' + key] = that['$$' + key] = button_element;
                that.$btnc.append(button_element);
            });

            if(total_buttons === 0) this.$btnc.hide();
            if(this.closeIcon === null && total_buttons === 0){
                /*
                 in case when no buttons are present & closeIcon is null, closeIcon is set to true,
                 set closeIcon to true to explicitly tell to hide the close icon
                 */
                this.closeIcon = true;
            }

            if(this.closeIcon){
                if(this.closeIconClass){
                    // user requires a custom class.
                    var closeHtml = '<i class="' + this.closeIconClass + '"></i>';
                    this.$closeIcon.html(closeHtml);
                }

                this.$closeIcon.click(function(e){
                    e.preventDefault();

                    var buttonName = false;
                    var shouldClose = false;
                    var str;

                    if(typeof that.closeIcon === 'function'){
                        str = that.closeIcon();
                    }else{
                        str = that.closeIcon;
                    }

                    if(typeof str === 'string' && typeof that.buttons[str] !== 'undefined'){
                        buttonName = str;
                        shouldClose = false;
                    }else if(typeof str === 'undefined' || !!(str) === true){
                        shouldClose = true;
                    }else{
                        shouldClose = false;
                    }
                    if(buttonName){
                        var btnResponse = that.buttons[buttonName].action.apply(that);
                        shouldClose = (typeof btnResponse === 'undefined') || !!(btnResponse);
                    }
                    if(shouldClose){
                        that.close();
                    }
                });
                this.$closeIcon.show();
            }else{
                this.$closeIcon.hide();
            }
        },
        /**
         * Set title of the modal
         *
         * @param string
         * @returns {PromiseLike<any> | Promise<any>}
         */
        setTitle: function(string){
            var that = this;
            return this.resolveOption(string).then(function(response){
                that.title = response || '';
                that.$title.html(that.title);
                that.updateTitleIconContainer();
                return that.title;
            });
        },
        setIcon: function(iconClass, force){
            var that = this;
            this.resolveOption(iconClass).then(function(response){
                that.icon = response || '';
                that.$icon.html(this.icon ? '<i class="' + this.icon + '"></i>' : '');
                that.updateTitleIconContainer();
            });
        },
        /**
         * hide if title and icon is false
         */
        updateTitleIconContainer: function(){
            var that = this;
            if(!that.title && !that.icon){
                that.$titleContainer.hide();
            }else{
                that.$titleContainer.show();
            }
        },
        /**
         * @todo needs attention
         * @param content
         * @param force
         */
        setContentPrepend: function(content, force){
            if(!content)
                return;

            this.contentParsed.prepend(content);
        },
        setContentAppend: function(content){
            if(!content)
                return;

            this.contentParsed.append(content);
        },
        setContent: function(content, force){
            force = !!force;
            var that = this;
            if(content)
                this.contentParsed.html('').append(content);
            if(this.isAjaxLoading && !force)
                return;

            this.$content.html('');
            this.$content.append(this.contentParsed);
            setTimeout(function(){
                that.$body.find('input[autofocus]:visible:first').focus();
            }, 100);
        },
        loadingSpinner: false,
        showLoading: function(disableButtons){
            this.loadingSpinner = true;
            this.$jconfirmBox.addClass('loading');
            if(disableButtons)
                this.$btnc.find('button').prop('disabled', true);

        },
        hideLoading: function(enableButtons){
            this.loadingSpinner = false;
            this.$jconfirmBox.removeClass('loading');
            if(enableButtons)
                this.$btnc.find('button').prop('disabled', false);

        },
        ajaxResponse: false,
        contentParsed: '',
        isAjax: false,
        isAjaxLoading: false,
        _parseContent: function(){
            var that = this;
            var e = '&nbsp;';

            if(typeof this.content === 'function'){
                var res = this.content.apply(this);
                if(typeof res === 'string'){
                    this.content = res;
                }else if(typeof res === 'object' && typeof res.always === 'function'){
                    // this is ajax loading via promise
                    this.isAjax = true;
                    this.isAjaxLoading = true;
                    res.always(function(data, status, xhr){
                        that.ajaxResponse = {
                            data: data,
                            status: status,
                            xhr: xhr
                        };
                        that._contentReady.resolve(data, status, xhr);
                        if(typeof that.contentLoaded === 'function')
                            that.contentLoaded(data, status, xhr);
                    });
                    this.content = e;
                }else{
                    this.content = e;
                }
            }

            if(typeof this.content === 'string' && this.content.substr(0, 4).toLowerCase() === 'url:'){
                this.isAjax = true;
                this.isAjaxLoading = true;
                var u = this.content.substring(4, this.content.length);
                $.get(u).done(function(html){
                    that.contentParsed.html(html);
                }).always(function(data, status, xhr){
                    that.ajaxResponse = {
                        data: data,
                        status: status,
                        xhr: xhr
                    };
                    that._contentReady.resolve(data, status, xhr);
                    if(typeof that.contentLoaded === 'function')
                        that.contentLoaded(data, status, xhr);
                });
            }

            if(!this.content)
                this.content = e;

            if(!this.isAjax){
                this.contentParsed.html(this.content);
                this.setContent();
                that._contentReady.resolve();
            }
        },
        _stopCountDown: function(){
            clearInterval(this.autoCloseInterval);
            if(this.$cd)
                this.$cd.remove();
        },
        _startCountDown: function(){
            var that = this;
            var opt = this.autoClose.split('|');
            if(opt.length !== 2){
                console.error('Invalid option for autoClose. example \'close|10000\'');
                return false;
            }

            var button_key = opt[0];
            var time = parseInt(opt[1]);
            if(typeof this.buttons[button_key] === 'undefined'){
                console.error('Invalid button key \'' + button_key + '\' for autoClose');
                return false;
            }

            var seconds = Math.ceil(time / 1000);
            this.$cd = $('<span class="countdown"> (' + seconds + ')</span>')
                .appendTo(this['$_' + button_key]);

            this.autoCloseInterval = setInterval(function(){
                that.$cd.html(' (' + (seconds -= 1) + ') ');
                if(seconds <= 0){
                    that['$$' + button_key].trigger('click');
                    that._stopCountDown();
                }
            }, 1000);
        },
        _getKey: function(key){
            // very necessary keys.
            switch(key){
                case 192:
                    return 'tilde';
                case 13:
                    return 'enter';
                case 16:
                    return 'shift';
                case 9:
                    return 'tab';
                case 20:
                    return 'capslock';
                case 17:
                    return 'ctrl';
                case 91:
                    return 'win';
                case 18:
                    return 'alt';
                case 27:
                    return 'esc';
                case 32:
                    return 'space';
            }

            // only trust alphabets with this.
            var initial = String.fromCharCode(key);
            if(/^[A-z0-9]+$/.test(initial))
                return initial.toLowerCase();
            else
                return false;
        },
        reactOnKey: function(e){
            var that = this;

            /*
             Prevent keyup event if the dialog is not last!
             */
            var a = $('.jconfirm');
            if(a.eq(a.length - 1)[0] !== this.$el[0])
                return false;

            var key = e.which;
            /*
             Do not react if Enter or Space is pressed on input elements
             */
            if(this.$content.find(':input').is(':focus') && /13|32/.test(key))
                return false;

            var keyChar = this._getKey(key);

            // If esc is pressed
            if(keyChar === 'esc' && this.escapeKey){
                if(this.escapeKey === true){
                    this.$scrollPane.trigger('click');
                }else if(typeof this.escapeKey === 'string' || typeof this.escapeKey === 'function'){
                    var buttonKey;
                    if(typeof this.escapeKey === 'function'){
                        buttonKey = this.escapeKey();
                    }else{
                        buttonKey = this.escapeKey;
                    }

                    if(buttonKey)
                        if(typeof this.buttons[buttonKey] === 'undefined'){
                            console.warn('Invalid escapeKey, no buttons found with key ' + buttonKey);
                        }else{
                            this['$_' + buttonKey].trigger('click');
                        }
                }
            }

            // check if any button is listening to this key.
            $.each(this.buttons, function(key, button){
                if(button.keys.indexOf(keyChar) !== -1){
                    that['$_' + key].trigger('click');
                }
            });
        },
        setDialogCenter: function(){
            console.info('setDialogCenter is deprecated, dialogs are centered with CSS3 tables');
        },
        _unwatchContent: function(){
            clearInterval(this._timer);
        },
        _bgShow: function(){
            var that = this;
            this.$jconfirmBg.removeClass(this._prefix + 'bg-h');
            setTimeout(function(){
                that.$jconfirmBg.addClass(this._prefix + 'bg-dn');
            }, this.animationSpeed);
        },
        _bgHide: function(){
            var that = this;
            this.$jconfirmBg.removeClass(this._prefix + 'bg-dn');
            this.$jconfirmBg.addClass(this._prefix + 'bg-h');
        },
        close: function(onClosePayload){
            var that = this;

            if(typeof this.onClose === 'function')
                this.onClose(onClosePayload);

            this._unwatchContent();

            /*
             unbind the window resize & keyup event.
             */
            $(window).unbind('resize.' + this._id);
            $(window).unbind('keyup.' + this._id);
            $(window).unbind('jcKeyDown.' + this._id);

            if(this.draggable){
                $(window).unbind('mousemove.' + this._id);
                $(window).unbind('mouseup.' + this._id);
                this.$titleContainer.unbind('mousedown');
            }

            that.$el.removeClass(that.loadedClass);
            $('body').removeClass('jconfirm-no-scroll-' + that._id);
            that.$jconfirmBoxContainer.removeClass('jconfirm-no-transition');

            setTimeout(function(){
                that.$body.addClass(that.closeAnimationParsed);
                that.$jconfirmBg.addClass('jconfirm-bg-h');
                var closeTimer = (that.closeAnimation === 'none') ? 1 : that.animationSpeed;

                setTimeout(function(){
                    that.$el.remove();

                    var l = w.jconfirm.instances;
                    var i = w.jconfirm.instances.length - 1;
                    for(i; i >= 0; i--){
                        if(w.jconfirm.instances[i]._id === that._id){
                            w.jconfirm.instances.splice(i, 1);
                        }
                    }

                    // Focusing a element, scrolls automatically to that element.
                    // no instances should be open, lastFocused should be true, the lastFocused element must exists in DOM
                    if(!w.jconfirm.instances.length){
                        if(that.scrollToPreviousElement && w.jconfirm.lastFocused && w.jconfirm.lastFocused.length && $.contains(document, w.jconfirm.lastFocused[0])){
                            var $lf = w.jconfirm.lastFocused;
                            if(that.scrollToPreviousElementAnimate){
                                var st = $(window).scrollTop();
                                var ot = w.jconfirm.lastFocused.offset().top;
                                var wh = $(window).height();
                                if(!(ot > st && ot < (st + wh))){
                                    var scrollTo = (ot - Math.round((wh / 3)));
                                    $('html, body').animate({
                                        scrollTop: scrollTo
                                    }, that.animationSpeed, 'swing', function(){
                                        // gracefully scroll and then focus.
                                        $lf.focus();
                                    });
                                }else{
                                    // the element to be focused is already in view.
                                    $lf.focus();
                                }
                            }else{
                                $lf.focus();
                            }
                            w.jconfirm.lastFocused = false;
                        }
                    }

                    if(typeof that.onDestroy === 'function')
                        that.onDestroy();

                }, closeTimer * 0.40);
            }, 50);

            return true;
        },
        open: function(){
            if(this.isOpen())
                return false;

            // var that = this;
            // this._buildHTML();
            // this._bindEvents();
            this._open();

            return true;
        },
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
        _open: function(){
            var that = this;
            if(typeof that.onOpenBefore === 'function')
                that.onOpenBefore();

            this.$body.removeClass(this.animationParsed);
            this.$jconfirmBg.removeClass('jconfirm-bg-h');
            this.$body.focus();

            that.$jconfirmBoxContainer.css('transform', 'translate(' + 0 + 'px, ' + 0 + 'px)');

            setTimeout(function(){
                that.$body.css(that._getCSS(that.animationSpeed, 1));
                that.$body.css({
                    'transition-property': that.$body.css('transition-property') + ', margin'
                });
                that.$jconfirmBoxContainer.addClass('jconfirm-no-transition');
                that._modalReady.resolve();
                if(typeof that.onOpen === 'function')
                    that.onOpen();

                that.$el.addClass(that.loadedClass);
            }, this.animationSpeed);
        },
        loadedClass: 'jconfirm-open',
        isClosed: function(){
            return !this.$el || this.$el.parent().length === 0;
        },
        isOpen: function(){
            return !this.isClosed();
        },
        toggle: function(){
            if(!this.isOpen())
                this.open();
            else
                this.close();
        }
    };

    w.jconfirm.instances = [];
    w.jconfirm.lastFocused = false;
    w.jconfirm.pluginDefaults = {
        template: '' +
            '<div class="jconfirm">\n    ' +
            '<div class="jconfirm-bg jconfirm-bg-h"></div>\n    ' +
            '<div class="jconfirm-scrollpane">\n        ' +
            '<div class="jconfirm-row">\n            ' +
            '<div class="jconfirm-cell">\n                ' +
            '<div class="jconfirm-holder">\n                    ' +
            '<div class="jc-bs3-container">\n                        ' +
            '<div class="jc-bs3-row">\n                            ' +
            '<div class="jconfirm-box-container jconfirm-animated">\n                                <div class="jconfirm-width-clone"></div>\n                                ' +
            '<div class="jconfirm-box"\n                                     role="dialog"\n                                     aria-labelledby="labelled"\n                                     tabindex="-1">\n                                    ' +
            '<div class="jconfirm-closeIcon">&times;</div>\n                                    ' +
            '<div class="jconfirm-title-c">' +
            '<span class="jconfirm-icon-c"></span>' +
            '<span class="jconfirm-title"></span>' +
            '</div>\n                                    ' +
            '<div class="jconfirm-content-pane">\n                                        ' +
            '<div class="jconfirm-content"></div>\n                                    ' +
            '</div>\n                                    ' +
            '<div class="jconfirm-buttons">' +
            '</div>\n                                    ' +
            '<div class="jconfirm-clear">' +
            '</div>\n                                ' +
            '</div>\n                            ' +
            '</div>\n                        ' +
            '</div>\n                    ' +
            '</div>\n                ' +
            '</div>\n            ' +
            '</div>\n        ' +
            '</div>\n    ' +
            '</div>\n</div>',
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

    /**
     * Store the last focused element
     * @type {null}
     */
    w.jconfirm.lastFocused = null;

    /**
     * Store the last clicked element.
     * @type {boolean}
     */
    w.jconfirm.lastClicked = false;
    /**
     * Store the timeout instance, clear it soon please.
     * @type {boolean}
     */
    w.jconfirm.lastClickedTimeout = false;
    /**
     * Array of instances
     * @type {*[]}
     */
    w.jconfirm.instances = [];
    $(document).on('mousedown', '.jconfirm-animate-target, .jc-at, button, a, [jc-source]', function(){
        if(w.jconfirm.lastClickedTimeout)
            clearTimeout(w.jconfirm.lastClickedTimeout);

        var el = $(this);
        // validate proper appearance.
        var position = el.offset();
        if(!position.top && !position.left){
            // dont know what went wrong
            return;
        }

        w.jconfirm.lastClicked = el;
        console.log('global clicked, this happens before jconfirm runs or we run?');
        setTimeout(function(){
            clearTimeout(w.jconfirm.lastClickedTimeout);
            w.jconfirm.lastClickedTimeout = false;
        }, 100);
    });
}));
