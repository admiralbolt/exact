import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('about', function() {
    this.route('project-tasks');
    this.route('personnel');
  });
  this.route('home', {path: '/'}, function() {
    this.route('organization');
    this.route('number-tutorial');
  });
});

export default Router;
