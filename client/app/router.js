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
  this.route('contents', function() {
    this.route('videos-and-animations');
    this.route('notation');
    this.route('history');
  });
  this.route('images');
  this.route('contribute', function() {
    this.route('how-to-submit');
    this.route('template');
  });
  this.route('admin', function() {
    this.route('login');
    this.route('account-recovery');
    this.route('content-management');
    this.route('account-information');
  });
});

export default Router;
