define(['jquery', 'jquery.validate', 'jquery.form', 'layer', 'jquery.md5'], function($, validate, jqform, layer){
    var options = {
        form : $('#register-form'),
        password:$('#password'),
        confirmPassword:$('#confirmPassword')
    };
    var init = function(){
        check();
    };

    var check = function(){
        options.form.validate({
            rules:{
                account:{
                    required:true,

                },
                password:'required'
            },
            submitHandler: function (form) {
                options.password.val($.md5(options.password.val()));
                options.confirmPassword.val($.md5(options.confirmPassword.val()));
                $(form).ajaxSubmit(function(res){
                    if (res && res.code && (res.code == 200)) {
                        layer.msg('注册成功', {icon : 6});
                        window.location.href = res.data.url;
                    } else {
                        var msg = res && res.message && res.message != '' ? res.message : '注册失败';
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