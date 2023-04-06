# jgcrm-react-web

机构 CRM 标准版 WEB 端，基于 liteC5（C5 纯净开发版）项目创建，采用 React 重写。

## 特性

- 总体基于dva框架，使用antd组件

## 目录结构

```bash
├── /dist/           # 项目输出目录
├── /public/         # 公共文件，编译时copy至dist目录
├── /src/            # 项目源码目录
│ ├── /components/   # UI组件及UI相关方法
│ ├── /routes/       # 路由组件
│ ├── /models/       # 数据模型
│ ├── /services/     # 数据接口
│ ├── /themes/       # 项目样式
│ ├── /utils/        # 工具函数
│ │ ├── config.js    # 项目常规配置
│ │ ├── request.js   # 异步请求函数
│ ├── router.js      # 路由配置
│ ├── index.js       # 入口文件
│ └── index.ejs      # html模版文件
├── package.json     # 项目信息
├── .eslintrc        # Eslint配置
└── .webpackrc       # roadhog配置
```

## 快速访问

```bash
$ git clone http://git.apexsoft.top/InstitutionProduct/institution_standard_c5/jgcrm-react-web.git
$ cd jgcrm-react-web
$ yarn install
$ npm start          # 访问链接:http://localhost:8000
```

## 开发环境搭建
```bash
$ git config --global core.ignorecase false # 区分文件名大小写（方便重命名记录）
$ git config --global core.autocrlf input #（Linux Mac 操作系统设置为 input，windows 设置为 true）
$ git config --global core.safecrlf true
$ git config --global user.name 王XX
$ git config --global user.email WXXXXXXX@apexsoft.com.cn # 使用公司邮箱(即用于登录公司git的邮箱)
$ git clone http://git.apexsoft.top/InstitutionProduct/pledgeofshares/pos_frontend.git # (git config --global credential.helper store来保存git用户名密码了)
$ cd jgcrm-react-web
$ git checkout xxxxx(切换到对应分支)
$ git pull
$ yarn install # (需要先安装yarn, 可以使用npm命令安装 $ npm install -g yarn)
$ npm start          # 访问链接:http://localhost:8000
```

## 兼容性

现代浏览器及 IE11+。

## 常见问题
1. windows 下使用 yarn 安装 husky，git hooks 初始化失败  
 先使用 yarn add husky -D 安装，然后执行 node ./node_modules/husky/lib/installer/bin install 初始化（mac 系统可跳过）。
2. 目录名称大小写敏感
 git config core.ignorecase false 设置 Git 区分大小写，一般用于目录大小写变更失效时。
3. 打包
 依赖安装成功后，在项目根目录下执行 npm run build 生成 dist 包，一般用于服务器上部署前端代码。