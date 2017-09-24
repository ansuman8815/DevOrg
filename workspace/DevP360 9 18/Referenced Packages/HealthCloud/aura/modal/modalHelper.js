({
    noBodyScroll: function(component) {
        var bodies = document.getElementsByTagName('body');
        var bodyToUpdate = bodies[0];

        if (component.get('v.isShow')) {
            $A.util.addClass(bodyToUpdate, 'bodyNoScroll');
        } else {
            $A.util.removeClass(bodyToUpdate, 'bodyNoScroll');
        }

    }
})