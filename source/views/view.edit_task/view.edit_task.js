define(['backbone', 'text!templates/edit_task.html'], function (Backbone, editTaskTemplate) {

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
            App.currentTask.destroy();
            App.removeEditPanel();
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