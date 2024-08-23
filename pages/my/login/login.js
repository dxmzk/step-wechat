/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 登录
 */

import {
  queryAuthCode,
  sendVerifyCode,
  loginAccount,
  wxAuthLogin,
  queryWxUnionId,
} from "../../../modules/api/account";
import { setAccountInfo, clearAccount } from "../../../modules/store/index";
import Base64 from "../../../utils/encrypt/base64";
import Timer from "../../../utils/date/timer";
import { checkPhone } from "../../../utils/index";
import Bus, { BusKey } from "../../../modules/event/index";

Page({
  data: {
    wxLogin: true, // 是否微信授权登录
    hasAuth: false, // 是否显示验证图片
    canLogin: false, // 是否可点击登录
    timer: {}, // 定时器
    codeTimer: false,
    codeAlertStr: "获取验证码",
    unionId: "",
    question: "", // 图片验证码提示文字
    authImg: "", // 认证图片
    code: "", // 验证码识别号
    authCode: "", // 输入的验证码
    phone: "", // 手机号
    authImgWidth: 300,
    authImgHeight: 150,
    imgWidth: 220,
    imgHeight: 150,
    authPoint: [], // 图片验证码点
    authLeft: 0,
    authTop: 0,
    
  },
  onLoad: function (options) {
    let that = this;
    clearAccount(); // 清除账号信息
    if (options && options.param) {
      
    }
    // if (wx.getUserProfile) {}
  },
  onUnload: function() {

  },
  // 输入手机号
  onInputPhone: function (e) {
    const that = this;
    const phone = e.detail.value;
    that.data.phone = phone;
    if(phone.length > 10) {
      that.getAuthImg();
    }
  },
  // 输入验证码
  onInputCode: function (e) {
    const that = this;
    const code = e.detail.value;
    that.data.authCode = code;

    const { phone, authCode, canLogin } = that.data;
    if (phone.length == 11 && authCode.length == 6) {
      that.setData({
        canLogin: true,
      });
    } else if (canLogin) {
      that.setData({
        canLogin: false,
      });
    }
  },
  // 获取点击图形验证码位置
  onGetAuthLocation: function () {
    return new Promise((resolve) => {
      let that = this;
      if (that.data.authLeft < 1) {
        const query = wx.createSelectorQuery();
        query
          .select("#auth_image")
          .boundingClientRect()
          .exec((res) => {
            that.data.authLeft = res[0].left;
            that.data.authTop = res[0].top;
            resolve(res[0]);
          });
      } else {
        resolve({
          left: that.data.authLeft,
          top: that.data.authTop,
        });
      }
    });
  },
  // 获取手机号
  getWXPhoneNumber: function (e) {
    const that = this;
    const detail = e.detail || {};
    // console.log(detail)
    if (!detail.iv || !detail.encryptedData) {
      that.setData({
        wxLogin: false,
      });
    } else {
      wx.login({
        success: (res) => {
          if (res.code) {
            that.onWxLogin(detail, res.code);
          } else {
            that.setData({
              wxLogin: false,
            });
            wx.showToast({ title: "获取用户信息失败", icon: "none" });
          }
        },
        fail: () => {
          that.setData({
            wxLogin: false,
          });
          wx.showToast({ title: "获取用户信息失败", icon: "none" });
        },
      });
    }
  },
  // 会员协议
  gotoGuide: function () {
    let path = encodeURIComponent("https://zt.web.bnq.com.cn/protocols.html");
    wx.navigateTo({
      url: "/pages/web_page/web?path=" + path,
    });
  },

  // 获取验证图片
  getAuthImg: async function () {
    const that = this;
    const phone = that.data.phone;

    const { code, data } = await queryAuthCode({ phone });
    if (code == 0) {
      const res = data || {};
      that.setData({
        question: res.question,
        authImg: res.image,
        authImgWidth: res.width,
        authImgHeight: res.height,
        radio: res.width / res.height,
        authPoint: [],
      });
    }
  },
  // 获取验证码
  getAuthCode: async function () {
    const that = this;
    const { radio, phone, authPoint, codeTimer, imgWidth } = that.data;
    if (codeTimer) {
      return;
    }
    const isPhone = checkPhone(phone);
    if (!isPhone) {
      wx.showToast({
        title: "请输入正确的手机号！",
        icon: "none",
      });
      return;
    }

    // 解析点坐标
    const arr = authPoint.map((e) => [e.x, e.y]);
    const encodeData = encodeURI(Base64.base64encode(JSON.stringify(arr)));

    const { code, data } = await sendVerifyCode({
      phone,
      picCode: arr.length > 0 ? encodeData : "",
      clientType: 5,
      width: imgWidth,
      height: imgWidth / radio,
    });

    if (code == 0) {
      that.data.timer = new Timer(60, (num) => {
        const isIng = num > 0;
        that.setData({
          codeTimer: isIng,
          codeAlertStr: isIng ? num + " s" : "获取验证码",
        });
      }).start();
    } else {
      // 验证不通过重新刷新图片
      that.getAuthImg();
    }
  },
  // 验证码点击 46/258  252/366
  onTouchStart: async function (e) {
    const that = this;
    const authPoint = that.data.authPoint;
    if (authPoint.length > 9) {
      return;
    }
    const point = e.changedTouches[0];
    let left = that.data.authLeft;
    let top = that.data.authTop;
    let imgWidth = that.data.imgWidth;
    let imgHeight = that.data.imgHeight;
    if (left < 1) {
      const res = await that.onGetAuthLocation();
      left = res.left;
      top = res.top;
      imgWidth = res.width;
      imgHeight = res.height;
    }
    const list = [];
    list.push({
      x: point.clientX - left - 6,
      y: point.clientY - top - 6,
    });
    // list.concat(this.state.authPoint)
    that.setData({
      imgWidth,
      imgHeight,
      authPoint: list.concat(authPoint),
    });
    // console.log(left, top, point)
  },
  // 手机号登录
  onLogin: async function () {
    const that = this;
    const { phone, authCode } = that.data;
    wx.login({
      success: async (res) => {
        if (res.code) {
          const unionId = "";
          const inviterOpenId = "";
          const inviterUserId = "";
          const inviterUserPhone = "";

          const isNew = inviterOpenId || inviterUserPhone;
          const params = {
            clientType: 5,
            jsCode: res.code,
            verifyCode: authCode,
            phone,
            unionId,
          };
          if (isNew) {
            params.inviterOpenId = inviterOpenId;
            params.inviterUserId = inviterUserId;
            params.inviterUserPhone = inviterUserPhone;
            params.promotionChannel = 1;
          }
          const { code, data } = await loginAccount(params);
          if (code == 0) {
            that.onSaveAccount(data);
          }
        }
      },
      fail: () => {},
    });
  },
  // 微信登录
  onWxLogin: async function (detail, jsCode) {
    const that = this;
    const unionId = "";
    const inviterOpenId = "";
    const inviterUserId = "";
    const inviterUserPhone = "";

    const isNew = inviterOpenId || inviterUserPhone;
    const params = {
      unionId,
      jsCode,
      clientType: 5,
      iv: detail.iv,
      encryptedData: detail.encryptedData,
    };
    if (isNew) {
      params.inviterOpenId = inviterOpenId;
      params.inviterUserId = inviterUserId;
      params.inviterUserPhone = inviterUserPhone;
      params.promotionChannel = 1;
    }
    const { code, data } = await wxAuthLogin(params);

    if (code == 0) {
      that.onSaveAccount(data);
    } else {
      that.setData({
        wxLogin: false,
      });
      wx.showToast({ title: "微信授权登录异常，请手动登录！", icon: "none" });
    }
  },
  // 缓存账号信息
  onSaveAccount: async function (data) {
    const user = data.user || {};
    const info = {
      unionId: this.data.unionId || "",
      openId: user.openId || "",
      role: user.role || "user",
      phone: user.phone || "",
      userId: user.userId || "",
      jgUserId: user.jgUserId || "",
      customerId: user.customerId || "",
      nickName: user.userName || "",
      headPicUrl: user.headPicUrl || "",
      userType: user.userType || "",
      token: data.token,
    };

    setAccountInfo(info);
    // 获取openId
    queryWxUnionId();

    Bus.send(BusKey.login, info);
    wx.navigateBack();

    wx.showToast({ title: "登录成功！" });
  },
});
