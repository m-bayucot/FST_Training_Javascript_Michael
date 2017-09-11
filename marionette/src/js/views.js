import $ from 'jquery';
import * as Mn from 'backbone.marionette'
import _ from 'underscore';

export class TodoView extends Mn.View {
  constructor(options) {
    options.tagName = 'li';
    options.ui = {
      edit: '.edit',
      destroy: '.destroy',
      label: 'label',
      toggle: '.toggle'
    };
    options.events = {
      'click @ui.destroy': 'deleteModel',
      'dblclick @ui.label': 'onEditClick',
      'keydown @ui.edit': 'onEditKeypress',
      'focusout @ui.edit': 'onEditFocusout',
      'click @ui.toggle': 'toggle'
    };
    super(options)
  }

  initialize() {
    this.template = _.template($('#template-todoItemView').html());
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'visible', this.toggleVisible);
  }

  className() {
    return this.model.get('completed') ? 'completed' : 'active';
  }

  modelEvents() {
    change: 'render'
  }

  deleteModel() {
    this.model.destroy();
  }

  toggle() {
    this.model.toggle().save();
  }

  onEditClick() {
    this.$el.addClass('editing');
    this.ui.edit.focus();
    this.ui.edit.val(this.ui.edit.val());
  }

  onEditFocusout() {
    let todoText = this.ui.edit.val().trim();
    if (todoText) {
      this.model.set('title', todoText).save();
      this.$el.removeClass('editing');
    } else {
      this.destroy();
    }
  }

  onEditKeypress(e) {
    let ENTER_KEY = 13;
    let ESC_KEY = 27;

    if (e.which === ENTER_KEY) {
      this.onEditFocusout();
      return;
    }

    if (e.which === ESC_KEY) {
      this.ui.edit.val(this.model.get('title'));
      this.$el.removeClass('editing');
    }
  }
}

export class ListBodyView extends Mn.CollectionView {
  initialize() {
    this.id = 'todo-list';
    this.tagName = 'ul';
    this.childView = TodoView;
  }

  filter(child) {
    let filteredOn = window.TodoManager.filterChannel.request('filterState').get('filter');
    return child.matchesFilter(filteredOn);
  }
}

export class ListView extends Mn.View {
  constructor(options) {
    options.tagName = 'li';
    options.ui = {
      toggle: '#toggle-all'
    }
    options.regions = {
      listBody: {
        el: 'ul',
        replaceElement: true
      }
    };
    options.events = {
      'click @ui.toggle': 'onToggleAllClick'
    };
    super(options)
  }

  initialize() {
    this.template = _.template($('#template-todoListView').html());
  }
}