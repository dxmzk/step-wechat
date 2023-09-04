/**
 * Create By: Meng
 * Date: 2022-04
 * 优惠明细
 */
Component({
  properties: {
    couponInfo: {
      type: Object,
      value: {},
    },
  },

  data: {
    animData: {},
    items: [
      { label: "商品总价", value: 0 },
      { label: "减满", tag: 1, value: 0 },
      { label: "返券", tag: 1, value: 0 },
      { label: "合计", value: 0 },
    ],
  },
  lifetimes: {
    attached: function () {
      let that = this;
      that.createAnim();
      that._setInfo(that.data.couponInfo);
    },
  },
  observers: {
    // "cartCouponInfo": function (item) {},
  },
  methods: {
    //
    createAnim: function (num) {
      let that = this;
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: "ease",
      });
      animation.translate(0, 0).step({ duration: 600 });
      that.setData({
        animData: animation.export(),
      });
    },
    _setInfo: function(item) {
      const that = this;
      const items = [...that.data.items];
      items[0].value = item.totalAmount;
      items[1].value = item.promotionAmount;
      items[2].value = item.couponAmount;
      items[3].value = item.costMoney;
      that.setData({items});
    },
    // 
    onEvent: function (status, data) {
      this.triggerEvent("click", {
        status,
        data,
      });
    },
    //
    onClose: function () {
      this.onEvent(false);
    },
  },
});
