/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 购物车
 */
import { searchGoodsList } from "../../modules/api/goods";
import {
  queryCartItemList,
  orderSettle,
  onDelCart,
  onChangeCart,
  changeTypeToCart,
  queryAcquiringCoupons,
} from "../../modules/api/order";
import Bus, { BusKey } from "../../modules/event/index";
import {
  checkLogin,
  getAccountInfo,
  getCityAndShop,
} from "../../modules/store/index";
import {
  goodsEnable,
  goodsIsCheck,
  splitGoodsUrl,
  orderSetParam,
  acquirCouponsParam,
  cartDialogParam,
  setPaymentParam
} from "../../utils/goods";
import { getSpecialShopType } from "../../utils/shop";

let lastTime = 0; // 防重
// 默认值
const DefShop = {
  cityCode: "310100",
  cityName: "上海市",
  shopCode: "1004",
  shopName: "上海龙阳店",
};

Page({
  data: {
    isLogin: false, //
    firstIn: true, // 页面加载完成
    loading: false, // 加载中
    phone: "",
    curPage: 1,
    hasMore: true, // 是否用更多商品
    editMode: false, //编辑模式
    chooseAll: false,

    address: "请选择地址", // 当前城市
    addressId: 0, // 收货地址 id
    cityCode: 0, // 当前城市 code
    shopCode: "", // 当前门店的shopCode

    curChooseShop: "", // 当前选择的门店

    hasSettle: true, // 是否需要调预结算，
    payCount: 0, // 选购商品数量
    costMoney: 0, // 应付 
    totalAmount: 0, // 总金额
    promotionAmount: 0, // 优惠金额
    couponAmount: 0, // 返券金额

    showDialog: 0, // 0不显示，1显示优惠明细2显示更多促销3换规格4编辑数量
    goodsCount: 1, // 商品数量
    dialogItem: {}, // 购物车弹窗 的缓存数据
    activityList: [], // 弹窗对应的促销数据
    inputModel: false, // 商品数目编辑弹窗
    cartList: [], // 购物车商品
    goodsList: [], // 推荐商品
  },

  onLoad: function (options) {},

  onReady: function () {
    const that = this;
    that._initData();
    that._initEvents();
  },
  onShow: function () {},
  onHide: function () {
    // 购物车同步数据
  },

  onPullDownRefresh: function () {
    let that = this;
    if (that.data.isLogin) {
      that.getCartList();
    }
    wx.stopPullDownRefresh();
  },

  onReachBottom: function () {
    let that = this;
    if (that.data.hasMore && !that.data.loading) {
      that._searchHotGoods();
    }
  },

  // 初始化数据
  _initData: function () {
    const that = this;
    let user = getAccountInfo();
    if (user.phone) {
      const _data = {
        isLogin: true,
        phone: user.phone,
      };
      that.setData(_data, that._setCurShop);
      // that.getCartList();
    } else {
      that._setCurShop();
    }
  },
  // 初始化事件
  _initEvents: function () {
    const that = this;
    // 登录
    Bus.add(BusKey.login, (info) => {
      let isLogin = info.userId != null;
      let _data = { isLogin };
      if (!isLogin) {
        // 清除数据
        _data.phone = "";
        _data.cartList = [];
        _data.costMoney = 0;
        _data.promotionAmount = 0;
        _data.payCount = 0;
      } else {
        _data.phone = info.phone;
      }
      that.setData(_data, () => {
        if (isLogin) {
          that.getCartList();
        }
      });
    });
    // 修改城市
    Bus.add(BusKey.shop_city, (city) => {
      that._setCurShop(city);
    });
  },

  // 设置当前店铺信息
  _setCurShop: function (city) {
    const that = this;
    let shopCode = that.data.shopCode;
    let _data = null;
    let updateGoods = true;

    if (!city) {
      city = getCityAndShop();
    }
    // 判断是否切换门店
    if (city) {
      _data = {
        address: city.address,
        cityCode: city.cityCode,
        shopCode: city.shopCode,
        addressId: city.id||0,
      };
      // 切换店铺 需要更新 推荐商品
      updateGoods = city.shopCode != shopCode;
      if (updateGoods) {
        _data.curPage = 1;
        _data.hasMore = true;
        _data.goodsList = [];
      }
    } else {
      _data = {
        address: DefShop.cityName,
        cityCode: DefShop.cityCode,
        shopCode: DefShop.shopCode,
      };
    }

    that.setData(_data, () => {
      if (updateGoods) {
        if (that.data.isLogin) {
          that.getCartList();
        }
        that._searchHotGoods();
      }
    });
  },

  // 跳转商品列表页
  _gotoGoodsList: function (promotion) {
    delete promotion.rewards;
    promotion = encodeURIComponent(JSON.stringify(promotion));
    wx.navigateTo({
      url: "/pages/sort/goods/goods?title=促销商品&promotion=" + promotion,
    });
  },
  // 选中/取消 删除商品
  _checkDelGoods: function (item) {
    const that = this;
    let cartList = [].concat(that.data.cartList);
    let shop = cartList[item.idx];
    if (item.index != null) {
      let goods = shop.cartItemVOS[item.index];
      goods.edit = !goods.edit;
      let glist = shop.cartItemVOS.filter((e) => e.edit);
      shop.edit = glist.length == shop.cartItemVOS.length;
    } else {
      shop.edit = !shop.edit;
      shop.cartItemVOS.forEach((e) => {
        e.edit = shop.edit;
      });
    }
    that.setData({ cartList });
  },
  // 商品选择逻辑
  _checkChooseGoods: function (item, lastList = []) {
    const that = this;
    let cartList = [].concat(that.data.cartList);
    let shop = cartList[item.idx];
    if (item.index != null) {
      let goods = shop.cartItemVOS[item.index];
      goods.isSelected = goods.isSelected == 1 ? 0 : 1;
      let glist = shop.cartItemVOS.filter((e) => e.isSelected == 1);
      shop.isSelected = glist.length == shop.cartItemVOS.length ? 1 : 0;
    } else {
      shop.isSelected = shop.isSelected == 1 ? 0 : 1;
      shop.cartItemVOS.forEach((e) => {
        e.isSelected = shop.isSelected;
      });
    }
    // that.setData({cartList});
    that._changeCartGoods(lastList.concat(shop.cartItemVOS));
  },

  // 切换城市
  onChangeCity: function () {
    wx.navigateTo({
      url: "/page_minor/pages/location/location",
    });
  },
  // 编辑购物车
  onEditCart: function () {
    const that = this;
    that.setData({
      showDialog: 0,
      editMode: !that.data.editMode,
    });
  },
  // 选中/取消 店铺/商品
  onCheckShopOrGoods: function (e) {
    const that = this;
    const isEdit = that.data.editMode;
    const data = e.currentTarget.dataset;

    if (isEdit) {
      that._checkDelGoods(data);
    } else {
      let cartList = that.data.cartList;
      let curChooseShop = that.data.curChooseShop;
      let shop = cartList[data.idx];

      if (curChooseShop && shop.shopCode != curChooseShop) {
        wx.showModal({
          title: "温馨提示",
          content: "暂不支持跨店合并下单，是否继续选择当前商品？",
          success: (res) => {
            if (res.confirm) {
              let lastList = []; // 上次选择的商品
              cartList.forEach((e) => {
                e.isSelected = 0;
                let vos = e.cartItemVOS;
                vos.forEach((g) => {
                  if (g.isSelected == 1) {
                    lastList.push(g);
                  }
                  g.isSelected = 0;
                });
              });
              that._checkChooseGoods(data, lastList);
            }
          },
        });
      } else {
        that._checkChooseGoods(data);
      }
    }
  },

  // 去凑单
  onTapAddItem: function (e) {
    let promotion = e.currentTarget.dataset.item;
    this._gotoGoodsList(promotion);
  },

  // 购物车 点击商品
  onClickGoods: function (e) {
    const item = e.currentTarget.dataset.item;
    const param = JSON.stringify({
      mode: "cart",
      itemId: item.itemId,
      skuId: item.skuId,
      shopCode: item.shopCode,
    });
    wx.navigateTo({
      url: "/pages/home/goods_detail/detail?item=" + encodeURIComponent(param),
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
  // 输入商品数量 回调
  onInputCount: function(e) {
    const that = this;
    const detail = e.detail;
    const _data = {
      showDialog: 0,
    }
    if(detail.state) {
      const {idx, index} = that.data.dialogItem;
      let cartList = that.data.cartList;
      let list = cartList[idx].cartItemVOS;
      list[index].quantity = detail.count; // 修改数量
      _data.cartList = [].concat(cartList);
      that._changeCartGoods(list);
    }
    that.setData(_data);
  },
  // 输入商品数量
  onTapCount: function (e) {
    let that = this;
    let dataset = e.currentTarget.dataset;
    let num = parseInt(dataset.num);
    let idx = parseInt(dataset.idx);
    let index = parseInt(dataset.index);
    let dialogItem = {idx, index};
    that.setData({
      dialogItem,
      goodsCount: num,
      showDialog: 4,
    });
  },
  // 修改商品数量
  onChangeGoodsNum: function (e) {
    const that = this;
    let cartList = that.data.cartList;
    let dataset = e.currentTarget.dataset;
    let num = parseInt(dataset.tag);
    let idx = parseInt(dataset.idx);
    let index = parseInt(dataset.index);

    let list = cartList[idx].cartItemVOS;
    let count = list[index].quantity;
    if (
      (count > 1 && count < 9999) ||
      (num > 0 && count <= 1) ||
      (num < 1 && count >= 9999)
    ) {
      list[index].quantity += num; // 修改数量
      that.setData({ cartList: [].concat(cartList) });
      that._changeCartGoods(list);
    } else if (num > 0 && count >= 9999) {
      wx.showToast({ title: "商品数量不能多于9999", icon: "none" });
    } else if (num < 0 && count <= 1) {
      wx.showToast({ title: "商品数量不能再少", icon: "none" });
    }
  },

  // 删除商品
  onDeleteGoods: function (e) {
    const that = this;
    let dataset = e.currentTarget.dataset;
    let gid = parseInt(dataset.gid);
    let choose = parseInt(dataset.choose);
    that.data.hasSettle = choose == 1;
    that._delCartGoods([gid]);
  },
  // 登录/去商城 点击
  onEmptyClick: function () {
    let isLogin = this.data.isLogin;
    if (isLogin) {
      wx.switchTab({
        url: "/pages/home/home",
      });
    } else {
      checkLogin();
    }
  },
  // 全选
  onCheckAll: function () {
    const that = this;
    let chooseAll = !that.data.chooseAll;
    let cartList = [].concat(that.data.cartList);
    cartList.forEach((e) => {
      e.edit = chooseAll;
      e.cartItemVOS.forEach((g) => {
        g.edit = chooseAll;
      });
    });
    that.setData({
      chooseAll,
      cartList,
    });
  },
  // 删除/结算
  onDeleteOrCommit: function () {
    const that = this;
    if (that.data.editMode) {
      let cartList = that.data.cartList;
      let goodsIds = [];
      let hasSettle = 0;
      cartList.forEach((e) => {
        e.cartItemVOS.forEach((g) => {
          if (g.edit) {
            hasSettle += g.isSelected == 1 ? 1 : 0;
            goodsIds.push(g.id);
          }
        });
      });
      that.data.hasSettle = hasSettle > 0;
      that._delCartGoods(goodsIds);
    } else {
      that.onSettleGoods(true);
    }
  },
  // 显示 切换类型/更多促销/优惠明细 弹窗
  onShowDialog: function (e) {
    let that = this;
    let dataset = e.currentTarget.dataset;
    let dialogItem = dataset.item || {};
    let showDialog = parseInt(dataset.tag);
    let activityList = [];
    if (showDialog != 1) {
      if (showDialog == 2) {
        activityList = dialogItem.cartActivityVOList || [];
      }
      dialogItem = cartDialogParam(dialogItem);
    }else {
      const {promotionAmount, totalAmount, couponAmount, costMoney} = that.data;
      dialogItem = {
        promotionAmount,
        couponAmount,
        totalAmount,
        costMoney
      }
      showDialog = that.data.showDialog > 0 ? 0 : 1;
    }
    
    that.setData({
      dialogItem,
      showDialog,
      activityList,
    });
  },
  // 关闭弹窗
  _hintDialog() {
    this.setData({
      showDialog: 0,
    });
  },
  // 选择商品类型
  onChooseType: function(e) {
    const that = this;
    that._hintDialog();
  },
  // 查看 更多优惠 列表
  onMoreCoupon: function(e) {
    const that = this;
    that._hintDialog();
    const detail = e.detail;
    if(detail.status) {
      that._gotoGoodsList(detail.data);
    }
  },

  // 购物车 商品滑动删除监听
  onScrollChange: function (e) {
    const left = e.detail.scrollLeft; // 滑动到一半即全部滑出
  },
  // 购物车 商品滑动结束
  onScrollEnd: function () {
    // 滑动结束
  },

  // 获取购物车商品
  getCartList: async function () {
    const that = this;
    let hasSettle = that.data.hasSettle;
    const cityCode = that.data.cityCode;
    const { code, data } = await queryCartItemList(cityCode);
    if (code == 0) {
      const dataList = (data.data || []).filter(
        (e) => (e.cartItemVOS || []).length > 0
      );
      let payCount = 0;
      let curChooseShop = "";

      // 当前城市的排到前面
      let cartList = dataList.filter((e) => e.distributeAddress == 1);
      let filter = dataList.filter((e) => e.distributeAddress != 1);
      cartList = cartList.concat(filter);

      cartList.forEach((e) => {
        const vos = e.cartItemVOS;

        const list = vos.filter((v1) => goodsIsCheck(v1, e.distributeAddress)); // 已选的商品
        const list2 = vos.filter((v2) => goodsEnable(v2, e.distributeAddress)); // 可选的商品
        let size1 = list.length;
        payCount += size1;
        // 同城及数量满足才全选
        e.edit = false; // 编辑模式选中与否
        e.isSelected = size1 > 0 && size1 == list2.length ? 1 : 0;
        if (size1 > 0) {
          curChooseShop = e.shopCode;
        }
        // 处理数据
        vos.forEach((g) => {
          g.edit = false; // 编辑模式选中与否
          g.itemUrl = splitGoodsUrl(g.itemUrl);
          g.isSelected = goodsIsCheck(g, e.distributeAddress) ? 1 : 0; // 是否选中
          g.opacity = goodsEnable(g, e.distributeAddress); // 是否置灰

          if (g.skuPropValues && g.skuPropValues.length > 0) {
            g.specification = g.skuPropValues
              .map((d) => d.propName + ": " + d.valueText)
              .join(";");
            delete g.skuPropValues;
          }
          if (g.cartActivityVOList && g.cartActivityVOList.length > 0) {
            let acts = g.cartActivityVOList.filter(
              (e) => e.optimalActivity == 1
            );
            g.promotion = acts.length > 0 ? acts[0] : g.cartActivityVOList[0];
          }
        });
      });
      let _data = {
        firstIn: false,
        editMode: false,
        inputModel: false,
        hasSettle: true,
        cartList,
        payCount,
        curChooseShop,
      };
      if (payCount == 0) {
        _data.promotionAmount = 0;
        _data.costMoney = 0;
        _data.couponAmount = 0;
      }
      that.setData(_data, () => {
        if (hasSettle && payCount > 0) {
          that.onSettleGoods();
        }
      });
    } else {
      that.setData({
        firstIn: false,
      });
    }
  },
  // 获取结算商品参数
  onSettleGoods: function (commit) {
    const that = this;
    let cartList = that.data.cartList;

    if (Date.now() - lastTime < 1200) {
      return;
    }
    lastTime = Date.now();

    let goodsList = [];
    let goodsIds = [];
    // 目前只支持 单店购买，下面逻辑为适配多店购买
    cartList.forEach((e) => {
      const glist = e.cartItemVOS || [];
      const sList = glist.filter((g) => goodsIsCheck(g, e.distributeAddress));
      if (sList.length > 0) {
        goodsList = sList;
      }
    });

    // 判断
    if (goodsList.length < 1) {
      if (commit) {
        wx.showToast({
          title: "您还没有选择商品哦!",
          icon: "none",
        });
      }
      return;
    }
    // 格式化参数
    goodsList = goodsList.map((item) => {
      goodsIds.push(item.id);
      return orderSetParam(item);
    });
    that._commitOrder(goodsList, goodsIds, commit);
  },
  // 提交/结算订单
  _commitOrder: async function (orderItemList, cartItemIds, commit) {
    const that = this;
    const phone = that.data.phone;
    const shopCode = that.data.curChooseShop;
    const specialShop = getSpecialShopType(shopCode);
    const params = {
      shopCode,
      cartItemIds,
      orderItemList,
      customerMobile: phone,
      receiverDistrictCode: "",
      channelType: specialShop ? specialShop.channelType : 4,
    };
    if (specialShop && specialShop.channelCode) {
      params.channelCode = specialShop.channelCode;
    }
    const { code, data } = await orderSettle(params);
    if (code == 0) {
      const order = data.data;
      let costMoney = Math.round(parseFloat(order.totalAmount) * 100 - parseFloat(order.promotionDiscount) * 100) / 100;
      if (costMoney < 0) {
        costMoney = 0;
      }
      that.setData({
        costMoney,
        showDialog: 0,
        totalAmount: order.totalAmount,
        promotionAmount: order.promotionDiscount,
      });

      if (commit) {
        const adsId = that.data.addressId;
        const cityCode = that.data.cityCode;
        const paramsStr = setPaymentParam(adsId, cityCode, shopCode, orderItemList, order, "card");
        wx.navigateTo({
          url: `/pages/cart/payment/payment?param=${paramsStr}`,
        });
      }
    }
  },
  // 修改商品
  _changeCartGoods: async function (list) {
    const that = this;
    let editList = [];
    list.forEach((e) => {
      if (e.state == 1) {
        editList.push({
          id: e.id,
          isSelected: e.isSelected,
          quantity: e.quantity,
          productType: e.productType,
        });
      }
    });

    const { code, data } = await onChangeCart(editList);
    if (code == 0) {
      that.getCartList();
    }
  },
  // 修改商品规格
  _changeGoodsType: async function () {
    let hasSettle = false;
    const { code, data } = await changeTypeToCart();
    if (code == 0) {
      this.getCartList();
    }
  },
  // 删除商品
  _delCartGoods: async function (ids) {
    const { code, data } = await onDelCart(ids);
    if (code == 0) {
      this.getCartList();
    }
  },
  // 获取折扣金额
  getAcquiringCoupons: async function (order, shopCode, phone) {
    const that = this;
    const goodsss = [];
    order.sendTypeItemList.forEach((e) => {
      e.orderItemList.forEach((item) => {
        if (item.tradeProductType !== "measure") {
          goodsss.push(acquirCouponsParam(item));
        }
      });
    });
    const res = await queryAcquiringCoupons(shopCode, phone, goodsss);
    if (res.code == 0) {
      let coupon = 0;
      if (res.data && res.data.data) {
        const ds = res.data.data.data || [];
        ds.forEach((e) => {
          coupon += e.couponAmt * 100;
        });
        that.setState({
          couponAmount: coupon / 100,
        });
      }
    }
  },
  // 获取商品列表
  _searchHotGoods: async function () {
    let that = this;
    that.data.loading = true;
    let { curPage, shopCode, isLogin } = that.data;

    let { code, data } = await searchGoodsList({
      shopCode,
      curPage,
      pageSize: 20,
      sort: 1,
    });
    let _data = {
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
      that.data.hasMore = data.page.totalPage > curPage;
      that.data.curPage += 1;
      _data.goodsList = goodsList;
    }
    if (!isLogin) {
      _data.firstIn = false;
    }
    that.setData(_data);
  },
});
