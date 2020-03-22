import Component from '@ember/component';
import { closeNavMenu } from 'client/utils/utils';

export default Component.extend({
  tagName: '',

  actions: {
    closeNavMenu() {
      closeNavMenu();
    }
  }
});
