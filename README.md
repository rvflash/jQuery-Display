jQuery-Display
==============

Give various methods to known if one DOM element is currently visible / displayed

## Examples ##

To apply action only if the element is currently displayed, you can now use:

    $("#myId:display").css('background-color', 'red');

And, you can specify that the element must be completely displayed: 

    $("#myId:display(true)").css('color', 'black');

Attach events when the element enters, is displayed or exits of the current view:

    $("#myId").display({
        onEnter : function (elem){ console.log('Hello'); },
        onView : function (elem){ console.log('Yes, I am here!'); },
        onExit : function (elem){ console.log('Bye'); },
    });

And, two more attributes are available, one to specify that element is entirely displayed:

    $("#myId")..display({
        onExit : function (elem){ console.log($(elem).id + ' has been displayed'); },
        fully : true,
    });

And the last to trigger events after time out: 

    $("#myId")..display({
        onEnter : function (elem){ console.log('... Hey!'); },
        latency : 1000,
    });

As you seen, the DOM element has been passed as first parameter on each method. 
