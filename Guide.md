
# 开发规范

    开发规范：每个公司都有自己习惯的规范。
    这里按照一个比较常规的规范操作。
    如有不同想法或者更好的规范可以补充通知其他人

## 项目结构

这里目前采用的规范如下：

目录：

```bash    
│── assets                              # 静态资源
    │── icon                                # 小图标 -❗️注意：按功能命名❗️
    │── img                                 # 图片              
│── common                                # 全局样式
    │── anim.wxss                           # 动画样式
    │── image.wxss                          # 图片样式
    │── text.wxss                           # 文字样式
    │── view.wxss                           # 视图样式
│── components                          # 公共组建
    │── header                              # 标题栏
│── modules                             # 功能模块
    │── api                                 # 接口
    │── auth                                # 授权
    │── bury                                # 埋点
    │── chat                                # 聊天室
    │── constant                            # 全局常量
    │── event                               # 全局 EventBus 事件分发
    │── net                                 # 网络及环境
    │── store                               # 数据存储 - ❗️注意：不要代码中直接调用wx.setStore,getStore❗️
    │── system                              # 系统API封装
│── pages                               # 主包-重要的界面
    │── cart                              # 购物车
        │── inventory                        # 订单商品明细
        │── payment                          # 订单支付
        │── widget                           # 组件
    │── home                              # 首页
        │── activity                         # 各种活动
        │── goods_detail                     # 商品详情
        │── search                           # 商品搜索
        │── widget                           # 组件
    │── my                                # 我的
        |── about                            # 商品详情
        |── feedback                         # 意见反馈
        |── login                            # 登录
        |── red_packed                       # 红包
        |── setting                          # 设置
        |── vip_code                         # 会员卡
    │── scan                              # 扫一扫
    │── sort                              # 分类
        │── goods                             # 商品列表
        │── widget                            # 组件
    │── test                              # 测试
    │── web_page                          # 各种h5加载
│── page_sundries                               # 分包-不重要的二级界面
    │── components                          # 分包组件
    │── images                              # 分包图片
    │── pages                               # 分包页面
        │── account                             # 账号相关
            │── foot_print                          # 足迹
            │── password                            # 修改密码
            │── score                               # 积分
            │── send_card                           # 发送名片
            │── sign                                # 登记
            │── verify_phone                        # 验证手机号
        │── brand                               # 品牌详情
        │── counselor                           # 在线顾问
        │── invoice                             # 发票
        │── logistics                           # 物流
        │── message                             # 消息
        │── order                               # 订单
        │── pay                                 # 支付中心
        │── preview                             # 预览视频，图片
        │── shop                                # 选择门店
│── page_minor                               # 分包-不重要的二级界面
    │── components                          # 分包组件
        │── icon                                # 图标
    │── images                              # 分包图片
        │── icon                                # 小图标-❗️注意：按功能命名❗️
        │── img                                 # 图片
    │── pages                               # 分包-页面
        │── addres                              # 收货地址
        │── coupon                              # 优惠券
        │── location                            # 选择地址
│── utils                               # 帮助类库
    │── app                                 # 系统，日志，启动App场景，更新，二维码
    │── encrypt                             # 加解密
    │── sort                                # 排序
    │── index.js                            # 统一帮助类
    │── tools.wxs                           # 统一wxs封装

├── eslintrc                            # eslint配置文件
│── app.js                              # App 入口文件
├── app.json                            # 项目页面配置
│── Guide.md                            # 项目结构
│── project.config.json                 # 小程序配置
│── README.md                           # 项目规范

```
