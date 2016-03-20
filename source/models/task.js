define (['parse'], function (Parse) {

    var Task = Parse.Object.extend('Task', {
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
    return Task;

});