import Component from '@ember/component';
import { closeNavMenu } from 'client/utils/utils';
import $ from 'jquery';

export default Component.extend({
  tagName: '',

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
