/**
 * Author: Meng
 * Date: 2022-04
 * Desc: web h5页面
 * 
 * 活动相关页面放到 home/activity 中
 */
Page({

  data: {
    path: '',
    params: '',
    itemInfo: {},
    mode: 0,
  },
  
  onLoad: function (options) {
    let _data = {};
    if(options.path) {
      _data.path = decodeURIComponent(options.path);
    }
    if(options.item) {
      let item = decodeURIComponent(options.item);
      _data.path = item.path;
      _data.itemInfo = item;
    }
    this.setData(_data);
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