/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 首页
 * 接口：获取购物车商品数量，banner，推荐商品，商品tab。。。
 * 首页 活动及新人红包，不清楚是不是接口
 */

import {
  queryCommoditys,
  queryMallIndex,
  queryHomeCategories,
  queryGoodsTabs,
  queryNearestShop,
} from "../../modules/api/index";
import { queryCartCount } from "../../modules/api/order";
import Wechat from "../../modules/system/index";
import {
  checkLogin,
  getNewcomerId,
  getCityAndShop,
  setCityAndShop,
} from "../../modules/store/index";
import Constants from "../../modules/constant/index";
import { splitGoodsUrl } from "../../utils/goods";
import Bus, { BusKey } from "../../modules/event/index";

// 默认值
const DefShop = {
  cityCode: "310100",
  cityName: "上海市",
  shopCode: "1004",
  shopName: "上海龙阳店",
};

// 商品数据类 - 可不保存，切换tab时刷新列表
const Tab = { list: [], pageNum: 1, hasMore: true };
const app = getApp();

Page({
  data: {
    indicator: true,
    autoplay: true,
    interval: 3500,
    duration: 1000,

    isLogin: false,
    firstIn: true, // 是否第一次加载

    pageNum: 1,
    hasMore: true,

    cityCode: "",
    cityName: "",
    shopCode: "",
    shopName: "",
    shopId: 0,

    cartNum: 0,
    bannerList: [], // banner
    mallSecurity: [], // 百安居承诺广告
    categories: [], // 金刚位
    brandItem: {}, // 品牌推荐
    tabList: [], // 商品 tabs
    goodsList: [], // 展示的商品数据
    goodsDatas: {}, // 所有分类的商品数据{pageNum, hasMore, list}
    animationData: {},
    categoryId: -1, // 商品tab index
    categoryTag: "t0", // 商品标识
    topHeight: app.consts.statusBarHeight + 88,
  },

  // 避免在此函数放入耗时任务及复杂逻辑
  onLoad: function (options) {},
  // 活动及其他接口可放在次处
  onReady: function () {
    let that = this;
    that._initData();
    that._initEventBus();
    // that.getLocationShop();
    // that.getHomeCategories();
    // that.getGoodsTabs();
  },
  // 检测登录/门店/购物车是否有变 - 现改成事件驱动，不再采用值对比方式
  onShow: function () {},

  // 下拉刷新项，商品列表，banner
  onPullDownRefresh: function () {
    let that = this;
    const _data = {
      pageNum: 1,
      hasMore: true,
      goodsDatas: {}
    }
    that.setData(_data, that.getGoodsList);
    if (that.data.categories.length < 1) {
      that.getHomeCategories();
    }
    if (that.data.tabList.length < 1) {
      that.getGoodsTabs();
    }
    that.getHomeBanner();
    that.getCartCount();
    wx.stopPullDownRefresh();
  },
  // 滑动地址加载下一页
  onReachBottom: function () {
    let that = this;
    if (that.data.hasMore) {
      that.getGoodsList();
    }
  },

  // 初始数据
  _initData: function() {
    const that = this;
    const isLogin = checkLogin(1);
    that.setData({isLogin}, that.getCartCount);
    that.getLocationShop();
    that.getHomeCategories();
    that.getGoodsTabs();

    // 是否需要 新人提示
    const newId = getNewcomerId();
    if (!newId) {
      wx.showToast({
        icon: "none",
        title: "您有一份新人大礼包",
      });
    }
  },

  // 初始化事件
  _initEventBus: function() {
    const that = this;
    // 登录/退出登录
    Bus.add(BusKey.login, (info) => {
      let isLogin = info.userId != null;
      // 登录状态变化 - 更新购物车数量
      that.setData({ isLogin }, that.getCartCount);
    });

    // 门店或店铺修改
    Bus.add(BusKey.shop_city, () => {
      that._setCurShop();
    });

    // 刷新购物车
    Bus.add(BusKey.cart, () => {
      that.getCartCount();
    });
  },
  // 设置当前店铺信息
  _setCurShop: function() {
    const that = this;
    let shopCode = that.data.shopCode;
    let shop = getCityAndShop();
    let hasShop = shop != null && shop.shopCode != null;
    // 判断是否切换门店
    if (hasShop && shop.shopCode != shopCode) {
      const _data = {
        pageNum: 1,
        hasMore: true,
        goodsDatas: {},
        cityCode: shop.cityCode,
        cityName: shop.cityName,
        shopCode: shop.shopCode,
        shopName: shop.shopName,
      };
      that.setData(_data, () => {
        // 和店铺有关接口 刷新数据
        that.getHomeBanner();
        that.getGoodsList();
      });
    }
    return hasShop;
  },

  // 选择门店
  onChangeShop: function () {
    wx.navigateTo({
      url: "/page_sundries/pages/shop/shop",
    });

  },
  // 搜索商品
  onOpenSearch: function (e) {
    let tab = e.detail.tab;
    switch (tab) {
      case "search":
        wx.navigateTo({
          url: "/pages/home/search/search",
        });
        break;
      case "scan":
        break;
      case "cart":
        wx.switchTab({
          url: "/pages/cart/cart",
        });
        break;
      case "vipcode":
        const isLogin = checkLogin();
        if(isLogin) {
          wx.navigateTo({
            url: "/pages/my/vip_code/code",
          });
        }
        break;
    }
  },
  // Banner点击事件
  onClickBanner: function (e) {
    let item = e.currentTarget.dataset.item;
    let jumpUrl = item.jumpUrl||'{}';
    // umpUrl.indexOf("https://") > -1 || jumpUrl.indexOf("http://") > -1
    if (pUrl.indexOf("://") > -1) {
      // h5路径，如果是活动跳转至 /home/activity
      wx.navigateTo({
        url: "/pages/web_page/web?path=" + encodeURIComponent(jumpUrl),
      });
    } else if (jumpUrl.indexOf("appId") > -1) {
      // 其他小程序
      const { appId, path, channel } = JSON.parse(jumpUrl);
      const path3 = channel ? path + "?channel=" + channel : path;
      openMiniApp(appId, path3);
    } else {
      // 小程序页面
      wx.navigateTo({
        url: `/${jumpUrl}`,
        fail: () => {
          wx.showToast({
            icon: "none",
            duration: 3000,
            title: `抱歉, ${jumpUrl}路径未找到！`,
          });
        },
      });
    }
  },
  // 点击金刚位/菜单 item
  onMenuTab: function (e) {
    let item = e.currentTarget.dataset.item;
    let jumpType = item.jumpType;
    switch (jumpType) {
      case 1:
        if(jumpUrl){
          wx.navigateTo({
            url: "/pages/web_page/web?path=" + encodeURIComponent(jumpUrl),
          });
        }
        break;
      case 2:
      case 3:
        Constants.categoryId = item.id;
        Bus.send(BusKey.sort, item.id); // 
        wx.switchTab({ url: "/pages/sort/sort" });
        break;
    }
  },
  // 点击品牌推荐 item
  onClickTab4: function (e) {
    const { brandItem, shopCode } = this.data;
    let path = encodeURIComponent(brandItem.jumpUrl + "?shopCode=" + shopCode);
    wx.navigateTo({
      url: "/pages/web_page/web?path=" + path,
    });
  },
  // 点击切换列表tab
  onGoodsTab: function (e) {
    const that = this;
    let idx = e.currentTarget.dataset.idx;
    let categoryTag = "t" + e.currentTarget.dataset.tag;

    let goodsDatas = that.data.goodsDatas;
    let curTabData = goodsDatas[categoryTag] || Object.create(Tab);
    let goodsList = curTabData.list;

    let categoryId = parseInt(idx);

    const data = {
      categoryId,
      goodsList,
      categoryTag,
      pageNum: curTabData.pageNum,
      hasMore: curTabData.hasMore,
    };
    that.setData(data, () => {
      if (goodsList.length < 1) {
        that.getGoodsList();
      }
    });
  },
  // 商品点击
  onGoodsClick: function(e) {
    let item = e.detail;
    const param = JSON.stringify({
      mode: "home",
      sapSkuNo: item.sapSkuNo,
      shopCode: item.shopCode,
    });
    wx.navigateTo({
      url: "/pages/home/goods_detail/detail?item=" + encodeURIComponent(param),
    });
  },

  // 获取位置店铺
  getLocationShop: async function () {
    let that = this;
    
    const hasShop = that._setCurShop(); // 1.4 需求，如有缓存地址直接显示，不再定位
    if(hasShop) {
      return;
    }

    let res = await Wechat.getLocation();
    let shop = { ...DefShop }; // 默认值
    if (res) {
      let { code, data } = await queryNearestShop(res.latitude, res.longitude);
      if (code == 0) {
        shop = data.data || {};
      }
    }
    that.setData(shop, () => {
      // 和店铺有关接口 刷新数据
      that.getHomeBanner();
      that.getGoodsList();
    });
    setCityAndShop(shop); // 存储定位信息
  },
  // 获取 Banner 数据
  getHomeBanner: async function () {
    const that = this;
    let { cityCode, shopCode } = that.data;
    let { code, data } = await queryMallIndex(shopCode, cityCode);
    if (code == 0) {
      if (data) {
        let bannerList = [];
        let brandItem = {};
        let mallSecurity = [];
        data.forEach((e) => {
          switch (e.floorName) {
            case "index_banner":
              bannerList = e.content;
              break;
            case "mall_security":
              mallSecurity = e.content;
              break;
            case "recommand_brand":
              brandItem = e;
              break;
          }
        });
        that.setData({
          bannerList,
          brandItem,
          mallSecurity,
          // firstIn: false
        });
      }
    }
  },
  // 获取金刚位
  getHomeCategories: async function () {
    let { code, data } = await queryHomeCategories();
    if (code == 0) {
      let categories = [];
      let home = data.content.home;
      let more = data.content.more;
      let category = data.content.category;
      if (home.logo) {
        categories.push(home);
      }
      if (category.length > 0) {
        category = category.filter((e) => e.logo);
        categories = categories.concat(category);
      }
      if (more.logo) {
        more.id = -1;
        categories.push(more);
      }
      this.setData({
        categories,
        firstIn: false,
      });
    }
  },
  // 获取商品分类
  getGoodsTabs: async function () {
    let { code, data } = await queryGoodsTabs();
    if (code == 0) {
      let list = [{ categoryId: -1, categoryName: "爆款推荐" }];
      this.setData({
        tabList: list.concat(data || []),
      });
    }
  },
  // 获取商品数据
  getGoodsList: async function () {
    let that = this;
    let { pageNum, categoryId, shopCode, goodsDatas, categoryTag } = this.data;
    let { code, data } = await queryCommoditys(shopCode, categoryId, pageNum);
    if (code == 0) {
      let hasMore = !data.isLastPage;
      let goodsList = that.data.goodsList;
      let gList = data.list || [];
      gList.forEach((e) => {
        e.commodityImageUrl = splitGoodsUrl(e.commodityImageUrl);
      });
      // 获取对应tab数据
      let curTabData = goodsDatas[categoryTag] || Object.create(Tab);
      if (pageNum > 1) {
        goodsList = goodsList.concat(gList);
      } else {
        goodsList = gList;
      }
      pageNum += 1;
      curTabData.list = goodsList;
      curTabData.pageNum = pageNum;
      curTabData.hasMore = hasMore;
      goodsDatas[categoryTag] = curTabData; // 刷新对应tab数据

      that.setData({
        hasMore,
        goodsList,
        pageNum,
        goodsDatas,
        firstIn: false,
      });
    } else {
      that.setData({
        firstIn: false,
      });
    }
  },
  // 获取购物车数量 - 不应该根据shopCode
  getCartCount: async function () {
    const that = this;
    let { isLogin, shopCode } = that.data;
    if (isLogin) {
      const { code, data } = await queryCartCount({ shopCode });
      if (code == 0 && data.data) {
        that.setData({ cartNum: data.data });
      }
    }else {
      that.setData({ cartNum: 0 });
    }
  },
});
