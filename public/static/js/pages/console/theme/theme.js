define(['jquery', 'layer', 'fn'], function($, layer, fn){
    var options = {
        changeBtn : $('.change-btn')
    };
    var init = function(){
        check();
        change();
    };

    var check = function(){
        fn.validateForm('theme-form');
    };

    var change = function(){
        options.on('click', function(){
            var $parent = $(this).parents('.theme-item');
            var id = $(this).attr('data-id');
            if (!$parent.hasClass('active')) {
                $parent.addClass('active').siblings('.theme-item').removeClass('active');
                $.ajax({
                    url : ''
                });
            }
        });
    };

    return {
        init : init
    };
});