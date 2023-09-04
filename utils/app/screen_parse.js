/**
 * Author: Meng
 * Date: 2022-07-13
 * Desc: 解析 启动参数 《异步操作》
 */

// 解析 小程序打开 Screen 参数
async function parse(options) {
  _printLog(options);

  let path = options.path;
  let query = options.query;
  const scene = options.scene;
  switch (scene) {
    case 1065: // URL scheme
      break;
    case 1007: // 单人聊天会话中的小程序消息卡片
      break;
    case 1008: // 群聊会话中的小程序消息卡片
      break;
    case 1036: // App 分享消息卡片
      break;
    default:
      break;
  }
}

function _printLog(msg) {
  console.log('======> Screen Log:');
  console.log(msg);
}

const Screen = {
  parse,
};

export default Screen;
