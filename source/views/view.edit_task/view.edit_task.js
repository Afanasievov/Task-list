define(['backbone',
    'services/parse.service',
    'text!templates/edit_task.html'
],
    function (Backbone, ParseService, editTaskTemplate) {

    var ViewEditTask = Backbone.View.extend({
        id: 'edit-panel',

        events: {
            'click .cancel' : 'cancel',
            'click #delete' : 'delete',
            'click #rename' : 'rename',
            'click #share'  : 'share'
        },

        initialize: function () {
            this.render();
        },
        template: editTaskTemplate,

        render: function () {
            this.$el.html(this.template);
            return this;
        },

        cancel: function () {
            App.removeEditPanel();
        },

        delete: function () {
            ParseService.deleteTask();
        },

        rename: function () {
            App.showChangePanel(App.instances.viewRenameTask.el);
        },

        share:  function () {
            App.showChangePanel(App.instances.viewShareTask.el);
        }
    });

    return ViewEditTask;
});