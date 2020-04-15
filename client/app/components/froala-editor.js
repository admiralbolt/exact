import FroalaEditorComponent from 'ember-froala-editor/components/froala-editor';
import { inject as service } from '@ember/service';
import config from '../config/environment';


// Hey future me, you're looking for this: https://froala.com/wysiwyg-editor/docs/concepts/image/upload/
// Also this: http://www.emberwysiwygeditor.com/#/addon/concepts?section=custom

export default class FroalaEditorComponentTwo extends FroalaEditorComponent {

  @service session;

  options = {
    key: '',
    theme:' dark',
    imageUploadURL: `${config.host}/froala/upload/`,
    requestHeaders: {
      authorization: `Token ${this.session.data.authenticated.token}`,
      Accept: 'application/vnd.api+json'
    }
  };

}
