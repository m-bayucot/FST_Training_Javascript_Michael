import $ from 'jquery';
import Backbone from 'backbone';
import _ from 'underscore';
import '../css/style.scss';
import {Contact, Contacts, ContactsView, ContactFormView, Router} from './contact-manager';

class ContactManagerApp {
  constructor() {
  }

  start() {
    let contacts = new Contacts;
    let router = new Router();

    router.on('route:home', function() {
      router.navigate('contacts', {
        trigger: true,
        replace: true
      });
    });

    router.on('route:showContacts', function() {
      let contactsView = new ContactsView({
        collection: contacts
      });

      $('.main-container').html(contactsView.render().$el);
    });

    router.on('route:newContact', function() {
      let newContactForm = new ContactFormView({
        model: new Contact()
      });

      newContactForm.on('form:submitted', function(attrs) {
        attrs.id = contacts.isEmpty() ? 1 : (_.max(contacts.pluck('id')) + 1);
        contacts.add(attrs);
        router.navigate('contacts', true);
      });

      $('.main-container').html(newContactForm.render().$el);
    });

    router.on('route:editContact', function(id) {
      let contact = contacts.get(id);
      let editContactForm;

      if (contact) {
        editContactForm = new ContactFormView({
          model: contact
        });

        editContactForm.on('form:submitted', function(attrs) {
          contact.set(attrs);
          router.navigate('contacts', true);
        });

        $('.main-container').html(editContactForm.render().$el);
      } else {
        router.navigate('contacts', true);
      }
    });

    Backbone.history.start();
  }
};

$(() => {
  new ContactManagerApp().start();
});