export function closeNavMenu() {
  // Close the nav menu by sending the 'closeNavigation' event.
  document.dispatchEvent(new Event('closeNavigation'));
  // Remove the aria expanded attribute from the nav-menu buttton.
  document.getElementById('dcf-menu-toggle').removeAttribute('aria-expanded');
}
