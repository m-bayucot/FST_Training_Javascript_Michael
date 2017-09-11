import Backbone from 'backbone';

export class Todo extends Backbone.Model {
  defaults() {
    return {
      title: '',
      completed: false,
      created: 0
    };
  }

  initialize() {
    if (this.isNew()) {
      this.set('created', new Date().getTime());
    }
  }

  toggle() {
    return this.set('completed', !this.isCompleted());
  }

  isCompleted() {
    return this.get('completed');
  }

  matchesFilter(filter) {
    if (filter === 'all') {
      return true;
    }

    if (filter === 'active') {
      return !this.isCompleted();
    }

    return this.isCompleted();
  }
}