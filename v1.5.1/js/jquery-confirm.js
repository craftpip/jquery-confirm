'use strict';
/*!
 * jquery-confirm v1.5.1 (http://craftpip.github.io/jquery-confirm/)
 * Author: Boniface Pereira
 * Website: www.craftpip.com
 * Contact: hey@craftpip.com
 *
 * Copyright 2013-2015 jquery-confirm
 * Licensed under MIT (https://github.com/craftpip/jquery-confirm/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
    throw new Error('jquery-confirm requires jQuery');
}

var jconfirm, Jconfirm;
(function ($) {
    $.confirm = function (options) {
        /*
         *  Alias of jconfirm 
         */
        return jconfirm(options);
    };
    $.alert = function (options) {
        /*
         *  Alias of jconfirm 
         */
        options.cancelButton = false;
        return jconfirm(options);
    };
    $.dialog = function (options) {
        /*
         *  Alias of jconfirm 
         */
        options.cancelButton = false;
        options.confirmButton = false;
        return jconfirm(options);
    };
    jconfirm = function (options) {
        /*
         * initial function for calling.
         */
        if (jconfirm.defaults) {
            /*
             * Merge global defaults with plugin defaults
             */
            $.extend(jconfirm.pluginDefaults, jconfirm.defaults);
        }
        /*
         * merge options with plugin defaults.
         */
        var options = $.extend({}, jconfirm.pluginDefaults, options);
        return new Jconfirm(options);
    };
    Jconfirm = function (options) {
        /*
         * constructor function Jconfirm,
         * options = user options.
         */
        $.extend(this, options);
        this._init();
    };
    Jconfirm.prototype = {
        _init: function () {
            var that = this;
            this._rand = Math.round(Math.random() * 99999);
            this._buildHTML();
            this._bindEvents();
            setTimeout(function () {
                that.open();
            }, 0);
        },
        animations: ['anim-scale', 'anim-top', 'anim-bottom', 'anim-left', 'anim-right', 'anim-zoom', 'anim-opacity', 'anim-none', 'anim-rotate', 'anim-rotatex', 'anim-rotatey', 'anim-scalex', 'anim-scaley'],
        _buildHTML: function () {
            var that = this;
            /*
             * Cleaning animations.
             */
            this.animation = 'anim-' + this.animation.toLowerCase();
            if (this.animation === 'none')
                this.animationSpeed = 0;
            /*
             * Append html to body.
             */
            this.$el = $(this.template).appendTo(this.container).addClass(this.theme);
            this.$b = this.$el.find('.jconfirm-box').css({
                '-webkit-transition-duration': this.animationSpeed / 1000 + 's',
                'transition-duration': this.animationSpeed / 1000 + 's'
            });
            this.$b = this.$el.find('.jconfirm-box');
            this.$b.addClass(this.animation);
            /*
             * setup html contents
             */
            this.$el.find('div.title').html('<i class="' + this.icon + '"></i> ' + this.title);
            var contentDiv = this.$el.find('div.content');

            /*
             * Settings up buttons
             */
            var $btnc = this.$el.find('.buttons');
            if (this.confirmButton && this.confirmButton.trim() !== '') {
                this.$confirmButton = $('<button class="btn">' + this.confirmButton + '</button>').appendTo($btnc);
                this.$confirmButton.addClass(this.confirmButtonClass);
            }
            if (this.cancelButton && this.cancelButton.trim() !== '') {
                this.$cancelButton = $('<button class="btn">' + this.cancelButton + '</button>').appendTo($btnc);
                this.$cancelButton.addClass(this.cancelButtonClass);
            }
            if (!this.confirmButton && !this.cancelButton) {
                $btnc.remove();
                if (this.closeIcon)
                    this.$closeButton = this.$b.find('.closeIcon').show();
            }

            /*
             * If user provides a Url to load the content from.
             * Check if it has HTTP protocol.
             */
            if (this.content.substr(0, 4).toLowerCase() === 'url:') {
                contentDiv.html('');
                $btnc.find('button').attr('disabled', 'disabled');
                var url = this.content.substring(4, this.content.length);
                setTimeout(function () {
                    $.get(url, function (html) {
                        contentDiv.html(html);
                        $btnc.find('button').removeAttr('disabled');
                        that.setDialogCenter();
                    });
                }, 1);
            } else {
                contentDiv.html(this.content);
            }
            if (this.autoClose)
                this._startCountDown();
        },
        _startCountDown: function () {
            var opt = this.autoClose.split('|');
            if (/cancel/.test(opt[0]) && this.type === 'alert')
                return false;
            if (/confirm|cancel/.test(opt[0])) {
                this.$cd = $(' <span class="countdown"></span>').appendTo(this['$' + opt[0] + 'Button']);
                var that = this;
                that.$cd.parent().click();
                var time = opt[1] / 1000;
                this.interval = setInterval(function () {
                    that.$cd.html(' [' + (time -= 1) + ']');
                    if (time === 0) {
                        that.$cd.parent().trigger('click');
                        clearInterval(that.interval);
                    }
                }, 1000);
            }
        },
        _bindEvents: function () {
            var that = this;
            this.$el.find('.jconfirm-bg').click(function (e) {
                if (that.backgroundDismiss) {
                    that.cancel();
                    that.close();
                } else {
                    that.$b.addClass('hilight');
                    setTimeout(function () {
                        that.$b.removeClass('hilight');
                    }, 400);
                }
            });
            if (this.$confirmButton) {
                this.$confirmButton.click(function (e) {
                    e.preventDefault();
                    var r = that.confirm(that.$b);
                    if (typeof r === 'undefined' || r)
                        that.close();
                });
            }
            if (this.$cancelButton) {
                this.$cancelButton.click(function (e) {
                    e.preventDefault();
                    var r = that.cancel(that.$b);
                    if (typeof r === 'undefined' || r)
                        that.close();
                });
            }
            if (this.$closeButton) {
                this.$closeButton.click(function (e) {
                    e.preventDefault();
                    that.cancel();
                    that.close();
                });
            }
            if (this.keyboardEnabled) {
                setTimeout(function () {
                    $(window).on('keyup.' + this._rand, function (e) {
                        that.reactOnKey(e);
                    });
                }, 500);
            }

            $(window).on('resize.' + this._rand, function () {
                that.setDialogCenter();
            });

            this.setDialogCenter();
        },
        reactOnKey: function key(e) {
            /*
             * prevent keyup event if the dialog is not last! 
             */
            var a = $('.jconfirm');
            if (a.eq(a.length - 1)[0] !== this.$el[0])
                return false;

            var key = e.which;
            console.log(e);
            if (key === 27) {
                /*
                 * if ESC key
                 */
                if (!this.backgroundDismiss) {
                    /*
                     * If background dismiss is false, Glow the modal.
                     */
                    this.$el.find('.jconfirm-bg').click();
                    return false;
                }

                if (this.$cancelButton) {
                    this.$cancelButton.click();
                } else {
                    this.close();
                }
            }
            if (key === 13) {
                /*
                 * if ENTER key
                 */
                if (this.$confirmButton) {
                    this.$confirmButton.click();
                } else {

                }
            }
        },
        setDialogCenter: function () {
            var h = $(window).height(),
                    h2 = this.$b.height(),
                    mar = (h - h2) / 2;
            this.$b.find('.content').css({
                'max-height': h - 200 + 'px'
            });
            this.$b.css({
                'margin-top': mar
            });
        },
        close: function () {
            var that = this;
            /*
             unbind the window resize & keyup event.
             */
            $(window).unbind('resize.' + this._rand);
            if (this.keyboardEnabled)
                $(window).unbind('keyup.' + this._rand);

            this.$b.addClass(this.animation);
            $('body').removeClass('jconfirm-noscroll');
            setTimeout(function () {
                that.$el.remove();
            }, this.animationSpeed);
        },
        open: function () {
            var that = this;
            $('body').addClass('jconfirm-noscroll');
            this.$b.removeClass(this.animations.join(' '));
            /**
             * Blur the focused elements, prevents re-execution with button press.
             */
            $('body :focus').trigger('blur');
        }
    };

    jconfirm.pluginDefaults = {
        template: '<div class="jconfirm"><div class="jconfirm-bg"></div><div class="container"><div class="row"><div class="col-md-6 col-md-offset-3 span6 offset3"><div class="jconfirm-box"><div class="closeIcon"><span class="glyphicon glyphicon-remove"></span></div><div class="title"></div><div class="content"></div><div class="buttons pull-right"></div><div class="jquery-clear"></div></div></div></div></div></div>',
        title: 'Hello',
        content: 'Are you sure to continue?',
        icon: '',
        confirmButton: 'Okay',
        cancelButton: 'Cancel',
        confirmButtonClass: 'btn-default',
        cancelButtonClass: 'btn-default',
        theme: 'white',
        animation: 'scale',
        animationSpeed: 400,
        keyboardEnabled: false,
        container: 'body',
        confirm: function () {
        },
        cancel: function () {
        },
        backgroundDismiss: true,
        autoClose: false,
        closeIcon: true,
    };
})(jQuery);