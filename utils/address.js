/**
 * Author: Meng
 * Date: 2022-03
 * Desc: 地址相关数据处理
 */

// 隐藏手机号 180****9999
export function formatPhone(phone) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

// 保存
export function formatAddressItem(item) {
  const phone = item.receiverMobile;
  const phoneStr = phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
  let shortAddress = item.shortAddress;
  let shortRemarkAddress = item.shortRemarkAddress;
  if(!item.location) {
    shortRemarkAddress = item.receiverCityName + item.receiverDistrictName + item.receiverStreetName;
  }
  return {
    id: item.id,
    phone,
    phoneStr,
    userName: item.receiverName,
    shortAddress,
    shortRemarkAddress,
    remarkAddress: item.remarkAddress || item.receiverAddress ||'',
    cityName: item.receiverCityName,
    districtName: item.receiverDistrictName,
    streetName: item.receiverStreetName,
    sex: item.sex || 0,
    location: item.location || "",
    isDefault: item.isDefault || 0,
    isDeliverRegion: item.isDeliverRegion||0, // 1再可配送范围
  }
}

// 转化修改地址参数
export function formatEditParam(item, mode = 0) {
  return {
    mode,
    id: item.id || 0,
    sex: item.sex || 0,
    location: item.location || "",
    isDefault: item.isDefault || 0,
    receiverName: item.userName || "",
    receiverMobile: item.phone || "",
    remarkAddress: item.remarkAddress || "",
    shortAddress: item.shortAddress || "",
    shortRemarkAddress: item.shortRemarkAddress || "",
  };
}
