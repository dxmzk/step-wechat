/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 收货地址
 */
import { queryAddressList } from "../../../modules/api/address";
import Bus, { BusKey } from "../../../modules/event/index";
import { getAccountInfo, getCityAndShop } from "../../../modules/store/index";
import { formatAddressItem, formatEditParam } from "../../../utils/address";

Page({
  data: {
    id: 0,
    mode: 0, // 0默认不选择;1从下单进入校验可用不可用
    phone: "",
    firstIn: true,
    cityCode: "",
    customerId: "",
    addressList: [],
    addressList2: [],
  },

  onLoad: function (options) {
    const that = this;
    const info = getAccountInfo();
    const shop = getCityAndShop();
    let mode = 0;
    if (options && options.mode) {
      mode = parseInt(options.mode);
    }
    const _data = {
      mode,
      cityCode: shop.cityCode,
      customerId: info.customerId,
    };
    that.setData(_data, that.getAddressData);
  },

  onUnload: function () {
    // Bus.remove({key: BusKey.address});
  },

  onPullDownRefresh: function () {
    this.getAddressData();
    wx.stopPullDownRefresh();
  },
  // 选择
  onItemClick: function (e) {
    const item = e.detail || {};
    const canUse = item.isDeliverRegion == 1 && this.data.mode != 0;

    if (canUse) {
      Bus.send(BusKey.address_choose, item);
      wx.navigateBack();
    }
  },
  // 编辑
  onEditAddress: function (e) {
    this._editOrAdd(e.detail);
  },
  // 新增
  onAddAddress: function () {
    this._editOrAdd();
  },
  // 编辑或新增
  _editOrAdd: function (item = {}) {
    const that = this;
    // 此处可采用一次性订阅
    Bus.single(
      BusKey.address,
      (res) => {
        that.getAddressData();
      },
      "address_list"
    );

    const mode = that.data.mode;

    const params = formatEditParam(item, mode);
    const json = encodeURIComponent(JSON.stringify(params));
    wx.navigateTo({
      url: "/page_minor/pages/address/edit/edit?item=" + json,
    });
  },

  // 判断地址是否可用
  _canUse: function (isDeliverRegion) {
    const mode = this.data.mode;
    return isDeliverRegion == 1 || mode == 0;
  },

  // 获取地址列表
  getAddressData: async function () {
    const that = this;
    const { customerId, cityCode, firstIn, mode, id } = that.data;
    const { code, data } = await queryAddressList(customerId, cityCode);
    if (code == 0 && data.data) {
      const list = data.data.map((e) => formatAddressItem(e));

      if (list.length < 1) {
        if (firstIn && mode == 1) {
          that._editOrAdd(); // 无数据跳新建
        }
      }

      if (id > 0) {
        let count = 0;
        list.forEach((e) => {
          if (e.id == id) {
            count += 1;
          }
        });
        if (count < 1) {
          // 清除已选择的地址
          Bus.send(BusKey.address_choose, null);
        }
      }

      const addressList = list.filter((e) => that._canUse(e.isDeliverRegion));
      const addressList2 = list.filter((e) => !that._canUse(e.isDeliverRegion));
      that.setData({
        firstIn: false,
        addressList,
        addressList2,
      });
    }
  },
});
