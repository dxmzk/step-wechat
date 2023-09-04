/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 城市列表
 */

import { queryAddressList0 } from "../../../../modules/api/address";
import { queryByDistance } from "../../../../modules/api/goods";
import { setCityAndShop } from "../../../../modules/store/index";
import Bus, { BusKey } from "../../../../modules/event/index";

Page({
  data: {
    mode: 0, // 0保存；1不保存
    citys: [],
  },

  onLoad: function (options) {
    const that = this;
    if(options && options.mode) {
      that.setData({
        mode: parseInt(options.mode)
      })
    }
    
    that.getMyAddress();
  },

  onReady: function () {},

  onPullDownRefresh: function () {},

  onReachBottom: function () {},

  // 点击事件
  onTapItem: function (e) {
    const mode = this.data.mode;
    let item = e.currentTarget.dataset.item;
    const _data = {
      cityCode: item.code,
      cityName: item.cityName,
      address: item.cityName,
    };

    if(mode == 0){
      queryByDistance({ cityCode: item.code }).then(({code, data}) => {
        if (code == 0 && data.data) {
          const shop = data.data.shopInfo;
          if (shop) {
            _data.shopName = shop.shopName;
            _data.shopCode = shop.shopCode;
            setCityAndShop(_data);
          }
          Bus.send(BusKey.shop_city, _data);
          wx.navigateBack({delta: 2});
        }
      });
    }else {
      Bus.send(BusKey.city, _data);
      wx.navigateBack();
    }
  },
  // 
  getMyAddress: async function () {
    let that = this;
    const {code, data} = await queryAddressList0();
    if(code == 0) {
      const ads = data.data || {};
      const cityMap = ads.sortCityMap||{};
      const citys = []
      for (const key in cityMap) {
          const list = cityMap[key]||[];
          citys.push({key, city: list})
      }
      that.setData({
        citys,
      });
    }
  },
});
