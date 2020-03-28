import { helper } from '@ember/component/helper';

export default helper(function isActive(params/*, hash*/) {
  const [ val1, val2 ] = params;
  return val1 == val2 ? 'is-active' : '';
});
