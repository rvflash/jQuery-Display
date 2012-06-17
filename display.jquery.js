/**
 * jQuery Display plugin
 * 
 * @desc Give various methods to known if one DOM element is currently displayed
 * @author Hervé GOUCHET
 * @requires jQuery 1.4.3+
 * @licenses Creative Commons BY-SA 2.0
 * @see https://github.com/rvflash/jQuery-Display
 */
;
(function($) {
    var timers = {};

    var display = function(elem, settings) {
        $(elem).each(function() {
            var data = $.extend({
                id : '_' + Math.floor((Math.random() * 1001) + 1),
                displayed : false,
            }, $(this).data('_display'));

            if (displayed(this, settings.fully)) {
                if (false == data.displayed && $.isFunction(settings.onEnter)) {
                    timers[data.id] = setTimeout(function() {
                        settings.onEnter(this);
                    }, settings.latency);
                } else if ($.isFunction(settings.onView)) {
                    settings.onView(this);
                }
                data.displayed = true;
            } else if (data.displayed) {
                if ($.isFunction(settings.onExit)) {
                    settings.onExit(this);
                }
                clearTimeout(timers[data.id]);
                data.displayed = false;
            }
            $(this).data('_display', data);
        });
    };

    var displayed = function(elem, fully) {
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
                return (
                    top < (window.pageYOffset + window.innerHeight) && 
                    left < (window.pageXOffset + window.innerWidth) && 
                    (top + height) > window.pageYOffset && 
                    (left + width) > window.pageXOffset
                );
            }
            return (
                top >= window.pageYOffset && 
                left >= window.pageXOffset && 
                (top + height) <= (window.pageYOffset + window.innerHeight) && 
                (left + width) <= (window.pageXOffset + window.innerWidth)
            );
        }
        return false;
    };

    $.fn.display = function(settings) {
        var defaults = {
            onEnter : null,
            onView : null,
            onExit : null,
            fully : false,
            latency : 0,
        };
        var _self = this;

        $(window).scroll(function() {
            display(_self, $.extend({}, defaults, settings));
        });

        // Currently displayed
        $(window).scroll();
    };

    $.expr[':'].display = function(elem, index, properties) {
        var fully = (properties[3] && 'true' == properties[3] ? true : false);
        return displayed(elem, fully);
    };
})(jQuery);
