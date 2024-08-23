/**
 * Author: Meng
 * Date: 2022-03
 * Desc: 接口
 */

import { request } from '../net/index';

// 登录
export function _login(data = {}) {
  return request({
    url: '',
    method: 'POST',
    // host: 'auth',
    data,
  });
}

/**
 * 根据经纬度获取最近的门店
 * @param longitude
 * @param latitude
 */
export function queryNearestShop(latitude, longitude) {
  return request({
    url: '/shop/getNearestShop',
    method: 'GET',
    data: {
      longitude,
      latitude,
    },
  });
}

// 首页banner 品牌等
export function queryMallIndex(shopCode, cityCode) {
  return request({
    url: '/xl-contentApi/mall/index.do',
    method: 'GET',
    host: 'ptDomain',
    data: {
      shopCode: shopCode,
      cityCode: cityCode,
      channelType: 2,
    },
  });
}

// 首页金刚位
export function queryHomeCategories() {
  return request({
    url: '/xl-contentApi/mall/queryIndexCategories.do',
    method: 'GET',
    host: 'ptDomain',
    data: {},
  });
}

// 商城首页瀑布流tab分类
export function queryGoodsTabs() {
  return request({
    url: '/xl-contentApi/mall/commodity/getClassification.do',
    method: 'GET',
    host: 'ptDomain',
    data: {},
  });
}

/**
 * 商城首页瀑布流
 * @param {*} shopCode
 * @param {*} cityCode
 */
export function queryCommoditys(shopCode, categoryId, pageNum, pageSize = 20) {
  return request({
    url: '/xl-contentApi/mall/commodity/list.do',
    method: 'POST',
    host: 'ptDomain',
    data: {
      shopCode: shopCode,
      catogeryId: categoryId,
      pageNum: pageNum,
      pageSize: pageSize,
    },
  });
}

/**
* 获取优惠券列表
status: 1可用 2失效
* @param curPage 当前第几页
* @param pageSize 分页大小
*/
export function queryCouponsList(status, pageNum, pageSize) {
  return request({
    url: '/xl-userApi/coupon/getCouponList.do',
    method: 'POST',
    host: 'ptDomain', // zt
    data: {
      status,
      pageNum,
      pageSize,
    },
  });
}

/**
 * 获取优惠券详情信息
 * @param couponId 优惠券id
 */
export function queryCouponDetail(couponId) {
  return request({
    url: '/bnq_owner/mine/getCouponDetail.do',
    method: 'GET',
    host: 'zt',
    data: {
      couponId,
    },
  });
}
