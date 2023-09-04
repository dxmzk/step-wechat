/**
 * Author: Meng
 * Date: 2022-03
 * Desc: 账号相关
 */

import { request } from '../net/index';
import { setWxUnionId } from '../store/index';
import Wechat from '../system/index';

// 获取微信 UnionId
export function queryWxUnionId() {
  return new Promise(async (resolve) => {
    const res = await Wechat.getUserInfo();
    if (!res) {
      resolve(null);
    }
    wx.login({
      success: async (info) => {
        const jsCode = info.code;
        const iv = res.iv;
        const encryptedData = res.encryptedData;
        const { code, data } = await decodeUnionId({
          iv,
          jsCode,
          encryptedData,
          clientType: '5',
        });
        if (code == 0) {
          setWxUnionId(data);
          resolve(data);
        } else {
          resolve(null);
        }
      },
      fail: (err) => {
        console.log('=========> wx.login 失败：', err);
        resolve(null);
      },
    });
  });
}

//获取微信加密信息
export function decodeUnionId(
  params = {
    iv: '',
    jsCode: '',
    encryptedData: '',
    clientType: '5',
  }
) {
  return request({
    url: '/bnq_owner/api/third/auth/decode.do',
    method: 'GET',
    data: params,
    host: 'zt',
    loading: false,
  });
}

/**
 * 获取验证图片
 */
export function queryAuthCode(params = { phone: '', clientType: '' }) {
  return request({
    url: '/bnq_owner/apis/common/validateCode.do?',
    method: 'GET',
    data: params,
    host: 'zt',
  });
}

/**
 * 发送登录验证码
 */
export function sendVerifyCode(
  params = { phone: '', picCode: '', clientType: '', width: '', height: '' }
) {
  return request({
    url: '/bnq_owner/apis/common/verifyCode/sendV3.do',
    method: 'POST',
    data: params,
    host: 'zt',
  });
}

/**
 * 微信直接登录 - ok
 * clientType 客户端类型 微信商城 -5
 * jsCode 微信登录后的code
 * inviterOpenId=邀请人inviterOpenId
 * inviterUserId=邀请人userId
 * inviterUserPhone=邀请人手机号
 * promotionChannel=推广渠道1-微信商城
 * addRecordFlag=是否需要添加记录
 */
export function loginAccount(
  params = {
    clientType: 5,
    jsCode,
    phone,
    verifyCode,
    inviterOpenId,
    inviterUserId,
    inviterUserPhone,
    promotionChannel: 1,
    addRecordFlag,
    unionId,
  }
) {
  return request({
    url: '/bnq_owner/api/third/auth/miniProgramRegister.do',
    method: 'GET',
    data: params,
    host: 'zt',
  });
}

/**
 * 微信获取手机号直接登录 - ok
 * clientType 客户端类型 微信商城 -5
 * jsCode 微信登录后的code
 * inviterOpenId=邀请人inviterOpenId
 * inviterUserId=邀请人userId
 * inviterUserPhone=邀请人手机号
 * promotionChannel=推广渠道1-微信商城
 * addRecordFlag=是否需要添加记录
 * iv=微信返回的签名
 * encryptedData=微信的加密数据
 */
export function wxAuthLogin(
  params = {
    clientType: 5,
    jsCode,
    inviterOpenId,
    inviterUserId,
    inviterUserPhone,
    promotionChannel: 1,
    addRecordFlag,
    iv,
    encryptedData,
    unionId,
  }
) {
  return request({
    url: '/bnq_owner/api/third/auth/miniProgramLoginNoCode.do',
    method: 'GET',
    data: params,
    host: 'zt',
  });
}

// 获取用户信息
export function queryOwnerInfo() {
  return request({
    url: '/bnq_owner/mine/fetchOwnerInfo.do',
    method: 'POST',
    host: 'zt',
  });
}

/***
 * 生成分享小程序码
 * @param width 	宽度
 * @param scene 参数
 */
export function createShareCode(width, query) {
  return {
    url:
      '/marketing-service/share/createWxQrCode.do?wxQrCodeWidth=' +
      encodeURIComponent(width) +
      query,
  };
}

/**
 * 获取会员信息
 *
 */
export function queryMemberInfo() {
  return request({
    url: '/bnq_owner/mine/getMemberInfo.do',
    method: 'GET',
    host: 'zt',
  });
}

/**
 * 修改账号信息
 * @param headUrl 头像
 * @param newName 昵称
 * @param gender
 * @param birthDate
 * @param type
 */
export function changeAccountInfo(data) {
  return request({
    url: '/bnq_owner/userManager/Modify.do',
    method: 'POST',
    host: 'zt',
    data: data,
  });
}

/**
     消息列表
    */
export function getMessageList(params) {
  return request({
    url: '/bnq_owner/msg/list.do',
    method: 'GET',
    data: params,
    host: 'zt',
  });
}

/**
 * 获取会员卡以及装修卡列表
 * @param curPage 当前第几页
 * @param pageSize 分页大小
 */
export function queryCardAndList(curPage, pageSize) {
  return request({
    url: '/bnq_owner/mine/myCardList.do',
    method: 'GET',
    data: {
      curPage,
      pageSize,
    },
    host: 'zt',
  });
}

