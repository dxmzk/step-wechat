/**
 * Author: Meng
 * Date: 2022-07-13
 * Desc: 按钮封装
 */
let _last_time = 0;

Component({
  externalClasses: ["cls"],
  options: {},
  properties: {
    text: {
      type: String,
      value: "",
    },
    tag: {
      type: String,
      value: "",
    },
  },
  data: {},
  methods: {
    _onLongtap: function () {
      if (Date.now() - _last_time > 1600) {
        this.triggerEvent("longclick", {});
      }
      _last_time = Date.now();
    },
    _onTap: function () {
      if (Date.now() - _last_time > 1200) {
        this.triggerEvent("click", {});
      }
      _last_time = Date.now();
    },
  },
});
