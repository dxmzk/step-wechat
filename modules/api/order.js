/**
 * Create By: Meng
 * Create Date: 2022-03
 * Desc: 接口 - 订单相关
 */

import { request } from '../net/index';

//获取订单列表
export function quertOrderList(phone, curPage, pageSize, state) {
  return request({
    url: '/channelOrder/orderList.do',
    method: 'GET',
    host: 'trade',
    toast: false,
    data: {
      customerMobile: phone,
      curPage: curPage,
      pageSize: pageSize,
      channelOrderStatus: state,
    },
  });
}

//收货码和安装码
export function installCode(orderCode) {
  return request({
    url: '/channelOrder/getReceiveCode',
    method: 'GET',
    host: 'trade',
    data: {
      orderCode,
    },
  });
}

//取消订单
export function cancelOrder(orderCode) {
  return request({
    url: '/channelOrder/cancelOrder',
    method: 'GET',
    host: 'trade',
    data: {
      orderCode,
    },
  });
}

//根据订单号查询所在交易单的发票信息
export function handleInvoiceByOrderNo(orderCode) {
  return request({
    url: '/invoice/queryInvoice',
    method: 'GET',
    host: 'invoice',
    data: {
      orderCode,
    },
  });
}

//确认收货
export function confirmReceipt(orderCode) {
  return request({
    url: '/channelOrder/confirmReceipt.do',
    method: 'GET',
    host: 'trade',
    data: {
      orderCode,
    },
  });
}

//统一下单
export function doPay(data) {
  return request({
    url: '/payment/doPay',
    method: 'POST',
    host: 'trade',
    data: {
      data,
    },
  });
}

//门店信息查询（新）
export function shopInfo(shopCode) {
  return request({
    url: '/channelOrder/shopInfo',
    method: 'GET',
    host: 'trade',
    data: {
      shopCode,
    },
  });
}

//获取订单详情
export function queryOrderDetail(orderCode) {
  return request({
    url: '/channelOrder/orderDetail.do',
    method: 'GET',
    host: 'trade',
    data: {
      orderCode,
    },
  });
}

//分配聊天人员
//goodsType 1 定制品，2 议价品，3 普通商品
export function queryPromoter(itemSkuId, goodsType) {
  return request({
    url: '/bnq_owner/homeMeal/getPromoter.do',
    method: 'GET',
    host: 'zt',
    data: {
      itemSkuId,
      goodsType,
    },
  });
}

//更新订单预约时间
export function updateOrderDate(param) {
  return request({
    url: '/channelOrder/updateOrder',
    method: 'POST',
    host: 'trade',
    data: param,
  });
}

//获取促销员推单订单详情
export function orderDetailForPromotion(orderCode) {
  return request({
    url: '/channelOrder/orderDetailForPromotion.do',
    method: 'GET',
    host: 'trade',
    data: {
      orderCode,
    },
  });
}

//查看资料的客户认可和客户不认可接口
export function customerApproval(materialId, status) {
  return request({
    url: '/worker/custom-made/customerApproval.do',
    method: 'GET',
    host: 'worker',
    data: {
      materialId,
      status,
    },
  });
}

//上传资料的记录
export function uploadRecord(channelOrderCode, curPage, pageSize) {
  return request({
    url: '/worker/custom-made/queryMaterialForSmallRoutine.do',
    method: 'GET',
    host: 'worker',
    data: {
      channelOrderCode,
      curPage,
      pageSize,
    },
  });
}

// 获取购物车列表
export function queryCartItemList(cityCode = 310100, cardNo = '') {
  return request({
    url: '/cart/queryCartItemList',
    method: 'GET',
    host: 'cart',
    // loading: false,
    data: {
      cityCode,
      cardNo,
    },
  });
}

// 查看进度
export function queryProgress(channelOrderCode) {
  return request({
    url: '/worker/custom-made/checkProgressForSmallRoutine.do',
    method: 'GET',
    host: 'worker',
    data: {
      channelOrderCode,
    },
  });
}

// 获取积分
export function queryByMobile(mobile) {
  return request({
    url: '/customer/point/queryByMobile.do',
    method: 'GET',
    host: 'customer',
    data: {
      mobile,
    },
  });
}

//储值卡付款方式接口
export function queryDecorationCards(mobile, shopCode) {
  return request({
    url: '/payment/decoration/cards',
    method: 'POST',
    host: 'trade',
    data: {
      data: {
        mobile,
        shopCode,
      },
    },
  });
}

//线下提交订单
export function commitOrder(
  baseInfo,
  orderItemList,
  cartItemIds,
  couponCodeList,
  energySubsidy,
  customerCardCode
) {
  return request({
    url: '/order/submit',
    method: 'POST',
    host: 'trade',
    data: {
      ...baseInfo,
      couponCodeList: couponCodeList,
      cartItemIds: cartItemIds,
      orderItemList: orderItemList,
      ...energySubsidy,
      customerCardCode,
    },
  });
}

