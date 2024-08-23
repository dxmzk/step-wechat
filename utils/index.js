/**
 * Author: Meng
 * Date: 2022-03
 * Desc:
 */

// 验证手机号
export function checkPhone(phone) {
  const phoneRe = /(^1[3456789][0-9]{9}$)/;
  if (phoneRe.test(phone)) {
    return true;
  }
  return false;
}
/*
验证电话号码
验证规则：区号+号码，区号以0开头，3位或4位
号码由7位或8位数字组成
区号与号码之间可以无连接符，也可以“-”连接
如01088888888,010-88888888,0955-7777777
*/
export function checkTelephone(tel) {
  let re = /^0\d{2,3}-?\d{7,8}$/;
  if (re.test(tel)) {
    return true;
  }
  return false;
}
/**
 * 隐藏手机号 180****9999
 */
export function hidePhone(phone) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}