/**
   获取优惠券是否有已过期 
   * @param mobile 手机号
  */
export function queryCouponExpired(mobile) {
  return request({
    url: '/customer/mine/checkCouponExpired.do',
    method: 'GET',
    data: {
      mobile,
    },
    host: 'def',
  });
}

/***
 * 新增分享纪录
 * @param jsCode 	微信openId
 * @param promotionChannel 推广渠道 1-微信商城
 * @param shareContent 分享内容,若是商品分享为sku
 * @param sharePageName 分享页面名
 * @param sharePageUrl 分享页面url
 * @param shareType 分享类型 1-分享商品; 2-分享活动
 * @param shareWay 	分享方式 1-发送给朋友; 2-生成海报
 *
 */
export function addShareRecord(
  jsCode,
  promotionChannel,
  shareContent,
  sharePageName,
  sharePageUrl,
  shareType,
  shareWay
) {
  return request({
    url: '/marketing-service/record/share/addRecord.do',
    method: 'POST',
    data: {
      jsCode: jsCode,
      promotionChannel: promotionChannel,
      shareContent: shareContent,
      sharePageName: sharePageName,
      sharePageUrl: sharePageUrl,
      shareType: shareType,
      shareWay: shareWay,
    },
    host: 'zt',
  });
}

/**
 * 获取会员信息
 *
 */
export function checkMacinAcitvity(params) {
  return request({
    url: '/wx-web/public/genera/checkMainActivity',
    method: 'GET',
    host: 'mfsWebDomain',
    data: params,
  });
}

export function checkSendCondition(params) {
  return request({
    url: '/wx-web/public/activity2022newcustomer/checkSendCondition',
    method: 'GET',
    host: 'mfsWebDomain',
    data: params,
  });
}

export function sendCouponAndPoins(params) {
  return request({
    url: '/wx-web/public/activity2022newcustomer/sendCouponAndPoins',
    method: 'GET',
    host: 'mfsWebDomain',
    data: params,
  });
}

// 登录
export function onLogin(data = {}) {
  return request({
    url: '/account/login',
    method: 'POST',
    // host: 'auth',
    data,
  });
}

// 获取首页数据
export function onRegister(data = {}) {
  return request({
    url: '/account/register',
    method: 'GET',
    data,
  });
}

// 获取首页数据
export function queryUserinfo(data = {}) {
  return request({
    url: '/account/info',
    method: 'GET',
    data,
  });
}

// 获取首页数据
export function accountReset(data = {}) {
  return request({
    url: '/account/reset',
    method: 'GET',
    data,
  });
}

// 获取首页数据
export function onLogout(data = {}) {
  return request({
    url: '/account/login',
    method: 'GET',
    data,
  });
}

// 获取首页数据
export function onDeleteAccount(data = {}) {
  return request({
    url: '/account/delete',
    method: 'GET',
    data,
  });
}

/**
 * 会员卡忘记密码
 * @param mobile 手机号
 * @param code    验证码
 * @param eCardNo 会员卡号
 */
export function modifyPasswordByCode(mobile, code, eCardNo) {
  return request({
    url: '/xl-userApi/ecard/validateMsg.do',
    method: 'GET',
    data: {
      mobile: mobile,
      code: code,
      eCardNo: eCardNo,
    },
    host: 'ptDomain',
  });
}
/**
 * 查询会员卡密码修改状态
 * @param eCardNo 会员卡号
 */
export function getMemberPasswordStatus(eCardNo) {
  return request({
    url: '/xl-userApi/ecard/checkPassword.do',
    method: 'GET',
    data: {
      eCardNo,
    },
    host: 'ptDomain',
  });
}
/**
 * 发送修改密码的验证码
 */
export function sendMsgForMemberCard() {
  return request({
    url: '/xl-userApi/ecard/sendMsg.do',
    method: 'GET',
    host: 'ptDomain',
  });
}

/**
 * 初次设置会员卡密码
 * @param eCardNo 会员卡号
 * @param password 初始密码密文
 */
export function saveMemberPassword(eCardNo, password) {
  return request({
    url: '/xl-userApi/ecard/savePassword.do',
    method: 'POST',
    data: {
      eCardNo,
      password,
    },
    host: 'ptDomain',
  });
}

/**
 * 校验原始密码
 * @param eCardNo 会员卡号
 * @param orginPsw 原始密码密文
 */
export function validateMemberPassword(eCardNo, password) {
  return request({
    url: '/xl-userApi/ecard/validatePassword.do',
    method: 'GET',
    data: {
      eCardNo,
      password,
    },
    host: 'ptDomain',
  });
}

/**
 * 修改密码
 * eCardNo 会员卡号
 * newPsw 新密码密文
 * token 校验密码接口或者校验短信验证码返回的token
 */
export function modifyMemberPassword(eCardNo, password, token) {
  return request({
    url: '/xl-userApi/ecard/updatePassword.do',
    method: 'POST',
    data: {
      eCardNo,
      password,
      token,
    },
    host: 'ptDomain',
  });
}
