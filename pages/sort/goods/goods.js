/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 商铺列表/促销商品
 * sort 0综合（默认）1销量 2价格倒叙
 * priceStatus 1默认 4降序 3升序
 */
import { searchGoodsList } from "../../../modules/api/goods";
import { getCityAndShop } from "../../../modules/store/index";
import { splitGoodsUrl } from "../../../utils/goods";

Page({
  data: {
    title: "百安居商城",
    firstIn: true, // 是否第一次加载
    showFilter: false,
    filter: 0,
    keyword: "", // 关键字
    saleCategoryId: "", // 选择的分类 id
    salePriceStart: "", // 最低价
    salePriceEnd: "", // 最高价
    shopCode: "1004",
    sort: "0", // 排序
    promId: "", // 促销 id
    curPage: 1,
    hasMore: true,
    isLoading: false, // 是否加载完成
    brandIds: [], // 选择的品牌
    brandList: [], // 品牌
    categoryIds: [], // 选择的分类
    categoryList: [], // 分类
    goodsList: [], // 商品
    goodsCount: 0, // 商品总数
    promotion: {},
    defParma: {},
  },

  onLoad: function (options) {
    const that = this;
    if (options) {
      that._parseOption(options);
    }
  },

  // 解析传参
  _parseOption: function (options) {
    const that = this;
    const shop = getCityAndShop();
    const _data = {};
    if (shop.shopCode) {
      _data.shopCode = shop.shopCode;
    }
    if (options.title) {
      _data.title = options.title;
    }
    if (options.search) {
      _data.keyword = options.search;
    }
    if (options.promotion) {
      _data.promotion = JSON.parse(decodeURIComponent(options.promotion));
      _data.promId = _data.promotion.activityId;
    }
    if (options.categoryid) {
      _data.saleCategoryId = options.categoryid||'';
    }
    console.log(_data)
    that.setData(_data, that.getGoodsList);
  },

  onShow: function () {
    // 获取搜索关键字
  },

  onPullDownRefresh: function () {
    const that = this;
    that.setData(
      {
        curPage: 1,
        hasMore: true,
      },
      that.getGoodsList
    );
    wx.stopPullDownRefresh();
  },

  onReachBottom: function () {
    const that = this;
    if (that.data.hasMore && !that.data.isLoading) {
      that.getGoodsList();
    }
  },

  onShareAppMessage: function () {},

  // 筛选栏
  onChangeFilter: function (e) {
    const that = this;
    let list = e.detail.list;
    that.setData({
      sort: `${list[0]}`,
      showFilter: list[3] == 1,
    }, that.onPullDownRefresh);

  },
  // 筛选pop回调
  onChangePop: function (e) {
    let _data = {};
    if (e.detail && e.detail.brandList) {
      _data = e.detail;
      _data.defParma = { start: _data.salePriceStart, end: _data.salePriceEnd };
    } else {
      _data.filter = 0;
    }
    _data.showFilter = false;
    this.setData(_data);
  },
  // 搜索
  gotoSearch: function () {
    wx.navigateTo({
      url: "/pages/home/search/search?mode=goods",
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
    console.log(item);
    wx.navigateTo({
      url: "/pages/home/goods_detail/detail?item=" + encodeURIComponent(param),
    });
  },

  // 搜索商品
  getGoodsList: async function () {
    const that = this;
    const {
      saleCategoryId,
      salePriceStart,
      salePriceEnd,
      shopCode,
      keyword,
      sort,
      promId,
      curPage,
      brandIds,
    } = that.data;

    //接口参数
    const params = {
      saleCategoryId,
      salePriceStart,
      salePriceEnd,
      shopCode,
      keyword,
      sort,
      promId,
      curPage,
      pageSize: 20,
      brandIds: brandIds.toString(),
    };
    that.data.isLoading = true;
    let { code, data } = await searchGoodsList(params);
    if (code == 0) {
      let goodsList = that.data.goodsList;
      let dataInfo = data.data || {};

      let hasMore = data.page?.nextPage > curPage; //
      // 品牌
      let brandList = (dataInfo.brandList || []).map((e) => {
        return { id: e.id, brandCode: e.brandCode, brandName: e.brandName };
      });
      // 分类
      let categoryList = (dataInfo.saleCategoryList || []).map((e) => {
        return { id: e.id, parentId: e.parentId, categoryName: e.categoryName };
      });
      // 商品
      let list = dataInfo.seItemList || [];
      list.forEach((e) => {
        delete e.skuDtoList;
        delete e.promotions;
        e.commodityName = e.itemName;
        e.commodityImageUrl = splitGoodsUrl(e.listImg);
        e.latestPrice = parseFloat(e.salePriceStr);
      });
      goodsList = curPage > 1 ? goodsList.concat(list) : list;
      that.setData({
        hasMore,
        goodsList,
        brandList,
        categoryList,
        firstIn: false,
        goodsCount: data.page?.totalNum,
        curPage: curPage + 1,
      });
    }else {
      that.setData({
        firstIn: false
      });
    }
    that.data.isLoading = false;
  },
});
