/**
 * Author: Meng
 * Date: 2022-03
 * Desc: 事件
 */

// 事件 key
export const BusKey = {
  address_get_city: 'address_get_city', // 订阅收货地址切换城市
  address: 'address_edit_add', // 收货地址编辑或添加
  address_choose: 'address_choose', // 选择收货地址

  login: 'account_login', // 登录成功
  logout: 'account_logout', // 退出成功

  cart: 'cart_change', // 加购，及购买
  city: 'city_change', // 选择城市
  order: 'order_change', // 订单列表变化
  sort: 'sort_change', // 分类tab变化
  shop_city: 'shop_city_change', // 修改店铺或者城市
};

class Bus {
  static _event_list = [];
  static _msg_list = [];

  // 事件注册
  static add(key, callback, tag, type) {
    this._event_list = this._event_list.filter(
      (e) => e.key != key || e.tag != tag
    );
    this._event_list.push({ key, callback, tag, type });

    let remove = false;
    this._msg_list.forEach((e) => {
      if (e.key == key) {
        remove = callback && callback(e.data);
      }
    });
    this._msg_list = this._msg_list.filter((e) => e.key != key || !remove);
  }

  // 订阅单次事件
  static single(key, callback, tag) {
    this.add(key, callback, tag, 1);
  }

  // 发送粘性消息
  static stick(key, data) {
    this.send(key, data);

    this._msg_list = this._msg_list.filter((e) => e.key != key);
    this._msg_list.push({ key, data });
  }

  // 发送消息
  static send(key, data, delay = 0) {
    if (delay > 0) {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        this._sendMsg(key, data);
      }, delay);
    } else {
      this._sendMsg(key, data);
    }
  }
  // 具体发送
  static _sendMsg(key, data) {
    this._event_list.forEach((e) => {
      if (e.key == key) {
        e.callback && e.callback(data);
      }
    });
    this._event_list = this._event_list.filter(
      (e) => e.key != key || e.type != 1
    );
  }

  // 移除消息
  static remove({ key, tag, callback } = {}) {
    if (key) {
      this._event_list = this._event_list.filter(
        (e) => e.key != key || e.tag != tag
      );
    } else {
      this._event_list = this._event_list.filter((e) => e.callback != callback);
    }
  }

  static clear() {
    EventBus._event_list = [];
    EventBus._msg_list = [];
  }
}
export default Bus;
