/**
 * Author: Meng
 * Date: 2022-05
 * Desc: 地址选择
 */
import {
  queryAddressName,
  queryAddressPoi,
} from "../../../../modules/api/address";
import Bus, { BusKey } from "../../../../modules/event/index";
import Wechat from "../../../../modules/system/index";

const Map_Style = "height: 560rpx;";

Page({
  data: {
    adsId: 0,
    mapStyle: "",
    disabled: true,
    latitude: 31.249574,
    longitude: 121.455708,
    cityName: "上海市",
    cityCode: "310100",
    adsList: [],
  },

  onLoad: function (options) {
    const that = this;
    if (options && options.location) {
      const mak = data[0].location.split(",");
      let latitude = parseFloat(mak[1]);
      let longitude = parseFloat(mak[0]);
      // that.setData
      that.getAddressPoi(latitude, longitude);
    } else {
      that.getCurLocation();
    }
  },
  onShow: function () {},

  // 切换城市
  onChangeCity: function () {
    wx.navigateTo({
      url: "/page_minor/pages/location/city/city",
    });
  },
  // 搜索
  onSearch: function () {
    wx.navigateTo({
      url: "/page_minor/pages/address/search/search",
    });
  },

  // 地址item点击
  onItemClick: function (e) {
    // const that = this;
    const item = e.currentTarget.dataset.item;
    const location = item.location;
    const shortRemarkAddress = item.cityname + item.adname + item.address;
    const shortAddress = item.name;
    // setAddressCity({ shortRemarkAddress, location, shortAddress });
    Bus.send(BusKey.address_get_city, {
      shortRemarkAddress,
      location,
      shortAddress,
    });
    wx.navigateBack();
  },

  onTapMap: function (e) {
    const latlng = e.detail;
    this.getAddressPoi(latlng.latitude, latlng.longitude);
  },

  // 添加marker点
  _addMarker: function (latitude, longitude) {
    const that = this;
    const map_view = wx.createMapContext("amap_view");

    const id = 9;
    const marker = {
      id,
      latitude,
      longitude,
      width: 48,
      height: 48,
      iconPath:
        "https://decorationhome.oss-cn-hangzhou.aliyuncs.com/app_icon/map_location.png",
    };
    map_view.addMarkers({
      markers: [marker],
      clear: true,
    });
    // console.log("============> marker", latitude, longitude);
  },

  // 获取定位
  getCurLocation: async function () {
    const that = this;
    const res = await Wechat.getLocation();
    if (res) {
      const { latitude, longitude } = res;
      that.setData({ latitude, longitude });
      // 只有从我的中进入显示定位城市
      that.getAddressName(latitude, longitude);

      that.getAddressPoi(latitude, longitude);
    }
  },

  // 地理编码
  getAddressName: async function (latitude, longitude) {
    const that = this;
    const { code, data } = await queryAddressName(latitude, longitude);
    if (code == 0) {
      that.setData({
        cityName: data.cityName,
      });
    }
  },

  // 获取周边
  getAddressPoi: async function (latitude, longitude) {
    const that = this;
    const { code, data } = await queryAddressPoi(latitude, longitude);
    if (code == 0 && data) {
      const _data = {
        adsList: data,
        mapStyle: Map_Style,
      };
      if (data.length > 0) {
        const mak = data[0].location.split(",");
        _data.latitude = parseFloat(mak[1]);
        _data.longitude = parseFloat(mak[0]);
        that._addMarker(_data.latitude, _data.longitude);
      }
      that.setData(_data);
    }
  },
});
