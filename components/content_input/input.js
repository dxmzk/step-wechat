/**
 * Author: Meng
 * Date: 2022-07-13
 * Desc: 多行输入文本
 */
Component({
  properties: {
    max_count: {
      type: Number,
      value: 200, 
    },
    value: {
      type: String,
      value: "",
    },
    placeholder: {
      type: String,
      value: "请输入",
    },
  },

  data: {
    count: 0,
  },
  methods: {
    onInput: function(e){
      const value = e.detail.value;
      const count = value.length;
      const that = this;
      that.triggerEvent('change', {value, count});
      that.setData({
        count
      });
    }
  },
});