//根据商品信息获取最佳优惠券组合
export function findBestCouponByOrder(
  mobile,
  shopCode,
  productInfoDtos,
  ecardNo
) {
  return request({
    url: '/ticketCoupon/findBestCouponInfoByOrderProduct.do',
    method: 'POST',
    host: 'promotion',
    toast: false,
    data: {
      mobile,
      shopCode,
      productInfoDtos,
      ecardNo,
    },
  });
}

//根据商品信息获取优惠券
export function findCouponByOrder(
  mobile,
  shopCode,
  productInfoDtos,
  receiverAddressId,
  ecardNo
) {
  return request({
    url: '/ticketCoupon/findCouponInfoByOrderProduct.do',
    method: 'POST',
    host: 'promotion',
    data: {
      mobile,
      shopCode,
      productInfoDtos,
      receiverAddressId,
      ecardNo,
    },
  });
}

/*
 * 预买单-推送促销员预购单到购物车
 */
export function pushCustomCart(phone, preOrderId, shopCode) {
  return {
    url: '/worker/advance/pay/pushCustomCart.do',
    method: 'GET',
    host: 'worker',
    data: {
      phone,
      preOrderId,
      shopCode,
    },
  };
}

// 分批加购
export function batchAddItemToCart(data = {}) {
  return request({
    url: '/cart/batchAddItemToCart',
    method: 'POST',
    host: 'cart',
    isWrapData: false,
    data,
  });
}

/**
 * 加入购物车
 * @param productType 1:普通商品 2：议价商品 3：定制商品
 * //   addItemToCart(unitCode, shopCode, shopId, itemId, itemCode, skuId, skuCode, sapSku, quantity, note, productType = '1', skuRelations) {
 */
export function addItemToCart(data) {
  return request({
    url: '/cart/addItemToCart',
    method: 'POST',
    host: 'cart',
    data: data,
  });
}

/**
 * 购物车数量
 * {shopCode}
 */
export function queryCartCount(data = {}) {
  return request({
    url: '/cart/getCartCount.do',
    method: 'GET',
    host: 'cart',
    toast: false,
    loading: false,
    data,
  });
}

/**
 * 删除购物车中宝贝
 * @param id
 * @returns {{url: string, type: string, param: {id: *}}}
 */
export function onDelCart(ids) {
  return request({
    url: '/cart/deleteItemFormCart',
    method: 'POST',
    host: 'cart',
    data: {
      cartItemIds: ids,
    },
  });
}
/**
 * 编辑购物车中宝贝
 * @param id
 * @param quantity
 * @param note
 * @returns {{url: string, type: string, param: {id: *, quantity: *, note: *}}}
 */
export function onChangeCart(cartList) {
  return request({
    url: '/cart/editItem',
    method: 'POST',
    host: 'cart',
    data: {
      editVOS: cartList,
    },
  });
}
/** 更改购物车商品规格
 * @param {
 * shopId 门店
 * itemCode 门店
 * itemId 门店
 * skuCode 中台
 * skuId 中台
 * sapSku
 * quantity 数量
 * note 备注
 * unitCode 单位
 * shopCode 门店号
 * oldCartItemId 更换规格前的购物车行项目id
 * cartId 购物车id
 * }
 */
export function changeTypeToCart(data) {
  return request({
    url: '/cart/editItemToCart',
    method: 'POST',
    host: 'cart',
    //   loading: false,
    data: data,
  });
}
/**
 * 结算
 * @param channelType
 * @param channelCode 可选
 * @param shopCode
 * @param customerMobile
 * @param orderItemList
 * @param receiverDistrictCode
 * @param cartItemIds
 * @param receiverAddressId
 */
export function orderSettle(params) {
  return request({
    url: '/order/orderSettle',
    method: 'POST',
    host: 'trade',
    data: params,
    //   loading: false,
  });
}

//获取可选发货时间列表
export function findDeliveryDays(
  shopCode,
  channelType,
  orderItemList,
  estimatedDeliveryDate
) {
  return request({
    url: '/channelOrder/findDeliveryDays',
    method: 'POST',
    host: 'trade',
    data: {
      shopCode,
      channelType,
      orderItemList,
      estimatedDeliveryDate,
    },
  });
}

//订单变更校验
export function checkOrderChange(
  channelType,
  shopCode,
  customerMobile,
  orderItemList,
  cartItemIds,
  isCustomized = 0
) {
  return request({
    url: '/order/checkOrderChange',
    method: 'POST',
    host: 'trade',
    toast: false,
    data: {
      channelType,
      shopCode,
      customerMobile,
      orderItemList,
      cartItemIds,
      isCustomized, ////是否定制商品，0：不是， 1：是
    },
  });
}

