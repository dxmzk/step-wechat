/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 商品列表 流布局
 */
Component({
  properties: {
    items: {
      type: Array,
      value: [],
    },
  },

  data: {
    leftList: [],
    rightList: [],
  },
  observers: {
    items: function (value) {
      this._parseList(value);
    },
  },
  lifetimes: {
    attached: function () {
      let that = this;
      that._parseList(that.data.items);
    },
  },
  methods: {
    _parseList: function (arr) {
      let that = this;
      let leftHeight = 0;
      let rightHeight = 0;
      let leftList = [];
      let rightList = [];
      arr.forEach((e) => {
        // 添加元素/计算高度
        if (leftHeight > rightHeight) {
          rightList.push(e);
          rightHeight += 200;
          if (e.tags && e.tags.length > 0) {
            e.tag = that._parseTag(e.tags);
            leftHeight -= 18; // 计算高度
          }
        } else {
          leftList.push(e);
          leftHeight += 200;
          if (e.tags && e.tags.length > 0) {
            e.tag = that._parseTag(e.tags);
            rightHeight -= 18; // 计算高度
          }
        }
      });

      // console.log(leftHeight, rightHeight)
      that.setData({
        leftList,
        rightList,
      });
    },
    _parseTag: function (tags) {
      let tag = tags[0];
      if (tag.indexOf(";") > -1) {
        tag = tag.split(";")[0];
      }
      return tag;
    },
    onItemClick: function (e) {
      this.triggerEvent("click", e.detail);
    },
  },
});
