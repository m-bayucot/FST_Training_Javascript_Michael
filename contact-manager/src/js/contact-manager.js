import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';

export class Contact extends Backbone.Model {
  defaults() {
    return {
      name: null,
      tel: null,
      email: null
    };
  }
}

export class Contacts extends Backbone.Collection {
  constructor(options) {
    super(options);
    this.model = Contact;
  }
}

class ContactView extends Backbone.View {

  constructor(options) {
    options.tagName = 'li';
    options.className = 'media col-md-6 col-lg-4';
    options.events = {
      'click .delete-contract': 'onClickDelete'
    };
    super(options)
  }

  initialize() {
    this.template = _.template($('#tpl-contact').html());
    this.listenTo(this.model, 'remove', this.remove);
  }

  render() {
    let html = this.template(this.model.toJSON());
    this.$el.append(html);
    return this;
  }

  onClickDelete(e) {
    e.preventDefault();
    this.model.collection.remove(this.model);
  }
}

export class ContactFormView extends Backbone.View {

  constructor(options) {
    options.events = {
      'submit .contract-form': 'onFormSubmit'
    };
    super(options)
  }

  initialize() {
    this.template = _.template($('#tpl-new-contact').html());
  }

  render() {
    let html = this.template(_.extend(this.model.toJSON(), {
      isNew: this.model.isNew()
    }));
    this.$el.append(html);
    return this;
  }

  onFormSubmit(e) {
    e.preventDefault();
    this.trigger('form:submitted', {
      name: this.$('.contact-name-input').val(),
      tel: this.$('.contact-tel-input').val(),
      email: this.$('.contact-email-input').val()
    });
  }
}

export class ContactsView extends Backbone.View {
  constructor(options) {
    super(options)
  }

  initialize() {
    this.template = _.template($('#tpl-contacts').html());
  }

  render() {
    let html = this.template();
    this.$el.html(html);

    this.collection.each(this.renderOne, this);

    return this;
  }

  renderOne(contact) {
    let itemView = new ContactView({model: contact});
    this.$('.contacts-container').append(itemView.render().$el);
  }
}

export class Router extends Backbone.Router {

  constructor() {
    super()

    this.routes = {
      '': 'home',
      'contacts': 'showContacts',
      'contacts/new': 'newContact',
      'contacts/edit/:id': 'editContact'
    }

    this._bindRoutes();
  }
}