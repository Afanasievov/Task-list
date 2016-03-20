requirejs.config({
    baseUrl: 'source',
    paths: {
        jquery: 'lib/jquery-2.2.0.min',
        backbone: 'lib/backbone-min',
        underscore: 'lib/underscore-min',
        parse: 'lib/parse',
        hammerjs: 'lib/hammer.min',
        jqueryhammer: 'lib/jquery.hammer',
        app: 'application/application',
        models: 'models',
        collection: 'collections',
        routers: 'routers',
        services: 'services',
        views: 'views'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'parse': {
            deps: ['underscore', 'jquery'],
            exports: 'Parse'
        }
    }
});

require(['jquery', 'app'], function ($, App) {
    $(document).ready(function () {
        App.init();
    });
});
