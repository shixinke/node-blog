define(['jquery', 'fn'], function($, fn){
    var options = {
        tabHead : $('#btn-tabs button'),
        tabGroupItem: $('.tab-group-item')
    };
    var init = function(){
        tabs();
        fn.validateForm('config-form');
    };

    var tabs = function(){
        options.tabHead.on('click', function(){
            $(this).addClass('active').siblings().removeClass('active');
            var group = $(this).attr('data-id');
            options.tabGroupItem.hide();
            $('div[data-group='+group+']').show();
        });
    };

    return {
        init:init
    }
})