/**
 * Author: Meng
 * Date: 2022-07-13
 * Desc: 拍照
 * https://developers.weixin.qq.com/miniprogram/dev/framework/ability/canvas-legacy-migration.html
 */
import Dates from '../../../utils/date/index';
const app = getApp();

Page({
  data: {
    isTask: false,
    width: app.consts.windowWidth,
    height: app.consts.height - 150,
    curDate: '',
    auto: true,
    back: true,
    imgPath: '',
    camersObj: null,
    canvas: null,
  },

  onLoad(options) {},

  onReady() {
    const that = this;
    that.data.camersObj = wx.createCameraContext();
    const dates = Dates.getDateStr2().split(' ');

    that.setData({
      curDate: `${dates[1]} | ${dates[0]}`,
    });
  },

  onUnload() {},

  initCanvas: function (imgPath) {
    const that = this;
    wx.createSelectorQuery()
      .select('#canvas_id')
      .fields({
        node: true,
        size: true,
      })
      .exec((res) => {
        const width = that.data.width;
        const height = that.data.height;

        const canvas = res[0].node;
        that.data.canvas = canvas;
        const ctx = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;

        const img = canvas.createImage();
        img.src = imgPath;
        img.onload = () => {
          that.darwMark(ctx, img, width, height);

          that._writeFile();
        };
      });
  },

  darwMark: function (ctx, img, width, height) {
    const that = this;
    // this._img = img;
    ctx.drawImage(img, 0, 0, width, height);
    ctx.restore();

    const w = 300;
    const h = 130;
    const m = 20;
    let x = m;
    let y = height - h - m;

    ctx.fillStyle = 'rgba(247, 245, 242, 0.6)';
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = 'rgba(20, 20, 20, 1)';
    ctx.font = '500 28px PingFangSC-Regular';
    const text = that.data.curDate;
    // const measure = ctx.measureText(text);
    // console.log(measure)
    y += 46;
    ctx.fillText(text, x + 16, y);
    ctx.font = '400 16px PingFangSC-Regular';
    y += 34;
    ctx.fillText('地址：上海市浦东新区上塘路2000号', x + 16, y);
    ctx.fillText('操作人：张三', x + 16, y + 28);
    // ctx.draw();
  },

  _writeFile: function (data) {
    const that = this;
    const timer = setTimeout(() => {
      clearTimeout(timer);
      wx.canvasToTempFilePath({
        canvas: that.data.canvas,
        success: (res) => {
          console.log(res.tempFilePath);
          // wx.saveImageToPhotosAlbum({
          //   filePath: res.tempImagePath,
          // });
          const imgs = [];
          imgs.push({
            url: res.tempFilePath,
            type: 0,
          });
          wx.navigateTo({
            url: '/pack_sub/pages/preview/preview?imgs=' + JSON.stringify(imgs),
          });
        },
        fail: (err) => {
          console.log(err);
        },
      });
    }, 600);
  },

  onConver: function () {
    const that = this;
    that.setData({
      back: !that.data.back,
    });
  },
  onOpenLight: function () {
    const that = this;
    if (!that.data.auto) {
      that.setData({});
    }
    that.setData({
      auto: !that.data.auto,
    });
  },
  onTakePhone: function () {
    const that = this;
    that.data.camersObj.takePhoto({
      quality: 'normal',
      success: (res) => {
        that.setData({
          isTask: true,
        });
        that.initCanvas(res.tempImagePath);
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
});
