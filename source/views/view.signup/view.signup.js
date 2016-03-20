define(['backbone',
        'services/parse.service',
        'text!templates/signup.html'
    ],
    function (Backbone,
              ParseService,
              signupTemplate) {

        var ViewSignup = Backbone.View.extend({
            id: 'signup-panel',

            events: {
                'submit': 'signUp'
            },

            initialize: function () {
                this.render();
            },

            template: signupTemplate,

            render: function () {
                this.$el.html(this.template);
                return this;
            },

            signUp: function (event) {
                event.preventDefault();
                var name = this.$el.find(".login").val();
                var pass = this.$el.find(".password").val();
                var email = this.$el.find(".email").val();

                ParseService.signup(name, pass, email);
            },

            success: function () {
                this.$el
                    .find('input[type="text"], input[type="password"], input[type="email"]')
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

        return ViewSignup;
    });