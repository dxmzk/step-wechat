/**
 * Author: Meng
 * Date: 2022-03
 * Desc: 小程序入口
 */

import ErrorLog from "./utils/app/error_log";
import Screen from "./utils/app/screen_parse";
import Shake from "./utils/app/shake";
import AppUpdate from "./utils/app/update";
import { setAppEnv } from './modules/net/config';

App({
  consts: {
    windowWidth: 414,
    screenHeight: 736,
    windowHeight: 688,
    height: 716,
    statusBarHeight: 20,
    bottomBarHeight: 18,
    system: "",
    wifiEnabled: false,
    batteryLevel: 100,
    isLoad: false,
  },
  onLaunch: function () {
    this._initSystem();
    const info = wx.getAccountInfoSync();
    if (info.miniProgram.envVersion != 'release') {
      Shake.env(); // 摇一摇切环境 - ❗️❗️❗️注意: 上线要注释这行代码❗️❗️❗️
    } else {
      setAppEnv(0);
    }
  },
  onShow: function (options) {
    Screen.parse(options); // 解析app启动参数
    AppUpdate.update(); // 检测更新
  },
  // 获取系统信息
  _initSystem: function () {
    wx.getSystemInfo({
      success: (res) => {
        // console.log(res)
        const bottomBarHeight = res.screenHeight - res.safeArea.bottom;
        let that = this;
        that.consts.windowWidth = res.windowWidth;
        that.consts.screenHeight = res.screenHeight;
        that.consts.windowHeight = res.windowHeight;
        that.consts.height = res.safeArea.height;
        that.consts.statusBarHeight = res.statusBarHeight;
        that.consts.bottomBarHeight = bottomBarHeight;
        that.consts.system = res.system;
        that.consts.wifiEnabled = res.wifiEnabled;
        that.consts.batteryLevel = res.batteryLevel;
        that.consts.isLoad = true;
        console.log(that.consts)
      },
    });
  },
  onHide: function () {},
  onError: function (err) {
    ErrorLog.log(err);
  },
  onPageNotFound: function () {},
});
