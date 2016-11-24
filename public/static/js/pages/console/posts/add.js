define(['jquery', 'fn', 'ueditor'], function($, fn, UE){
    var options = {

    };
    var init = function(){
        //laydate({ele : '#datepicker', event :'focus'});
        editor();
        fn.validateForm('posts-form');

    };
    var editor = function(){
        require(['ueditor.zeroclipboard'], function (ZeroClipboard) {
            window['ZeroClipboard'] = ZeroClipboard;
        });
        var ue = UE.getEditor('container');
    };
    return {
        init : init
    }
});