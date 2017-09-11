import * as Mn from 'backbone.marionette'

export class Router extends Mn.AppRouter {
  constructor() {
    let options = {
      appRoutes: {
        '*filter': 'filterItems'
      },
      controller: {
        filterItems(filter) {
          let newFilter = filter && filter.trim() || 'all';
          window.TodoManager.filterChannel.request('filterState').set('filter', newFilter);
        }
      }
    };

    super(options);
  }
}