import Backbone from 'backbone';
import SidebarItemView from 'apps/sidebar/sidebar<%= delimiter %>item<%= delimiter %>view';
import helpers from 'helpers/handlebars<%= delimiter %>helpers';

describe('SidebarItemView', function() {
  helpers.initialize();

  beforeEach(() => {
      this.model = new Backbone.Model({
        name: 'Sample',
        count: 20
      });
      this.view = new SidebarItemView({model: this.model});
      this.view.render();
    });

    it('render() should return the view object', () => {
      expect(this.view.render()).<%=assert.toequal%>(this.view);
    });
    it('name should equal Sample', () => {
      expect(this.view.render().$('.text-capitalize').text()).<%=assert.toequal%>('Sample');
    });
    it('count should equal 20', () => {
      expect(this.view.render().$('.badge.pull-right').text()).<%=assert.toequal%>('20');
    });
});
