/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 更多优惠
 */
Component({
  properties: {
    list: {
      type: Array,
      value: [],
    },
    detail: {
      type: Object,
      value: {},
    }
  },

  data: {
    animData: {},
    list: [{}],
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
    },
    ready: function () {
      let that = this;
      that.createAnim();
    },

    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
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
    //
    onEventBack: function (status, data = {}) {
      this.triggerEvent("click", {
        status,
        data,
      });
    },
    // 关闭
    onClose: function () {
      this.onEventBack(false);
    },
    // 点击查看图片
    onLookImg: function () {},
    // 去凑单
    onAddItem: function (e) {
      let item = e.currentTarget.dataset.item;
      this.onEventBack(true, item);
    },
  },
});
