define(['backbone',
        'services/parse.service',
        'text!templates/main_panel.html'
    ],
    function (Backbone,
              ParseService,
              mainPanelTemplate) {

        var ViewMainPanel = Backbone.View.extend({
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

            template: mainPanelTemplate,

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
                var taskView = new App.Views.ViewTask({model: task});
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

        return ViewMainPanel;
    });