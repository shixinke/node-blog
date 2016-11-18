define(['jquery', 'layer', 'fn'], function($, layer, fn){
    var options = {

    };
    var init = function(){
        fn.webuploader({serverUrl:'/console/profile/avatar', showBox:'#avatar-img'});
        fn.validateForm('profile-form');
    };

    return {
        init:init
    }
})