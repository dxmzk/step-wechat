/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 设置
 */

import Bus, { BusKey } from "../../../modules/event/index";
import { clearAccount } from "../../../modules/store/index";

Page({
  data: {
    itemList: [{ name: "退出登录", path: "" }],
  },
  onLoad: function (options) {},
  // 退出登录
  onItemClick: function (e) {
    clearAccount();
    Bus.send(BusKey.login, {});
    Bus.send(BusKey.logout, true);
    wx.reLaunch({
      url: "/pages/home/home",
    });
  },
});
