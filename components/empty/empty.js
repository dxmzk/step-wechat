/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 空视图
 */
Component({
  properties: {
    icon: {
      type: String,
      value: "/assets/img/empty.png", // ...路径/图片.png
    },
    msg: {
      type: String,
      value: "", // '咦，没有内容哦！'
    },
  },

  data: {},
  methods: {
    onLoading: function() {
      this.triggerEvent('load')
    }
  },
});
