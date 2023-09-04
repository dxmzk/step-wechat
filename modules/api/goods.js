/**
 * Create By: Meng
 * Create Date: 2022-03
 * Desc: 请求接口 - 商品相关
 */

import { request } from '../net/index';

// 参数 sk 转换为具体业务数据 serialNum
export function querySKMapperContent(data) {
  return request({
    url: '/bnq_owner/api/third/auth/getQrcode.do',
    method: 'GET',
    host: 'zt',
    data: data,
  });
}

/**
 * 推广活动引擎
 * @param shopCode
 * @param skuInfos
 * @param mobile
 * @param ecardNo
 * @returns {{param: {shopCode: *, ecardNo: string, mobile: string, skuInfos: *}, type: string, url: string}}
 */

export function doPromotionActivityEngine(data) {
  return request({
    url: '/promotionEngine/doPromotionActivityEngine',
    method: 'POST',
    host: 'promotion',
    data: data,
    toast: false,
    loading: false,
  });
}

/***
 * 获取分类信息
 * @returns {{url: string, type: string, param: {}}}
 */
export function queryCategory() {
  return request({
    url: '/category/sale/fs',
    method: 'GET',
    host: 'def',
    data: {},
  });
}
/***
 * 获取商品列表
 * @param queryCategoryId 选择的前台类目
 * @param shopId 店铺ID
 * @param shopCode 店铺Code 数组
 * @param keyword  搜索关键字
 * @param isDiscount 是否满减 1是，0否
 * @param activity 活动id
 * @param brandIds 品牌id
 * @param brandCode 品牌code
 * @param sort 排序
 */
export function searchGoodsList(data = {}) {
  return request({
    url: '/items/searchList',
    method: 'GET',
    host: 'def',
    // loading: false,
    data,
  });
}

/**
 * 获取优惠券对应商品
 * shopCode=1004&activityNo=2022147858&curPage=1&pageSize=10
 */
export function queryCouponGoods(data) {
  return request({
    url: '/promotion/queryCouponSkuList',
    method: 'GET',
    host: 'def',
    // loading: false,
    data,
  });
}

/***
 * 获取商品列表
 * @param id itemId
 */
export function getTrackProductList(data) {
  return request({
    url: '/items/trackProductList',
    method: 'GET',
    host: 'def',
    data: data,
  });
}

/***
 * 获取商品详情
 * @param itemId 商品ID
 */
export function queryGoodsDetail(data) {
  return request({
    url: '/item/new/detail',
    method: 'GET',
    host: 'def',
    data: data,
    toast: false,
  });
}

/***
 * 获取商品详情
 * @param itemSkuId 商品itemSkuId
 * itemSkuId
 */
export function queryByItemSkuId(data) {
  return request({
    url: '/item/new/detail/queryByItemSkuId',
    method: 'GET',
    host: 'def',
    data: data,
    toast: false,
  });
}

export function queryBySapskuAndShopcode(data) {
  return request({
    url: '/item/new/detail/queryBySapSkuNoAndShopCode',
    method: 'GET',
    host: 'def',
    data: data,
    toast: false,
  });
}

/***
 * 获取查询门店
 * spuCode
 * cityCode 城市code
 */
export function queryByDistance(data = {}) {
  return request({
    url: '/item/detail/queryByDistance',
    method: 'GET',
    host: 'def',
    data,
  });
}

// 门店-商品上下架状态查询 cityCode=310100&sapSkuCode=4251916
// cityCode: '', sapSkuCode: ''
export function queryShopStatus(data = {}) {
  return request({
    url: '/item/querySkuState',
    method: 'GET',
    host: 'def',
    data,
  });
}
/**
 * 首页热词
 */
export function queryHotList(data) {
  return request({
    url: '/salesAdmin/homepage/hotlist',
    method: 'GET',
    host: 'def',
    data: data,
  });
}

/**
 * 获取城市&&门店列表 6.3.5
 * 赋能商城
 */
export function queryAllShop(data = {}) {
  return request({
    url: '/xl-contentApi/mall/commodity/getShopList.do',
    method: 'POST',
    host: 'ptDomain',
    data,
  });
}

/**
 * 品牌详情 人气推荐/新品推荐
 */
export function queryBrandSkuList(shopCode, brandCode) {
  return request({
    url: '/items/brandSkuList',
    method: 'GET',
    host: 'def',
    loading: false,
    data: {
      shopCode: shopCode,
      brandCode: brandCode,
    },
  });
}

/**
 * 首页热词
 */
export function queryDefaultHotWord(data) {
  return request({
    url: '/salesAdmin/homepage/defaultsech',
    method: 'GET',
    host: 'def',
    data: data,
  });
}
/**
 * 品牌活动相关
 */
export function queryBrandDetail(shopCode, brandCode) {
  return request({
    url: '/xl-contentApi/mall/brand/getBrandDetail',
    method: 'GET',
    host: 'ptDomain',
    data: {
      shopCode: shopCode,
      brandCode: brandCode,
    },
    toast: false,
    loading: false,
  });
}

/**
 * 扫码购物
 */
export function queryProductByScanning(barcode, shopCode) {
  return request({
    url: '/item/getItemIdByBarcode',
    method: 'GET',
    host: 'def',
    data: {
      barcode,
      shopCode,
    },
  });
}
