import Backbone from 'backbone'
import {Todo} from './models'
import {LocalStorage} from 'backbone.localstorage'

export class TodoList extends Backbone.Collection {
  constructor(options) {
    super(options);
    this.model = Todo;
    this.localStorage = new LocalStorage('todos-backbone-backbone');
  }

  getCompleted() {
    return this.filter(todo => todo.get('completed'));
  }

  getActive() {
    return this.without(...this.completed());
  }

  _isCompleted(todo) {
    return todo.isCompleted();
  }
}