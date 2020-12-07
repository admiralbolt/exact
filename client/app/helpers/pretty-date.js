import { helper } from '@ember/component/helper';

export default helper(function prettyDate(params/*, hash*/) {
  const [ str ] = params;
  const date = new Date(str);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});
