import  $  from  'jquery';
import  *  as  Mn  from  'backbone.marionette'
import  _  from  'underscore'

export class RootLayout extends Mn.View  {
  constructor() {
    let options = {
      regions: {
        header: '#header',
        main: '#main',
        footer: '#footer'
      }
    };
    super(options)
  }

  initialize() {
    this.setElement($('#todoapp'), true);
  }
}

export class HeaderLayout extends Mn.View  {
  constructor(options) {
    options.ui = '#new-todo';
    options.events = {
      'keypress @ui.input': 'onInputKeypress',
      'keyup @ui.input': 'onInputKeyup'
    };
    super(options)
  }

  initialize() {
    this.template = _.template($('#template-header').html());
    this.ui = {
      input: '#new-todo'
    }
  }

  onInputKeyup(e) {
    let ESC_KEY = 27;

    if (e.which === ESC_KEY) {
      this.render();
    }
  }

  onInputKeypress(e) {
    let ENTER_KEY = 13;
    let todoText = this.ui.input.val().trim();

    if (e.which === ENTER_KEY && todoText) {
      this.collection.create({
        title: todoText
      });
      this.ui.input.val('');
    }
  }
}

export class FooterLayout extends Mn.View  {
  constructor(options) {
    options = Object.assign(options,  {
      ui: {
        filters: '#filters a',
        completed: '.completed a',
        active: '.active a',
        all: '.all a',
        summary: '#todo-count',
        clear: '#clear-completed'
      },
      events: {
        'click @ui.clear': 'onClearClick'
      },
      collectionEvents: {
        'all': 'render'
      },
      templateContext: {
        activeCountLabel() {
          return (this.activeCount === 1 ? 'item' : 'items') + ' left';
        }
      }
    });
    super(options)
  }

  initialize() {
    this.template = _.template($('#template-footer').html());
  }

  initialize() {
    this.listenTo(window.TodoManager.filterChannel.request('filterState'), 'change:filter', this.updateFilterSelection,  this);
  }

  serializeData() {
    let active = this.collection.getActive().length;
    let total = this.collection.length;

    return  {
      activeCount: active,
      totalCount: total,
      completedCount: total - active
    };
  }

  render() {
    this.$el.parent().toggle(!!this.collection.length);
    this.updateFilterSelection();
  }

  updateFilterSelection() {
    this.ui.filters.removeClass('selected');
    this.ui[window.TodoManager.filterChannel.request('filterState').get('filter')]
      .addClass('selected');
  }

  onClearClick() {
    let completed = this.collection.getCompleted();
    completed.forEach(function(todo) {
      todo.destroy();
    });
  }
}