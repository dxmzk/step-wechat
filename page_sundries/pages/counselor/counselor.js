/**
 * Create By: Meng
 * Date: 2022-01
 * 在线顾问
 */
Page({

    data: {
        imgUrl: 'https://bajanju-p.oss-cn-shanghai.aliyuncs.com/consultant.png',
        skpUrl: 'https://w.1yb.co/LEAmq4E',
        urlKey: 'sap-pic-url-key'
    },

    onLoad: function (options) {
        let that = this;
        let item = JSON.parse(options.params||'{}');
        // console.log(item)
        that.setData({
            imgUrl: item.img,
            skpUrl: item.url
        })
    },

    onReady: function () {
    },

    // 点击添加顾问微信号
    onAddWechat: function() {
        const param = {
            url: this.data.skpUrl
        }
        wx.navigateTo({
          url: '/pages/h5page/h5page?url=' + JSON.stringify(param),
        })
    }
})