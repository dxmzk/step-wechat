/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 分类
 */

import { queryCategory } from "../../modules/api/goods";
import Constants from "../../modules/constant/index";
import Bus, { BusKey } from "../../modules/event/index";

Page({
  data: {
    tabIndex: -1,
    tabList: [],
    categoryList: [], // 源数据
    sortList: [],
  },

  onLoad: function (options) {
    
  },

  onReady: function() {
    const that = this;
    that.getSortData();
    // 监听切换tab
    Bus.add(BusKey.sort, (categoryId) => {});
  },

  onShow: function () {
    const that = this;
    let categoryId = Constants.categoryId;
    if (categoryId != -1 && that.data.tabIndex != categoryId) {
      that.setData({
        tabIndex: categoryId,
      });
    }
  },

  // 搜索
  onSearch: function () {
    wx.navigateTo({
      url: "/pages/home/search/search",
    });
  },
  // 扫码
  onScan: function () {},
  // 切换tab
  onChangeTab: function (e) {
    const that = this;
    let tabIndex = parseInt(e.currentTarget.dataset.tag);
    let categoryList = that.data.categoryList.filter((e) => e.id == tabIndex); //
    let sortList = categoryList[0].subCategoryList || [];
    if (sortList.length > 0) {
      sortList[0].logo = categoryList[0].logo;
    }
    that.setData({
      tabIndex,
      sortList,
    });
  },
  // 点击分类item
  onGridItem: function (e) {
    let item = e.currentTarget.dataset;
    if (item.title == "全部") {
      const { tabIndex, categoryList } = this.data;
      let category = categoryList.filter((e) => e.id == tabIndex); //
      item.title = category[0].categoryName;
    }
    wx.navigateTo({
      url: `/pages/sort/goods/goods?categoryid=${item.categoryid}&title=${item.title}`
    });
  },
  // 获取数据
  getSortData: async function () {
    const that = this;
    let { code, data } = await queryCategory();
    if (code == 0) {
      let tabIndex = that.data.tabIndex;
      let categoryList = data.data.subCategoryList || []; // subCategoryList
      let sortList = [];

      let tabList = categoryList.map((e) => {
        if (tabIndex == e.id) {
          sortList = e.subCategoryList || [];
          if (sortList.length > 0) {
            sortList[0].logo = e.logo;
          }
        }
        return {
          id: e.id,
          name: e.categoryName,
        };
      });

      if (categoryList.length > 0 && tabIndex == -1) {
        const category = categoryList[0] || {};
        sortList = category.subCategoryList || [];
        tabIndex = category.id;
        if (sortList.length > 0) {
          sortList[0].logo = category.logo;
        }
      }
      that.setData({
        categoryList,
        tabList,
        tabIndex,
        sortList,
      });
    }
  },
});
