/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 权限申请
 */

export const Scope = {
  /** */
  userInfo: "scope.userInfo",
  /** 是否授权通讯地址 */
  address: "scope.address",
  /** 是否授权摄像头 */
  camera: "scope.camera",
  /** 是否授权获取发票， */
  invoice: "scope.invoice",
  /** 是否授权发票抬头 */
  invoiceTitle: "scope.invoiceTitle",
  /** 是否授权录音功能 */
  record: "scope.record",
  /** 是否授权用户信息 */
  userInfo: "scope.userInfo",
  /** 是否授权地理位置 */
  location: "scope.userLocation",
  /** 是否授权微信运动步数*/
  werun: "scope.werun",
  /** 是否授权保存到相册 */
  writePhotosAlbum: "scope.writePhotosAlbum",
};

const ScopeText = {
  "scope.userInfo": "您已拒绝获取获取你的昵称权限，请手动打开",
  "scope.address": "您已拒绝获取位置权限，请手动打开",
  "scope.camera": "您已拒绝相机权限，请手动打开",
  "scope.invoice": "您已拒绝位置信息，请手动打开",
  "scope.invoiceTitle": "您已拒绝位置信息，请手动打开",
  "scope.record": "您已拒绝位置信息，请手动打开",
  "scope.userInfo": "您已拒绝位置信息，请手动打开",
  "scope.userLocation": "您已拒绝位置信息，请手动打开",
  "scope.werun": "您已拒绝位置信息，请手动打开",
  "scope.writePhotosAlbum": "您已拒绝位置信息，请手动打开",
};

export function authorize(scope) {
  // 检查是否已授权
  // 发起授权
  return new Promise((resolve) => {
    wx.getSetting({
      withSubscriptions: true,
      success: (result) => {
        let status = result.authSetting[scope];
        if (status == null) {
          // 未授权
          auth(scope, resolve);
        } else if (!status) {
          // 拒绝授权
          // 弹出打开设置界面
          wx.showModal({
            cancelText: "取消",
            confirmText: "确认",
            content: ScopeText[scope],
            showCancel: true,
            title: "打开设置",
            success: (res) => {
              if (res.confirm) {
                openSetting();
              }
            },
          });
          resolve({
            message: "您已拒绝授权！",
            status: false,
          });
        } else {
          resolve({
            message: "授权成功！",
            status: true,
          });
        }
      },
      fail: (err) => {
        console.log(err);
        resolve({
          message: "获取授权失败，请重新打开！",
          status: false,
        });
      },
    });
  });
}

function auth(scope, resolve) {
  wx.authorize({
    scope,
    success: (res) => {
      resolve({
        message: "授权成功！",
        status: true,
      });
    },
    fail: (err) => {
      console.log(err);
      resolve({
        message: "授权失败！",
        status: false,
      });
    },
  });
}

function openSetting() {
  wx.openSetting({
    withSubscriptions: true,
    success: (result) => {},
  });
}
