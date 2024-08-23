/**
 * Create By: Meng
 * Date: 2022-04
 * 购物车 商品数量编辑
 */
Component({
  properties: {
    count: {
      type: Number,
      value: 1,
    },
  },
  data: {
    value: 1,
    input: "1",
  },
  lifetimes: {
    attached: function () {
      const that = this;
      that.setData({
        value: that.data.count
      });
    },
  },
  methods: {
    onClose: function() {
      this.triggerEvent('count', {state: false});
    },
    onComfirm: function() {
      const that = this;
      const count = that.data.value;
      that.triggerEvent('count', {state: true, count});
    },
    // 输入商品数量
    onInputCount: function (e) {
      const input = e.detail.value || "0";
      const value = parseInt(input);
      const _data = {input};
      if (value > 0) {
        _data.value = value;
      }
      this.setData(_data);
    },

    onInputBlur: function () {
      const that = this;
      const input = parseInt(that.data.input);
      if (input < 1) {
        that.setData({
          value: 1,
          input: "1",
        });
      }
    },
  },
});
