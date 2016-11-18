define(['jquery', 'jquery.validate', 'jquery.form', 'layer', 'jquery.md5'], function($, validate, jqform, layer){
    var options = {
        form : $('#login-form'),
        password:$('#password'),
        btns : $(".bg-switch .bg")
    };
    var init = function(){
        changeBg();
        checklogin();
    };

    var changeBg = function(){
        options.btns.click(function (e) {
            e.preventDefault();
            options.btns.removeClass("active");
            $(this).addClass("active");
            var bg = $(this).data("img");
            $("html").css("background-image", "url('/static/img/bgs/" + bg + "')");
        });
    };

    var checklogin = function(){
        options.form.validate({
            rules:{
                account:{
                    required:true,

                },
                password:'required'
            },
            submitHandler: function (form) {
                options.password.val($.md5(options.password.val()));
                $(form).ajaxSubmit(function(res){
                    if (res && res.code && (res.code == 200)) {
                        layer.msg('登录成功', {icon : 6});
                        window.location.href = res.data.url;
                    } else {
                        var msg = res && res.message && res.message != '' ? res.message : '登录失败';
                        layer.msg(msg, {icon : 2})
                    }
                });
            }
        });
    };
    return {
        init:init
    }
})