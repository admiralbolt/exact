import Route from '@ember/routing/route';

export default Route.extend({
  queryParams : {
    coord: {
      replace: true
    },
    category: {
      replace: true
    }
  }
});
