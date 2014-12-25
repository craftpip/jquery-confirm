'use strict';
/*!
 * jquery-confirm v1.0.0 (http://craftpip.github.io/jquery-confirm/)
 * Author: boniface pereira
 * Website: www.craftpip.com
 * Contact: hey@craftpip.com
 *
 * Copyright 2013-2014 jquery-confirm
 * Licensed under MIT (https://github.com/craftpip/jquery-confirm/blob/master/LICENSE)
 */
if (typeof jQuery === 'undefined') {
    throw new Error('jquery-confirm requires jQuery');
}

var jconfirm;
(function ($) {

    $.confirm = function (options) {
        options.type = 'confirm';
        return jconfirm(options);
    };
    $.alert = function (options) {
        options.type = 'alert';
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

    var Jconfirm = function (options) {

        /*
         * constructor function Jconfirm, 
         * options = user options.
         */
        $.extend(this, options);
        this.animation = this.animation.toLowerCase();
        this._init();
    };

    Jconfirm.prototype = {
        _init: function () {
            this._buildHTML();
            this._bindEvents();

            var that = this;
            setTimeout(function () {
                that.open();
            }, 100);
        },
        animations: ['anim-scale', 'anim-top', 'anim-bottom', 'anim-left', 'anim-right', 'anim-zoom', 'anim-opacity', 'anim-none', 'anim-rotate', 'anim-rotatex', 'anim-rotatey', 'anim-scalex', 'anim-scaley', 'anim-blur'],
        _buildHTML: function () {
            var that = this;
            /*
             * append html to body.
             */
            this.$el = $(this.template).appendTo('body')
                    .addClass(this.theme);
            this.$b = this.$el.find('.jconfirm-box')
                    .css({
                        '-webkit-transition': 'all ' + this.animationSpeed / 1000 + 's',
                        'transition': 'all ' + this.animationSpeed / 1000 + 's'
                    });

            /*
             * cleaning animations
             */
            this.animation = this.animation.split('|');
            $.each(this.animation, function (i, a) {
                that.animation[i] = 'anim-' + a;
            });
            this.$b.addClass(this.animation.join(' '));

            /*
             * setup html contents
             */
            this.$el.find('div.title').html('<i class="' + this.icon + '"></i> ' + this.title);
            this.$el.find('div.content').html(this.content);

            var $btnc = this.$el.find('.buttons');
            if (this.confirmButton) {
                this.$confirmButton = $('<button class="btn">' + this.confirmButton + '</button>').appendTo($btnc);
                this.$confirmButton.addClass(this.confirmButtonClass);
            }
            if (this.cancelButton && this.type !== 'alert') {
                this.$cancelButton = $('<button class="btn">' + this.cancelButton + '</button>').appendTo($btnc);
                this.$cancelButton.addClass(this.cancelButtonClass);
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

            this.$confirmButton.click(function (e) {
                that.close();
                that.confirm();
            });

            if (this.$cancelButton) {
                this.$cancelButton.click(function (e) {
                    that.close();
                    that.cancel();
                });
            }
        },
        close: function () {
            var that = this;
            this.$b.addClass(this.animation.join(' '));
            setTimeout(function () {
                that.$el.remove();
            }, this.animationSpeed);
        },
        open: function () {
            var that = this;
            this.$b.removeClass(this.animations.join(' '));
        }
    };

    jconfirm.pluginDefaults = {
        type: 'alert',
        template: '<div class="jconfirm"><div class="jconfirm-bg"></div><div class="container"><div class="row"><div class="col-md-6 col-md-offset-3"><div class="jconfirm-box"><div class="title"></div><div class="content"></div><div class="buttons pull-right"></div><div class="jquery-clear"></div></div></div></div></div></div>',
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
        confirm: function () {
        },
        cancel: function () {
        },
        backgroundDismiss: true,
        autoClose: false
    };
})(jQuery);