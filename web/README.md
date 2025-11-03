# 即贸 Amazon评论分析工具 - Web端

基于Vue 3 + Element Plus + ECharts开发的Amazon商品评论智能分析报告系统。

## 📋 项目简介

本项目是即贸Amazon评论分析工具的Web端详细报告页面，提供以下6大分析维度：

1. **👥 消费者画像** - 4个堆叠柱状图分析用户角色、使用时间、使用地点和行为
2. **🎯 使用场景** - 垂直列表展示产品使用场景及占比
3. **⭐ 星级影响度** - 散点图分析不同话题对星级的影响
4. **👍 产品体验** - 负向和正向观点分析，帮助改进产品
5. **🛒 购买动机** - 分析客户购买产品的核心原因
6. **📋 未被满足的需求** - 识别产品改进空间

## 🚀 快速开始

### 环境要求

- Node.js >= 16.x
- npm >= 8.x

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问: http://localhost:3000

### 构建生产版本

```bash
npm run build
```

构建输出目录: `dist/`

### 预览生产构建

```bash
npm run preview
```

## 📁 项目结构

```
web/
├── src/
│   ├── components/          # Vue组件
│   │   ├── ConsumerProfile.vue       # 消费者画像
│   │   ├── UsageScenarios.vue        # 使用场景
│   │   ├── StarRatingImpact.vue      # 星级影响度
│   │   ├── ProductExperience.vue     # 产品体验
│   │   ├── PurchaseMotivation.vue    # 购买动机
│   │   └── UnmetNeeds.vue            # 未被满足的需求
│   ├── views/               # 页面视图
│   │   └── ReportDetail.vue          # 报告详情页
│   ├── router/              # 路由配置
│   │   └── index.js
│   ├── mock/                # Mock数据
│   │   └── earbuds-data.js           # 耳机Demo数据
│   ├── styles/              # 全局样式
│   │   └── global.scss
│   ├── App.vue              # 根组件
│   └── main.js              # 入口文件
├── index.html               # HTML模板
├── vite.config.js           # Vite配置
├── package.json             # 项目依赖
└── README.md                # 项目说明
```

## 🎨 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite 5
- **UI组件库**: Element Plus
- **图表库**: ECharts + vue-echarts
- **路由**: Vue Router 4
- **HTTP客户端**: Axios
- **样式**: SCSS
- **数据导出**: xlsx + html2canvas

## 📊 组件功能

### 1. 消费者画像 (ConsumerProfile)

- 4个维度的堆叠柱状图
- 正向/负向提及数据可视化
- 支持翻译（中英文切换）
- 导出功能（XLSX 4个sheet，PNG）

### 2. 使用场景 (UsageScenarios)

- 垂直列表展示
- 蓝色进度条显示占比
- 初始显示TOP 10，支持加载更多
- 导出功能（CSV，PNG）

### 3. 星级影响度 (StarRatingImpact)

- 散点图展示话题与星级关系
- 4星参考线区分好评/差评话题
- 红绿双色区分
- 导出功能（CSV，PNG）

### 4. 产品体验 (ProductExperience)

- 负向观点（红色进度条）
- 正向观点（绿色进度条）
- 独立的加载更多功能
- 导出功能（CSV包含类型列，PNG）

### 5. 购买动机 (PurchaseMotivation)

- 蓝色进度条列表
- 初始显示TOP 10
- 导出功能（CSV，PNG）

### 6. 未被满足的需求 (UnmetNeeds)

- 蓝色进度条列表
- 初始显示TOP 10
- 导出功能（CSV，PNG）

## 🌐 Demo案例

目前提供3个Demo案例:

1. **Wireless Bluetooth Earbuds** (无线蓝牙耳机)
   - ASIN: demo-earbuds
   - 访问路径: `/report/demo-earbuds`

2. **Apple Slicer** (苹果切片器)
   - ASIN: demo-apple-slicer
   - 访问路径: `/report/demo-apple-slicer`

3. **Laptop Backpack** (笔记本电脑背包)
   - ASIN: demo-laptop-backpack
   - 访问路径: `/report/demo-laptop-backpack`

## 🔧 配置说明

### Vite配置

- 端口: 3000
- 自动打开浏览器
- 路径别名: `@` -> `src/`
- 代码分割: element-plus, echarts独立打包

### 样式配置

- 全局重置样式
- 自定义滚动条
- 响应式设计（支持移动端）
- 模块化SCSS

## 📝 开发指南

### 添加新的Demo数据

1. 在 `src/mock/` 创建新的数据文件，如 `apple-slicer-data.js`
2. 在 `ReportDetail.vue` 的 `onMounted` 中添加路由判断
3. 访问对应的URL查看效果

### 自定义组件样式

所有组件样式都是scoped，可以直接修改组件内的 `<style>` 部分，或在 `src/styles/global.scss` 中添加全局样式。

### 修改颜色主题

在 `src/styles/global.scss` 中修改进度条颜色:

```scss
.progress-bar-fill {
  &.blue {
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
  }
  &.green {
    background: linear-gradient(90deg, #10b981, #34d399);
  }
  &.red {
    background: linear-gradient(90deg, #ef4444, #f87171);
  }
}
```

## 🔌 API集成

### 连接后端API

修改 `src/views/ReportDetail.vue` 中的数据加载逻辑:

```javascript
import axios from 'axios'

onMounted(async () => {
  const asin = route.params.asin
  
  try {
    const response = await axios.get(`/api/reports/${asin}`)
    productData.value = response.data
  } catch (error) {
    console.error('Failed to load report:', error)
  }
})
```

### API数据格式

后端API应返回与Mock数据相同的格式，参考 `src/mock/earbuds-data.js`。

## 📦 部署

### 静态部署

构建后将 `dist/` 目录上传到任何静态服务器（Nginx, Apache, CDN等）。

### Nginx配置示例

```nginx
server {
  listen 80;
  server_name your-domain.com;
  
  root /path/to/dist;
  index index.html;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
  
  # 启用Gzip压缩
  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Docker部署

```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🐛 常见问题

### 1. ECharts图表不显示

确保已正确安装依赖:

```bash
npm install echarts vue-echarts
```

### 2. XLSX导出失败

确保已安装xlsx库:

```bash
npm install xlsx
```

### 3. 图片导出模糊

在 `html2canvas` 调用中设置 `scale: 2` 可提高清晰度。

## 📄 许可证

Copyright © 2025 即贸技术团队. All rights reserved.

## 👥 贡献

欢迎提交Issue和Pull Request！

## 📧 联系我们

如有问题，请联系：support@jimao.com

---

**即贸提供AI支持** - 让Amazon运营更简单 🚀

