define ([
    'backbone',
    'services/parse.service',
    'text!templates/login.html'
]
    , function (
        Backbone,
        ParseService,
        loginTemplate
    ) {

    var ViewLogin = Backbone.View.extend({
        id: 'login-panel',

        events: {
            'submit': 'logIn'
        },

        initialize: function () {
            this.render();
        },
        template: loginTemplate,

        render: function () {
            this.$el.html(this.template);
            return this;
        },

        logIn: function (event) {
            event.preventDefault();
            var name = this.$el.find('.login').val();
            var pass = this.$el.find('.password').val();
            ParseService.login(name, pass);
        },

        success: function () {
            this.$el
                .find('input[type="text"], input[type="password"]')
                .val('')
                .end()
                .find('.message')
                .empty();
            location.hash = 'main';
        },

        error: function (message) {
            this.$el.find('.message').html('<i class="fa fa-exclamation-circle"></i> ' + message);
        }
    });

    return ViewLogin;
});
