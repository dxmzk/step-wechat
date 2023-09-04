/**
 * Author: Meng
 * Date: 2022-07-13
 * Desc: 图片选择组件
 *
 */
Component({
  properties: {
    imgs: {
      type: Array,
      value: [],
    },
    upload: {
      type: Boolean,
      value: true,
    },
    custom: {
      type: Boolean,
      value: false, // 是否自定义 添加图片逻辑，通过bindopen 函数处理
    },
    maxCount: {
      type: Number,
      value: 9,
    },
    mode: {
      type: Number,
      value: 3, // 3相册相机2相册1相机
    },
  },

  data: {
    count: 0,
  },

  lifetimes: {
    attached: function () {
      let that = this;
      if (that.data.upload) {
        that._filter();
      }
    },
  },

  methods: {
    // 点击预览大图
    onTap: function (e) {
      let that = this;
      // 是否上传的时候禁止点击查看大图
      if (that.data.upload) {
        // return;
      }
      let index = e.currentTarget.dataset.index;
      let imgs = that.data.imgs;
      // console.log(imgs);
      imgs = imgs.filter((re) => re != null);
      wx.previewImage({
        current: imgs[index], // 当前显示图片的http链接
        urls: imgs, // 需要预览的图片http链接列表
      });
    },
    // 上传图片
    onUpdate: function () {
      let that = this;
      if (that.data.count >= that.data.maxCount) {
        return;
      }
      let count = that.data.maxCount - that.data.count;
      if (that.data.custom) {
        let imgs = that.data.imgs.filter((e) => e != null);
        that.triggerEvent('open', {
          count,
          value: imgs,
        });
      } else {
        const mode = that.data.mode;
        let sourceType = [];
        if (mode == 1) {
          sourceType.push('camera');
        } else if (mode == 2) {
          sourceType.push('album');
        } else {
          sourceType = ['album', 'camera'];
        }
        wx.chooseMedia({
          count,
          sourceType,
          camera: 'back',
          mediaType: ['image'],
          sizeType: ['compressed'], // 'original'
          // sourceType: ["album", "camera"],
          success: (res) => {
            // console.log(res);
            const list = res.tempFiles.map((e) => e.tempFilePath);
            that.data.imgs.push(...list);
            that._filter();
            that.onChange();
          },
        });
      }
    },
    // 删除图片
    onDel: function (e) {
      let that = this;
      let tag = e.currentTarget.dataset.index;
      that.data.imgs = that.data.imgs.filter((_, index) => index != tag);
      that._filter();
      that.onChange();
    },
    // 改变图片
    onChange: function () {
      let that = this;
      // let imgs = that.data.imgs;
      let imgs = that.data.imgs.filter((e) => e != null);
      let count = imgs.length;
      that.triggerEvent('change', {
        count,
        value: imgs,
      });
    },
    // 更新列表
    _filter: function () {
      let that = this;
      let imgs = that.data.imgs.filter((e) => e != null);
      let count = imgs.length;
      if (count < that.data.maxCount) {
        imgs.push(null);
      }
      that.setData({
        count,
        imgs,
      });
    },
  },
});
