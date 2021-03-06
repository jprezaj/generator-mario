import {LayoutView} from 'marionette';
import * as JST from 'templates';

export default LayoutView.extend({
  template: JST['<%= templatePath %>']<% if(!templateExists) { %>,
  regions: {
    region1: '#region1',
    region2: '#region2'
  }<% } %>
});
