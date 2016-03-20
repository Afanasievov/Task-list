define(['backbone',
        'services/parse.service',
        'text!templates/share_task.html'
    ],
    function (Backbone,
              ParseService,
              shareTaskTemplate) {

        var ViewShareTask = Backbone.View.extend({
            id: 'share-panel',

            events: {
                'submit': 'submit',
                'click .cancel': 'cancel',
                'transitionend': 'detachPanel'
            },

            initialize: function () {
                this.render();
            },

            template: shareTaskTemplate,

            render: function () {
                this.$el.html(this.template);
                return this;
            },

            cancel: function () {
                this.$el
                    .removeClass('done')
                    .find('.message')
                    .empty()
                    .end()
                    .find('form')
                    .trigger('reset');
                App.removeChangePanel();
            },

            submit: function (event) {
                event.preventDefault();
                var emailShare = this.$el.find('input').val();
                var messageDiv = this.$el.find('.message');
                var self = this;

                if (emailShare == ParseService.getCurrentEmail()) {
                    messageDiv.html('<i class="fa fa-exclamation-circle"></i> It is your email! Input an email of another user!');
                    return;
                }

                var queryUser = new Parse.Query('User');
                queryUser.equalTo('email', emailShare);
                queryUser.first(({
                    success: function (result) {
                        if (!result) {
                            messageDiv.html('<i class="fa fa-exclamation-circle"></i> Incorrect email!');
                            return;
                        }
                        var relation = App.currentTask.relation('owners');
                        relation.add(result);
                        App.currentTask.set('shared', true);
                        App.currentTask.save();
                        messageDiv.text('Done!');
                        self.$el.addClass('done');
                    },
                    error: function (error) {
                        messageDiv.html('<i class="fa fa-exclamation-circle"></i> ' + error.message);
                    }
                }));
            },
            detachPanel: function () {
                this.cancel();
                App.removeEditPanel();
            }

        });

        return ViewShareTask;
    });