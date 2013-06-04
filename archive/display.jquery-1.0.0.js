/**
 * jQuery Display plugin
 * 
 * @desc Give various methods to known if one DOM element is currently displayed
 * @author Hervé GOUCHET
 * @author Aurélie LE BOUGUENNEC
 * @requires jQuery 1.4.3+
 * @licenses Creative Commons BY-SA 2.0
 * @see https://github.com/rvflash/jQuery-Display
 * @version 1.0.0
 */
;
(function($) {
    var timers = {};

    var display = function(elem, settings)
    {
        $(elem).each(function()
        {
            var _self = this;
            var data = $.extend({
                id : '_' + Math.floor((Math.random() * 1001) + 1),
                displayed : false,
                seen : false
            }, $(_self).data('_display'));

            if (displayed(_self, settings.fully)) {
                if (false == data.displayed) {
                    if (false == data.seen) {
                        timers[data.id] = {};

                        if ($.isFunction(settings.onOnce)) {
                            if ('onOnce' in timers[data.id]) {
                                timers[data.id].onOnce.resume();
                            } else {
                                timers[data.id].onOnce = new Timer(
                                    function()
                                    {
                                        settings.onOnce(_self);
                                    }, settings.latency
                                );
                            }
                        }
                        data.seen = true;
                    }
                    if ($.isFunction(settings.onEnter)) {
                        if ('onEnter' in timers[data.id]) {
                            timers[data.id].onEnter.resume();
                        } else {
                            timers[data.id].onEnter = new Timer(
                                function()
                                {
                                    settings.onEnter(_self);
                                }, settings.latency
                            );
                        }
                    }
                }
                data.displayed = true;

                if ($.isFunction(settings.onView)) {
                    settings.onView(_self);
                }
            } else if (data.displayed) {
                if ($.isFunction(settings.onExit)) {
                    settings.onExit(_self);
                }
                for (var timer in timers[data.id]) {
                    timer.pause();
                }
                data.displayed = false;
            }
            $(_self).data('_display', data);
        });
    };

    var displayed = function(elem, fully)
    {
        if ($(elem).is(':visible')) {
            var top = elem.offsetTop;
            var left = elem.offsetLeft;
            var width = elem.offsetWidth;
            var height = elem.offsetHeight;

            while (elem.offsetParent) {
                elem = elem.offsetParent;
                top += elem.offsetTop;
                left += elem.offsetLeft;
            }

            if ('undefined' == typeof (fully) || false == fully) {
                return (top < ($(window).scrollTop() + $(window).height()) && 
                        left < ($(window).scrollLeft() + $(window).width()) && 
                        (top + height) > $(window).scrollTop() && (left + width) > $(window).scrollLeft());
            }
            return (top >= $(window).scrollTop() &&
                    left >= $(window).scrollLeft() &&
                    (top + height) <= ($(window).scrollTop() + $(window).height()) &&
                    (left + width) <= ($(window).scrollLeft() + $(window).width()));
        }
        return false;
    };

    function Timer(callback, delay)
    {
        var timerId, start, remaining = delay;

        this.pause = function()
        {
            window.clearTimeout(timerId);
            remaining -= new Date() - start;
        };

        this.resume = function()
        {
            start = new Date();
            timerId = window.setTimeout(callback, remaining);
        };
        this.resume();
    };

    $.fn.display = function(settings)
    {
        var defaults = {
            onEnter : null,
            onOnce : null,
            onView : null,
            onExit : null,
            fully : false,
            latency : 0
        };
        var _self = this;

        $(window).scroll(function() {
            display(_self, $.extend({}, defaults, settings));
        });
        // Currently displayed
        $(window).scroll();
    };

    $.expr[':'].display = function(elem, index, properties)
    {
        var fully = (properties[3] && 'true' == properties[3] ? true : false);
        return displayed(elem, fully);
    };
})(jQuery);
