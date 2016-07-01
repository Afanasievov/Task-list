define(['parse'], function (Parse) {

    var ParseService = {

        initialize: function () {
            Parse.initialize("zkyxTC7ECUg1n43fEZYUGxruoqswy52xol4Wnzl0", "5lIO7eKWAf0kUs34tSHkR26RzSNy4bQOvl3VlMo7");
        },

        isCurrentUser: function () {
            return Parse.User.current();
        },

        login: function (name, pass) {

            Parse.User.logIn(name, pass, {
                success: function () {
                    App.instances.viewLogin.success();
                },
                error: function (user, error) {
                    App.instances.viewLogin.error(error.message);
                }
            });
        },

        signup: function (name, pass, email) {
            var user = new Parse.User();
            user.signUp({username: name, password: pass, email: email}, {
                success: function () {
                    App.instances.viewSignup.success();
                },
                error: function (user, error) {
                    App.instances.viewSignup.error(error.message);
                }
            });
        },

        logOut: function () {
            Parse.User.logOut();
        },

        getUserName: function () {
            return Parse.User.current().get('username')
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
                    App.instances.viewMainPanel.getDataError(error.message);
                }
            }));
        },

        addTask: function (newTask, newTaskTitle) {

            newTask.save({title: newTaskTitle}, {
                success: function () {
                    relation = newTask.relation('owners');
                    relation.add(Parse.User.current());
                    newTask.save();
                    App.instances.viewMainPanel.addingSuccess(newTask);
                },
                error: function (error, response) {
                    App.instances.viewMainPanel.addingError(response.message);
                }
            })
        },

        saveTask: function (newTaskTitle) {
            App.currentTask.save({title: newTaskTitle}, {
                success: function () {
                    App.instances.viewRenameTask.success();
                },
                error: function (model, error) {
                    App.instances.viewRenameTask.error(error.message);
                }
            });
        },

        shareTask: function (emailShare) {
            var queryUser = new Parse.Query('User');
            queryUser.equalTo('email', emailShare);
            queryUser.first(({
                success: function (result) {
                    if (!result) {
                        App.instances.viewShareTask.showEmailErr();
                        return;
                    }
                    var relation = App.currentTask.relation('owners');
                    relation.add(result);
                    App.currentTask.set('shared', true);
                    App.currentTask.save();
                    App.instances.viewShareTask.success();
                },
                error: function (error) {
                    messageDiv.html('<i class="fa fa-exclamation-circle"></i> ' + error.message);
                }
            }));
        },

        deleteTask: function () {
            App.currentTask.destroy({
                success: function () {
                    App.removeEditPanel();
                }
            })
        },

        getCurrentEmail: function () {
            return Parse.User.current().get('email');
        }
    };

    return ParseService;
});