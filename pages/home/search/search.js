/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 搜索
 */

import { queryHotList, queryDefaultHotWord } from "../../../modules/api/goods";
import {
  getCityAndShop,
  getHistoryList,
  setHistoryList,
} from "../../../modules/store/index";

Page({
  data: {
    keyword: "",
    mode: "", // 退出模式，goods:列表跳转
    searchStr: "",
    shopCode: "",
    historys: [],
    hotList: [],
    showClear: false,
  },

  onLoad: function (options) {
    let that = this;
    if (options) {
      const _data = {};
      if (options.key) {
        _data.keyword = options.key;
      }
      _data.mode = options.mode || "";
      that.setData(_data);
    }
    let shop = getCityAndShop();
    if (shop) {
      that.data.shopCode = shop.shopCode;
    }
    that.getHotWordData();
  },

  onShow: function () {
    let historys = getHistoryList();
    if (historys && historys.length > 0) {
      this.setData({
        historys,
      });
    }
  },
  // 输入字符串
  onInputStr: function (e) {
    const that = this;
    const str = e.detail.value;
    that.data.keyword = str;
    if (
      (that.data.showClear && str.length < 1) ||
      (!that.data.showClear && str.length > 0)
    ) {
      that.setData({
        showClear: str.length > 0,
      });
    }
  },
  // 清除搜索记录
  onClearHistory: function () {
    let historys = [];
    setHistoryList(historys);
    this.setData({
      historys,
    });
  },
  // 搜索
  onSearch: function () {
    const that = this;
    let str = that.data.searchStr;
    let word = that.data.keyword || str;
    let list = that.data.historys;
    list.push(word);
    setHistoryList(list);
    if (that.data.mode == "goods") {
      wx.navigateBack();
    } else {
      wx.redirectTo({ url: "/pages/sort/goods/goods?search=" + word });
    }
  },
  // 获取热词
  getHotWordData: function () {
    const that = this;
    queryHotList({
      shopCode: "",
      pageSize: "3",
      terminalType: "10",
    })
      .then(({ code, data }) => {
        if (code == 0) {
          that.setData({
            hotList: data.data || [],
          });
        }
      })
      .catch(() => {});

    queryDefaultHotWord({
      shopCode: "",
      terminalType: "10",
    })
      .then(({ code, data }) => {
        if (code == 0) {
          that.setData({
            searchStr: data.data?.title,
          });
        }
      })
      .catch(() => {});
  },
});
