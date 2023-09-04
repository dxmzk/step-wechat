/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 商品列表筛选
 */

Component({
  properties: {
    brands: {
      type: Array,
      value: [],
    },
    categorys: {
      type: Array,
      value: [],
    },
    count: {
      type: Number,
      value: 0,
    },
    defParma: {
      type: Object,
      value: {}
    }
  },
  observers: {
    "brands, categorys, count, defParma": function (value, value2, value3, value4) {
      if(!value && !value2 && !value3 && !value4) {
        return;
      }
      const _data = {
        brandList: value,
        categoryList: value2,
        goodsNum: value3,
      };
      // 选择默认值
      if(value4) {
        _data.salePriceStart = value4.start||'';
        _data.salePriceEnd = value4.end||'';
      }
      this.setData(_data);
    },
    // categorys: function (value) {},
    // count: function (value) {},
  },
  data: {
    brandList: [],
    categoryList: [],
    goodsNum: 0,
    brandExpand: false,
    categoryExpand: false,
    salePriceStart: '',
    salePriceEnd: '',
  },
  methods: {
    onItemClick: function (e) {
      const that = this;
      let tag = e.currentTarget.dataset.tag;
      let item = e.currentTarget.dataset.item;
      if(tag == 'brand') {
        let brandList = that.data.brandList;
        brandList.forEach(e => {
          if(e.id == item.id) {
            e.check = !item.check;
          }
        });
        that.setData({brandList});
      }else {
        let categoryList = that.data.categoryList;
        categoryList.forEach(e => {
          if(e.id == item.id) {
            e.check = !item.check;
          }
        });
        that.setData({categoryList});
      }
    },
    onExpandList: function() {
      const that = this;
      that.setData({
        brandExpand: !that.data.brandExpand
      });
    },
    onExpandList2: function() {
      const that = this;
      that.setData({
        categoryExpand: !that.data.categoryExpand
      });
    },
    onInputStart: function(e) {
      this.data.salePriceStart = e.detail.value;
    },
    onInputEnd: function(e) {
      this.data.salePriceEnd = e.detail.value;
    },
    onReset: function() {
      this.setData({
        salePriceStart: '',
        salePriceEnd: '',
      });
    },
    onCommit: function() {
      const that = this;
      const {brandList, categoryList, salePriceStart, salePriceEnd} = that.data;
      
      let brandIds = brandList.filter(e => e.check);
      brandIds = brandIds.map(e => e.id);
      let categoryIds = brandList.filter(e => e.check);
      categoryIds = categoryIds.map(e => e.id);

      let filter = brandIds.length > 0 || categoryIds.length > 0 || salePriceStart || salePriceEnd;

      that.triggerEvent('change', {
        brandList,
        categoryList,
        salePriceStart,
        salePriceEnd,
        categoryIds,
        brandIds,
        filter
      });
    },
    onClose: function() {
      this.triggerEvent('change', {});
    }
  },
});
