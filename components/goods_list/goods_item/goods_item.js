/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 商品item
 */
Component({
  properties: {
    item: {
      type: Object,
      value: {},
    },
  },

  data: {},
  observers: {},
  methods: {
    onClick: function (e) {
      let item = e.currentTarget.dataset.item;
      this.triggerEvent("click", {
        mode: "list",
        id: item.id,
        itemId: item.itemId,
        skuId: item.skuId,
        sapSkuNo: item.sapSkuNo,
        cityCode: item.cityCode,
        shopCode: item.shopCode,
      });
    },
  },
});
