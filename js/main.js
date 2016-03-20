(function () {
    Parse.initialize("zkyxTC7ECUg1n43fEZYUGxruoqswy52xol4Wnzl0", "5lIO7eKWAf0kUs34tSHkR26RzSNy4bQOvl3VlMo7");

    window.App = {
        elId: '#wrapper',
        Models: {},
        Views: {},
        Collections: {},
        Router: {},
        instances: {},
        currentTask: null,

        checkLogin: function () {
            location.hash = Parse.User.current() ? 'main' : 'login';
        },

        showPanel: function (element) {
            if (element == this.instances.mainView) {
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
                .append(this.instances.editTaskView.el)
                .children()
                .first()
                .addClass('disabled');
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

    window.ParseService = {

        login: function (name, pass) {

            Parse.User.logIn(name, pass, {
                success: function () {
                    App.instances.loginView.success();
                },
                error: function (user, error) {
                    App.instances.loginView.error(error.message);
                }
            });
        },

        signup: function (name, pass, email) {
            var user = new Parse.User();
            user.signUp({username: name, password: pass, email: email}, {
                success: function () {
                    App.instances.signupView.success();
                },
                error: function (user, error) {
                    App.instances.signupView.error(error.message);
                }
            });
        },

        queryTask: function () {
            var queryTask = new Parse.Query('Task');
            queryTask.equalTo('owners', Parse.User.current());
            queryTask.find(({
                success: function (results) {
                    for (var i in results) {
                        App.instances.tasksCollection.add(results[i]);
                    }
                },
                error: function (error) {
                    App.instances.mainView.getDataError(error.message);
                }
            }));
        },

        getCurrentEmail: function () {
            return Parse.User.current().get('email');
        }
    };

    //MODEL
    App.Models.Task = Parse.Object.extend("Task", {

        defaults: {
            complete: false,
            shared  : false
        },

        validate: function (attrs) {
            if (!$.trim(attrs.title)) {
                return ('Error: Input a title!');
            }
        }
    });

    //VIEW

    App.Views.LoginView = Backbone.View.extend({
        id: 'login-panel',

        events: {
            'submit': 'logIn'
        },

        initialize: function () {
            this.render();
        },
        template: $('#login-panel-template').html(),

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

    App.Views.SignupView = Backbone.View.extend({
        id: 'signup-panel',

        events: {
            'submit': 'signUp'
        },

        initialize: function () {
            this.render();
        },

        template: $('#signup-panel-template').html(),

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


    App.Views.Task = Backbone.View.extend({
        className: 'task',

        events: {
            'click .task-label': 'check',
            'click .task-checkbox': 'check',
            'click .fa-edit': 'edit',
            'press': 'edit',
            'swiperight': 'destroy',
            'transitionend': 'removeEl'
        },

        initialize: function () {
            this.model.on('destroy', this.remove, this);
            this.model.on('change', this.render, this);
            App.instances.vent.on('showCompl', this.filterCompleted, this);
            App.instances.vent.on('showInCompl', this.filterInCompleted, this);
            App.instances.vent.on('allUserTasks', this.showAllTasks, this);
        },

        template: _.template($('#task-template').html()),

        destroy: function () {
            this.model.destroy();
        },

        remove: function () {
            this.$el.addClass('remove');
        },

        removeEl: function (event) {
            if (event.originalEvent.propertyName == 'opacity') {
                this.$el.remove();
            }
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.hammer({velocity: 0.1});
            return this;
        },

        check: function () {
            this.model.save({complete: !this.model.get('complete')});
        },

        filterCompleted: function () {
            this.$el.toggle(this.model.get('complete'));
        },

        filterInCompleted: function () {
            this.$el.toggle(!this.model.get('complete'));
        },

        showAllTasks: function () {
            this.$el.show();
        },

        edit: function () {
            App.showEditPanel(this.model);
        }
    });

    App.Views.MainPanel = Backbone.View.extend({
        id: 'main-panel',

        events: {
            'click #logout': 'logOut',
            'submit #add-task': 'addTask',
            'click #check-all': 'checkAll',
            'blur input': 'blur',
            'click #completed': 'showCompleted',
            'click #incompleted': 'showInCompleted',
            'click #all-user-tasks': 'allUserTasks',
            'click #clear-tasklist': 'clearTaskList'
        },

        initialize: function () {
            this.render();
            this.collection.on('add', this.addOne, this);
        },

        checkedAll: false,

        template: $('#main-template').html(),

        render: function () {
            this.$el
                .html(this.template);
            return this;
        },

        getData: function () {
            this.$el
                .find('.message')
                .empty();
            ParseService.queryTask();
        },

        getDataError: function (message) {
            this.$el
                .find('.message')
                .text(message);
        },

        addOne: function (task) {
            var taskView = new App.Views.Task({model: task});
            this.$el
                .find('#task-list')
                .prepend(taskView.render().el);
        },

        blur: function () {

            this.$el
                .find('.message')
                .empty();
        },

        showUserName: function () {
            this.$el
                .find('#current-user')
                .html(Parse.User.current().get('username'));
        },

        logOut: function () {
            this.collection.reset();
            Parse.User.logOut();
            this.$el
                .find('#task-list')
                .empty()
                .end()
                .find('#current-user')
                .empty();
            location.hash = 'login';
        },

        addTask: function (event) {
            event.preventDefault();
            var newTaskTitle = this.$el.find('.task-title').val();
            var newTask = new App.Models.Task();
            var coincidence = _.filter(this.collection.models, function (model) {
                return model.get('title') == newTaskTitle;
            });

            if (coincidence.length > 0) {
                this.$el
                    .find('.message')
                    .html('<i class="fa fa-exclamation-circle"></i> ' + 'This task already exist!');
                return;
            }

            var self = this;
            newTask.save({title: newTaskTitle}, {
                success: function () {
                    self.$el
                        .find('#add-task')
                        .trigger('reset')
                        .end()
                        .find('.message')
                        .empty();
                    self.collection.add(newTask);
                },
                error: function (model, error) {
                    self.$el
                        .find('.message')
                        .html('<i class="fa fa-exclamation-circle"></i> ' + error)
                        .end()
                        .find('.task-title')
                        .focus();
                }
            });
            if (newTaskTitle) {
                var relation = newTask.relation('owners');
                relation.add(Parse.User.current());
                newTask.save();
            }
        },

        getCompletedArr: function () {
            return this.collection.filter(function (tasks) {
                return tasks.get('complete');
            });
        },

        clearTaskList: function () {
            _.each(this.getCompletedArr(), function (model) {
                model.destroy();
            });
            this.$el
                .find('#check-all')
                .prop('checked', false);
        },

        showCompleted: function (event) {
            event.preventDefault();
            App.instances.vent.trigger('showCompl')
        },

        showInCompleted: function (event) {
            event.preventDefault();
            App.instances.vent.trigger('showInCompl')
        },

        allUserTasks: function (event) {
            event.preventDefault();
            App.instances.vent.trigger('allUserTasks')
        },

        checkAll: function () {
            var self = this;
            this.$el
                .find('label[for="check-all"] i')
                .toggleClass('fa-square-o')
                .toggleClass('fa-check-square-o')
                .end()
                .find('#check-text')
                .text((this.checkedAll) ? 'Check all' : 'Uncheck all');
            this.collection.each(function (model) {
                model.save({complete: !self.checkedAll})
            });
            this.checkedAll = !this.checkedAll;
        }
    });

    App.Views.EditTaskView = Backbone.View.extend({
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
        template: $('#edit-panel-template').html(),

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
            App.showChangePanel(App.instances.renameTaskView.el);
        },

        share:  function () {
            App.showChangePanel(App.instances.shareTaskView.el);
        }
    });

    App.Views.RenameTaskView = Backbone.View.extend ({
        id: 'rename-panel',

        events: {
            'submit'        : 'submit',
            'click .cancel' : 'cancel',
            'transitionend': 'detachPanel'
        },

        initialize: function () {
            this.render();
        },

        template: $('#rename-template').html(),

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

            var self = this;
            App.currentTask.save({title: newTaskTitle}, {
                success: function () {
                    self.$el
                        .addClass('done')
                        .find('.message')
                        .html('Done!');
                },
                error: function (model, error) {
                    self.$el
                        .find('.message')
                        .html('<i class="fa fa-exclamation-circle"></i> ' + error);
                }
            });
        },

        cancel: function(){
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

    App.Views.ShareTaskView = Backbone.View.extend ({
        id: 'share-panel',

        events: {
            'submit'        : 'submit',
            'click .cancel' : 'cancel',
            'transitionend': 'detachPanel'
        },

        initialize: function () {
            this.render();
        },

        f: $('#share-template').html(),

        render: function () {
            this.$el.html(this.template);
            return this;
        },

        cancel: function(){
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

    //COLLECTION
    App.Collections.Tasks = Parse.Collection.extend({
        model: App.Models.Task
    });

    //ROUTER
    App.Router = Backbone.Router.extend({

        routes: {
            '': 'start',
            'main': 'main',
            'signup': 'signup',
            'login': 'login'
        },

        start: function () {
            App.checkLogin();
        },

        main: function () {
            App.showPanel(App.instances.mainView);
        },

        signup: function () {
            App.showPanel(App.instances.signupView);
        },

        login: function () {
            App.showPanel(App.instances.loginView);
        }

    });

    App.instances.vent = _.extend({}, Backbone.Events);

    App.instances.tasksCollection = new App.Collections.Tasks([{}]);
    App.instances.mainView = new App.Views.MainPanel({collection: App.instances.tasksCollection});
    App.instances.loginView = new App.Views.LoginView();
    App.instances.signupView = new App.Views.SignupView();
    App.instances.editTaskView = new App.Views.EditTaskView();
    App.instances.renameTaskView = new App.Views.RenameTaskView();
    App.instances.shareTaskView = new App.Views.ShareTaskView();

    App.instances.router = new App.Router();
    Backbone.history.start();

}());