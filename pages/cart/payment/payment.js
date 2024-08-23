/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 订单支付
 */

import { queryAddressList } from "../../../modules/api/address";
import Bus, { BusKey } from "../../../modules/event/index";
import {
  checkLogin,
  getAccountInfo,
  getCityAndShop,
} from "../../../modules/store/index";
import { formatAddressItem } from "../../../utils/address";
import { formatPayCost } from "../../../utils/goods";

Page({
  data: {
    options: {},
    adsCanUse: true, // 地址是否能用
    customerId: 0, //
    cityCode: 0, //
    fromType: "", // 支付来源 购物车，商品详情
    address: { // 地址信息
      id: 0,
      phone: "",
      userName: "",
      address: "请新建或选择地址",
    },
    dateInfo: {
      urgent: false,
      date: "",
    },
    orderData: {}, // 预支付，参数
    goodsList: [], // 提交数据
    dateList: [], // 
    costList: [
      { label: "商品金额", unit: "¥", value: 0 },
      { label: "运费", unit: "¥", value: 0 },
      { label: "优惠券", tag: "券", mode: 'hint', value: '暂无可用优惠券' },
      { label: "促销立减", tag: "减", mode: 'hint', value: '暂无可用' },
    ],
  },

  onLoad: function (options) {
    if (options && options.param) {
      this.data.options = JSON.parse(decodeURIComponent(options.param));
    }
  },

  onReady: function () {
    const that = this;
    that._initEvent();
    that._initData(that.data.options);
  },

  onShow: function () {},

  onUnload: function () {
    Bus.remove({ key: BusKey.address_choose });
  },

  onShareAppMessage: function () {},

  _initData: function (options) {
    const that = this;
    const user = getAccountInfo();
    if (user && user.userId) {
      let _data = {
        customerId: user.customerId,
      };
      if (options.goodsList) {
        _data.goodsList = options.goodsList;
      }

      if (options.adsId) {
        const address = that.data.address;
        address.id = options.adsId;
        _data.address = address;
      }

      if (options.orderData) {
        _data.orderData = options.orderData;
        // _data.costList = formatPayCost(_data.orderData);
      }

      if (options.cityCode) {
        _data.cityCode = options.cityCode;
      } else {
        const city = getCityAndShop();
        _data.cityCode = city.cityCode;
      }
      console.log(_data)
      that.setData(_data, () => {
        that._getAddressList();
      });
    } else {
      checkLogin();
      // 登录监听
      Bus.single(BusKey.login,
        (info) => {
          that.onReady();
        }, "payment");
    }
  },

  _initEvent: function () {
    const that = this;
    // 切换地址监听
    Bus.add(BusKey.address_choose, (info) => {
      that._setAddress(info);
    });
  },

  _setAddress: function (info) {
    const that = this;
    const address = `${info.shortAddress || info.shortRemarkAddress} ${info.remarkAddress}`
    let _data = {
      address: {
        id: info.id||0,
        phone: info.phone,
        userName: info.userName,
        address
      },
    };
    that.setData(_data);
  },

  // 选择收货地址
  onChooseAddress: function () {
    wx.navigateTo({
      url: "/page_minor/pages/address/address?mode=1",
    });
  },
  // 选择配送时间
  onChooseDate: function () {},
  // 查看商品明细
  onLookGoods: function () {
    wx.navigateTo({
      url: "/pages/cart/inventory/inventory",
    });
  },

  // 获取地址列表
  _getAddressList: async function () {
    const that = this;
    const { cityCode, customerId, address } = that.data;

    const { code, data } = await queryAddressList(customerId, cityCode);
    if (code == 0 && data.data) {
      const aid = address.id;
      let _item = null;
      data.data.forEach(e => {
        if(aid != 0) {
          if(e.id == aid) {
            _item = e;
          }
        }else if(e.isDefault == 1) {
          _item = e;
        }
      });

      if(_item) {
        _item = formatAddressItem(_item);
        that._setAddress(_item)
      }
    }
  },
  _orderSettlt: async function () {},
});
