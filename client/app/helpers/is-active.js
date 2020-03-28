import { helper } from '@ember/component/helper';

export default helper(function isActive(params/*, hash*/) {
  const [ val1, val2 ] = params;
  return val1.toLowerCase() == val2.toLowerCase() ? 'is-active' : '';
});
