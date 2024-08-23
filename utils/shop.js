/**
 * Author: Meng
 * Date: 2022-03
 * Desc: 店铺相关数据处理
 */

const ShopConfig = {
  quickShop: {
    shopCode: "2588",
    shopName: "快闪店",
    channelType: 15,
  },
  artisanShop: {
    shopCode: "C365",
    shopName: "牛匠到家",
    channelType: 15,
    channelCode: 3302,
  },
};

export function isSpecialShop(shopCode) {
  return Object.keys(ShopConfig).some(shopKey => shopCode === ShopConfig[shopKey].shopCode);
}

export function getSpecialShopType(shopCode) {
  const shopKey = Object.keys(ShopConfig).find(shopKey => shopCode === ShopConfig[shopKey].shopCode);
  return ShopConfig[shopKey];
}
