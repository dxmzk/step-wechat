/**
 * Author: Meng
 * Date: 2022-04
 * 门店在售状态弹窗
 */

Component({
  properties: {
    consultantPic: {
      type: String,
      value: "",
    },
    consultantUrl: {
      type: String,
      value: "",
    },
    sapSkuCode: {
      type: Number,
      value: 0,
    },
    item: {
      // 商品数据
      type: Object,
      value: {},
    },
  },

  data: {
    animData: {},
    address: { cityName: "无" },
    list: [],
    cityCode: 0,
    loading: false,
    latlng: { latitude: null, longitude: null },
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
    },
    ready: function () {
      let that = this;
      that.getInfo();
      that.createAnim();
      that.getLocation();
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
      this.triggerEvent("onClose");
    },
    getInfo: function () {
      let that = this;
    },
    // 点击查看图片
    onLookImg: function () {},
    // 切换地址
    onChangeCity: function () {},
    // 联系客服
    onContactShop: function (e) {},
    // 添加门店顾问
    onAddShopWechat: function (e) {
      let that = this;
    },
    // 获取
    getShopStatus: async function () {
      let that = this;
    },
    getLocation: async function () {},
  },
});
