import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | contribute/template', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:contribute/template');
    assert.ok(route);
  });
});
