'use strict';
/*!
 * jquery-confirm v1.1.3 (http://craftpip.github.io/jquery-confirm/)
 * Author: Boniface Pereira
 * Website: www.craftpip.com
 * Contact: hey@craftpip.com
 *
 * Copyright 2013-2014 jquery-confirm
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
            if (this.animation == 'none')
                this.animationSpeed = 0;

            /*
             * Append html to body.
             */
            this.$el = $(this.template).appendTo('body').addClass(this.theme);
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
                    that.confirm();
                    that.close();
                });
            }
            if (this.$cancelButton) {
                this.$cancelButton.click(function (e) {
                    that.cancel();
                    that.close();
                });
            }
            if (this.$closeButton) {
                this.$closeButton.click(function (e) {
                    that.cancel();
                    that.close();
                })
            }
            $(window).on('resize', function () {
                that.setDialogCenter()
            });
            this.setDialogCenter();
        },
        setDialogCenter: function () {
            var h = $(window).height();
            var h2 = this.$b.height();
            var mar = (h - h2) / 2;

            this.$b.find('.content').css({
                'max-height': h - 200 + 'px'
            });
            this.$b.css({
                'margin-top': mar
            });
        },
        close: function () {
            /*
             Remove the window resize event.
             */
            $(window).unbind('resize', this.setDialogCenter);
            var that = this;
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
        confirm: function () {
        },
        cancel: function () {
        },
        backgroundDismiss: true,
        autoClose: false,
        closeIcon: true,
    };
})(jQuery);