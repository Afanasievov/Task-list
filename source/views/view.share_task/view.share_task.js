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
                var self = this;

                if (emailShare == ParseService.getCurrentEmail()) {
                    this.$el.find('.message')
                        .html('<i class="fa fa-exclamation-circle"></i> It is your email! Input an email of another user!');
                    return;
                }

                ParseService.shareTask(emailShare);
            },
            
            showEmailErr: function () {
                this.$el.find('.message')
                    .html('<i class="fa fa-exclamation-circle"></i> Incorrect email!');
            },
            
            success: function () {
                this.$el.find('.message')
                    .text('Done!');
                this.$el.addClass('done');
            },
            
            detachPanel: function () {
                this.cancel();
                App.removeEditPanel();
            }

        });

        return ViewShareTask;
    });