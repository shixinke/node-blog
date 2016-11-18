define(['jquery'], function($){
    var validateForm = function(formId, options){
        require(['jquery.validate', 'jquery.form', 'layer', 'jquery.md5'], function(validate, jqueryForm, layer){
            $('#'+formId).validate({
                errorPlacement: function(error, element) {
                    var $label = $( element ).closest( "form" ).find( "div[for='" + element.attr( "id" ) + "']" );
                    $label.append(error).show();
                },
                submitHandler: function(form){
                    var iframe = $(form).attr('data-iframe');
                    $('input[type=password]').each(function(){
                        var encrypt = $(this).attr('data-encrypt');
                        if(encrypt == 'no') {

                        } else {
                            $(this).val($.md5($(this).val()));
                        }
                    });
                    $(form).ajaxSubmit({
                        dataType:'json',
                        success:function(res){
                            var res = res ? res : {}
                            if (res.code == 200) {
                                res.message = typeof res.message != 'undefined' && res.message != '' ? res.message : '操作成功';
                                layer.alert(res.message, {shade:[0, 'transparent'], icon:1}, function(){
                                    iframe == 1 ? window.parent.location.href = res.data.url : window.location.href = res.data.url;
                                });
                            } else {
                                console.log(res.message);
                                res.message = typeof res.message != 'undefined' && res.message != '' ? res.message : '操作失败';
                                layer.alert(res.message, {shade:[0, 'transparent'], icon:5}, function(index){
                                    if (typeof res.data.url != 'undefined' && res.data.url != '') {
                                        iframe == 1 ? window.parent.location.href = res.data.url : window.location.href = res.data.url;
                                    }
                                    else {
                                        layer.close(index);
                                    }
                                });
                            }
                        }
                    });
                }
            });
        })
    };

    var loadPage = function(selector){
        var $selector = selector ? $(selector) : $('.loadpage');
        var style = {};
        require(['layer'], function(layer){
            $selector.on('click', function(){
                style.width = $(this).attr('data-width') || $(window).width() - 50;
                style.height = $(this).attr('data-height') || $(window).height() - 50;
                var title = $(this).attr('data-title') || $(this).text();
                layer.open({
                    type: 2,
                    title:title,
                    scrollbar:true,
                    area: [style.width +'px', style.height +'px'],
                    content: $(this).attr('data-url')
                });
            });
        });
    };

    var hoverTip = function(selector){
        var $selector = selector ? $(selector) : $('.tip-hover');
        require(['layer'], function(layer){
            var index = null;
            $selector.on('mouseover', function(){
                var that = this;
                var time = $(this).attr('data-time');
                var type = $(this).attr('data-type') || 2;
                var color = $(this).attr('data-time') || '3595CC';
                index = layer.tips($(this).attr('data-tip'), that, {tips:[type, '#'+color], time:time || 0}); //在元素的事件回调体中，follow直接赋予this即可;
            });
            $selector.on('mouseout', function(){
                layer.close(index);
            });

        });
    };

    var clickTip = function(selector){
        var $selector = selector ? $(selector) : $('.tip-hover');
        require(['layer'], function(layer){
            var index = null;
            $selector.on('click', function(){
                var that = this;
                var time = $(this).attr('data-time');
                var type = $(this).attr('data-type') || 2;
                var color = $(this).attr('data-time') || '3595CC';
                index = layer.tips($(this).attr('data-tip'), that, {tips:[type, '#'+color], time:time || 0}); //在元素的事件回调体中，follow直接赋予this即可;
            });

        });
    };

    var dropMenu = function(selector){
        var $selector = selector ? $(selector) : $('.dropdown');
        $selector.on('click', function(){
            var $droparrow = $(this).find(".drop-arrow");
            var $dropmenu = $(this).find('.dropdown-menu');
            $('.dropdown').removeClass("open");
            $('.dropdown-menu').hide();
            $('.dropdown .drop-arrow').removeClass("icon-up").addClass("icon-down");
            if ($dropmenu.is(':visible')) {
                $(this).removeClass('open');
                $droparrow.removeClass("icon-up").addClass("icon-down");
                $dropmenu.hide();
            } else {
                $(this).addClass('open');
                $droparrow.removeClass("icon-down").addClass("icon-up");
                $dropmenu.show();
            }
        });
    };
    var onOff = function(){
        $('.onoff-tab span').on('click', function(){
            var $radio = $('#'+$(this).attr('for'));
            $(this).addClass('onoff-current').siblings('span').removeClass('onoff-current');
            $radio.attr('checked', 'checked').siblings(':radio').attr('checked', false);
        });
    };

    var ajaxDelSubmit = function(url, data, info, okFn){
        if (!okFn) {
            var okFn = function(res){
                if (res.code == 200) {
                    res.message = typeof res.message != 'undefined' && res.message != '' ? res.message : '操作成功';
                    layer.alert(res.message, {shade:[0, 'transparent'], icon:1}, function(){
                        window.location.href = res.data.url;
                    });
                } else {
                    res.message = typeof res.message != 'undefined' && res.message != '' ? res.message : '操作失败';
                    layer.alert(res.message, {shade:[0, 'transparent'], icon:5}, function(index){
                        if (typeof res.data.url != 'undefined' && res.data.url != '') {
                            window.location.href = res.data.url;
                        }
                        else {
                            layer.close(index);
                        }
                    });
                }
            };
        };
        info.msg = info.msg ? info.msg : '您确定要删除该项吗？删除后将无法恢复';
        info.title = info.title ? info.title : '删除提醒';
        layer.confirm(info.msg, {icon:3, title:info.title}, function(index){
            layer.close(index);
            $.ajax({
                url : url,
                type:'post',
                data : data,
                dataType:'json',
                success:okFn
            });
        }, function(index){
            layer.close(index);
        });
    };

    var ajaxDel = function(selector, okFn){
        require(['layer'], function(layer){
            var $selector = selector ? $(selector) : $('.ajax-del-btn');
            $selector.on('click', function(){
                var $parent = $(this).parents(".row-item");
                var msg = $(this).attr('data-msg') ? $selector.attr('data-msg') : '您确定要删除该项吗？删除后将无法恢复';
                var title = $(this).attr('data-title') ? $selector.attr('data-title') : '删除提醒';
                var options = {};
                if ($(this).attr('data-id')) {
                    options.id = $(this).attr('data-id');
                } else {
                    var fields = $(this).attr('data-fields');
                    var arr = fields.split(',');
                    for (var val in arr) {
                        if (val) {
                            options[val] = $(this).attr('data-'+val);
                        }
                    }
                }

                var removeFn = function(res){
                    if (res.code == 200) {
                        //$parent.remove();
                        layer.msg(res.message, {icon: 1}, function(){
                            $parent.remove();
                        });

                    } else {
                        res.message = typeof res.message != 'undefined' && res.message != '' ? res.message : '操作失败';
                        layer.msg(res.message, {icon:5}, function(){
                            if (res.data && typeof res.data.url != 'undefined' && res.data.url != '') {
                                window.location.href = res.data.url;
                            }
                        });

                    }
                };
                if (!okFn) {
                    okFn = removeFn;
                }
                ajaxDelSubmit($(this).attr('data-action'), options, {title:title, msg:msg}, okFn);
            });
        });
    };

    var trim = function(str){
        if (!str) {
            return str;
        }
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }
    var ltrim= function(str, delimiter){
        if (!str) {
            return str;
        }
        return str.replace(/(^\s*)/g,"");
    }
    var rtrim = function(str){
        if (!str) {
            return str;
        }
        return str.replace(/(\s*$)/g,"");
    }

    var ajaxDelBatch = function(selector, checkSelector){
        require(['layer'], function(layer){
            var $selector = selector ? $(selector) : $('#ajax-batch-del-btn');
            var checkSelector = checkSelector ? checkSelector : '.check-item';
            $selector.on('click', function(){
                var $checkedSelector = $(checkSelector+":checked");
                var length = $checkedSelector.length;
                if (length < 1) {
                    layer.alert('请选择要删除的选项', {shade:[0, 'transparent']});
                    return false;
                }
                var ids = '';
                $checkedSelector.each(function(){
                    ids += $(this).val()+',';
                });
                var msg = $(this).attr('data-msg') || '您确定要删除这些选定的选项吗？';
                ajaxDelSubmit($(this).attr('data-action'), {ids:ids}, {msg:msg});
            });
        });
    };

    var getUrlVars = function(){
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++){
            hash = hashes[i].split('=');
            if (hash[1] != "") {
                vars[hash[0]] = hash[1];
            }
        }
        return vars;
    };

    var getUrlVar = function(name){
        return getUrlVars()[name];
    };

    var getBaseUrl = function(url){
        var url = url ? url : window.location.href;
        return url.substr(0, url.indexOf('?'))
    };

    //封装浏览器参数
    var composeUrlParams=function(){
        var param='';
        var vars = getUrlVars();
        var index = 0;
        for(var k in vars) {
            if (k != 'page' && vars[k]) {
                var tmp = index == 0 ? "" : "&";
                param += tmp + k+"="+vars[k];
                index ++;
            }
        };
        return param;
    }

    var pager = function(selector) {
        require(['pager'], function(pager){
            var $selector = selector ? $(selector) : $('#pager');
            var options = {
                currentPage:$selector.attr('pageNum') || 1,
                totalPages:$selector.attr('pageCount') || 1,
                numberOfPages:$selector.attr('numberOfPages') || 5,
                bootstrapMajorVersion:2,
                pageUrl: function(type, page, current){
                    return getBaseUrl($selector.attr('baseUrl'))+'?'+composeUrlParams()+"&page="+page;
                }
            };
            $selector.bootstrapPaginator(options);
            var $pageSearchBtn = $('.page-search');
            var $pageInput = $('.page-input');
            $pageInput.change(function(){
                if ($(this).val().length > 0) {
                    var pageNum = parseInt($(this).val());
                    if (pageNum > 0) {
                        $pageSearchBtn.attr('disabled', false);
                    }
                } else {
                    $pageSearchBtn.attr('disabled', true);
                }
            });
            $('.page-search').on('click', function(){
                var pageNum = parseInt($pageInput.val());
                if (pageNum < 1) {
                    layer.msg("请输入合法的页码", {icon: 6}, function(){
                        $pageSearchBtn.attr('disabled', true);
                    });

                } else {
                    url = getBaseUrl()+'?'+composeUrlParams()+"&page="+pageNum;
                    window.location.href = url;
                }
            });
        });
    };

    var changeBtn = function(selector, disabled){
            var selector = selector ? $(selector) : $('.form-btn-groups');
            if (disabled) {
                selector.find('.btn').attr('disabled', true);
            } else {
                selector.find('.btn').removeAttr('disabled');
            }
    };

    var checkAll = function(checkAll, checkItem, change){

            var checkAll = checkAll ? checkAll : '.check-all';
            var $checkItem = checkItem ? $(checkItem) : $('#form-table .check-item');
            var change = change ? change : false;
            $('#form-table').on('click', checkAll, function(){
                if (this.checked) {
                    console.log($checkItem.length);
                    $checkItem.prop('checked', true);
                    if (change) {
                        changeBtn(null, false);
                    }

                } else {
                    $checkItem.prop('checked', false);
                    if (change) {
                        changeBtn(null, true);
                    }
                }
            });

            if (change) {
                $checkItem.on('click', function(){
                    if (this.checked) {
                        changeBtn(null, false);
                    } else {
                        if ($('#form-table .check-item:checked').length == 0) {
                            changeBtn(null, true);
                        }
                    }
                });
            }

    };

    var refreshPage = function(isParent, selector){

            var $selector = selector ? $(selector) : $('.refresh-btn');
            $selector.on('click', function(){
                if (isParent) {
                    window.parent.location.reload();
                } else {
                    window.location.reload();
                }
            });

    };

    var datepicker = function(selector, options){
        require(['laydate'], function(){
            var $selector = selector ? selector : '.date';
            var format = options.type == 'datetime' ? 'YYYY/MM/DD hh:mm:ss' : 'YYYY/MM/DD';
            var istime = options.type == 'datetime' ? true : false;
            laydate({
                elem: selector,
                format : options.format ? options.format : format,
                istime : options.istime ? options.istime : istime
            });
        });
    };

    var webuploader = function(options){
        var options = options ? options : {};
        require(['webuploader', 'layer'], function(WebUploader, layer){
            var $uploadBox = $(options.picker).parents('.upload-box');
            var serverUrl = options.serverUrl;
            options.fileType = options.fileType ? options.fileType : 'image';
            if (!serverUrl || serverUrl == '') {
                serverUrl = options.fileType == 'image' ? '/upload/images' : '/upload/files';
            }
            console.log(options);
            var accept = null;

            if (options.fileType == 'image') {
                accept = {title: 'Images', extensions: 'gif,jpg,jpeg,bmp,png', mimeTypes: 'image/*'};
            } else {
                accept = {title: 'files', extensions: 'pdf,txt,md,csv', mimeTypes: 'application/pdf,text/plain,text/markdown,text/comma-separated-values'};
            }
            var uploader = WebUploader.create({
                swf:'/js/libs/webuploader/0.1.5/Uploader.swf',
                server: serverUrl,
                auto:true,
                pick: options.picker ? options.picker : $('#filePicker'),
                accept:accept,
                resize: false
            });

            var name = options.name ? options.name : $uploadBox.attr('data-name');
            uploader.on( 'uploadError', function( file ) {
                layer.msg('上传失败', {icon:5});
            });

            uploader.on('uploadSuccess', function(file, ret){
                if (ret && ret.code && ret.code == 200) {
                    if (options.fileType == 'image') {
                        if (options.showBox) {
                            $('#hidden-img-file').val(ret.data.url);
                            $(options.showBox).attr('src', ret.data.url);
                        } else {
                            $uploadBox.find('ul').append('<li><img src="'+ret.data.url+'"><input type="hidden" class="upload-hidden-path" name="'+name+'" value="'+ret.data.url+'"><a href="javascript:;" class="remove-file iconfont icon-error upload-remove-btn"></a></li>');
                        }

                    } else {
                        $uploadBox.find('ul').append('<li><i class="iconfont icon-'+ret.data.extension+'"></i><p class="filename">'+ret.data.basename+'</p><input type="hidden" class="upload-hidden-path" name="'+name+'" value="'+ret.data.url+'"><a href="javascript:;" class="remove-file iconfont icon-error upload-remove-btn"></a></li>');
                    }
                    if (!options.isMulti) {
                        $(options.picker).parents('.upload-btn-box').hide();
                    }

                } else {
                    layer.msg(ret.message, {icon:5});
                }
            });

        });
    };

    var removeFile = function(options){
        require(['layer'], function(layer){
            $('.upload-box ul').on('click', 'a.upload-remove-btn', function(){
                var $parent = $(this).parents('li');
                var $uploadBox = $(this).parents('.upload-box');
                var type = $uploadBox.attr('data-type');
                var path = $parent.find('.upload-hidden-path').val();
                $.ajax({
                    url:options.removeUrl || '/upload/remove',
                    type:'post',
                    data:{path:path},
                    dataType:'json',
                    success:function(ret){
                        var code = ret.code ? ret.code : null;
                        if (code == 200) {
                            $parent.remove();
                            var length = $uploadBox.find('ul li').length;
                            if ((type == 'image' || type == 'file') && length == 0) {
                                $uploadBox.find('.upload-btn-box').show();
                            }
                        } else {
                            var message = ret && ret.message && ret.message != '' ? ret.message : '删除失败';
                            layer.msg(message, {icon:5});
                        }
                    }
                });
            });
        });
    };

    var treetable = function(selector, options){
        require(['treetable'], function(){
            var $selector = selector ? $(selector) : $('.tree-table');
            $selector.treetable({expandable : true, indent : 24, indenterTemplate : '<span class="indenter"><i>&nbsp;</i></span>'});
        });
    };

    var formatBytes = function(size, delimiter){
        var delimiter = delimiter ? delimiter : ' ';
        var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
        var size = size;
        for (var i = 0; size >= 1024 && i< units.length; i++) {
            size = size / 1024;
        }
        return size.toFixed(2)+delimiter+units[i+1];
    };

    var strtotime = function(timestamp)
    {
        var date = new Date(timestamp);
        return date.getTime();
    };

    var timeFormat = function(time, format){
        var format = format ? format : '%Y-%m-%d %H:%i:%s';
        var date = new Date(time);
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        month = month < 10 ? '0'+month.toString() : month;
        var day = date.getDate();
        day = day < 10 ? '0'+day.toString() : day;
        var hour = date.getHours();
        hour = hour < 10 ? '0'+hour.toString() : hour;
        var minute = date.getMinutes();
        minute = minute < 10 ? '0'+minute.toString() : minute;
        var second = date.getDate();
        second = second < 10 ? '0'+second.toString() : second;
        var str = format;
        str = str.replace('%Y', year);
        str = str.replace('%m', month);
        str = str.replace('%d', day);
        str = str.replace('%H', hour)
        str = str.replace('%i', minute)
        str = str.replace('%s', second)
        return str;
    };

    return {
        validateForm:validateForm,
        loadPage:loadPage,
        onOff:onOff,
        dropMenu:dropMenu,
        hoverTip:hoverTip,
        clickTip:clickTip,
        pager:pager,
        ajaxDel:ajaxDel,
        ajaxDelBatch:ajaxDelBatch,
        ajaxDelSubmit:ajaxDelSubmit,
        checkAll:checkAll,
        refreshPage:refreshPage,
        datepicker:datepicker,
        webuploader:webuploader,
        removeFile:removeFile,
        treetable:treetable,
        formatBytes:formatBytes,
        strtotime:strtotime,
        timeFormat:timeFormat
    }
});