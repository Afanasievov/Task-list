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

        getCurrentEmail: function () {
            return Parse.User.current().get('email');
        }
    };

    return ParseService;
});