/**
 * Author: Meng
 * Date: 2022-04
 * Desc: 活动 - 专属页面
 * https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html
 * 
 * 流程: 通过key获取对应活动配置，如果需要登录则，登录，
 * 并在onShow中监听登录状态，如登录则调用setData刷新页面并传递对应账号信息
 * 
 * 分享: 分享数据可通过h5发送postMessage的形式，若未发送则使用默认这配置项中的分享数据
 * 格式为: {title, path, imageUrl, login, query: 参数}
 * 文档: https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html
 */

import { getActivityFromKey } from "../../../modules/net/config_activity";
import { getAccountInfo } from "../../../modules/store/index";

Page({
  data: {
    loaded: false, // 可做 加载中的显示
    url: "",
    query: "",
    login: false, // 是否需要登录信息
    isLogin: false, // 是否已登陆
    shareData: { title: "", path: "", imageUrl: "", query: 0 }, // 分享的数据
    title: "", 
    path: "", 
    imageUrl: ""
  },

  onLoad: function (options) {
    // 加载动画
    const that = this;
    let _data = {};
    if (options.key) {
      _data = getActivityFromKey(options.key);
    }else if(options.query) {
      _data = JSON.parse(decodeURIComponent(options.query));
    }
    if(_data && _data.path) {
      _data.shareData = {
        title: _data.title, 
        path: `${(_data.url + '/')||''}${_data.path||''}`, 
        imageUrl: _data.imageUrl, 
        query: _data.query
      }
    }
    if (_data.login) {
      // 需要登录
      let info = getAccountInfo(); // 账号信息
      _data.isLogin = info && info.token != null; // 登录状态
      let query = _data.query;
      if (query) {
        if (_data.isLogin) {
          _data.url = that._parseParams(_data.url, query, info);
        } else {
          _data.url += `?${query}`;
        }
      }
    }

    that.setData(_data);
  },

  onShow: function () {
    const that = this;
    const { isLogin, login } = that.data;
    let info = getAccountInfo();
    if (!isLogin && login && info && info.token) {
      // 登录后 拼接参数
      let { url, query } = that.data;
      const url3 = that._parseParams(url, query, info);
      that.setData({ url: url3, isLogin: true });
    } else {
      that.data.isLogin = false;
    }
  },

  onUnload: function() {},

  onShareAppMessage: function (res) {
    const share = this.data.shareData;
    if(!share.imageUrl) {
      delete share.imageUrl;
    }
    if(share.query) {
      const query = encodeURIComponent(JSON.stringify(share));
      share.path += `?query=${query}`;
    }
    return share;
  },

  // 拼接参数
  _parseParams: function (url, query, info) {
    if (query) {
      let querys = [query];
      if (query.indexOf("&") > -1) {
        querys = query.split("&");
      }
      let param = "?";
      querys.forEach((e, idx) => {
        let k = e.replace("=", "");
        param += `${idx > 0 ? "&" : ""}${e}${info[k]}`;
      });
      url += param;
    }
    return url;
  },
  // 网页加载完成会掉
  onWebLoaded: function() {
    this.setData({
      loaded: true
    })
  },
  // h5事件交互
  onWebMessage: function(e) {
    const that = this;
    let param = e.detail;
    console.log(e);
    if(param.key == 'share') {
      let shareData = param.data;
      if(shareData && shareData.title) {
        that.setData({
          shareData
        });
      }
    }
  }

});
