/**
 * Created by 18/8/2.
 */

import wkApi from "./index.js";

const undef = undefined;
export default {
  // 获取到<微信登录信息 & 业务登录信息初始化>上报登录事件
  reportLoginReady() {
    wkApi.report("wkb_login_ready", {});
  },
  /**
   * 上报 -> 运行参数 ，仅上报一次
   * 场景： 打开的分享小程序链接,上报分享者相关信息
   * @param refStoreId 分享者的 门店ID
   * @param refUserId 分享者的 会员ID
   * @param refWxOpenId 分享者的 微信openId
   * @param [refBzScene] 分享者的 业务场景
   * @param [refBzId]分享者的 业务场景具体数据ID
   */
  reportShareRef({ refStoreId, refUserId, refWxOpenId, refBzScene, refBzId }) {
    const report = {};
    if (!!refUserId && !!refWxOpenId && !!refStoreId)
      report.bury = {
        _ref_storeId: refStoreId,
        _ref_useId: refUserId,
        _ref_wxOpenId: refWxOpenId,
        bzscene: refBzScene || "",
        _ref_bz_id: refBzId || "",
      };
    wkApi.updateRunTimeBzParam(report);
  },
  /**
   * 上报 -> 运行参数 ，可上报多次
   * 场景： 切换门店 / 业务系统登录之后选择的默认门店
   * @param storeId 当前 门店ID
   */
  reportRuntimeStore(storeId) {
    const report = {};
    if (!!storeId) report.store = storeId;
    wkApi.updateRunTimeBzParam(report);
  },

  /**
   * 用户信息上报 ，可上报多次
   * wxAuth = {
   * unionId,
   * openId,
   * phone,
   * userId,
   * storeId,
   * nickName,
   * avatarImgUrl,
   * gender,
   * province,
   * city,
   * country
   * }
   */
  reportUser(wxAuth) {
    const user = {
      unionid: wxAuth["unionId"] || "",
      openid: wxAuth["openId"] || "",
      phone: wxAuth["phone"] || "",
      uid: wxAuth["userId"] || "",
    };
    const profile = {
      nickname: wxAuth["nickName"] || "",
      avatarUrl: wxAuth["avatarImgUrl"] || "",
      gender: wxAuth["gender"] || "",
      prov: wxAuth["province"] || "",
      city: wxAuth["city"] || "",
      state: wxAuth["country"] || "",
      store_id: wxAuth["storeId"] || "",
    };
    wkApi.reportUser(user, profile);
  },

  /**
   * 定位结果上报
   * @param longitude
   * @param latitude
   */
  reportLocationResult({ longitude, latitude }) {
    wkApi.reportLocation({ longitude, latitude });
  },

  // 上报分享动作
  reportShare() {
    const pageInfo = wkApi.currentPageInfo();
    wkApi.report("share_app", {
      //当前页面
      ru: pageInfo.ru || undef,
      result: 1,
    });
  },

  /**
   * 上报请求微信授权的操作
   * @param allowed 是否成功
   * @param author_type 0:用户信息，1:用户手机
   */
  reportAuthOperation(allowed, author_type) {
    wkApi.reportAuthOperation(allowed, author_type);
  },

  // 上报微信地址授权
  reportLocation(result) {
    wkApi.report("author_location", {
      result: result ? 1 : 0,
    });
  },

  // 收货地址授权
  reportAccAddress(result) {
    wkApi.report("author_address", {
      result: result ? 1 : 0,
    });
  },
  /**
   * 商品曝光
   * @param itemid 商品id
   * @param itemName 商品名称
   * @param thumbnail 商品图片
   * @param sale_price 销售价格
   */
  goodsExposure(itemid, itemName, thumbnail = "", sale_price = "") {
    const pageInfo = wkApi.currentPageInfo();
    wkApi.report("exposure_item", {
      ru: pageInfo.ru || undef,
      itemid: itemid,
      item_name: itemName || "",
      thumbnail: thumbnail || "",
      sale_price: sale_price || 0,
    });
  },

  /**
   * 上报 进入详情页面
   * @param itemNo 商品编号
   * @param itemName 商品名称
   */
  detailPage(itemNo, itemName) {
    const pageInfo = wkApi.currentPageInfo();
    wkApi.report("click_item", {
      ru: pageInfo.ru || undef,
      item_no: itemNo,
      itemid: itemNo,
      item_name: itemName || "",
    });
  },

  /**
   * 获取商品的会话id
   * @param itemNo 商品编号
   */
  getBrowseItemSessionId(itemNo) {
    return itemNo + "_" + new Date().getTime();
  },

  /**
   * 支付流程:加入购物车
   * @param itemNo
   * @param itemName
   * @param sessionId
   * @param thumbnail 商品图片
   * @param sale_price 销售价格
   */
  toShopCart(itemNo, itemName, sessionId, thumbnail = "", sale_price = "") {
    wkApi.report("add_shop", {
      itemid: itemNo,
      item_name: itemName || "",
      item_no: itemNo,
      session_id: sessionId,
      thumbnail: thumbnail || "",
      sale_price: sale_price || 0,
    });
  },

  /**
   * 跳转商品支付页
   * @param skuId 商品skuId
   * @param itemNo 商品编号
   * @param itemName 商品名称
   * @param barcode 商品条码
   * @param productCount
   */
  clickBuyNowProductPage({ skuId, itemNo, itemName, barcode, productCount }) {
    wkApi.report("click_buy_now_productpage", {
      sku_num: skuId || undef,
      itemNo: itemNo || undef,
      item_no: itemNo || undef,
      item_name: itemName || undef,
      barcode: barcode || undef,
      product_count: productCount || 1,
    });
  },

  /**
   * 订单拉起微信支付
   * @param orderNo  {String}
   * @param itemList {Array}
   * @param result 1/0 , 1: 拉取支付成功,0: 拉取支付失败
   * 调用示例
   * unifyOrder({
   *   result: 1,
   *   orderNo:'2343423423423',
   *   itemList:[
   *     {itemNo:'商品编号',itemName:'商品名称',sessionId:'会话id',thumbnail:'商品缩略图片',sale_price:'销售价格'}
   *   ]
   * })
   */
  unifyOrder({ orderNo = "", itemList, result = 0 }) {
    if (!orderNo || !itemList || !itemList.length) return;
    wkApi.report("unifer_order", {
      item_infos: itemList.map((item) => {
        return {
          itemid: item.itemNo,
          item_name: item.itemName || "",
          session_id: item.sessionId || "",
          thumbnail: item.thumbnail || "",
          sale_price: item.sale_price || 0,
        };
      }),
      result: result,
      order_no: orderNo,
    });
  },

  /**
   * 订单微信支付结果上报
   * @param orderNo  {String}
   * @param itemList {Array}
   * @param result 1/0 , 1: 拉取支付成功,0: 拉取支付失败
   * 调用示例
   * unifyOrder({
   *   result: 1,
   *   orderNo:'2343423423423',
   *   itemList:[
   *     {itemNo:'订单编号',itemName:'商品名称',sessionId:'会话id',thumbnail:'商品缩略图片',sale_price:'销售价格'}
   *   ]
   * })
   */
  payResult({ orderNo = "", itemList, result = 0 }) {
    if (!orderNo || !itemList || !itemList.length) return;
    wkApi.report("pay_result", {
      item_infos: itemList.map((item) => {
        return {
          itemid: item.itemNo,
          item_name: item.itemName || "",
          session_id: item.sessionId || "",
          thumbnail: item.thumbnail || "",
          sale_price: item.sale_price || 0,
        };
      }),
      result: result,
      order_no: orderNo,
    });
  },

  /**
   * 支付流程:立即购买
   * @param itemid 商品id
   * @param itemName 商品名称
   * @param ordertype  砍价立即购买/拼团立即购买/拼团成功购买/正常流程购买
   *  1:正常购买(含产品，服务，卡项；2:拼团立即购买；3:参团立即购买；4:砍价立即购买
   */
  clickBuy(itemid, itemName, ordertype = 1) {
    wkApi.report("click_buy", {
      itemid,
      item_name: itemName,
      ordertype,
    });
  },

  /**
   * 支付流程:选择规格后点击下一步
   * @param itemNo 商品编号
   * @param itemName 商品名称
   * @param item_size 选择的规格
   */
  clickShopNext(itemNo, itemName, item_size) {
    wkApi.report("click_shop_next", {
      itemid: itemNo,
      item_name: itemName,
      item_size,
    });
  },

  //点击确认支付
  clickPay(config) {
    wkApi.report("click_pay", {
      result: !!config.result ? 1 : 0, //   ---- 1,成功 0,失败
      fail_reason: config.fail_reason || "", // ---- 如果失败，则上报原因
      item_count: 0, //---- 购买的数量
      amount: config.amount, //     ---- 支付总金额
      pay_type: config.pay_type, //   ---- 支付方式
      trade_type: "", //  ----付款类型(拼团/砍价/正常)
    });
  },
};
