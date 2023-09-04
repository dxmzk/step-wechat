/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 选择城市店铺
 */

import { queryAllShop } from "../../../modules/api/goods";
import Bus, { BusKey } from "../../../modules/event/index";
import { setCityAndShop, getCityAndShop } from "../../../modules/store/index";
// import Wechat from "../../../modules/system/index";

Page({
  data: {
    cityList: [],
    shopList: [],
    cityCode: -1,
    cityName: "",
    shopCode: -1,
  },

  onLoad: function (options) {
    let that = this;

    that.getShopList();
  },

  // 改变城市
  onChangeCity: function (e) {
    const that = this;
    let cityList = that.data.cityList;
    let cityCode = e.currentTarget.dataset.code;
    let cityName = e.currentTarget.dataset.name;
    let shopList = [];
    cityList.forEach((e) => {
      if (e.cityCode == cityCode) {
        shopList = e.shopInfoList;
      }
    });

    that.setData({
      cityCode,
      cityName,
      shopList,
    });
  },
  // 店铺点击
  onShopItem: function (e) {
    const that = this;
    let { cityCode, cityName } = that.data;
    let shopCode = e.currentTarget.dataset.code;
    let shopName = e.currentTarget.dataset.name;

    const _data = {
      cityCode,
      cityName,
      shopCode,
      shopName,
      address: cityName,
    };
    setCityAndShop(_data);

    Bus.send(BusKey.shop_city, _data, 500);
    wx.navigateBack();
  },

  // 获取门店数据
  getShopList: async function () {
    const that = this;
    // let res = await Wechat.getLocation();
    // if (!res) {
    //   res = {};
    // }
    let { code, data } = await queryAllShop({});
    if (code == 0) {
      let list = data.result || [];
      let cityList = [];
      let shopList = [];
      let cityName = "";
      let cityCode = -1;
      let shopCode = -1;

      let cs = getCityAndShop(); // 当前店铺
      if (cs) {
        cityCode = cs.cityCode;
        shopCode = cs.shopCode;
      }

      // 分组
      list.forEach((cityObj) => {
        for (const key in cityObj) {
          let citys = cityObj[key];
          if (citys.length > 0) {
            citys[0].keyStr = key;
            cityList = cityList.concat(citys);
          }
        }
      });

      // 设置默认值
      if (cityList.length > 0) {
        let idx = 0;
        if (cityCode != -1) {
          cityList.forEach((e, index) => {
            if (e.cityCode == cityCode) {
              idx = index;
            }
          });
        }
        let city = cityList[idx] || {};
        shopList = city.shopInfoList;
        cityCode = city.cityCode;
        cityName = city.cityName;
      }
      that.setData({
        cityList,
        cityCode,
        cityName,
        shopCode,
        shopList,
      });
    }
  },
});
