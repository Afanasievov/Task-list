define (['models/task', 'parse'], function (Task, Parse) {

    var TasksCollections = Parse.Collection.extend({
        model: Task
    });
    return TasksCollections;

});