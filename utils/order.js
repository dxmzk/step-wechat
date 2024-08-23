/**
 * Author: Meng
 * Date: 2022-03
 * Desc: 订单相关数据处理
 */
const Tab_State = ["", "1", "2", "4", "6"]; // 全部'';待付款1;待发货2;待收货4;已收货5;已完成6

export function getTabState(index) {
  // return Tab_State[index];
}

// 打开家装小程序 shopId店铺id
export function openShopApp(shopId) {
  // console.log(shopId);
  wx.navigateToMiniProgram({
    appId: "wx3d63644eeefbc41a",
    path: "/pages/shop/shopdetail/shopdetail?shopId=" + shopId,
    fail: (err) => {
      console.log(err);
      wx.showToast({
        icon: 'none',
        title: '抱歉，未能找到对应的小程序！',
      })
    }
  });
}

// 获取支付类型
export function getPaymentType(order) {
  switch (order.paymentWay) {
    case 1:
      return "安居账号 " + (order.customerCardCode || "");
    case 2:
      return "授信账号";
    case 3:
      return "支付宝支付";
    case 4:
      return "微信支付";
    case 5:
      return "银联";
    case 6:
      return "Pos支付";
    case 7:
      return "优惠券支付";
    case 8:
      return "积分支付";
    case 9:
      return "其他方式支付";
    case 10:
      return "拼多多支付";
    default:
      return "";
  }
}

// 解析金额与下单信息
export function parseCostAndOrderInfo(detail) {
  const color = "color: #F56105;";
  let costInfo = [
    { name: "商品总额", value: 0 },
    { name: "运费", value: 0 },
    { color, name: "优惠券", value: 0, icon: "", tag: "-", label: '券' },
    { color, name: "促销立减", value: 0, icon: "", tag: "-", label: '减' },
    { color, name: "促销返券", value: 0, icon: "", coupon: true, label: '返' },
    { color, name: "积分抵扣", value: 0, icon: "", tag: "-", label: '积' },
  ];
  let otherInfo = [
    { name: "订单编号", value: "", tag: "复制" },
    { name: "备注", value: "" },
    { name: "创建时间", value: "" },
    { name: "支付时间", value: "" },
    { name: "支付方式", value: "" }
  ];

  costInfo[0].value = detail.totalAmount || 0;
  costInfo[1].value = detail.postAmount || 0;
  costInfo[2].value = detail.couponDeductionAmount || 0;
  costInfo[3].value = detail.promotionDiscount || 0;
  costInfo[4].value = 0; // 不知道
  costInfo[5].value = detail.pointDeductionAmount||0;
  costInfo = costInfo.filter((e, index) => index < 2 || e.value > 0);

  otherInfo[0].value = detail.orderCode;
  otherInfo[1].value = detail.buyerRemark;
  otherInfo[2].value = detail.createTime; 
  // isPaid 0 代表未支付 1 代表已支付
  otherInfo[3].value = detail.isPaid != 0 ? detail.paymentTime : '';
  if(detail.isPaid != 0) {
    const payType = getPaymentType(detail);
    otherInfo[4].value = detail.orderStatusCode != "WAIT_BUYER_PAY" ? payType : "";
  }
  
  otherInfo = otherInfo.filter((e, index) => index < 2 || e.value);

  let couponMoney =
    (detail.couponDeductionAmount || 0) +
    (detail.promotionDiscount || 0) +
    (detail.cardDiscount || 0) +
    (detail.pointDeductionAmount || 0);
  return { costInfo, otherInfo, couponMoney };
}

// 设置订单状态
export function setStateType(item, detail = false) {
  let hasPay = false; // 支付
  let hasCancel = false; // 取消
  let hasDelete = false; // 删除
  let hasBuyAgain = false; // 再次购买
  let hasLogistics = false; // 物流
  let hasAfterSale = false; // 售后
  let hasRefund = false; // 退款信息
  let hasInvoice = false; // 发票
  //   let hasRemark = false; // 评价
  //   let hasProgress = false; // 查看进度
  //   let hasConfirmReceipt = false; // 确认收货

  // let hasAuthCode = item.deliveryType == 3 && item.orderStatusCode == "WAIT_BUYER_CONFIRM_GOODS"; // 验证码

  switch (item.orderStatusCode) {
    case "WAIT_SEND_COD": // 退款中
      item.stateStr = "refund";
      break;
    case "TRADE_CANCELED": // 已取消
      item.stateStr = "cancel";
      hasDelete = true;
      hasBuyAgain = true;
      break;
    case "TRADE_CLOSED": // 已关闭
    case "TRADE_CLOSED_BY_TAOBAO":
      item.stateStr = "close";
      hasBuyAgain = true;
      break;
    case "WAIT_BUYER_PAY": // 待付款
    case "PAY_PENDING":
      const pay = item.showPayButton == 0; // showPayButton，0 代表可以展示支付按钮 1 代表不能展示
      item.stateStr = pay ? "pay" : "";
      // hasCancel = item.paymentWay != 6;
      hasCancel = true;
      hasPay = pay;
      break;
    case "WAIT_SELLER_STOCK_OUT": // 待发货
    case "WAIT_SELLER_DELIVERY":
    case "WAIT_SELLER_SEND_GOODS":
      item.stateStr = "waitgoods";
      //   hasLogistics = true;
      hasBuyAgain = true;
      let refund = item.refundOrderStatus || item.isHasRefund || 0;
      hasInvoice = true; // refund < 1
      hasAfterSale = refund < 1;
      hasRefund = refund > 0;
      break;
    case "SELLER_CONSIGNED_PART": // 待收货
    case "WAIT_GOODS_RECEIVE_CONFIRM":
    case "WAIT_BUYER_CONFIRM_GOODS":
      item.stateStr = "send";
      hasLogistics = true;
      hasBuyAgain = true;
      hasInvoice = true;
      let refund2 = item.refundOrderStatus || item.isHasRefund || 0;
      hasAfterSale = refund2 < 1;
      hasRefund = refund2 > 0;
      break;
    case "TRADE_BUYER_SIGNED": // 已完成
    case "FINISHED_L":
    case "TRADE_FINISHED":
      item.stateStr = "finish";
      hasLogistics = true;
      hasBuyAgain = true;
      hasInvoice = true;
      hasDelete = true;
      hasAfterSale = item.isHasRefund != 1;
      hasRefund = item.isHasRefund == 1;
      break;
    // case "": // 待评价
    //   break;
    // case "WAIT_SEND_CODE": // 待发码/安装
    // case "WAIT_INSTALL":
    //   break;
  }

  if (hasRefund) {
    item.stateStr = "refund";
    // hasDelete = item.refundOrderStatus > 1; // 完成20？ 退款中 1 没有单独的 退款完成 状态
  }

  //   const orderItem = item.orderItem.filter(e => e.productName && (e.productName.indexOf('运费') < 0 && e.productName.indexOf('运输费') < 0))
  //   item.orderList = orderItem;

  item.hasPay = hasPay;
  item.hasCancel = hasCancel;
  item.hasDelete = hasDelete;
  item.hasBuyAgain = hasBuyAgain;
  item.hasLogistics = hasLogistics;
  item.hasAfterSale = hasAfterSale;
  item.hasRefund = hasRefund;
  item.hasInvoice = hasInvoice;
  // item.hasAuthCode = hasAuthCode;
  return item;
}
