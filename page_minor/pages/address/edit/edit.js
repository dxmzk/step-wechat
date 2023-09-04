/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 编辑收货地址
 */
import {
  queryHotAddress,
  addOrUpdateAddress,
  deleteAddress,
  checkPhoneIsEmpty,
} from "../../../../modules/api/address";
import Bus, { BusKey } from "../../../../modules/event/index";
import { getAccountInfo } from "../../../../modules/store/index";
import { checkPhone } from "../../../../utils/index";

Page({
  data: {
    params: {
      id: 0,
      sex: "0",
      location: "",
      isDefault: 0,
      receiverName: "",
      receiverMobile: "",
      remarkAddress: "",
      shortAddress: "",
      shortRemarkAddress: "",
    }, // 添加地址参数
    customerId: "",
    hotAddress: {},
    hasDef: 0, // 0不显示;1默认地址;2默认收货人;3默认手机号
    mode: 0, // 0默认1从下单进入
    phoneEmpty: false, //
  },

  onLoad: function (options) {
    const that = this;
    that._getHotAddress();
    if (options && options.item) {
      const item = JSON.parse(decodeURIComponent(options.item));
      that.setData({ params: item, mode: item.mode });
    }
  },

  onUnload: function () {
    // Bus.remove({key: BusKey.address_get_city});
  },

  onChooseMap: function () {
    const that = this;
    // 此处可采用一次性订阅
    Bus.single(BusKey.address_get_city, (res = {}) => {
      const params = {
        ...that.data.params,
        ...res,
      };
      that.setData({ params });
    }, 'address_edit');
    wx.navigateTo({
      url: "/page_minor/pages/address/amap/amap",
    });
  },

  inputDoors: function (e) {
    const that = this;
    const params = that.data.params;
    params.remarkAddress = e.detail.value;
    that.setData({
      params,
    });
  },
  inputName: function (e) {
    const that = this;
    const params = that.data.params;
    params.receiverName = e.detail.value;
    that.setData({
      params,
    });
  },
  inputPhone: function (e) {
    const that = this;
    const params = that.data.params;
    params.receiverMobile = e.detail.value;
    that.setData({
      params,
    });
  },
  onChangeDef: function (e) {
    const that = this;
    const params = that.data.params;
    params.isDefault = e.detail.value ? 1 : 0;
    that.setData({
      params,
    });
  },
  onChangeSex: function (e) {
    const that = this;
    const params = that.data.params;
    params.sex = e.detail.value;
    that.setData({
      params,
    });
  },

  // 保存
  onSave: async function () {
    const that = this;
    const params = { ...that.data.params };
    let alert = "";
    if (!checkPhone(params.receiverMobile)) {
      alert = "请输入正确的手机号";
    }
    if (params.receiverName.length < 1) {
      alert = "请输入收货人姓名";
    }
    if (params.remarkAddress.length < 1) {
      alert = "请输入门牌号";
    }
    if (params.location.length < 1) {
      alert = "请选择所在城市";
    }

    if (alert) {
      wx.showToast({
        title: alert,
        icon: "none",
      });
      return;
    }

    // 校验手机号是不是空号
    const { code, data } = await checkPhoneIsEmpty(params.receiverMobile);
    if (code == 0 && !data.data) {
      that.setData({ phoneEmpty: true });
      return;
    }
    that._commit(params);
  },

  // 提交
  _commit: async function (params) {
    // params.remarkAddress = params.address + "&" + params.remarkAddress;
    if (params.id < 1) {
      delete params.id;
      params.customerId = this.data.customerId;
    }
    const { code, data } = await addOrUpdateAddress(params);
    if (code == 0) {
      Bus.send(BusKey.address);
      wx.navigateBack();
      wx.showToast({
        icon: "none",
        title: "操作成功！",
      });
    }
  },
  // 删除
  onDelete: function () {
    wx.showModal({
      title: "删除地址",
      content: "确认删除该收货地址吗？",
      success: async (res) => {
        if (res.confirm) {
          const id = this.data.params.id;
          const { code, data } = await deleteAddress(id);
          if (code == 0) {
            Bus.send(BusKey.address);
            wx.navigateBack();
            wx.showToast({
              icon: "none",
              title: "删除成功！",
            });
          }
        }
      },
    });
  },

  // 获取推荐地址
  _getHotAddress: async function () {
    const that = this;
    let info = getAccountInfo() || {};
    that.data.customerId = info.customerId;
    const { code, data } = await queryHotAddress(info.customerId);
    const hotAddress = data?.data;
    if (code == 0 && hotAddress) {
      that.setData({
        hotAddress,
        hasDef: 1,
      });
    }
  },
});
