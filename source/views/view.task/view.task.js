define(['backbone',
        'text!templates/task.html',
        'hammerjs',
        'jqueryhammer'
    ],
    function (Backbone,
              taskTemplate) {

        var ViewTask = Backbone.View.extend({
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

            template: _.template(taskTemplate),

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

        return ViewTask;
    });