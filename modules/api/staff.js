/**
 * Create By: Meng
 * Create Date: 2022-03
 * Desc: 接口 - 员工相关
 */

import { request } from '../net/index';

/**
 * 获取商品关联促销员及品牌信息
 * @param phone 用户手机号
 * shopId
 * sapSkuCode
 */

export function queryBrandCode(data) {
  return request({
    url: '/bnq_owner/promoter/getBrandCode.do',
    method: 'GET',
    host: 'zt',
    data: data,
  });
}

/**
 * 个人名片相关
 */
// param: { shopId: shopId,sapSkuCode:sapSkuCode },

export function queryStaffCard(data) {
  return request({
    url: '/bnq_owner/user/getUserInfo.do',
    method: 'GET',
    host: 'zt',
    data: data,
  });
}

//头像 employeeNo
export function queryStaffAvatar(data) {
  return request({
    url: '/bnq_owner/market/getInfo.do',
    method: 'GET',
    host: 'zt',
    data: data,
  });
}

/**
 * 获取联系我的ID
 * employeeNo
 */
export function queryStaffConfigId(data) {
  return request({
    url: '/bnq_owner/market/getConfigId.do',
    method: 'GET',
    host: 'zt',
    data: data,
  });
}

/*
 * 根据shopCode获取shopInfo
 * @param shopCode
 */
export function queryByShopCode(data) {
  return request({
    url: '/shop/queryByShopCode',
    method: 'GET',
    host: 'def',
    data: data,
  });
}

/*
 * 获取下级部门和人员
   deptId,
     employeeId,
     shopType
 */
export function queryDeptChild(data) {
  return request({
    url: '/wp/organization/tree/getChild',
    method: 'GET',
    host: 'dssDomain',
    data: data,
  });
}
/*
 * 模糊查询人员信息
  corpUserName,deptId,employeeId,shopType
*/
export function vagueQuery(data) {
  return request({
    url: '/wp/organization/tree/vagueQuery',
    method: 'GET',
    host: 'dssDomain',
    data: data,
  });
}
/**
 * 获取个人联单列表
 */
export function ownerOrderList(corpUserId, storeId, pageNo, pageSize, Cookie) {
  return request({
    url: '/wp/joinOrder/list',
    method: 'POST',
    host: 'dssDomain',
    header: {
      Cookie: Cookie,
    },
    data: {
      corpUserId,
      storeId,
      pageNo,
      pageSize,
    },
  });
}
export function remarkPhone(
  joinOrderId,
  customerPhone,
  description = '',
  Cookie
) {
  return request({
    url: '/wp/joinOrderApply/addCustomerPhone',
    method: 'POST',
    host: 'dssDomain',
    header: {
      Cookie: Cookie,
    },
    data: {
      joinOrderId,
      customerPhone,
      description,
    },
  });
}

export function remarkOrderInfo(
  registerType,
  type,
  customerPhone,
  shopType,
  shopCode,
  outEmployeeId,
  storeId,
  applicantedName,
  applicantedPhone,
  Cookie
) {
  return request({
    url: '/wp/bringBack/register',
    method: 'POST',
    host: 'dssDomain',
    header: {
      Cookie: Cookie,
    },
    data: {
      registerType,
      type,
      customerPhone,
      shopType,
      shopCode,
      outEmployeeId,
      storeId,
      applicantedName,
      applicantedPhone,
    },
  });
}

/**
 * 获取是否显示某些按钮 (主要为了审核的时候控制是否显示分享按钮)
 * bizType  1:商城小程序
 * type     1:分享按钮
 */
export function queryUserShowFlag(bizType, type) {
  return request({
    url: '/marketing-service/common/queryButtonShowFlag.do',
    method: 'GET',
    host: 'yingxiao',
    data: {
      bizType: bizType,
      type: type,
    },
    loading: false,
  });
}

/****
 * 获取人人营销销售员身份校验
 */
export function queryValidateRole() {
  return request({
    url: '/marketing-service/performance/validateRole.do',
    type: 'GET',
    host: 'yingxiao',
  });
}
