/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 搜索试图
 */
Component({
  properties: {
    keyword: {
      type: String,
      value: ''
    }
  },

  data: {
    inputStr: ''
  },
  observers: {
    'keyword': function(key) {
      this.setData({
        inputStr: key
      })
    }
  },
  methods: {
    onSearch: function() {
      this.triggerEvent('search')
    },
    onScan: function() {
      this.triggerEvent('scan')
    },
  }
})
