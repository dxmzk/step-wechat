/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 反馈
 */
Page({

  data: {
    title: '',
    content: '',
  },
  onLoad: function (options) {

  },
  onTitle: function (e) {
    this.data.title = e.detail.value
  },
  onCommit: function () {
    let {title, content} = this.data;
    if(title.length < 1) {
      wx.showToast({
        title: '请输入反馈标题',
        icon: 'none'
      })
    }else if(content.length < 1) {
      wx.showToast({
        title: '请输入反馈内容',
        icon: 'none'
      })
    }else {

    }
  },
  onContent: function (e) {
    this.data.content = e.detail.value
  }
})