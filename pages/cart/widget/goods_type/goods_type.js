/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 商品类型
 */
import { queryGoodsDetail } from "../../../../modules/api/goods";
Component({
  properties: {
    detail: {
      type: Object,
      value: {},
    },
    info: {
      type: Object,
      value: {
        temId: 0,
        skuId: 0, //
        shopId: "",
        goods: {},
        state: 0, // 是否下架
      },
    },
  },

  data: {
    animData: {},
    canSelect: true, // 是否可以选择
    defSize: 0, // 默认规格长度
    selectedSkuId: 0, // 默认选择的
    hasDown: false,
    selectData: {}, // 选择的数据
    saleList: [], // 选中的规格
    skuList: [],
    saleList2: [],
    skuList2: [],
    skuData: {},
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
    },
    ready: function () {
      const that = this;
      that.createAnim();
      that._getGoodsDetail();
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods: {
    //
    createAnim: function (num) {
      let that = this;
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: "ease",
      });
      animation.translate(0, 0).step({ duration: 600 });
      that.setData({
        animData: animation.export(),
      });
    },
    //
    onEventBack: function (status, data = {}) {
      data.status = status;
      this.triggerEvent("click", data);
    },
    //
    onClose: function () {
      this.onEventBack(false);
    },
    // 确定按钮
    onConfirm: function () {
      const that = this;
      const { selectData, skuData, defSize, hasDown } = that.data;
      let selectDataKey = Object.getOwnPropertyNames(selectData);
      if (selectDataKey.length < defSize || hasDown) {
        wx.showToast({
          icon: "none",
          title: "请选择可售商品！",
        });
        return;
      }
      if (!skuData.shopId) {
        skuData.shopId = that.data.info.shopId;
      }
      that.onEventBack(true, { selectData, skuData });
    },
    // idx-父索引index-子索引item数据
    onPressItem: function (e) {
      const that = this;
      const dataset = e.currentTarget.dataset;
      const idx = dataset.idx;
      const index = dataset.index;
      const item = dataset.item;
      const { selectData, saleList, saleList2 } = that.data;
      let selectDataKey = Object.getOwnPropertyNames(selectData);
      const propertyId = saleList[idx].propertyId;
      const status = saleList[idx].valueList[index].status;
      // status=1已选，status=2未选，status=3不可选，status=4下架
      if (status == 3) {
        return;
      }

      if (
        selectDataKey.includes(propertyId + "") &&
        selectData[propertyId] === item.valueId
      ) {
        // delete selectData[propertyId]
        that.data.selectData = selectData[propertyId];
      } else {
        const newSelectData = {
          ...selectData,
          [propertyId]: item.valueId,
        };
        selectDataKey = Object.getOwnPropertyNames(newSelectData);
        if (selectDataKey.length == saleList2.length) {
          that.data.skuList = that._getAllCanUseSkus(newSelectData);
        }
        that.data.selectData = newSelectData;
      }
      const list = that._updateSaleList(saleList2);
      const skuData = that.data.skuList[0];

      that.setData({
        saleList: list,
        skuData,
      });
    },
    // 设置 canUseSkus 数据  计算出符合当前属性选择的sku列表
    _getAllCanUseSkus: function (selectData) {
      const { skuList2, saleList2 } = this.data;
      const propertys = Object.getOwnPropertyNames(selectData);
      if (!propertys || propertys.length == 0) {
        return skuList2;
      } else {
        let canUseSkus = null;
        for (let i in propertys) {
          let key = parseInt(propertys[i]);
          let propItem = saleList2.find((value) => value.propertyId === key);
          let propValue = propItem.valueList.find(
            (value) => value.valueId === selectData[key]
          );
          let skuIds = propValue.skuIdList;
          if (!canUseSkus) {
            canUseSkus = new Set(skuIds);
          } else {
            canUseSkus = new Set(
              [...canUseSkus].filter((x) => new Set(skuIds).has(x))
            );
          }
        }
        return skuList2.filter((item) => canUseSkus.has(item.skuId));
      }
    },

    // 更新数据状态
    _updateSaleList: function (saleList, init = 0) {
      const that = this;
      const selectData = that.data.selectData;
      const selectDataKey = Object.getOwnPropertyNames(selectData);
      let downCount = 0;
      // 默认数据
      saleList.forEach((e) => {
        const propertyId = e.propertyId + "";
        let selectValueId = selectDataKey.includes(propertyId)
          ? selectData[propertyId]
          : "";
        e.valueList.forEach((v) => {
          // status=1已选，status=2未选，status=3不可选，status=4下架
          if (v.valueId == selectValueId) {
            v.status = 1;
            // v.down = v.down;
          } else {
            const tag = that._getTagStatus(propertyId, v.valueId);
            v.status = tag.status;
            v.down = tag.down;
          }
          if (v.status == 1) {
            downCount += v.down ? 1 : 0;
          }
        });
      });
      if (init == 0) {
        that.data.hasDown = downCount > 0;
      }
      return [...saleList];
    },

    // 设置对应商品规格/标签状态
    _getTagStatus: function (propertyId, valueId) {
      const that = this;
      const { saleList2, selectData } = that.data;
      const selectDataKey = Object.getOwnPropertyNames(selectData);
      if (saleList2.length == selectDataKey.length) {
        const tempProps = {
          ...selectData,
          [propertyId]: valueId,
        };
        let skuList = that._getAllCanUseSkus(tempProps);
        if (skuList.length == 1) {
          const down = skuList[0].state == 1 ? false : true;
          return {
            status: 2,
            down,
          };
        } else {
          return { status: 3, down: false };
        }
      } else {
        const selectList = saleList2.filter(
          (item) => !selectDataKey.includes(`${item.propertyId}`)
        );
        const tagList = [];
        selectList.forEach((e) => {
          const tid = e.propertyId;
          const vlist = e.valueList.map((item) => {
            return { [tid]: item.valueId };
          });
          tagList.push(vlist);
        });

        let allSkuList = [];
        tagList.forEach((e) => {
          let allValue = {};
          e.forEach((obj) => {
            for (const key in obj) {
              allValue[key] = obj[key];
            }
          });
          const tempProps = {
            ...selectData,
            ...allValue,
            [propertyId]: valueId,
          };
          let useSkuList = that._getAllCanUseSkus(tempProps);
          allSkuList = allSkuList.concat(useSkuList);
        });
        let isDown = true;
        for (let i = 0; i < allSkuList.length; i++) {
          let sku = allSkuList[i];
          if (sku.state == 1) {
            isDown = false;
          }
        }
        // 1: 已选,2: 未选但可以选择,3：未选且不能选择 4：下架
        // return isDown ? 4 : (allSkuList.length > 0 ? 2 : 3);
        // return allSkuList.length > 0 ? (isDown ? 4 : 2) : 3;
        return {
          status: allSkuList.length > 0 ? 2 : 3,
          down: isDown,
        };
      }
    },

    // 解析详情数据
    _paramsDetail: function (detail) {
      const that = this;
      let saleList = detail.salePropertyList || [];
      let skuList = detail.skuList || [];
      const selectedSkuId = detail.selectedSkuId || 0;
      let index = 0;
      if (skuList.length > 1) {
        skuList.forEach((e, idx) => {
          if (e.skuId == selectedSkuId) {
            index = idx;
          }
        });
      }
      let skuData = skuList[index]; // 默认数据
      const selectData = {}; // 选择的数据
      let sktId = -1; // 是否添加数据
      // 添加选择的数据
      saleList.forEach((e) => {
        e.valueList.forEach((v) => {
          const skt = v.skuIdList.filter((s) => selectedSkuId == s);
          if (skt.length > 0) {
            sktId = v.valueId;
          }
        });
        if (sktId > 0) {
          selectData[e.propertyId] = sktId;
        }
      });
      that.data.selectData = selectData;
      that.data.skuList2 = [...skuList];
      that.data.saleList2 = [...saleList];
      skuList = that._getAllCanUseSkus(selectData); // 不是知道为啥不是使用接口返回的
      // 默认数据
      saleList = that._updateSaleList(saleList, 1);

      const defSize = saleList.length;

      console.log(saleList);
      that.setData({
        selectedSkuId,
        saleList,
        skuList,
        defSize,
        skuData
      });
    },
    _getGoodsDetail: async function () {
      const that = this;
      let detail = that.data.detail;
      let info = that.data.info;
      if (info && info.skuId) {
        // itemId: 7088989 skuId: 480241 shopCode: 1004
        that.data.hasDown = info.state != 1;
        const { code, data } = await queryGoodsDetail({
          itemId: info.skuId,
        });
        if (code == 0) {
          detail = data.data || {};
        }
      }
      that._paramsDetail(detail);
    },
  },
});
