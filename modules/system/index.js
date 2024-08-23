/**
 * Author: Meng
 * Date: 2022-03
 * Desc: 小程序 系统 API -
 */

import { authorize, Scope } from "../auth/index";

// 定位缓存
const map_latlng = {
  latitude: 0,
  longitude: 0,
  time: 0, // 两次定位间隔要大于1分钟
  max: 60000,
};

// 获取地址
function getLocation() {
  return new Promise(async (resolve) => {
    const res = await authorize(Scope.location);
    if (res && res.status) {
      if (Date.now() - map_latlng.time < map_latlng.max) {
        resolve({
          latitude: map_latlng.latitude,
          longitude: map_latlng.longitude,
        });
        // console.log('定位缓存')
        return;
      }
      wx.getLocation({
        type: "gcj02", // gcj02/wgs84
        isHighAccuracy: false,
        success: (res) => {
          // console.log(res)
          if (res.latitude) {
            map_latlng.latitude = res.latitude;
            map_latlng.longitude = res.longitude;
            map_latlng.time = Date.now();
            resolve(res);
          } else {
            resolve(null);
          }
        },
        fail: (err) => {
          console.log(err);
          resolve(null);
        },
      });
    } else {
      resolve(null);
    }
  });
}

// 获取getUserInfo
function getUserInfo() {
  return new Promise(async (resolve) => {
    const res = await authorize(Scope.userInfo);
    if (res.status) {
      wx.getUserInfo({
        success: async (res) => {
          resolve(res);
        },
        fail: () => {
          wx.getUserProfile({
            desc: "用于完善会员资料。",
            success: async (res) => {
              resolve(res);
            },
            fail: () => {
              resolve(null);
            },
          });
        },
      });
    } else {
      resolve(null);
    }
  });
}

// 获取头像及昵称
function getUserProfile(back) {
  wx.getUserProfile({
    desc: "用于完善会员资料。",
    success: async (res) => {
      back && back(res);
    },
    fail: () => {
      back && back(null);
    },
  });
}

function openMiniApp(appId, path='') {
  wx.navigateToMiniProgram({
    appId,
    path,
    extraData: {},
    envVersion: "release",
    fail: () => {
      wx.showToast({
        title: "抱歉，未能找到对应的小程序！",
        icon: "error",
      });
    },
  });
}

const Wechat = {
  getLocation,
  getUserInfo,
  getUserProfile,
  openMiniApp
};
export default Wechat;
