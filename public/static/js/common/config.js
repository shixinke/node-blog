requirejs.config({
    baseUrl: '/static/js',
    paths: {
        'jquery':'libs/jquery/1.2.3/jquery.min',
        'fn':'common/fn',
        'layout':'common/layout',
        'jquery.form':'libs/jquery.form/3.5.0/jquery.form.min',
        'jquery.validate':'libs/jquery.validation/1.15.0/jquery.validate.min',
        'jquery.md5':'libs/jquery.md5/jquery.md5',
        'layer':'libs/layer/3.0.1/layer',
        'laydate':'libs/laydate/1.1/laydate',
        'bootstrap':'libs/bootstrap/3.3.0/bootstrap.min',
        'pager':'libs/pager/0.5/bootstrap-paginator',
        'webuploader':'libs/webuploader/0.1.5/webuploader.min',
        'flot':'libs/jquery.flot/0.8.3/jquery.flot.min',
        'flot-pie':'libs/jquery.flot/0.8.3/jquery.flot.pie.min',
        'flot-resize':'libs/jquery.flot/0.8.3/jquery.flot.resize.min',
        'flot-categories':'libs/jquery.flot/0.8.3/jquery.flot.categories.min',
        'flot-time':'libs/jquery.flot/0.8.3/jquery.flot.time.min',
        'raphael':'libs/raphael/2.1/raphael.min',
        'morris':'libs/jquery.morris/0.5.1/morris.min',
        'treetable':'libs/treetable/3.2.0/treetable',

    },
    shim:{
        'bootstrap':['jquery'],
        'jquery.form':['jquery'],
        'jquery.validate':['jquery'],
        'jquery.md5':['jquery'],
        'flot':['jquery'],
        'flot-resize':['jquery', 'flot'],
        'flot-categories':['flot'],
        'flot-time':['jquery', 'flot'],
        'flot-pie':['jquery', 'flot'],
        'morris':['jquery', 'raphael'],
        'layer':['jquery']
    }
});