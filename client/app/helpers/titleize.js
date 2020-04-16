import { helper } from '@ember/component/helper';

export default helper(function titleize(params/*, hash*/) {
  const [ str ] = params;
  let words = str.split(' ');
  let capitals = words.map(word => `${word[0].toUpperCase()}${word.slice(1)}`);
  return capitals.join(' ');
});
