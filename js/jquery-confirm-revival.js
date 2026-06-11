/*!
 * jquery-confirm revival compatibility patch
 *
 * Load after jquery-confirm.js in browsers, or require this file as the package
 * entry point in CommonJS builds. This intentionally patches the existing
 * v3.x runtime instead of replacing the project with another rewrite.
 */
(function(factory){
    if(typeof define === 'function' && define.amd){
        define(['jquery', './jquery-confirm'], factory);
    }else if(typeof module === 'object' && module.exports){
        module.exports = function(root, jQuery){
            if(jQuery === undefined){
                if(typeof window !== 'undefined'){
                    jQuery = require('jquery');
                    root = window;
                }else{
                    jQuery = require('jquery')(root);
                }
            }

            var jqueryConfirm = require('./jquery-confirm');
            if(typeof jqueryConfirm === 'function'){
                jqueryConfirm(root, jQuery);
            }

            factory(jQuery, root || (typeof window !== 'undefined' ? window : undefined));
            return jQuery;
        };
    }else{
        factory(jQuery, window);
    }
}(function($, w){
    "use strict";

    if(!$ || !w || !w.Jconfirm){
        if(w && w.console && typeof w.console.warn === 'function'){
            w.console.warn('jquery-confirm-revival.js must be loaded after jquery-confirm.js');
        }
        return;
    }

    var proto = w.Jconfirm.prototype;
    if(proto._revivalPatchApplied){
        return;
    }

    function trim(value){
        return (value === null || typeof value === 'undefined') ? '' : String(value).trim();
    }

    function addSafeIcon($container, className){
        $container.empty();
        className = trim(className);
        if(className){
            $('<i></i>').addClass(className).appendTo($container);
        }
    }

    proto._revivalPatchApplied = true;

    proto._parseTheme = function(theme){
        var that = this;
        theme = (theme || '').split(',');
        $.each(theme, function(k, a){
            if(a.indexOf(that._themePrefix) === -1)
                theme[k] = that._themePrefix + trim(a);
        });
        this.themeParsed = theme.join(' ').toLowerCase();
    };

    proto._parseBgDismissAnimation = function(bgDismissAnimation){
        var animation = (bgDismissAnimation || '').split(',');
        var that = this;
        $.each(animation, function(k, a){
            if(a.indexOf(that._bgDismissPrefix) === -1)
                animation[k] = that._bgDismissPrefix + trim(a);
        });
        this.backgroundDismissAnimationParsed = animation.join(' ').toLowerCase();
    };

    proto._parseAnimation = function(animation, which){
        which = which || 'o';
        var animations = (animation || '').split(',');
        var that = this;
        $.each(animations, function(k, a){
            if(a.indexOf(that._animationPrefix) === -1)
                animations[k] = that._animationPrefix + trim(a);
        });
        var a_string = animations.join(' ').toLowerCase();
        if(which === 'o')
            this.animationParsed = a_string;
        else
            this.closeAnimationParsed = a_string;

        return a_string;
    };

    proto.setIcon = function(iconClass, force){
        force = force || false;

        if(typeof iconClass !== 'undefined'){
            if(typeof iconClass === 'string'){
                this.icon = iconClass;
            }else if(typeof iconClass === 'function'){
                var response = iconClass();
                this.icon = (typeof response === 'string') ? response : false;
            }else{
                this.icon = false;
            }
        }

        if(this.isAjaxLoading && !force)
            return;

        addSafeIcon(this.$icon, this.icon);
        this.updateTitleContainer();
    };

    proto._isButtonActionable = function(buttonKey){
        var button = this.buttons && this.buttons[buttonKey];
        var $button = this['$_' + buttonKey];

        if(!button || !$button || !$button.length)
            return false;

        if(button.isDisabled || button.isHidden)
            return false;

        if($button.prop('disabled') || $button.css('display') === 'none')
            return false;

        return true;
    };

    proto._triggerButtonAction = function(buttonKey){
        if(!this._isButtonActionable(buttonKey))
            return false;

        this['$_' + buttonKey].trigger('click');
        return true;
    };

    proto._setButtons = function(){
        var that = this;
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
                that.buttons[key].keys[i] = String(a).toLowerCase();
            });

            var button_element = $('<button type="button" class="btn"></button>')
                .html(that.buttons[key].text)
                .addClass(that.buttons[key].btnClass)
                .prop('disabled', that.buttons[key].isDisabled)
                .css('display', that.buttons[key].isHidden ? 'none' : '')
                .click(function(e){
                    e.preventDefault();

                    if(!that._isButtonActionable(key))
                        return false;

                    var res = that.buttons[key].action.apply(that, [that.buttons[key]]);
                    that.onAction.apply(that, [key, that.buttons[key]]);
                    that._stopCountDown();
                    if(typeof res === 'undefined' || res)
                        that.close();
                });

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

            that['$_' + key] = that['$$' + key] = button_element;
            that.$btnc.append(button_element);
        });

        if(total_buttons === 0) this.$btnc.hide();
        if(this.closeIcon === null && total_buttons === 0){
            this.closeIcon = true;
        }

        if(this.closeIcon){
            if(this.closeIconClass){
                addSafeIcon(this.$closeIcon, this.closeIconClass);
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
                    if(that._isButtonActionable(buttonName)){
                        var btnResponse = that.buttons[buttonName].action.apply(that, [that.buttons[buttonName]]);
                        that.onAction.apply(that, [buttonName, that.buttons[buttonName]]);
                        that._stopCountDown();
                        shouldClose = (typeof btnResponse === 'undefined') || !!(btnResponse);
                    }else{
                        shouldClose = false;
                    }
                }
                if(shouldClose){
                    that.close();
                }
            });
            this.$closeIcon.show();
        }else{
            this.$closeIcon.hide();
        }
    };

    proto._ensureContentMounted = function(){
        if(!this.$content || !this.$content.length)
            return;

        if(this.contentParsed.parent()[0] !== this.$content[0]){
            this.$content.html('');
            this.$content.append(this.contentParsed);
        }
    };

    proto.setContentPrepend = function(content, force){
        if(typeof content === 'undefined' || content === null)
            return this;

        this.contentParsed.prepend(content);
        if(!(this.isAjaxLoading && !force)){
            this._ensureContentMounted();
            this._updateContentMaxHeight();
        }
        return this;
    };

    proto.setContentAppend = function(content, force){
        if(typeof content === 'undefined' || content === null)
            return this;

        this.contentParsed.append(content);
        if(!(this.isAjaxLoading && !force)){
            this._ensureContentMounted();
            this._updateContentMaxHeight();
        }
        return this;
    };

    proto.setContent = function(content, force){
        force = !!force;
        var that = this;
        if(typeof content !== 'undefined')
            this.contentParsed.html('').append(content);
        if(this.isAjaxLoading && !force)
            return this;

        this._ensureContentMounted();
        this._updateContentMaxHeight();
        setTimeout(function(){
            that.$body.find('input[autofocus]:visible:first').focus();
        }, 100);
        return this;
    };

    proto._bindEvents = function(){
        var that = this;
        this.boxClicked = false;

        this.$scrollPane.click(function(e){
            if(!that.boxClicked){
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
                    if(that._isButtonActionable(buttonName)){
                        var btnResponse = that.buttons[buttonName].action.apply(that, [that.buttons[buttonName]]);
                        that.onAction.apply(that, [buttonName, that.buttons[buttonName]]);
                        that._stopCountDown();
                        shouldClose = (typeof btnResponse === 'undefined') || !!(btnResponse);
                    }else{
                        shouldClose = false;
                    }
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
        });
    };

    proto.reactOnKey = function(e){
        var that = this;

        var a = $('.jconfirm');
        if(a.eq(a.length - 1)[0] !== this.$el[0])
            return false;

        var key = e.which;
        if(this.$content.find(':input').is(':focus') && /13|32/.test(key))
            return false;

        var keyChar = this._getKey(key);

        if(keyChar === 'esc' && this.escapeKey){
            if(this.escapeKey === true){
                this.$scrollPane.trigger('click');
            }
            else if(typeof this.escapeKey === 'string' || typeof this.escapeKey === 'function'){
                var buttonKey;
                if(typeof this.escapeKey === 'function'){
                    buttonKey = this.escapeKey();
                }else{
                    buttonKey = this.escapeKey;
                }

                if(buttonKey){
                    if(typeof this.buttons[buttonKey] === 'undefined'){
                        console.warn('Invalid escapeKey, no buttons found with key ' + buttonKey);
                    }else{
                        this._triggerButtonAction(buttonKey);
                    }
                }
            }
        }

        $.each(this.buttons, function(key, button){
            if(button.keys.indexOf(keyChar) !== -1){
                that._triggerButtonAction(key);
            }
        });
    };
}));
