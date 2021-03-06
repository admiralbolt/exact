import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('not-found', { path: '/*path' });
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
    this.route('equation', {
      path: '/equation/:id'
    });
    this.route('equation-types', function() {});
    this.route('geometries');
  });
  this.route('contribute', function() {
    this.route('template');
  });
  this.route('admin', function() {
    this.route('account');
    this.route('account-recovery');
    this.route('password-reset');
    this.route('file-sharing');
  });
});

export default Router;
