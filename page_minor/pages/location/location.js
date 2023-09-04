/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 选择地址
 */
import { queryAddressList0 } from "../../../modules/api/address";
// import { queryByDistance } from "../../../modules/api/goods";
import Bus, { BusKey } from "../../../modules/event/index";
import { getAccountInfo, setShopCity } from "../../../modules/store/index";
import Wechat from "../../../modules/system/index";

Page({
  data: {
    mode: 0, // 0默认不选择;1从下单进入校验可用不可用
    address: {},
    addressList: [],
    sapSkuCode: 0,
    phone: "",
  },

  onLoad: function (options) {
    const that = this;
    const info = getAccountInfo() || {};
    const phone = info.phone;
    let sapSkuCode = 0;
    let mode = 0;
    if (options) {
      if (options.mode) {
        mode = parseInt(options.mode);
      }
      if (options.sap) {
        sapSkuCode = options.sap;
      }
    }

    that.setData({ phone, sapSkuCode, mode }, that.getMyAddress);
  },

  onReady: function () {
    const res = Wechat.getLocation();
    if (res) {
      this.setData({
        address: {
          latitude: res.latitude,
          longitude: res.longitude,
        },
      });
    }
  },

  // 点击事件
  onItemPress: function (e) {
    let item = e.currentTarget.dataset.item;
    if (item.canUse) {
      const _data = {
        id: item.id,
        cityCode: item.cityCode,
        cityName: item.cityName,
        address: item.cityName + item.districtName + item.streetName,
      };
      setShopCity(_data);
      Bus.send(BusKey.shop_city, _data);
      wx.navigateBack();
      // queryByDistance({ cityCode: item.cityCode }).then(({code, data}) => {
      //   if (code == 0 && data.data) {
      //     const shop = data.data.shopInfo;
      //     if (shop) {
      //       _data.shopName = shop.shopName;
      //       _data.shopCode = shop.shopCode;
      //       setCityAndShop(_data);
      //     }
      //     Bus.send(BusKey.city, _data);
      //     wx.navigateBack();
      //   }
      // });
    } else {
      wx.showToast({
        title: "该位置不在配送范围内！",
        icon: "none",
      });
    }
  },

  // 选择城市
  onChooseCity: function () {
    wx.navigateTo({
      url: "/page_minor/pages/location/city/city",
    });
  },

  //
  getMyAddress: async function () {
    let that = this;
    const { phone, sapSkuCode, mode } = that.data;
    const { code, data } = await queryAddressList0({ phone, sapSkuCode });
    if (code == 0 && data.data) {
      const ads = data.data;
      const addressList = ads.addressList || [];
      addressList.filter(e => {
        e.canUse = e.isDeliverRegion == 1 || mode == 0;
      });
      that.setData({
        addressList,
      });
    }
  },
});
