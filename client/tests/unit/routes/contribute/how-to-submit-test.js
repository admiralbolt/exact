import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | contribute/how-to-submit', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:contribute/how-to-submit');
    assert.ok(route);
  });
});
