import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQueryRecord(query) {
    let originalUrl = this._buildURL('user');
    if (query.me) {
      delete query.me;
      return `${originalUrl}/me/`;
    }

    return originalUrl;
  }
});
