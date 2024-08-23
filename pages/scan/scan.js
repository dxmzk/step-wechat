/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 扫一扫
 */
Page({

  data: {

  },
  
  onLoad: function (options) {
    wx.scanCode({
      onlyFromCamera: false,
      success: (res) => {
        wx.switchTab({
          url: '/pages/home/home',
        })
      },
      fail: () => {
        wx.switchTab({
          url: '/pages/home/home',
        })
      }
    })
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },
  
  onShareAppMessage: function () {

  }
})