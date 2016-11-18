define(['jquery', 'bootstrap'], function($){
    var options = {
        notifyBox : $(".notification-dropdown"),
        bodyBox:$('body'),
        skinBtn:$('.skins-nav .skin'),
        skinFile : $('#skin-file'),
        headBox : $('head'),
        menuBox:$('#sidebar-nav'),
        menuItem:$('#sidebar-nav li'),
        menuToggler:$("#menu-toggler"),
        menuBtn:$("#dashboard-menu .dropdown-toggle"),
        menuPointer:$('#sidebar-nav li .pointer'),
        toolTipBox : $("[data-toggle='tooltip']")
    };
    var init = function(){
        leftmenu();
        skin();
        notify();
        tooltip();
        new uiDropdown();
    };

    var leftmenu = function(){
        var $menu = $("#sidebar-nav");
        var currentUrl = window.location.pathname;
        var pathArr = currentUrl.split('/');
        options.menuItem.each(function(){
            var href = $(this).find('a').attr('href');
            var submenu = $(this).parent('.submenu');
            var parentItem = $(this).parent('.submenu').parent('li');
            var html = '<div class="pointer"><div class="arrow"></div> <div class="arrow_border"></div></div>';
            var menuPointer;

            var urlArr = href.split('/');
            var matched = false;
            if ((pathArr.length == 3) && (urlArr.length == 3)) {
                if (pathArr[0] == urlArr[0] && (pathArr[1] == urlArr[1])) {
                    matched = true;
                }
            }

            if (href == currentUrl || matched) {
                options.menuItem.removeClass('active');
                options.menuPointer.hide();
                $(this).addClass('active');
                if (parentItem.length == 0) {
                    menuPointer = $(this).find('.pointer');
                    if (menuPointer.length > 0) {
                        menuPointer.css('display', 'block');
                    } else {
                        $(this).prepend(html);
                    }
                } else {
                    menuPointer = parentItem.find('.pointer');
                    if (menuPointer.length > 0) {
                        menuPointer.show();
                    } else {
                        parentItem.prepend(html);
                    }
                    parentItem.addClass('active');
                    submenu.show();
                    $(this).find('a').addClass('active');
                }

            }
        });
        options.bodyBox.click(function () {
            if (options.menuBox.hasClass("display")) {
                options.menuBox.removeClass("display");
            }
        });
        options.menuBox.click(function(e) {
            e.stopPropagation();
        });
        options.menuToggler.click(function (e) {
            e.stopPropagation();
            $menu.toggleClass("display");
        });
        options.menuBtn.click(function (e) {
            e.preventDefault();
            options.menuItem.removeClass('active');
            var $item = $(this).parent();
            $item.toggleClass("active");
            if ($item.hasClass("active")) {
                $item.find(".submenu").slideDown("fast");
            } else {
                $item.find(".submenu").slideUp("fast");
            }
        });
    };
    var skin = function(){
        options.skinBtn.click(function (e) {
            e.preventDefault();
            if ($(this).hasClass("selected")) {
                return;
            }
            options.skinBtn.removeClass("selected");
            $(this).addClass("selected");

            if (!options.skinFile.length) {
                options.headBox.append('<link rel="stylesheet" type="text/css" id="skin-file" href="">');
            }
            if ($(this).attr("data-file")) {
                options.skinFile.attr("href", $(this).data("file"));
            } else {
                options.skinFile.attr("href", "");
            }

        });
    };
    var notify = function(){
        options.notifyBox.each(function (index, el) {
            var $el = $(el);
            var $dialog = $el.find(".pop-dialog");
            var $trigger = $el.find(".trigger");

            $dialog.click(function (e) {
                e.stopPropagation()
            });
            $dialog.find(".close-icon").click(function (e) {
                e.preventDefault();
                $dialog.removeClass("is-visible");
                $trigger.removeClass("active");
            });
            options.bodyBox.click(function () {
                $dialog.removeClass("is-visible");
                $trigger.removeClass("active");
            });

            $trigger.click(function (e) {
                e.preventDefault();
                e.stopPropagation();

                // hide all other pop-dialogs
                $(".notification-dropdown .pop-dialog").removeClass("is-visible");
                $(".notification-dropdown .trigger").removeClass("active")

                $dialog.toggleClass("is-visible");
                if ($dialog.hasClass("is-visible")) {
                    $(this).addClass("active");
                } else {
                    $(this).removeClass("active");
                }
            });
        });
    };

    var uiDropdown = new function() {
        var self;
        self = this;
        this.hideDialog = function($el) {
            return $el.find(".dialog").hide().removeClass("is-visible");
        };
        this.showDialog = function($el) {
            return $el.find(".dialog").show().addClass("is-visible");
        };
        return this.initialize = function() {
            $("html").click(function() {
                $(".ui-dropdown .head").removeClass("active");
                return self.hideDialog($(".ui-dropdown"));
            });
            $(".ui-dropdown .body").click(function(e) {
                return e.stopPropagation();
            });
            return $(".ui-dropdown").each(function(index, el) {
                return $(el).click(function(e) {
                    e.stopPropagation();
                    $(el).find(".head").toggleClass("active");
                    if ($(el).find(".head").hasClass("active")) {
                        return self.showDialog($(el));
                    } else {
                        return self.hideDialog($(el));
                    }
                });
            });
        };
    };

    var tooltip = function(){
        options.toolTipBox.each(function (index, el) {
            $(el).tooltip({
                placement: $(this).data("placement") || 'top'
            });
        });
    };
    return {
        init : init
    };
});