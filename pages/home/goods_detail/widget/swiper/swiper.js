/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 商品轮播图
 */
Component({
  properties: {
    swiperInfo: {
      type: Object,
      value: {},
    },
  },

  data: {
    items: [],
    goodsVideo: null,
    curIndex: 0,
    tabIndex: 0,
    tabs: [],
    videoPlayStatus: 0, // 0：未播放  1： 播放   2：暂停播放
    isfullscreen: false,
  },
  observers: {
    "swiperInfo": function (item) {
      this.parseDate(item);
    },
  },
  lifetimes: {
    attached: function () {},
    ready: function () {
      let that = this;
      that.data.goodsVideo = wx.createVideoContext("v_swiper_video");
      that.parseDate(that.data.swiperInfo);
    },
    detached: function () {
      let video = this.data.goodsVideo;
      if (video) {
        video.stop();
      }
    },
  },
  methods: {
    parseDate: function (item) {
      let that = this;
      let items = [];
      let tabs = [];
      if (item.video) {
        items.push({ url: videoUrl, type: 0 });
        tabs.push({ type: 0, name: "视频" });
      }
      let list = item.imgs.map((e) => {
        return { url: e, type: 1 };
      });
      items.push(...list);
      tabs.push({ type: 1, name: "图片" });
      if (item.vr) {
        items.push({ url: item.vrImg, type: 2 });
        tabs.push({ type: 2, name: "3D" });
      }
      if(items.length < 1) {
        return
      }
      that.setData({
        tabIndex: tabs[0].type,
        items,
        tabs,
        curIndex: 1,
      });
    },
    onChangePage: function (e) {
      let that = this;
      let index = e.detail.current;
      let tabIndex = that.data.items[index].type;

      that.setData({
        curIndex: index + 1,
        tabIndex,
      });
    },

    onTap: function (e) {
      let that = this;

      let swiperIndex = 0;
      let tabIndex = e.currentTarget.dataset.type;

      for (var i = 0; i <= that.data.items.length; i++) {
        if (that.data.items[i].type == tabIndex) {
          swiperIndex = i;
          break;
        }
      }
      that.setData({
        curIndex: swiperIndex + 1,
        tabIndex,
      });
    },

    playVideo() {
      this.setData({ videoPlayStatus: 1 });
    },
    onFullScreenChange(e) {
      let fullScreen = e.detail.fullScreen; //值true为进入全屏，false为退出全屏
      if (!fullScreen) {
        //退出全屏
        let that = this;
        that.setData({ isfullscreen: false });
        that.videoContext = wx.createVideoContext("v_swiper_video", that);
        that.videoContext.exitFullScreen();
      } else {
        //进入全屏
      }
    },
    onEnded() {
      this.setData({ videoPlayStatus: 0 });
    },
    onImgLook: function (e) {
      let index = parseInt(e.currentTarget.dataset.index || "0");
      let imgs = [];
      this.data.items.map((item) => {
        if (item.type == 1) {
          imgs.push(item.url);
        }
      });
      wx.previewImage({
        urls: imgs,
        current: imgs[index],
      });
    },
    onVideoLook: function (e) {
      // 播放状态
      let that = this;
      if (that.data.videoPlayStatus == 1) {
        if (!that.data.isfullscreen) {
          // 未全屏状态
          that.setData({ isfullscreen: true, videoPlayStatus: 1 });
          that.videoContext = wx.createVideoContext("v_swiper_video", that);
          that.videoContext.requestFullScreen({ direction: 90 });
        } else {
          // 全屏状态
          that.setData({ videoPlayStatus: 2 });
          that.videoContext = wx.createVideoContext("v_swiper_video", that);
          that.videoContext.pause();
        }
      } else if (that.data.videoPlayStatus == 0) {
        // 未播放状态
        that.setData({ videoPlayStatus: 1 });
        that.videoContext = wx.createVideoContext("v_swiper_video", that);
        that.videoContext.play();
      } else if (that.data.videoPlayStatus == 2) {
        that.setData({ videoPlayStatus: 1 });
        that.videoContext = wx.createVideoContext("v_swiper_video", that);
        that.videoContext.play();
      }
    },
    on3DLook: function () {
      wx.navigateTo({
        url:
          "/pages/web_page/web_page?path=" + encodeURIComponent(this.data.item.vr),
      });
    },
  },
});
