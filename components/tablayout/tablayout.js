/**
 * Author: Meng
 * Date: 2022-04
 * Desc: tab 布局
 */
Component({
  properties: {
    tabs: {
      type: Array,
      value: [],
    },
    index: {
      type: Number,
      value: 0,
    },
  },

  data: {
    tabIndex: 0,
  },
  methods: {
    onChangeTab: function (e) {
      const that = this;
      const idx = parseInt(e.currentTarget.dataset.idx);
      that.setData({
        tabIdx: idx,
      });
      that.triggerEvent("change", { idx });
    },
  },
});
