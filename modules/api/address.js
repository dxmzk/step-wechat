/**
 * Create By: Meng
 * Create Date: 2022-03
 * Desc: 请求接口 - 地址相关
 */
import { net_config } from '../net/config';
import { request } from '../net/index';

// 获取地址列表 - 旧
export function queryAddressList0(data = { phone: '', sapSkuCode: '' }) {
  return request({
    url: '/cutomer/addess/getAddress',
    method: 'GET',
    host: 'def',
    data,
  });
}

// 获取收货地址列表 - 新
export function queryAddressList(customerId, cityCode) {
  const data = {
    customerId,
  };
  if (cityCode) {
    data.cityCode = cityCode;
  }
  return request({
    url: '/customer/address/list.do',
    method: 'GET',
    host: 'def',
    data,
  });
}
// 获取推荐地址
export function queryHotAddress(customerId) {
  return request({
    url: '/customer/address/initQueryAddressInfo.do',
    method: 'GET',
    host: 'def',
    data: {
      customerId,
    },
  });
}
// 新增地址
export function addOrUpdateAddress(data = {}) {
  let url = '/customer/address/add.do';
  if (data.id) {
    url = '/customer/address/update.do';
  }
  return request({
    url,
    method: 'POST',
    host: 'def',
    data,
  });
}
// 删除收货地址
export function queryAddressDetail(id) {
  return request({
    url: '/customer/address/detail.do',
    method: 'GET',
    host: 'def',
    data: {
      id,
    },
  });
}
// 删除收货地址
export function deleteAddress(id) {
  return request({
    url: '/customer/address/delete.do',
    method: 'GET',
    host: 'def',
    data: {
      id,
    },
  });
}
// 校验手机号
export function checkPhoneIsEmpty(phone) {
  return request({
    // url: '/retail-member/address//deleteAddress',
    url: '/customer/address/checkPhone.do',
    method: 'GET',
    host: 'def',
    data: {
      phone,
    },
  });
}

// 地理逆编码
export function queryAddressName(latitude, longitude) {
  const url = `https://restapi.amap.com/v3/geocode/regeo?key=${net_config.AMAP}&location=${longitude},${latitude}&radius=2000`;
  return new Promise((resolve) => {
    wx.request({
      url,
      success: (res) => {
        _printLog(url, res);
        let address = { code: -1, data: null };
        if (res.statusCode == 200 && res.data) {
          const info = res.data.regeocode.addressComponent || {};
          address.code = 0;
          address.data = {
            code: info.citycode,
            cityName: info.province,
            district: info.district,
            adcode: info.adcode,
          };
        }
        resolve(address);
      },
      fail: () => {
        wx.showToast({
          icon: 'none',
          title: '位置服务重启中，请稍后重试！',
        });
        resolve({ code: -2, data: null });
      },
    });
  });
}

// 地理POI
export function queryAddressPoi(
  latitude,
  longitude,
  keywords = '',
  region = ''
) {
  const url = `https://restapi.amap.com/v5/place/around?key=${net_config.AMAP}&page_size=20&location=${longitude},${latitude}&radius=3000&region=${region}&keywords=${keywords}`;
  return new Promise((resolve) => {
    wx.request({
      url,
      success: (res) => {
        _printLog(url, res);
        let address = { code: -1, data: null };
        if (res.statusCode == 200 && res.data) {
          const list = res.data.pois || [];
          // adcode: "310115", address: "花木路1378号浦东嘉里城B106B", adname: "浦东新区"
          // citycode: "021", cityname: "上海市", location: "121.563826,31.211783"
          // name: "怪兽充电(小时食光浦东嘉里城店)", pcode: "310000", pname: "上海市"
          address.code = 0;
          address.data = list;
        }
        resolve(address);
      },
      fail: () => {
        wx.showToast({
          icon: 'none',
          title: '服务重启中，请稍后重试！',
        });
        resolve({ code: -2, data: null });
      },
    });
  });
}

// 搜索地址/逆编码 keywords：关键字, region：城市-默认全国
export function searchAddressPlace(keywords = '', region = '') {
  const url = `https://restapi.amap.com/v5/place/text?key=${net_config.AMAP}&page_size=25&region=${region}&keywords=${keywords}`;
  return new Promise((resolve) => {
    wx.request({
      url,
      success: (res) => {
        _printLog(url, res);
        let address = { code: -1, data: null };
        if (res.statusCode == 200 && res.data) {
          // adcode: "310115", address: "花木路1378号浦东嘉里城B106B", adname: "浦东新区"
          // citycode: "021", cityname: "上海市", location: "121.563826,31.211783"
          // name: "怪兽充电(小时食光浦东嘉里城店)", pcode: "310000", pname: "上海市"
          address.code = 0;
          address.data = res.data.pois || [];
        }
        resolve(address);
      },
      fail: () => {
        wx.showToast({
          icon: 'none',
          title: '服务重启中，请稍后重试！',
        });
        resolve({ code: -2, data: null });
      },
    });
  });
}

function _printLog(url, data) {
  console.log(url);
  console.log(data);
}

// 获取省市区
export function queryAllAreas() {
  return request({
    url: '/area/allAreas',
    method: 'GET',
    host: 'customer',
    data: {},
  });
}
// 获取所有省份
export function queryAllProvinces() {
  return request({
    url: '/cutomer/area/district/provinces',
    method: 'GET',
    host: 'customer',
    data: {},
  });
}
// 获取所有市
export function queryAllCitys(provinceId) {
  return request({
    url: '/cutomer/area/district/citys',
    method: 'GET',
    host: 'customer',
    data: {
      provinceId,
    },
  });
}
// 获取所有区
export function queryAllDistricts(cityId) {
  return request({
    url: '/cutomer/area/district/districts',
    method: 'GET',
    host: 'customer',
    data: {
      cityId,
    },
  });
}
// 获取所有街道
export function queryAllStreets(districtId) {
  return request({
    url: '/cutomer/area/street/streets',
    method: 'GET',
    host: 'customer',
    data: {
      districtId,
    },
  });
}
