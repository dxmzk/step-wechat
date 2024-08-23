/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 优惠券
 */
import { queryCouponsList } from "../../../modules/api/index";

Page({

  data: {
    curPage: 1,
    tabIndex: 0,
    coupons: [],
  },
  
  onLoad: function (options) {

  },

  onShow: function () {
    this.onPullDownRefresh();
  },

  onPullDownRefresh: function () {
    const that = this;
    that.data.curPage = 1;
    that.data.hasMore = true;
    that.getCouponsList();
    wx.stopPullDownRefresh();
  },

  onReachBottom: function () {
    const that = this;
    if(that.data.hasMore && !that.data.isLoading) {
      that.getCouponsList();
    }
  },
  // 切换tab
  onTabChange: function(e) {
    const that = this;
    const index = parseInt(e.detail.idx);
    const tabIndex = index == 3 ? 4 : index;
    that.data.hasMore = true;
    that.setData({
      hasMore: true,
      tabIndex
    }, that.onPullDownRefresh);
  },
  // 领券中心
  gotoCouponCenter: function() {
    wx.navigateTo({
      url: '/pages/home/activity/activity?key=coupon',
    });
  },
  // 去使用
  onUse: function() {
    wx.navigateTo({
      url: '/page_minor/pages/coupon/goods/goods',
    });
  },
  // 二维码
  onQrcode: function() {
    
  },
  // 获取优惠券列表
  getCouponsList: async function() {
    const that = this;
    const {curPage, tabIndex} = that.data;
    that.data.isLoading = true;
    const {code, data} = await queryCouponsList(tabIndex, curPage, 20);
    if(code == 0) {
      const hasMore = data.pageInfo.hasNextPage;
      const list = data.pageInfo.list||[];
      let coupons = [].concat(that.data.coupons);
      if(curPage > 1) {
        coupons.push(...list);
      }else {
        coupons = list
      }
      that.setData({
        hasMore,
        coupons,
        curPage: curPage+1,
        isLoading: false,
        count: {
          usedCoupon: data.usedCoupon||0,
          expireCoupon: data.expireCoupon||0,
          notUsedCoupon: data.notUsedCoupon||0,
        }
      });
    }
  },
})