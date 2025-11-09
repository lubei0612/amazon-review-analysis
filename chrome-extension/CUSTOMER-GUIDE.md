# 🚀 Chrome Extension Customer Deployment Guide
# Chrome 插件客户部署指南

[English](#english) | [中文](#chinese)

---

<a name="english"></a>
## English Version

### 1️⃣ Installation

#### Step 1: Download the Extension
Copy the entire `chrome-extension` folder to your local machine

#### Step 2: Open Chrome Extensions
1. Open Chrome browser
2. Visit `chrome://extensions/`
3. Enable **"Developer mode"** in the top right

#### Step 3: Load the Extension
1. Click **"Load unpacked"**
2. Select the `chrome-extension` folder
3. Extension installed successfully ✅

---

### 2️⃣ Configure Server (Required for First Use)

#### Step 1: Open Extension Settings
1. Click the **extension icon** in the browser toolbar
2. Click the **"⚙️ API Settings"** button

#### Step 2: Enter Server Address

**Default Configuration (Recommended)**
The extension is pre-configured with default server:
```
Backend Server: http://43.130.35.117:8088
Frontend URL:   http://43.130.35.117:8089
```

**Custom Configuration**
If you deployed your own server, modify the addresses:
```
Backend Server: http://YOUR-SERVER-IP:8088
Frontend URL:   http://YOUR-SERVER-IP:8089
```

#### Step 3: Save Configuration
1. Click **"💾 Save Configuration"**
2. Wait for **"✅ Configuration Saved"**
3. (Optional) Click **"🔍 Test Server Connection"** to verify

---

### 3️⃣ Usage

1. **Visit an Amazon Product Page**
   ```
   https://www.amazon.com/dp/B0CHWRXH8B
   ```

2. **Open the Extension**
   Click the extension icon in toolbar

3. **Start Analysis**
   Click **"Start Analysis"** button

4. **View Results**
   - Full report opens automatically
   - Or view summary on Amazon page

---

### 4️⃣ Troubleshooting

**Q: Extension shows "❌ Not a product page"?**
- Ensure you're on an Amazon product page (URL contains `/dp/` or `/product/`)

**Q: Cannot connect to server?**
1. Check server address is correct
2. Ensure server is running
3. Click "🔍 Test Server Connection" to diagnose

**Q: Analysis failed?**
1. Check network connection
2. Verify server configuration
3. Check browser console (F12) for errors

---

<a name="chinese"></a>
## 中文版本

### 1️⃣ 安装插件

#### 步骤 1：下载插件文件
将整个 `chrome-extension` 文件夹复制到本地

#### 步骤 2：打开 Chrome 扩展管理
1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 打开右上角的**"开发者模式"**

#### 步骤 3：加载插件
1. 点击**"加载已解压的扩展程序"**
2. 选择 `chrome-extension` 文件夹
3. 插件安装成功 ✅

---

### 2️⃣ 配置服务器（首次使用必须配置）

#### 步骤 1：打开插件设置
1. 点击浏览器右上角的**插件图标**
2. 点击**"⚙️ API 设置"**按钮

#### 步骤 2：填写服务器地址

**默认配置（推荐）**
插件已自动配置默认服务器，无需修改：
```
服务器地址: http://43.130.35.117:8088
前端地址:   http://43.130.35.117:8089
```

**自定义配置**
如果您部署了自己的服务器，请修改为您的服务器地址：
```
服务器地址: http://您的服务器IP:8088
前端地址:   http://您的服务器IP:8089
```

#### 步骤 3：保存配置
1. 点击**"💾 保存配置"**按钮
2. 等待显示 **"✅ 配置已保存"**
3. （可选）点击**"🔍 测试服务器连接"**验证

---

### 3️⃣ 开始使用

1. **访问 Amazon 产品页面**
   ```
   https://www.amazon.com/dp/B0CHWRXH8B
   ```

2. **打开插件**
   点击浏览器右上角的插件图标

3. **开始分析**
   点击**"开始分析"**按钮

4. **查看结果**
   - 分析完成后自动打开完整报告页面
   - 或在 Amazon 页面上查看简要分析

---

### 4️⃣ 常见问题

**Q: 插件显示"❌ 非产品页"？**
- 确保您访问的是 Amazon 产品详情页（URL包含 `/dp/` 或 `/product/`）

**Q: 无法连接到服务器？**
1. 检查服务器地址是否正确
2. 确保服务器已启动并正常运行
3. 点击"🔍 测试服务器连接"进行诊断

**Q: 分析失败怎么办？**
1. 检查网络连接
2. 确认服务器配置正确
3. 查看浏览器控制台（F12）的错误信息

---

## 🎯 Quick Start Flow

```
1. Install Extension
   ↓
2. Configure Server (First time only)
   ↓
3. Visit Amazon Product Page
   ↓
4. Click Extension Icon
   ↓
5. Click "Start Analysis"
   ↓
6. View Analysis Report
```

---

## 📞 Support

- **GitHub**: https://github.com/lubei0612/amazon-review-analysis
- **Technical Support**: support@your-company.com

---

**Enjoy using the extension!** 🎉

