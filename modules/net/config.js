/**
 * Author: Meng
 * Date: 2022-03
 * 网络配置项
 */
import md5 from '../../utils/encrypt/md5';
import { getTokenStr } from '../store/index';

const secret = 'c1cf9ed1b74d838c7801d524f480cc51';

export const net_config = {
  ECardRSA: '',
  AMAP: '',
  env: 'prod',
  // env: "test",
  // env: "uat",
};

// 获取地址
export function getWebPath(host, env = net_config.env) {
  const url = env_hosts[env][host];
  return url;
}

// 设置环境 0prod, 1test, 2dev
export function setAppEnv(num = 0) {
  const index = num > 2 ? 0 : num;
  net_config.env = index == 0 ? 'prod' : index == 1 ? 'test' : 'dev';
}

// 获取对应请求地址
export function requestHost(host = 'def', env = 'prod') {
  const url = env_hosts[env][host];
  return url;
}

const bnqUserAgent = JSON.stringify({
  appVersion: '',
  buildVersion: '',
  networkStatus: '',
  adfa: 'df9e51fb-5a42-4ed6-a293',
  channel: '',
  mobileName: '',
  osVersion: '',
  reOsVersion: '',
  deviceType: '',
  apiVersion: '5',
  lat: '',
  lon: '',
});
// 请求头设置
export function mergeHeaders(header = {}) {
  const token = getTokenStr();
  let cookie = 'TOKEN=' + token + ';sessionToken=' + token;
  if (header.Cookie) {
    cookie = header.Cookie;
    delete header.Cookie;
  }
  return {
    BAJ_SESSION_ID: token,
    bnqUserAgent: bnqUserAgent,
    cookie: cookie,
    TOKEN: token,
    Accept: 'application/json',
    ...header,
  };
}

// 请求参数设置
export function mergeParams(params = {}, host) {
  const TOKEN = getTokenStr();
  const timestamp = Date.now() + '';
  let param = params;
  if (host == 'dssDomain') {
    return params;
  }
  param = {
    key: 'wechat_shop',
    timestamp,
    sign: '',
    TOKEN,
    ...params,
  };
  let paramArr = [];
  for (const key in param) {
    paramArr.push(key.toLowerCase());
  }
  paramArr = paramArr.sort();
  const sign = md5.hex_md5(secret + timestamp + paramArr.join('') + secret);
  param.sign = sign;
  return param;
}

// 数据服务地址
const env_hosts = {
  prod: {
    def: 'https://item.bnq.com.cn', //
    worker: 'https://ds.bnq.com.cn', //path:原bnq_worker->worker的接口域名
    yingxiao: 'https://yingxiao.bnq.com.cn', // 营销
    trade: 'https://trade.bnq.com.cn/trade-web', // 交易链路：结算、下单、支付
    tradeTest: 'https://trade-test.bnq.com.cn/trade-web', // 交易链路：结算、下单、支付
    customer: 'https://gw.bnq.com.cn/customerGateway', // 积分、地址
    customer2: 'https://gw.bnq.com.cn/customerGateway', // 获取省市区街道
    cart: 'https://cart.bnq.com.cn/cartwebService', // 购物车
    pay: 'https://zt.bnq.com.cn', //
    zt: 'https://wy.bthome.com', //
    ptDomain: 'https://himiko.bthome.com',
    invoice: 'https://invoice.bnq.com.cn/invoiceService/', //电子发票
    logistics: 'https://logistics.bnq.com.cn/logisticsAdmin', // 物流
    H5Domain: 'https://dhstatic.bthome.com/prod/web/designer/index.html#/', //榜单等H5入口
    promotion: 'https://promotion.bnq.com.cn/promotion-service', //促销中心
    marketWebDomain: 'https://m.market.bnq.com.cn',
    promotionDomain: 'https://promotion.bnq.com.cn/promotion-service', //促销中心
    dssDomain: 'https://dss.bthome.com',
    mfsWebDomain: 'https://mfs.bnq.com.cn',
  },
  uat: {
    def: 'https://sales-uat.bnq.com.cn',
    worker: 'https://ds-uat.bnq.com.cn', //path:原bnq_worker->work的接口域名
    yingxiao: 'http://yingxiao-uat.bnq.com.cn',
    trade: 'https://trade-uat.bnq.com.cn/trade-web',
    customer: 'http://customer-uat.bnq.com.cn/customerGateway',
    customer2: 'http://customer-uat.bnq.com.cn/customer',
    cart: 'http://cart-uat.bnq.com.cn/cartwebService',
    pay: 'http://uat.zt.bnq.com.cn',
    zt: 'https://wy-uat.bthome.com',
    ptDomain: 'https://scgw-uat.bthome.com',
    invoice: 'https://invoice-uat.bnq.com.cn/invoiceService/', //电子发票
    logistics: 'https://logistics-uat.bnq.com.cn/logisticsAdmin', // 物流
    H5Domain: 'https://dhstatic.bthome.com/uat/web/designer/index.html#/', //榜单等H5入口
    marketWebDomain: 'https://m.market.bnq.com.cn',
    promotion: 'http://promotion-uat.bnq.com.cn/promotion-service', //促销中心
    promotionDomain: 'http://promotion-uat.bnq.com.cn/promotion-service', //促销中心
    dssDomain: 'https://dss-uat.bthome.com',
    mfsWebDomain: 'https://mfs-uat.bnq.com.cn',
  },
  test: {
    def: 'https://sales-test.bnq.com.cn',
    worker: 'https://ds-test.bnq.com.cn', //path:原bnq_worker->work的接口域名
    yingxiao: 'https://yingxiao-test.bnq.com.cn',
    trade: 'https://trade-test.bnq.com.cn/trade-web',
    customer: 'https://customer-test.bnq.com.cn/customerGateway',
    customer2: 'https://customer-test.bnq.com.cn/customer',
    cart: 'http://cart-test.bnq.com.cn/cartwebService',
    pay: 'https://test.zt.bnq.com.cn',
    zt: 'https://wy-test.bthome.com',
    ptDomain: 'https://scgw-test.bthome.com',
    invoice: 'https://invoice-test.bnq.com.cn/invoiceService/',
    logistics: 'https://logistics-test.bnq.com.cn/logisticsAdmin', // 物流
    H5Domain: 'https://dhstatic.bthome.com/test/web/designer/index.html#/', //榜单等H5入口
    marketWebDomain: 'https://m.market.bnq.com.cn',
    promotion: 'https://promotion-test.bnq.com.cn/promotion-service', //促销中心
    promotionDomain: 'https://promotion-test.bnq.com.cn/promotion-service', //促销中心
    dssDomain: 'https://dss-test.bthome.com',
    mfsWebDomain: 'https://mfs-test.bnq.com.cn',
  },
};
