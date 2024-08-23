/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 商品详情
 * 目前商品shopCode是根据首页门店，而不是更加商品shopCode
 */
import {
  queryByItemSkuId,
  querySKMapperContent,
  queryByDistance,
  queryBySapskuAndShopcode,
  queryBrandDetail,
  queryBrandSkuList,
  doPromotionActivityEngine,
  queryGoodsDetail,
  searchGoodsList,
  queryShopStatus,
} from "../../../modules/api/goods";
import {
  queryCartCount,
  commitOrder,
  addItemToCart,
} from "../../../modules/api/order";
import Bus, { BusKey } from "../../../modules/event/index";
import { checkLogin, getCityAndShop } from "../../../modules/store/index";
import {
  parseDetailGoodsInfo,
  getBrandList,
  splitGoodsUrl,
} from "../../../utils/goods";

Page({
  data: {
    showDialog: 0, // 1选择类型，2查看门店在售状态，3商品信息
    paramObj: {}, // 传参
    curPage: 1,
    hasMore: true,
    loading: false,
    firstIn: true,

    canSale: true,
    isLogin: false,
    isCustom: 0,
    customRelaSku: {}, // 线上预约数据
    saleNum: 0, // 销售数量
    spuCode: "",
    goodsDetail: {}, // 商品详情全量数据
    goodsInfo: {}, // 商品数据
    stateStr: "上架",
    skuList: [], // 商品sku
    defaultSku: "",
    selectedSkuId: 0,
    saleProperty: "",
    basicPropertyList: [], // 商品详情数据

    cartNum: 0,
    brandInfo: {}, // 品牌数据
    goodsShopCode: "", // 商品的门店code
    cityCode: "", // 当前的城市code
    shopCode: "", // 当前选择的门店code
    deliveryAddress: "", // 当前选择的地址
    consultant: {
      // 在线客服数据
      pic: "",
      url: "",
    },
    swiperInfo: {
      // 轮播图数据
      video: "",
      vr: "",
      vrImg: "",
      imgs: [],
    },
    goodsList: [], // 推荐商品
  },

  onLoad: function (options) {
    const that = this;
    let paramObj = {};
    if (options.item) {
      paramObj = JSON.parse(decodeURIComponent(options.item));
    }
    // console.log(paramObj);
    that.data.paramObj = paramObj;
    that._paramsObj(paramObj);
  },

  _paramsObj: function (param) {
    const that = this;
    if (param.mode == "list" || param.mode == "cart") {
      // 购物车及searchList接口商品
      that.getDetailById(param);
    } else if (param.scene) {
      // 分享
      let scene = param.scene;
      const itemId = scene.itemId;
      that.getDetailById({ itemId: itemId, skuId: param.skuId });
    } else if (param.itemSkuId) {
      // 不知道什么逻辑
      that.getDetailBySkuId(param);
    } else if (param.mode == "home") {
      // 首页
      that.getDetailBySapsku(param); // 带有shopCode
    }
  },

  onReady: function () {
    const that = this;
    that.getShopStatus();
  },

  onShow: function () {
    const that = this;
    let isLogin = checkLogin(1);
    // 判断是否切换门店
    const _data = this._updateCity();
    _data.isLogin = isLogin;

    that.setData(_data,() => {
      that.getCartCount();
    });
  },

  onReachBottom: function () {
    let that = this;
    if (that.data.hasMore && !that.data.loading) {
      that._searchHotGoods();
    }
  },

  onShareAppMessage: function () {},

  // 更新城市信息
  _updateCity: function() {
    const that = this;
    let shop = getCityAndShop();
    const _data = {
    };
    // 判断是否切换门店
    if (shop && shop.shopCode != that.data.shopCode) {
      _data.shopCode = shop.shopCode;
      _data.cityCode = shop.cityCode;
      _data.deliveryAddress = shop.address;
    }
    return _data;
  },

  onLookShopState: function () {},

  // 切换地址
  gotoChooseAds: function () {
    const that = this;
    const detail = that.data.goodsInfo;
    // Bus.single(BusKey.city, (shop) => {
    //   // 判断是否切换门店
    // }, 'goods_detail');
    wx.navigateTo({
      url: "/page_minor/pages/location/location?sap=" + detail.sapSkuNo,
    });
  },
  // 品牌详情页
  gotoShop: function () {
    const brand = this.data.goodsInfo;
    wx.navigateTo({
      url: `/page_sundries/pages/brand/brand?code=${brand.brandCode}&title=${brand.brandName}`,
    });
  },
  // 选择类型
  onChooseType: function (e) {
    const that = this;
    that.setData({
      showDialog: 0,
    });
  },
  // 显示弹窗
  onShowDialog: function (e) {
    const that = this;
    const showDialog = parseInt(e.currentTarget.dataset.tag);
    that.setData({
      showDialog,
    });
  },
  // 解析商品数据
  _parseDetail: function (detail) {
    const that = this;
    const _data = parseDetailGoodsInfo(detail);

    that.setData(_data, () => {
      that.getByDistance();
      that.getBrandInfo(_data.goodsInfo.brandCode, _data.goodsShopCode);
      that._searchHotGoods();
    });
  },
  // 为您推荐 商品点击
  onGoodsListClick: function (e) {
    let item = e.detail;
    const param = JSON.stringify({
      mode: "list",
      itemId: item.id || item.itemId,
      skuId: item.skuId,
      shopCode: item.shopCode,
    });
    wx.navigateTo({
      url: "/pages/home/goods_detail/detail?item=" + encodeURIComponent(param),
    });
  },

  /**  */

  // 获取详情 1
  getDetailById: async function (param) {
    const that = this;
    const { code, data } = await queryGoodsDetail(param);
    if (code == 0) {
      that._parseDetail(data.data);
    }
    that.setData({ firstIn: false });
  },
  // 获取详情 2
  getDetailBySkuId: async function (param) {
    const that = this;
    const { code, data } = await queryByItemSkuId(param);
    if (code == 0) {
      that._parseDetail(data.data);
    }
    that.setData({ firstIn: false });
  },
  // 获取详情 3
  getDetailBySapsku: async function (param) {
    const that = this;
    const { code, data } = await queryBySapskuAndShopcode(param);
    if (code == 0) {
      that._parseDetail(data.data);
    }
    that.setData({ firstIn: false });
  },
  // 品牌想起
  getBrandInfo: async function (brandCode, shopCode) {
    const that = this;
    that.getBrandSkuList(brandCode, shopCode);
    const { code, data } = await queryBrandDetail(shopCode, brandCode);
    if (code == 0) {
    }
  },
  // 品牌商品
  getBrandSkuList: async function (brandCode, shopCode) {
    const { code, data } = await queryBrandSkuList(shopCode, brandCode);
    if (code == 0) {
      // brandLabel: brandLabelStr: "品牌授权" brandUrl: id: name: saleNumItemDtos: totalNum:
      let brandInfo = data.data;
      let list = brandInfo.saleNumItemDtos || [];
      brandInfo.show = list.length > 9;
      brandInfo.saleNumItemDtos = getBrandList(list);
      delete brandInfo.timeItemDtos;
      this.setData({ brandInfo });
    }
  },
  // 获取购物车数量
  getCartCount: async function () {
    const that = this;
    let { isLogin, shopCode } = that.data;
    if (isLogin) {
      const { code, data } = await queryCartCount({ shopCode });
      if (code == 0) {
        that.setData({ cartNum: data.data });
      }
    }
  },
  // 是否支持配送
  getByDistance: async function () {
    const that = this;
    let { spuCode, cityCode } = that.data;
    const { code, data } = await queryByDistance({ cityCode, spuCode });
    if (code == 0) {
      let canSale = data.data.itemInfo != null;
      that.setData({ canSale });
    }
  },
  // 获取推荐列表
  _searchHotGoods: async function () {
    const that = this;
    const { shopCode, curPage, goodsInfo } = that.data;
    const param = {
      curPage,
      shopCode,
      sort: 1,
      pageSize: 20,
      keyword: "",
      categoryId: goodsInfo.mainCategoryId,
    };
    const { code, data } = await searchGoodsList(param);
    const _data = {
      loading: false,
    };
    if (code == 0) {
      const list = (data.data || {}).seItemList || [];
      list.forEach((e) => {
        e.commodityName = e.itemName;
        e.commodityImageUrl = splitGoodsUrl(e.listImg);
        e.latestPrice = parseFloat(e.salePriceStr?.replace("¥", ""));
      });
      let goodsList = [].concat(that.data.goodsList);
      if (curPage > 1) {
        goodsList.push(...list);
      } else {
        goodsList = list;
      }
      _data.curPage = curPage + 1;
      _data.hasMore = data.page.totalPage > curPage;
      _data.goodsList = goodsList;
    }
    that.setData(_data);
  },
  // 获取店铺在售状态
  getShopStatus: async function () {
    const { code, data } = await queryShopStatus();
  },
});
