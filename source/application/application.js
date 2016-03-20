define(['collections/tasksCollection',
        'models/task',
        'views/view.task/view.task',
        'views/view.main_panel/view.main_panel',
        'views/view.login/view.login',
        'views/view.signup/view.signup',
        'views/view.edit_task/view.edit_task',
        'views/view.rename_task/view.rename_task',
        'views/view.share_task/view.share_task',
        'routers/router',
        'services/parse.service',
        'backbone'
    ],

    function (TasksCollection,
              Task,
              ViewTask,
              ViewMainPanel,
              ViewLogin,
              ViewSignup,
              ViewEditTask,
              ViewRenameTask,
              ViewShareTask,
              Router,
              ParseService,
              Backbone) {
        window.App = {
            elId: '#wrapper',
            Models: {Task: Task},
            Views: {
                ViewTask: ViewTask,
                ViewMainPanel: ViewMainPanel,
                ViewLogin: ViewLogin,
                ViewSignup: ViewSignup,
                ViewEditTask: ViewEditTask,
                ViewRenameTask: ViewRenameTask,
                ViewShareTask: ViewShareTask
            },
            Collections: {
                TasksCollection: TasksCollection
            },
            Router: Router,
            instances: {},
            currentTask: null,

            init: function () {
                ParseService.initialize();

                this.instances.vent = _.extend({}, Backbone.Events);
                this.instances.tasksCollection = new this.Collections.TasksCollection;
                this.instances.viewMainPanel = new this.Views.ViewMainPanel({collection: App.instances.tasksCollection});
                this.instances.viewLogin = new this.Views.ViewLogin;
                this.instances.viewSignup = new this.Views.ViewSignup;
                this.instances.viewEditTask = new this.Views.ViewEditTask;
                this.instances.viewRenameTask = new this.Views.ViewRenameTask;
                this.instances.viewShareTask = new this.Views.ViewShareTask;
                this.instances.router = new this.Router;
                Backbone.history.start();

                this.checkLogin();
            },

            checkLogin: function () {
                location.hash = ParseService.isCurrentUser() ? 'main' : 'login';
            },

            showPanel: function (element) {
                if (element == this.instances.viewMainPanel) {
                    element.getData();
                    element.showUserName();
                }
                $(this.elId)
                    .children()
                    .detach()
                    .end()
                    .html(element.el)
                    .find('.message')
                    .empty();
            },

            showEditPanel: function (task) {
                this.currentTask = task;
                $(this.elId)
                    .append(this.instances.viewEditTask.el)
                    .children()
                    .first()
                    .addClass('disabled')
                    .end()
                    .last()
                    .width($(this.elId).width());
            },

            removeEditPanel: function () {
                this.currentTask = null;
                $(this.elId)
                    .children()
                    .removeClass('disabled')
                    .last()
                    .detach();
            },

            showChangePanel: function (element) {
                $(this.elId)
                    .children()
                    .addClass('disabled')
                    .end()
                    .append(element);
                $(element)
                    .width($(this.elId).width())
                    .find('input')
                    .focus();
            },

            removeChangePanel: function () {
                $(this.elId)
                    .children()
                    .last()
                    .detach();
                $(this.elId)
                    .children()
                    .last()
                    .removeClass('disabled');
            }
        };

        return App;
    });
