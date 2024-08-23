/**
 * Author: Meng
 * Date: 2022-03
 * Desc: 商品相关数据处理
 */

// 商品是否选中 useType: distributeAddress 1在配送范围
export function goodsIsCheck(item, useType) {
  return item.isSelected == 1 && item.state == 1 && useType == 1 && item.price;
}
// 商品是否可用 useType: distributeAddress 1在配送范围
export function goodsEnable(item, useType) {
  return item.state == 1 && useType == 1 && item.price;
}

// 处理图片地址 图片地址过长会导致加载变慢
export function splitGoodsUrl(url) {
  let itemUrl = url || "";
  if (itemUrl.indexOf("?") > -1) {
    itemUrl = itemUrl.split("?")[0];
  }
  return itemUrl;
}

// 转化为提交订单参数
export function orderSetParam(item) {
  return {
    id: item.id,
    itemCode: item.itemCode,
    spuCode: item.spuCode,
    skuCode: item.skuCode,
    quantity: item.quantity,
    productThumbPic: item.itemUrl,
    productSpecDesc: item.specification,
    productName: item.itemName,
    espSign: item.espSign,
    priceGrade: item.priceGrade,
    unitCode: item.unitCode,
    salePrice: item.price,
  };
}

// 购物车 弹窗 促销，修改类型参数
export function cartDialogParam(item) {
  return {
    id: item.id,
    skuImgUrl: item.itemUrl,
    name: item.itemName,
    spuCode: item.itemCode,
    price: item.price,
    itemId: item.itemId,
    skuId: item.skuId,
    skuCode: item.skuCode,
    sapSku: item.sapSku,
    cartId: item.cartId,
    unitCode: item.unitCode,
    shopCode: item.shopCode,
    shopId: item.shopId,
    quantity: item.quantity,
    state: item.state,
  };
}

// 转化为获取返券金额参数
export function acquirCouponsParam(item) {
  return {
    skuCode: item.sapSkuCode,
    skuCount: item.quantity,
    nowTotalPrice: item.actualTotalAmount,
  };
}

// 获取类型 名称
export function getSalePropertyName(list, skuId) {
  let name = "";
  if (list && list.length > 0) {
    list.forEach((e) => {
      let valueList = e.valueList || [];
      valueList.forEach((v) => {
        if (JSON.stringify(v).includes(skuId + "")) {
          name = v.text;
        }
      });
    });
  }
  if (name) {
    name += ", 1件";
  }
  return name;
}

// 解析商品sku数据
export function parseGoodsInfo(goods) {
  let goodsInfo = {
    brandCode: goods.brandCode,
    brandName: goods.brandName,
    id: goods.id,
    itemName: goods.itemName,
    detailImgList: goods.detailImgList,
    price: goods.price,
    priceGrade: goods.priceGrade,
    priceStr: goods.priceStr,
    productLabels: goods.productLabels,
    qrCodeUrl: goods.qrCodeUrl,
    sapSkuNo: goods.sapSkuNo,
    skuCode: goods.skuCode,
    skuId: goods.skuId,
    skuImgUrl: goods.skuImgUrl,
    spuCode: goods.spuCode,
    envLevel: goods.envLevel,
    envTitle2: goods.envTitle2,
    isNegotiate: goods.isNegotiate,
    state: goods.state,
    subtitle: goods.subtitle,
    supplyTimePlus: goods.supplyTimePlus,
    supplyTimePlusStr: goods.supplyTimePlusStr,
    mainCategoryId: goods.mainCategoryId,
  };
  return goodsInfo;
}

// 解析商品详情数据
export function parseDetailGoodsInfo(detail) {
  let skuList = detail.skuList;
  let selectedSkuId = detail.selectedSkuId;
  let index = 0;
  if (skuList.length > 1) {
    skuList.forEach((e, idx) => {
      if (e.skuId == selectedSkuId) {
        index = idx;
      }
    });
  }
  let goods = skuList[index];
  let goodsInfo = parseGoodsInfo(goods);
  let saleProperty = getSalePropertyName(
    detail.salePropertyList,
    selectedSkuId
  );
  const info = {
    goodsInfo,
    skuList,
    selectedSkuId,
    saleProperty,
    goodsDetail: {
      skuList: detail.skuList,
      selectedSkuId: detail.selectedSkuId,
      salePropertyList: detail.salePropertyList,
    },
    isCustom: detail.isCustom,
    customRelaSku: detail.customRelaSku,
    stateStr: detail.stateStr,
    saleNum: detail.saleNum,
    spuCode: detail.spuCode,
    goodsShopCode: detail.shopCode,
    defaultSku: detail.defaultSku,
    basicPropertyList: detail.basicPropertyList,

    swiperInfo: {
      video: goods.skuVideoUrl,
      vr: goods.sku3DPicUrl,
      vrImg: splitGoodsUrl(goods.skuImgUrl),
      imgs: goods.mainImgList.map((e) => splitGoodsUrl(e.url)),
    },
    consultant: {
      pic: detail.consultantPic,
      url: detail.consultantUrl,
    },
  };
  return info;
}

// 转换品牌列表数据
export function getBrandList(list) {
  let items = list.filter((_, index) => index < 4);
  items = items.map((e) => {
    return {
      id: e.id,
      spuId: e.spuId,
      itemName: e.itemName,
      salePriceStr: e.salePriceStr,
      listImg: splitGoodsUrl(e.listImg),
    };
  });
  return items;
}

// 下单参数配置 addressId
export function setPaymentParam(adsId, cityCode, shopCode, goodsList, orderData, fromType) {
  delete orderData.sendTypeItemList;
  const dcCardShopList = orderData.dcCardShopList || [];
  const isBntAccount = dcCardShopList.some((e) => item.shopCode == shopCode);
  // 跳转参数
  const orderParams = {
    adsId,
    cityCode,
    goodsList,
    orderData,
    fromType,
    isBntAccount,
  };
  return encodeURIComponent(JSON.stringify(orderParams));
}

// 转化下单费用详情
export function formatPayCost(item) {
  const right_icon = "/assets/icon/arrow_right.png";
  const isProm = item.promotionDiscount;
  let cost_list = [
    { label: "商品金额", unit: "¥", value: item.totalAmount },
    { label: "运费", unit: "¥", value: item.postAmount },
    {
      tag: "券",
      label: "优惠券",
      mode: "hint",
      value: "暂无可用优惠券",
    },
    {
      tag: "减",
      label: "促销立减",
      mode: isProm ? "money" : "hint",
      unit: isProm ? "-¥" : "",
      value: item.promotionDiscount || "无可用优惠",
    },
    {
      tag: "返",
      label: "促销返券",
      mode: "hint",
      color: "color: #fe7100;",
      value: "下单返3张优惠券",
      icon: right_icon,
    },
  ];

  return cost_list;
}
