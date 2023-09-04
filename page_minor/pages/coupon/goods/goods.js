/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 优惠券商品
 */

Page({
  data: {
    title: "百安居商城",
    goodsList: [],
  },

  onLoad: function (options) {
    const that = this;

    if (options) {
      that._parseOption(options);
    }
  },

  _parseOption: function (options) {
    const that = this;
    if (options.search) {
      that.setData({ keyword: options.search });
    }
  },

  onShow: function () {},

  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },

  onReachBottom: function () {},

  onShareAppMessage: function () {},
  
  gotoSearch: function () {
    wx.redirectTo({
      url: "/pages/home/search/search",
    });
  },

  // 获取优惠券对应的商品
  getGoodsList: function() {

  }
});
