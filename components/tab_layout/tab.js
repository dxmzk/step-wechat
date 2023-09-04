/**
 * Author: Meng
 * Date: 2022-07-13
 * Desc: TabLayout
 */
Component({
  properties: {
    index: {
      type: Number,
      value: 0,
    },
    items: {
      type: Array,
      value: [],
    },
    fixed: {
      type: Boolean,
      value: true,
    }
  },
  data: {
    tabIdx: 0,
    tabs: [],
  },
  lifetimes: {
    attached: function() {
      const tabs = this.data.items;
      this.setData({
        tabs
      })
    }
  },
  methods: {
    onClick: function(e) {
      const idx = parseInt(e.currentTarget.dataset.idx);
      const that = this;
      that.setData({
        tabIdx: idx
      });
      that.triggerEvent('change', {idx});
    }
  },
});
