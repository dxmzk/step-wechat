/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 测试页面 - 可用于开发预览效果
 */
Page({
  data: {},

  onLoad: function () {
    wx.navigateTo({
      url: "/page_minor/pages/address/amap/amap", // 开发页面的路径
    });
  },
  onReady: function () {},
  onShow: function () {},
  onPullDownRefresh: function () {},
  onShareAppMessage: function () {},
});
