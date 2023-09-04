/**
 * Author: Meng
 * Date: 2022-04
 * 网络配置项
 */

import { getWebPath } from "./config";

/**  活动配置
 * url: 地址
 * path: 路径
 * query: 参数
 * title: 分享的标题 imageUrl: 分享的图片
 * login: 是否需要登录
 */
const Activitys = {
  benefits: {
    url: "",
    path: "",
    query: "",
    title: "工艺大赛邀请您领好礼，抢定优秀工匠",
    imageUrl: "https://decorationhome.oss-cn-hangzhou.aliyuncs.com/gongyi.png",
    login: false,
  },
  coupon: {
    url: "",
    path: "pages/Activity/couponTool/index",
    query: "token=&openId=",
    title: "工艺大赛邀请您领好礼，抢定优秀工匠",
    imageUrl: "https://decorationhome.oss-cn-hangzhou.aliyuncs.com/gongyi.png",
    login: true,
  },
};

// 获取活动信息
export function getActivityFromKey(key) {
  let item = {};
  if (Object.hasOwnProperty.call(Activitys, key)) {
    item = Activitys[key];
    item.url = getWebPath("H5Domain") + item.path;
  }
  return item;
}
