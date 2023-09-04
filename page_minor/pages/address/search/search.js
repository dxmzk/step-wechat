/**
 * Author: Meng
 * Date: 2022-05
 * Desc: 地址搜索
 */

import { searchAddressPlace } from "../../../../modules/api/address";
import Bus, {BusKey} from "../../../../modules/event/index";
import { getCitySearchHistory, setCitySearchHistory, setAddressCity } from "../../../../modules/store/index";

let TIMER = -1;

Page({
  data: {
    cityName: "上海市",
    inputKey: "",
    showHistory: false,
    historys: [],
    addressList: [],
  },

  onLoad: function () {},
  onReady: function () {
    this._getHistory();
  },

  onUnload: function () {
    clearTimeout(TIMER);
  },

  onBack: function () {
    wx.navigateBack();
  },

  // 切换城市
  onChangeCity: function() {
    wx.navigateTo({
      url: "/page_minor/pages/location/city/city",
    });
  },
  
  // 获取搜索历史
  _getHistory: function () {
    let historys = getCitySearchHistory()||[];
    historys = historys.filter((e, index) => index < 10);
    this.setData({
      historys,
      showHistory: historys.length > 0,
    });
  },

  // 输入文本
  onInputStr: function (e) {
    const that = this;
    const inputKey = e.detail.value;
    that.setData({ inputKey });
    if (inputKey) {
      that.onTimer();
    }
  },
  // 时间
  onTimer: function () {
    clearTimeout(TIMER);
    TIMER = setTimeout(() => {
      this.onSearch();
    }, 3000);
  },
  // 获取焦点
  onFocus: function () {
    const that = this;
    if (!that.data.showHistory) {
      that._getHistory();
    }
  },
  // 搜索
  onSearch: function () {
    this.onSearchAddress();
  },

  // 清除搜索历史
  _clearHistory: function () {
    const that = this;
    wx.showModal({
      content: "确认删除历史搜索？",
      success: (res) => {
        if (res.confirm) {
          setCitySearchHistory([]);
          that.setData({
            historys: [],
            showHistory: false,
          });
        }
      },
    });
  },
  // 搜索历史点击
  onNodeClick: function (e) {
    const that = this;
    const idx = parseInt(e.currentTarget.dataset.idx);
    const historys = that.data.historys;
    that.setData(
      { inputKey: historys[idx], showHistory: false },
      that.onSearch
    );
  },
  // 地址item点击
  onItemClick: function (e) {
    const that = this;
    const item = e.currentTarget.dataset.item;
    const { historys, inputKey } = that.data;
    if (inputKey.length > 0) {
      let data = [inputKey];
      data = data.concat(historys.filter(e => e != inputKey ));
      setCitySearchHistory(data);
    }
    const location = item.location;
    const shortRemarkAddress = item.cityname + item.adname + item.address;
    const shortAddress = item.name;
    // setAddressCity({ shortRemarkAddress, location, shortAddress });
    Bus.send(BusKey.address_get_city, {shortRemarkAddress, location, shortAddress});
    wx.navigateBack({delta: 2});
  },

  // 搜索地址
  onSearchAddress: async function () {
    const that = this;
    const { cityName, inputKey } = that.data;
    const { code, data } = await searchAddressPlace(inputKey, cityName);
    if (code == 0) {
      that.setData({
        addressList: data,
      });
    }
  },
});
