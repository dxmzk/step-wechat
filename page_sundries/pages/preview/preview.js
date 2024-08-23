/**
 * Create By: Meng
 * Date: 2022-01-
 */
Page({
    data: {
        canUse: false,
        imgList: [
            {url: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400', type: 2},
            {url: 'https://cn.bing.com/th?id=OHR.LakeKochelsee_ZH-CN0004970986_1920x1080.jpg', type: 1},
            {url: 'https://cn.bing.com/th?id=OHR.PorcupineWillow_ZH-CN0280041973_1920x1080.jpg', type: 1},
        ],
        goodsVideo: null,
        curIndex: 1,
    },

    onLoad: function (options) {
    },

    onReady: function () {
        this.data.goodsVideo = wx.createVideoContext('goods_video');
    },

    onHide: function () {
        if(this.data.goodsVideo) {
            this.data.goodsVideo.stop();
        }
    },

    onUnload: function () {

    },

    // 切换
    onChangePage: function (e) {
        let that = this;
        let index = (e.detail.current||0) + 1;
        that.setData({
            curIndex: index
        })
        if(that.data.goodsVideo) {
            that.data.goodsVideo.stop();
        }
    },
    // 
    onImgLook: function(e) {
        let index = parseInt(e.currentTarget.dataset.index||'0');
        let imgs = this.data.imgList.filter(e => e.type ==1);
        wx.previewImage({
          urls: imgs,
          current: index,
        })
    }
})