/**
 * jQuery Display plugin
 *
 * @desc Give various methods to known if one DOM element is currently displayed
 * @version 1.1.0
 * @author Hervé GOUCHET
 * @author Aurélie LE BOUGUENNEC
 * @requires jQuery 1.4.3+
 * @licenses Creative Commons BY-SA 2.0
 * @see https://github.com/rvflash/jQuery-Display
 */
;
(function($)
{
    var _timers = {};

    var _defaults = {
        onEnter : null,
        onOnce : null,
        onView : null,
        onExit : null,
        fully : false,
        latency : 0
    };

    var display = function(elem, settings)
    {
        $(elem).each(function()
        {
            var _self = this;
            var data = $.extend({
                id: '_' + Math.floor((Math.random() * 1001) + 1),
                displayed : false,
                seen : false
            }, $(_self).data('_display'));

            if (displayed(_self, settings.fully)) {

                if (false == data.displayed) {
                    if ('undefined' == typeof _timers[data.id]) {
                        _timers[data.id] = {};
                    }
                    if (false == data.seen) {
                        if ($.isFunction(settings.onOnce)) {
                            if ('onOnce' in _timers[data.id]) {
                                _timers[data.id].onOnce.resume();
                            } else {
                                _timers[data.id].onOnce = new Timer(
                                    function()
                                    {
                                        settings.onOnce(_self);
                                        data.seen = true;
                                    }, settings.latency
                                );
                            }
                        }
                    }
                    if ($.isFunction(settings.onEnter)) {
                        if ('onEnter' in _timers[data.id]) {
                            _timers[data.id].onEnter.resume();
                        } else {
                            _timers[data.id].onEnter = new Timer(
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
                for (var timer in _timers[data.id]) {
                    _timers[data.id][timer].pause();
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
        var _self = this;
        var _options = $.extend({}, _defaults, settings);

        setInterval(function()
        {
            display(_self, _options);
        }, _options.latency);
    };

    $.expr[':'].display = function(elem, index, properties)
    {
        var fully = (properties[3] && 'true' == properties[3] ? true : false);
        return displayed(elem, fully);
    };
})(jQuery);