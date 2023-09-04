/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 首页搜索
 */
Component({
  properties: {
    keyword: {
      type: String,
      value: "",
    },
    cartNum: {
      type: Number,
      value: 0
    }
  },

  data: {
    inputStr: "",
    statusBarHeight: 20,
  },
  lifetimes: {
    attached: function () {
      let _this = this;
      let consts = getApp().consts;
      let statusBarHeight = consts.statusBarHeight;
      if (!consts.isLoad) {
        wx.getSystemInfo({
          success: function success(res) {
            statusBarHeight = res.statusBarHeight;
          },
        });
      }
      _this.setData({
        statusBarHeight,
      });
    },
  },
  // observers: {
  //   keyword: function (key) {
  //     this.setData({
  //       inputStr: key,
  //     });
  //   },
  // },
  methods: {
    _backEvent: function (tab='search') {
      this.triggerEvent("search", {tab});
    },
    onSearch: function () {
      this._backEvent("search");
    },
    onScan: function () {
      this._backEvent("scan");
    },
    onCutCart: function () {
      this._backEvent("cart");
    },
    onVipCode: function () {
      this._backEvent("vipcode");
    },
  },
});
