/**
 * Author: Meng
 * Date: 2022-03
 * Desc: 存储数据 -
 */

const LOGIN_COUNT = "account_login_count"; // 账号打开次数
const ACCOUNT = "account_data_info"; // 账号
const UNION_ID = "wechat_union_id"; //
const TOKEN = "account_token"; //

const CITY_ADS = "choose_city_address"; // 收货地址选择城市
const CITY_SHOP = "cur_city_shop"; // 店铺所在城市
const HISTORY = "search_history_info"; // 搜索商品历史
const HISTORY_CITY = "search_city_history_info"; // 搜索城市历史

const NEWCOMER = "app_account_newcomer"; // 新人

const SHOP = "cur_shop_info"; // 店铺
const ADDRESS = "cur_address_info"; // 地址

let LAST_TIME = 0;

/**  获取登录信息
  unionId, openId, token,
  phone, userId, jgUserId, customerId,
  nickName, headPicUrl, userType, role,
 */
export function getAccountInfo() {
  return wx.getStorageSync(ACCOUNT);
}
// 设置登录信息
export function setAccountInfo(data) {
  wx.setStorageSync(TOKEN, data.token);
  wx.setStorageSync(ACCOUNT, data);
  setNewcomerId(data.userId);
}

// 获取保存登录人id
export function getNewcomerId() {
  let userId = wx.getStorageSync(NEWCOMER);
  return userId;
}

// 保存登录人id
export function setNewcomerId(userId) {
  wx.setStorage({ key: NEWCOMER, data: userId });
}

// 设置登录次数
export function getLoginCount() {
  let count = wx.getStorageSync(LOGIN_COUNT) || 0;
  return count;
}

// 设置登录次数
export function setLoginCount() {
  let count = getLoginCount();
  wx.setStorage({ key: LOGIN_COUNT, data: count + 1 });
}

// 是否登录
export function isLogined() {
  let info = getAccountInfo();
  return info != null && info.userId != null;
}

// 检测是否登录-并登录 0登录；1不登录
export function checkLogin(login = 0, params = {}) {
  const isLogin = isLogined();
  // const pages = getCurrentPages();
  if (!isLogin && login == 0 && Date.now() - LAST_TIME > 2000) {
    LAST_TIME = Date.now();
    wx.navigateTo({
      url: "/pages/my/login/login?param=" + params,
    });
  }
  return isLogin;
}

// 获取Token
export function getTokenStr() {
  return wx.getStorageSync(TOKEN);
}

// 获取商品搜索历史
export function getHistoryList() {
  return wx.getStorageSync(HISTORY);
}
// 设置商品搜索历史
export function setHistoryList(data = {}) {
  wx.setStorage({
    key: HISTORY,
    data,
  });
}

// 获取城市搜索历史
export function getCitySearchHistory() {
  return wx.getStorageSync(HISTORY_CITY);
}
// 设置城市搜索历史
export function setCitySearchHistory(data = {}) {
  wx.setStorage({
    key: HISTORY_CITY,
    data,
  });
}

// 设置地址信息
export function setShopCity(data = "") {
  const _info = getCityAndShop();
  _info.cityCode = data.cityCode;
  _info.cityName = data.cityName;
  _info.address = data.address;
  _info.id = data.id || 0;
  setCityAndShop(_info);
}

// 设置店铺信息
export function setShopInfo(data = {}) {
  const _info = getCityAndShop();
  _info.shopCode = data.shopCode;
  _info.shopName = data.shopName;
  setCityAndShop(_info);
}

// 设置地址和门店信息
export function setCityAndShop(data = {}) {
  wx.setStorageSync(CITY_SHOP, {
    shopCode: data.shopCode,
    shopName: data.shopName,
    cityCode: data.cityCode,
    cityName: data.cityName,
    address: data.address || data.cityName,
    id: data.id || 0,
  });
}
// 获取地址和门店信息
export function getCityAndShop() {
  return wx.getStorageSync(CITY_SHOP);
}

// 获取城市
export function getAddressCity() {
  return wx.getStorageSync(CITY_ADS);
}
// 设置城市
export function setAddressCity(data = {}) {
  wx.setStorage({
    key: CITY_ADS,
    data,
  });
}

// 获取微信 UnionId
export function getWxUnionId() {
  return wx.getStorageSync(UNION_ID);
}
// 存储微信 UnionId
export function setWxUnionId(data) {
  wx.setStorage({
    key: UNION_ID,
    data,
  });
}

export function clearAccount() {
  wx.removeStorageSync(LOGIN_COUNT);
  wx.removeStorageSync(ACCOUNT);
  wx.removeStorageSync(TOKEN);
  wx.removeStorageSync(NEWCOMER);
  // wx.removeStorage({ key: UNION_ID });
}
