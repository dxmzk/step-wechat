/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 会员卡
 */

import { queryMemberInfo, queryCardAndList } from "../../../modules/api/account";
import QRCode from '../../../utils/app/qrcode';
// import { getAccountInfo } from "../../../modules/store/index";
let qrcode_obj=null;
Page({
  data: {
    cardInfo: {cardNo: '', phone: '',balance: 0},
    phone: "",
    couponNum: 0,
    scoreNum: 0,
  },

  onLoad: function (options) {
  },

  onReady: function() {
    const that = this;
    that.getCardAndList();
    that.getMemberInfo();
  },

  onPullDownRefresh: function () {
    const that = this;
    that.getCardAndList();
    that.getMemberInfo();
  },
  onUnload: function() {
    if(qrcode_obj) {
      qrcode_obj.clear();
      qrcode_obj == null;
    }
  },
  onCopyCardNo: function() {
    wx.setClipboardData({
      data: this.data.cardInfo.cardNo,
    })
  },
  // 生成二维码
  createQrcode: function() {
    // const that = this;
    const text = this.data.cardInfo.cardNo;
    qrcode_obj = new QRCode('vip-qrcode', {
      text,
      width: 180,
      height: 180
    });
  },
  // 领券中心
  gotoCouponPage: function () {
    wx.navigateTo({
      url: "/pages/home/activity/activity?key=coupon",
    });
  },

  // 获取优惠券及积分
  getMemberInfo: async function () {
    const that = this;
    const { code, data } = await queryMemberInfo();
    if (code == 0 && data) {
      that.setData({
        couponNum: data.couponCount||0,
        scoreNum: data.point||0,
      });
    }
  },
  // 获取会员卡信息
  getCardAndList: async function () {
    const that = this;
    const { code, data } = await queryCardAndList(1, 20);
    if (code == 0) {
      that.setData({
        cardInfo: data.memberCard
      }, that.createQrcode);
    }
  },
});
