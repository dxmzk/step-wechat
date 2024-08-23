/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 订单
 */

import { openShopApp } from "../../../utils/order";

const Tab_State = ["", "1", "2", "4", "6"]; // 全部'';待付款1;待发货2;待收货4;已收货5;已完成6

Page({
  data: {
    tabIndex: 0,
    orderList: [],
  },

  onLoad: function (options) {
    const that = this;
    let _data = {};
    if (options.tab) {
      _data.tabIndex = parseInt(options.tab);
    }
    that.setData(_data);
  },

  onReady: function () {},

  onShow: function () {},

  onHide: function () {},

  onUnload: function () {},

  onPullDownRefresh: function () {},

  onReachBottom: function () {},

  onOpenShop: function (e) {
    const shop = e
    openShopApp(shop);
  },

  // 获取订单
  _getOrderList: function() {

  },
  // 
  _getOrderList: function() {
    
  },
  // 获取推荐商品 
  _getGoodsList: function() {
    
  }
});
