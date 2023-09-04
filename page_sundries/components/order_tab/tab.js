/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 优惠券 TabLayout
 */
Component({
  properties: {
    index: {
      type: Number,
      value: 0,
    },
    tabItems: {
      type: Array,
      value: [], // '咦，没有内容哦！'
    },
  },

  data: {
    tabIdx: 0,
    tabs: [
      { name: "全部", num: 0 },
        { name: "待付款", num: 0 },
        { name: "待发货", num: 0 },
        { name: "待收货", num: 0 },
        { name: "待评价", num: 0 },
    ],
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
