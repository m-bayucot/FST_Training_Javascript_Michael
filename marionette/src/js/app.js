import $ from 'jquery';
import * as Mn from 'backbone.marionette'
import Backbone from 'backbone';
import {RootLayout, HeaderLayout, FooterLayout} from './layouts'
import {Router} from './routers'
import {ListView} from './views'
import {TodoList} from './collections'
import '../css/style.scss';

window.TodoManager = {
  init: function() {
    let filterState = new Backbone.Model({
      filter: 'all'
    });

    this.filterChannel = Backbone.Radio.channel('filter');
    this.filterChannel.reply('filterState', function() {
      return filterState;
    });
  }
};

class Controller extends Mn.Object {
  initialize() {
    this.todoList = new TodoList();
  }

  // Start the app by showing the appropriate views
  // and fetching the list of todo items, if there are any
  start() {
    this.showHeader(this.todoList);
    this.showFooter(this.todoList);
    this.showTodoList(this.todoList);
    this.todoList.on('all', this.updateHiddenElements, this);
    this.todoList.fetch();
  }

  updateHiddenElements() {
    $('#main, #footer').toggle(!!this.todoList.length);
  }

  showHeader(todoList) {
    let header = new HeaderLayout({
      collection: todoList
    });
    window.TodoManager.App.root.showChildView('header', header);
  }

  showFooter(todoList) {
    let footer = new FooterLayout({
      collection: todoList
    });
    window.TodoManager.App.root.showChildView('footer', footer);
  }

  showTodoList(todoList) {
    window.TodoManager.App.root.showChildView('main', new ListView({
      collection: todoList
    }));
  }

  filterItems(filter) {
    let newFilter = filter && filter.trim() || 'all';
    window.TodoManager.filterChannel.request('filterState').set('filter', newFilter);
  }
}

class TodoManagerApp extends Mn.Application {
  setRootLayout() {
    this.root = new RootLayout();
  }
}

$(() => {
  window.TodoManager.App = new TodoManagerApp();
  window.TodoManager.App.on('before:start', function() {
    window.TodoManager.App.setRootLayout();
  });

  window.TodoManager.App.on('start', function() {
    window.TodoManager.init();

    let controller = new Controller();
    controller.router = new Router({
      controller: controller
    });

    controller.start();
    Backbone.history.start();
  });

  window.TodoManager.App.start();
});