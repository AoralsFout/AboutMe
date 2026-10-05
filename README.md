# AboutMe · 关于我

一个展示个人信息、技术栈、项目经历与兴趣爱好的个人网站。前端使用 Vue 3、TypeScript 和 Vite，后端使用 Node.js 与 Express，接入 Steam 和 Bangumi 数据。

页面采用全屏布局，结合鼠标视差、入场动画与多种转场效果；也放进了一些个人偏好的小交互：可拖动的弹簧立牌、模拟终端，以及东方音乐电台。

## 功能与页面

| 页面 | 内容 |
| --- | --- |
| 首页 | 个人头像、打字机文案、电台播放与音频频谱 |
| 个人信息 | 个人介绍、教育经历、兴趣、图片与社交链接 |
| 技术栈 | 技术分类、代码片段与可交互的模拟终端 |
| 项目展示 | 项目列表、介绍、截图与相关链接 |
| ACGN | 动画收藏，以及漫画、游戏、轻小说等兴趣内容 |
| 游戏 | Steam 玩家资料、等级、游戏库、最近游玩与游戏时长 |
| 后记 | 开发记录、实现细节、参考链接与致谢 |

- **页面切换**：使用鼠标滚轮或页面导航切换，页面组件按需加载。
- **视觉交互**：鼠标移动视差、分层动画，以及条纹、粒子、碎片等转场效果。
- **模拟终端**：支持命令历史、Tab 补全与 ANSI 颜色渲染，可输入 `help` 查看命令。
- **动态数据**：通过后端获取 Steam 和 Bangumi 数据，前端统一显示请求错误提示。
- **在线电台**：播放东方音乐电台，展示当前曲目信息与音频频谱。

## 技术栈

| 部分 | 主要技术 |
| --- | --- |
| 前端 | Vue 3、TypeScript、Vite |
| 请求与展示 | Axios、Font Awesome、ansi-to-html |
| 动画与音频 | CSS 动画、Vue 响应式状态、Web Audio API |
| 后端 | Node.js、Express、TypeScript、dotenv |
| 外部数据 | Steam Web API、Steam 商店接口、Bangumi API |

## 本地运行

### 1. 环境准备

- Node.js：版本需满足 `^20.19.0 || >=22.12.0`，与根目录 `package.json` 的要求一致。
- npm：用于安装依赖和运行脚本。
- 动态数据与电台功能需要能够访问对应的外部服务。

### 2. 安装依赖

在项目根目录执行：

```sh
npm ci
npm --prefix server ci
```

前端与后端各自维护依赖和锁文件，需要分别安装。

### 3. 配置后端

在 `server/` 目录创建 `.env`，按需填写以下内容：

```dotenv
PORT=3030
STEAM_API_KEY=your_steam_web_api_key
STEAM_ID=your_steam_id_64
FAMILY_GROUP_ID=
BANGUMI_USERNAME=your_bangumi_username
BANGUMI_API_BASE_URL=https://api.bgm.tv
```

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `PORT` | 后端监听端口 | `3030` |
| `STEAM_API_KEY` | Steam Web API Key，供 Steam Web API 请求使用 | 空 |
| `STEAM_ID` | 默认查询的 Steam 64 位用户 ID | 空 |
| `FAMILY_GROUP_ID` | 家庭共享库接口使用的家庭组 ID，按需设置 | 空 |
| `BANGUMI_USERNAME` | 获取动画收藏的 Bangumi 用户名或用户 ID | `1254033` |
| `BANGUMI_API_BASE_URL` | Bangumi API 服务地址 | `https://api.bgm.tv` |

`server/.env` 已加入 `.gitignore`。Steam Key 保存在后端，不要写入前端代码或提交到仓库。Steam 数据的返回范围还取决于账号隐私设置和接口权限；只查看静态页面时可以暂不配置 Steam。

后端也支持通过 `HTTP_PROXY`、`HTTPS_PROXY` 或对应的小写环境变量设置外部请求代理，代理地址按本机环境填写。

### 4. 启动前后端

打开两个终端，均在项目根目录执行。

终端一，启动后端：

```sh
npm --prefix server run dev
```

终端二，启动前端：

```sh
npm run dev
```

访问 Vite 在终端中输出的地址，默认是 `http://localhost:5173`。后端默认运行在 `http://localhost:3030`，可访问 `/api/health` 检查服务状态。

