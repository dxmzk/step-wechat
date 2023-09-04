/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 首页头布局
 */

Component({
  options: {
  //   multipleSlots: true,
    addGlobalClass: true,
  },
  properties: {
    title: {
      type: String,
      value: "首页",
    },
    shopNameStr: {
      type: String,
      value: "",
    },
  },
  data: {
    shopName: "",
    displayStyle: "",
    ios: true,
    statusBarHeight: 46,
  },
  observers: {
    shopNameStr: function (value) {
      console.log(value);
      this.setData({
        shopName: value,
      });
    },
  },
  lifetimes: {
    attached: function () {
      let _this = this;
      let consts = getApp().consts;
      let statusBarHeight = consts.statusBarHeight;
      let ios = false;
      if (!consts.isLoad) {
        wx.getSystemInfo({
          success: function success(res) {
            ios = !!(res.system.toLowerCase().search("ios") + 1);
            statusBarHeight = res.statusBarHeight;
          },
        });
      }
      _this.setData({
        ios,
        statusBarHeight,
        shopName: _this.data.shopNameStr,
      });
    },
  },

  methods: {
    _showChange: function _showChange(show) {
      let displayStyle =
        "opacity: " +
        (show ? "1" : "0") +
        ";-webkit-transition:opacity 0.5s;transition:opacity 0.5s;";
      this.setData({
        displayStyle: displayStyle,
      });
    },
    onChangeShop: function () {
      this.triggerEvent("shop", {});
    },
  },
});
