/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 优惠券 TabLayout
 */
Component({
  properties: {
    list: {
      type: Array,
      value: [],
    },
    use: {
      type: Number,
      value: 0 // 0默认不选择;1从下单进入校验可用不可用
    }
  },

  data: {
    tabIdx: 0,
  },
  methods: {
    onClickItem: function(e) {
      const that = this;
      const item = e.currentTarget.dataset.item;
      that.triggerEvent('click', item);
    },
    onEditAddress: function(e) {
      const that = this;
      const item = e.currentTarget.dataset.item;
      that.triggerEvent('edit', item);
    },
    _formatData: function(item) {
      // return {};
    }
  }
});
