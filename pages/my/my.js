/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 我的
 */

import {
  queryOwnerInfo,
  queryMemberInfo,
  createShareCode,
  queryCouponExpired,
  changeAccountInfo,
} from "../../modules/api/account";
import { queryOrderStatus } from "../../modules/api/order";
import { queryUserShowFlag } from "../../modules/api/staff";
import { getWebPath } from "../../modules/net/config";
import {
  checkLogin,
  getAccountInfo,
  setAccountInfo,
} from "../../modules/store/index";
import { hidePhone } from "../../utils/index";

Page({
  data: {
    isLogin: false,
    topBgUrl:
      "http://bajanju-p.oss-cn-shanghai.aliyuncs.com/20220328-173026.png",
    bannerUrl:
      "https://decorationhome.oss-cn-hangzhou.aliyuncs.com/img/shopImg/newcoupcenter.png",

    user: {
      headIcon: "",
      nickName: "立即登录",
      phone: "",
    },
    topData: {
      cardCount: 0, // 足迹
      couponCount: 0, // 优惠券
      point: 0, // 积分
      level: "普通会员",
    },
    shareImage: "",
    isShowShare: false,
    isCouponExpired: false, //
    orderInfo: {
      waitBuyerConfirmGoodsCount: 0, // 待收货
      waitSellerSendGoodsCount: 0, // 待发货
      waitBuyerPayCount: 0, // 待付款
    },
    menulist: [
      {
        name: "收货地址",
        key: "",
        icon: "/assets/icon/address_b.png",
        path: "/page_minor/pages/address/address",
      },
      {
        name: "停车缴费",
        key: "",
        icon: "/assets/icon/my_tcjf.png",
        path: "/pages/web_page/web?path=",
      },
      {
        name: "客服帮助",
        key: "",
        icon: "/assets/icon/my_service.png",
        path: "",
      },
      {
        name: "每日福利群",
        key: "",
        icon: "/assets/icon/my_weal.png",
        path: "",
      },
      {
        name: "投诉建议",
        key: "",
        icon: "/assets/icon/my_tsjy.png",
        path: "",
      },
      {
        name: "设置",
        key: "",
        icon: "/assets/icon/my_setting.png",
        path: "/pages/my/setting/setting",
      },
    ],
  },

  onLoad: function (options) {},

  onReady: function () {
    const that = this;
    const login = checkLogin(1);
    if(login) {
      that.getOwnerInfo();
    }
  },

  onShow: function () {
    let that = this;
    let info = getAccountInfo();
    if (info && info.userId) {
      if (!that.data.isLogin) {
        const phoneStr = hidePhone(info.phone);
        const user = {
          headIcon: info.headPicUrl,
          nickName: info.nickName,
          phone: info.phone,
          phoneStr
        }
        that.setData({ user, isLogin: true });
      }
    } else if (that.data.isLogin) {
      that._clearAccount();
    }
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  // 清除账号信息
  _clearAccount: function () {},

  // 修改头像
  getUserProfile: function (e) {
    const that = this;
    let login = checkLogin(0);
    if (login) {
      wx.getUserProfile({
        desc: "用于完善会员资料",
        success: (res) => {
          // console.log(res);
          const info = res.userInfo;
          const user = that.data.user;
          if (user.headPicUrl == info.avatarUrl) {
            return;
          }
          const newName =
            info.nickName.length > 1 ? info.nickName : user.nickName;
          let params = {
            newName,
            type: 5,
            headUrl: info.avatarUrl,
          };
          that.onChangeAccountInfo(params);
        },
      });
    }
  },
  // 登录/查看个人信息
  onUserInfo: function () {
    // let that = this;
    let login = checkLogin(0);
    if (login) {
      // 查看个人信息
    }
  },
  gotoVipCard: function () {
    let login = checkLogin(0);
    if (login) {
      wx.navigateTo({
        url: "/pages/my/vip_code/code",
      });
    }
  },
  // 积分/优惠券/足迹
  onTabClick: function (e) {
    // let that = this;
    let idx = parseInt(e.currentTarget.dataset.idx);
    let login = checkLogin(0);
    if (login) {
      let paths = [
        "/page_sundries/pages/account/score/score",
        "/page_minor/pages/coupon/coupon",
        "/page_sundries/pages/account/foot_print/foot_print",
      ];
      let url = paths[idx];
      wx.navigateTo({
        url,
      });
    }
  },
  // 订单 tab 事件
  onOrderClick: function (e) {
    // let that = this;
    let idx = e.currentTarget.dataset.idx;
    let login = checkLogin(0);
    if (login) {
      wx.navigateTo({
        url: "/page_sundries/pages/order/order?tab=" + idx,
      });
    }
  },
  // 领券中心
  gotoCouponPage: function () {
    let login = checkLogin(0);
    if (login) {
      wx.navigateTo({
        url: "/pages/home/activity/activity?key=coupon",
      });
    }
  },
  // 菜单事件
  onMenuClick: function (e) {
    const that = this;
    let menulist = that.data.menulist;
    let idx = parseInt(e.currentTarget.dataset.idx);
    let menu = menulist[idx];
    let login = checkLogin(0);

    if (idx == 1) {
      let param = `${getWebPath("marketWebDomain")}/park?from=app&mobile=${
        that.data.user.phone
      }`;
      menu.path += encodeURIComponent(param);
    }
    if (login) {
      switch (idx) {
        case 0:
        case 1:
        case 5:
          wx.navigateTo({
            url: menu.path,
          });
          break;
        case 2:
          break;
      }
    }
  },
  // 显示登录提示弹窗
  showLogin: function () {
    let isLogin = checkLogin(1);
    if (!isLogin) {
      wx.showModal({
        title: "请先登录",
        content: "您还未登录请先登录",
        success: (e) => {
          if (e.confirm) {
            wx.navigateTo({
              url: "/pages/my/login/login",
            });
          }
        },
      });
    }
  },

  // 获取用户信息
  getOwnerInfo: async function () {
    const that = this;
    const user = { ...that.data.user };
    const { code, data } = await queryOwnerInfo();
    if (code == 0) {
      let info = getAccountInfo();
      info.headPicUrl = data.headPicURL;
      info.nickName = data.name;
      user.headIcon = data.headPicURL;
      user.nickName = data.name;
      setAccountInfo(info);
    }

    const scene = "&scene=" + encodeURIComponent("p=" + user.phone);
    const shareUrl = createShareCode(340, scene).url;
    let shareImage = getWebPath("yingxiao") + shareUrl;

    that.setData({ shareImage, user });

    that.getOrderStatus();
    that.getCouponExpired();
    that.getMemberInfo();
    that.getValidateRole();
  },
  // 获取订单状态
  getOrderStatus: async function () {
    const that = this;
    const { code, data } = await queryOrderStatus(that.data.user.phone);
    if (code == 0 && data.data) {
      that.setData({ orderInfo: data.data });
    }
  },
  // 是否显示我的分享码
  getValidateRole: async function () {
    const that = this;
    const { code, data } = await queryUserShowFlag(1, 1);
    if (code == 0 && data.data) {
      const item = data.data[0];
      if (item) {
        that.setData({
          isShowShare: item.showFlag == 1,
        });
      }
    }
  },
  // 获取会员卡信息
  getMemberInfo: async function () {
    const that = this;
    const { code, data } = await queryMemberInfo();
    if (code == 0) {
      that.setData({
        topData: data,
      });
    }
  },
  // 获取是否有已过期优惠券
  getCouponExpired: async function () {
    const that = this;
    const { code, data } = await queryCouponExpired(that.data.user.phone);
    if (code == 0) {
      that.setData({
        isCouponExpired: data.data,
      });
    }
  },
  // 修改账号信息
  onChangeAccountInfo: async function (params) {
    const that = this;
    const { code, data } = await changeAccountInfo(params);
    if (code == 0) {
      wx.showToast({
        icon: "success",
        title: "修改信息成功",
      });
      that.getOwnerInfo();
    }
  },
});
