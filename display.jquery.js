/**
 * jQuery Display plugin
 * 
 * @desc Give various methods to known if one DOM element is currently displayed
 * @author Hervé GOUCHET
 * @author Aurélie LE BOUGUENNEC
 * @requires jQuery 1.4.3+
 * @licenses Creative Commons BY-SA 2.0
 * @see https://github.com/rvflash/jQuery-Display
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
                    if ($.isFunction(settings.onEnter)) {
                        timers[data.id] = setTimeout(function()
                        {
                            settings.onEnter(_self);
                        }, settings.latency);
                    }
                    if (false == data.seen && $.isFunction(settings.onOnce)) {
                        settings.onOnce(_self);
                    }
                    data.seen = true;
                }
                data.displayed = true;

                if ($.isFunction(settings.onView)) {
                    settings.onView(_self);
                }
            } else if (data.displayed) {
                if ($.isFunction(settings.onExit)) {
                    settings.onExit(_self);
                }
                clearTimeout(timers[data.id]);
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