开发环境下，Vite 将 `/api` 请求代理到 `http://localhost:3030`。如果修改后端端口，也需要同步修改 `vite.config.ts` 中的代理地址。

## 常用命令

以下命令均在项目根目录执行：

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动前端开发服务 |
| `npm run type-check` | 检查前端 Vue / TypeScript 类型 |
| `npm run build` | 构建前端，输出到根目录 `dist/` |
| `npm run preview` | 本地预览前端构建产物 |
| `npm --prefix server run dev` | 启动后端开发服务，监听文件变化 |
| `npm --prefix server run build` | 编译后端，输出到 `server/dist/` |
| `npm --prefix server start` | 运行已编译的后端 |

前端 `build` 脚本仅执行 Vite 构建，类型检查需要单独运行。

## 构建与部署

先完成依赖安装和后端环境配置，再执行：

```sh
npm run type-check
npm run build
npm --prefix server run build
npm --prefix server start
```

部署时需要同时提供静态页面和 API 服务：

1. 将根目录 `dist/` 交给 Nginx 等静态文件服务器。
2. 运行后端，并保留 `server/.env` 与 `server/fastfetch.txt`。
3. 将同一站点下的 `/api/` 请求反向代理到后端。

前端 API 客户端使用同源相对路径。Vite 的 `server.proxy` 只用于开发服务，生产部署需要自行配置反向代理；`npm run preview` 也不能替代完整的生产部署。

以下为 Nginx 配置片段，静态目录按实际部署路径修改：

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/aboutme/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3030;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

这里的 `proxy_pass` 保留 `/api/` 路径前缀，与后端路由一致。

## 项目结构

```text
AboutMe/
├── public/
│   ├── icons/                 # 技术栈图标
│   └── images/                # 页面插画、装饰与项目截图
├── src/
│   ├── api/client.ts          # Axios 客户端与全局错误提示
│   ├── components/            # 导航、电台、终端、弹簧立牌等组件
│   ├── composables/           # 页面切换、视差与提示逻辑
│   ├── pages/                 # 七个展示页面
│   ├── transitions/           # 页面转场效果
│   ├── types/                 # 页面组件接口等类型
│   ├── App.vue                # 页面编排与电台音频管理
│   └── main.ts                # 前端入口
├── server/
│   ├── src/
│   │   ├── routes/            # 基础、Steam 与 Bangumi 路由
│   │   ├── services/          # 外部 API 请求与数据处理
│   │   ├── config.ts          # 环境变量与服务配置
│   │   └── index.ts           # Express 入口
│   ├── fastfetch.txt          # 模拟终端使用的展示文本
│   └── package.json           # 后端依赖与脚本
├── index.html                 # HTML 入口、全局字体与标题交互
├── vite.config.ts             # Vite 配置与开发代理
└── package.json               # 前端依赖与脚本
```

## 个性化修改

- **个人资料与社交链接**：修改 `src/pages/HomePage.vue` 和 `src/pages/InformationPage.vue`。
- **技术栈与终端**：修改 `src/pages/TechStackPage.vue` 和 `src/components/MockTerminal.vue`；`fastfetch` 展示内容来自 `server/fastfetch.txt`。
- **项目列表**：修改 `src/pages/ProjectsPage.vue` 中的 `projects` 数组，截图放在 `public/images/projects/`。
- **兴趣内容**：修改 `src/pages/ACGNPage.vue`，动画收藏账号通过 `BANGUMI_USERNAME` 配置。
- **游戏数据**：在后端 `.env` 中配置 Steam 账号；页面展示逻辑位于 `src/pages/GamingPage.vue`。
- **电台**：音频流地址在 `src/App.vue`，曲目信息请求在 `src/pages/HomePage.vue`，更换电台时需要一并调整。
- **页面与转场**：页面注册位于 `src/App.vue`，切换逻辑位于 `src/composables/usePageSwitcher.ts`，转场组件位于 `src/transitions/`。

个人文案、图片和部分链接直接保存在页面组件中，复用时需要逐项替换。字体、头像、封面和电台还使用了外部资源，加载效果会受到网络和资源服务状态影响。

## 致谢

感谢 Vue、Vite、TypeScript 等开源项目，以及提供数据的 Steam、Bangumi 和东方音乐电台。

项目中的第三方插画、字体、图标与媒体素材，其权利归各自权利人所有，复用时请遵循对应授权。