//获取运费图片
export function createCarriageImg(shopCode) {
  return request({
    url: '/item/getCarriageImg',
    method: 'GET',
    host: 'def',
    data: {
      shopCode,
    },
  });
}

//查询速效返券接口
export function queryAcquiringCoupons(shopCode, mobile, productInfoDtos) {
  return request({
    url: '/order/queryAcquiringCoupons',
    method: 'POST',
    host: 'trade',
    toast: false,
    loading: false,
    data: {
      shopCode,
      mobile,
      productInfoDtos,
    },
  });
}

/**
 * 采集销售日志记录 channelType, count, orderNo, orderType, sku
 * channelType 渠道
 * count 数量
 * orderNo 订单号
 * orderType 订单类型
 * sku sku
 */
export function addSaleLog(items) {
  return request({
    url: '/bnq_owner/appLog/addSaleLog.do',
    method: 'POST',
    host: 'zt',
    toast: false,
    isWrapData: false,
    data: items,
  });
}

//订单预支付接口
export function doPrePay(orderId) {
  return request({
    url: '/payment/doPrePay',
    method: 'POST',
    host: 'trade',
    data: {
      data: {
        orderId,
      },
    },
  });
}

// 查询物流列表
export function queryLogisticsList(channelOrderCode = '') {
  return request({
    url: '/logistics/logisticsList',
    method: 'GET',
    data: {
      channelOrderCode,
    },
    host: 'logistics',
  });
}

/**
 * 查询物流进度
 * @param  交货单号
 */
export function queryLogisticsDetail(id) {
  return request({
    url: '/logistics/h5Log/' + id,
    method: 'GET',
    host: 'logistics',
  });
}

/****
 * 获取新的订单数统计
 */
export function queryOrderStatus(customerMobile) {
  return request({
    url: '/channelOrder/orderStatusStatistics',
    method: 'GET',
    host: 'trade',
    data: {
      customerMobile,
    },
    loading: false,
  });
}

/**
 * 售后列表
 */
export function queryRefundList(channelOrderId) {
  return request({
    url: '/refund/refundList.do',
    method: 'POST',
    data: { channelOrderId },
    host: 'trade',
  });
}

/**
 * 退款金额预计算
 */
export function queryRefundAmount(
  channelOrderItemId,
  refundNum,
  applyRefundType
) {
  return request({
    url: '/refund/getRefundAmount.do',
    method: 'POST',
    host: 'trade',
    data: {
      channelOrderItemId,
      applyRefundType: applyRefundType,
      applyRefundQuantity: refundNum,
    },
  });
}

/**
 * 提交退款申请
 */
export function saveRefund(params) {
  return request({
    url: '/refund/saveRefund.do',
    method: 'POST',
    data: params,
    host: 'trade',
  });
}
/**
 * 储值卡支付
 */
export function doCardPay(data) {
  return request({
    url: '/payment/card/doPay',
    method: 'POST',
    host: 'trade',
    data: {
      data,
    },
  });
}

/**
 * 卡信息查询接口
 */
export function queryCardInfo(cardId) {
  return request({
    url: '/payment/card/info',
    method: 'GET',
    host: 'trade',
    data: {
      cardId,
    },
  });
}

/**
 * 退款详情
 * @param channelOrderItemId
 * @returns {{url: string, type: string, param: {channelOrderItemId: *}}}
 */
export function queryRefundDetail(channelOrderItemId) {
  return request({
    url: '/refund/getRefundDetail.do',
    method: 'POST',
    data: {
      channelOrderItemId,
    },
    host: 'trade',
  });
}

/****
 * 根据订单号查询线上订单发票详情
 */
export function queryOnlineOrderList(orderNo) {
  return request({
    // url: '/invoice/print/queryOnlineOrderList.do',
    url: '/invoice/getInvoiceInfoByOrderCode',
    method: 'GET',
    host: 'invoice',
    data: {
      orderCode: orderNo,
    },
  });
}

/**
 * 发票抬头模糊匹配
 */
export function queryCustomerList(companyName) {
  return request({
    url: 'invoice/queryCustomerList',
    method: 'get',
    host: 'invoice',
    data: {
      queryKey: companyName,
    },
  });
}

/****
 * 新开电子发票
 */
export function openerElectronicinvoice(
  info,
  status = '1',
  itemType = '3',
  itemSource = '2',
  discountAmount = '0',
  key = 'wechat_shop'
) {
  return request({
    url: '/invoice/askForInvoice',
    method: 'POST',
    host: 'invoice',
    data: {
      ...info,
      status,
      itemType,
      itemSource,
      discountAmount,
      key,
    },
  });
}
/**发票详情页，点击发送至邮箱 */
export function invoiceCommitEmail(orderNo, email) {
  return request({
    url: '/invoice/sendInvoiceToEmail',
    method: 'GET',
    host: 'invoice',
    data: {
      orderNo,
      email,
    },
  });
}
