import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { closeNavMenu } from 'client/utils/utils';
import $ from 'jquery';

export default Component.extend({
  tagName: '',
  session: service(),

  actions: {
    closeNavMenu() {
      closeNavMenu();
    }
  },

  didRender() {
    $('#dcf-nav-menu-child a').unbind('click').click(function() {
      document.dispatchEvent(new Event('closeNavigation'));
      document.getElementById('dcf-menu-toggle').removeAttribute('aria-expanded');
    });
  }
});
