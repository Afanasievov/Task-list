define(['backbone',
    'services/parse.service',
    'text!templates/rename_task.html'
],
    function (Backbone,
              ParseService,
              renameTaskTemplate) {

    var ViewRenameTask = Backbone.View.extend({
        id: 'rename-panel',

        events: {
            'submit': 'submit',
            'click .cancel': 'cancel',
            'transitionend': 'detachPanel'
        },

        initialize: function () {
            this.render();
        },

        template: renameTaskTemplate,

        render: function () {
            this.$el.html(this.template);
            return this;
        },

        submit: function (event) {
            event.preventDefault();
            var newTaskTitle = this.$el.find('input').val();
            var coincidence = _.filter(App.instances.tasksCollection.models, function (model) {
                return model.get('title') == newTaskTitle;
            });

            if (coincidence.length > 0) {
                this.$el
                    .find('.message')
                    .html('<i class="fa fa-exclamation-circle"></i> ' + 'This task already exist!');
                return;
            }

            ParseService.saveTask(newTaskTitle);
        },
        
        success: function () {
            this.$el
                .addClass('done')
                .find('.message')
                .html('Done!');
        },
        
        error: function (errMess) {
            this.$el
                .find('.message')
                .html('<i class="fa fa-exclamation-circle"></i> ' + errMess);
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

        detachPanel: function () {
            this.cancel();
            App.removeEditPanel();
        }
    });

    return ViewRenameTask;
});