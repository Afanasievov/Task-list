define(['backbone'], function (Backbone) {

    var Router = Backbone.Router.extend({

        routes: {
            'main': 'main',
            'signup': 'signup',
            'login': 'login'
        },

        main: function () {
            App.showPanel(App.instances.viewMainPanel);
        },

        signup: function () {
            App.showPanel(App.instances.viewSignup);
        },

        login: function () {
            App.showPanel(App.instances.viewLogin);
        }

    });

    return Router;
});