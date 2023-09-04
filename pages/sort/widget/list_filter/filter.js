/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 商品列表筛选
 * sort 0综合（默认）1 销量 2 价格倒叙
 * priceStatus 1默认 4降序 3升序
 */
const PriceIcon = ['ic','up','down'];

Component({
  properties: {
    filterState: {
      type: Number,
      value: 0
    }
  },
  observers: {
    filterState: function (value) {
      this.setData({
        filter: value
      });
    }
  },
  data: {
    filter: 0, // 0未选择1选中
    tabList: [
      // {name: '综合', def: '综合', enable: 0},
      {name: '综合', enable: 0},
      {name: '销量', enable: 0},
      {name: '价格', enable: 0, icon: true, src: 'ic'},
      {name: '筛选', enable: 0, icon: true, src: 'sort'},
    ],
  },
  methods: {
    onItemClick: function (e) {
      const that = this;
      let tabList = [].concat(that.data.tabList);
      let idx = parseInt(e.currentTarget.dataset.idx);
      let tab = tabList[idx];
      let enable = tab.enable == 0 ? 1 : 0;
      if(tab.icon) {
        if(idx == 2) {
          enable = tab.src == 'ic' ? 1 : (tab.src == 'up' ? 2 : 0);
          tab.src = PriceIcon[enable];
        }
      }
      tabList[idx].enable = enable;
      tabList[3].enable = (idx == 3 ? 1:0); // 筛选 不做 状态
      that.setData({
        tabList
      });
      let list = tabList.map(e => e.enable);
      that.triggerEvent('change', {
        list
      });
    }
  },
});
