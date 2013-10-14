// Generated by CoffeeScript 1.6.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'backbone', 'collections/todos', 'views/todos', 'text!templates/stats.html', 'common', 'contracts-js'], function($, _, Backbone, Todos, TodoView, statsTemplate, Common, C) {
    var AppView, _ref;
    return AppView = (function(_super) {
      __extends(AppView, _super);

      function AppView() {
        _ref = AppView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      AppView.prototype.el = '#todoapp';

      AppView.prototype.template = _.template(statsTemplate);

      AppView.prototype.events = {
        'keypress #new-todo': 'createOnEnter',
        'click #clear-completed': 'clearCompleted',
        'click #toggle-all': 'toggleAllComplete'
      };

      AppView.prototype.initialize = function() {
        this.TodosCollection = new Todos();
        this.allCheckbox = this.$('#toggle-all')[0];
        this.$input = this.$('#new-todo');
        this.$footer = this.$('#footer');
        this.$main = this.$('#main');
        this.listenTo(this.TodosCollection, 'add', this.addOne);
        this.listenTo(this.TodosCollection, 'reset', this.addAll);
        this.listenTo(this.TodosCollection, 'change:completed', this.filterOne);
        this.listenTo(this.TodosCollection, 'filter', this.filterAll);
        this.listenTo(this.TodosCollection, 'all', this.render);
        return this.TodosCollection.fetch();
      };

      AppView.prototype.render = C.guard(C.fun(C.Any, C.Self), function() {
        var completed, remaining;
        completed = this.TodosCollection.completed().length;
        remaining = this.TodosCollection.remaining().length;
        if (this.TodosCollection.length) {
          this.$main.show();
          this.$footer.show();
          this.$footer.html(this.template({
            completed: completed,
            remaining: remaining
          }));
          this.$('#filters li a').removeClass('selected').filter('[href="#' + (Common.TodoFilter || '') + '"]');
        } else {
          this.$main.hide();
          this.$footer.hide();
        }
        this.allCheckbox.checked = !remaining;
        return this;
      });

      AppView.prototype.addOne = function(todo) {
        var view;
        view = new TodoView({
          model: todo
        });
        return $('#todo-list').append(view.render().el);
      };

      AppView.prototype.addAll = function() {
        this.$('#todo-list').html('');
        return this.TodosCollection.each(this.addOne, this);
      };

      AppView.prototype.filterOne = function(todo) {
        return todo.trigger('visible');
      };

      AppView.prototype.filterAll = function() {
        return this.TodosCollection.each(this.filterOne, this);
      };

      AppView.prototype.newAttributes = C.guard(C.fun(C.Any, C.object({
        title: C.Str,
        order: C.Num,
        completed: C.Bool
      })), function() {
        return {
          title: this.$input.val().trim(),
          order: this.TodosCollection.nextOrder(),
          completed: false
        };
      });

      AppView.prototype.isEvent = C.check((function(e) {
        return e.which !== 'undefined';
      }), 'Event');

      AppView.prototype.createOnEnter = C.guard(C.fun(AppView.prototype.isEvent, C.Any), function(e) {
        if (!(e.which !== Common.ENTER_KEY || !this.$input.val().trim())) {
          this.TodosCollection.create(this.newAttributes());
          return this.$input.val('');
        }
      });

      AppView.prototype.clearCompleted = function() {
        _.invoke(this.TodosCollection.completed(), 'destroy');
        return false;
      };

      AppView.prototype.toggleAllComplete = function() {
        var completed;
        completed = this.allCheckbox.checked;
        return this.TodosCollection.each(function(todo) {
          return todo.save({
            'completed': completed
          });
        });
      };

      return AppView;

    })(Backbone.View);
  });

}).call(this);

/*
//@ sourceMappingURL=app.map
*/
