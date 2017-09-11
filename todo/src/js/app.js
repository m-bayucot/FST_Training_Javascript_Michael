import $ from 'jquery';
import Backbone from 'backbone';
import '../css/style.scss';
import {AppView, Filters} from './todo-app';

$(() => {
  new AppView();
  new Filters();
  Backbone.history.start();
});