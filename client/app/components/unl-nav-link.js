import Component from '@ember/component';

// This is like super unnecessarily nested, but it's just because since we are
// doing dynamic routing, we need to close the nav menu on link click.
// Cleaniest  thing is to make a component that is just a link to with
// an extra click() function.
export default Component.extend({
  tagName: '',
  route: '',
  text: '',

  actions: {
    closeNavMenu() {
      // Close the nav menu by sending the 'closeNavigation' event.
      document.dispatchEvent(new Event('closeNavigation'));
      // Remove the aria expanded attribute from the nav-menu buttton.
      document.getElementById('dcf-menu-toggle').removeAttribute('aria-expanded');
    }
  }
});
