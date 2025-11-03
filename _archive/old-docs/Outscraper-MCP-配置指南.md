# 🚀 Outscraper MCP Server 配置完成指南

## ✅ **已完成的步骤**

### 1. ✅ 安装 Python 环境
- Python 3.11.7 已就绪
- pip 23.2.1 已就绪

### 2. ✅ 安装依赖
- ✅ uv (Python 包管理工具)
- ✅ outscraper-mcp-server (0.1.2)
- ✅ fastmcp (2.12.5)
- ✅ outscraper (5.9.2)

### 3. ✅ API Key 配置
- **OUTSCRAPER_API_KEY**: `M2UyNTc2NDYyMjQxNDVmNjhiMDY2YzZlMDE4MDQ5MTJ8MjYyNTMwY2RhOA`

---

## 📝 **Cursor MCP 配置方法**

### **方法一：通过 Cursor 设置界面（推荐）**

1. **打开 Cursor 设置**
   - 按 `Ctrl + ,` 打开设置
   - 或点击左下角齿轮图标 → Settings

2. **找到 MCP 设置**
   - 搜索 "MCP" 或 "Model Context Protocol"
   - 找到 "MCP Servers" 配置项

3. **添加 Outscraper MCP Server**
   ```json
   {
     "mcpServers": {
       "outscraper": {
         "command": "uvx",
         "args": ["outscraper-mcp-server"],
         "env": {
           "OUTSCRAPER_API_KEY": "M2UyNTc2NDYyMjQxNDVmNjhiMDY2YzZlMDE4MDQ5MTJ8MjYyNTMwY2RhOA"
         }
       }
     }
   }
   ```

4. **保存并重启 Cursor**

---

### **方法二：手动编辑配置文件**

1. **找到 Cursor 配置文件**
   
   配置文件通常位于：
   ```
   C:\Users\你的用户名\AppData\Roaming\Cursor\User\settings.json
   ```
   
   或者（如果使用 Claude Dev 插件）：
   ```
   C:\Users\你的用户名\AppData\Roaming\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json
   ```

2. **编辑配置文件**
   
   在文件中添加或修改 `mcpServers` 配置：
   ```json
   {
     "mcpServers": {
       "outscraper": {
         "command": "uvx",
         "args": ["outscraper-mcp-server"],
         "env": {
           "OUTSCRAPER_API_KEY": "M2UyNTc2NDYyMjQxNDVmNjhiMDY2YzZlMDE4MDQ5MTJ8MjYyNTMwY2RhOA"
         }
       }
     }
   }
   ```

3. **保存文件并重启 Cursor**

---

### **方法三：使用项目配置文件（最简单）**

我已经在项目根目录创建了 `.cursorrules-mcp.json` 文件，包含完整配置。

如果 Cursor 支持项目级 MCP 配置，它会自动读取这个文件。

---

## 🧪 **测试 MCP 连接**

配置完成后，在 Cursor 中测试：

### **测试命令 1：搜索业务信息**
```
@outscraper 搜索纽约曼哈顿的餐厅
```

### **测试命令 2：获取 Amazon 评论**
```
@outscraper 获取 Amazon ASIN B0C4G36RNS 的评论
```

### **测试命令 3：Google Maps 评论**
```
@outscraper 获取 The NoMad Restaurant 的 Google Maps 评论
```

---

## 🎯 **Outscraper MCP Server 功能**

配置完成后，你可以通过自然语言在 Cursor 中直接使用以下功能：

### **1. Google Maps 数据提取**
- 🗺️ 搜索业务和地点
- ⭐ 提取客户评论
- 📸 获取地点照片
- 🧭 获取路线导航

### **2. 搜索与评论**
- 🔍 Google 搜索
- 📰 Google 新闻搜索
- 🛒 Amazon 产品信息
- 📝 Amazon 评论
- 🏨 Tripadvisor 评论
- 📱 Google Play / App Store 评论
- 📺 YouTube 评论

### **3. 商业智能**
- 📧 提取邮箱和联系信息
- 📞 电话号码验证
- 🏢 公司信息
- 📨 邮箱验证

### **4. 地理位置服务**
- 📍 地址转坐标（Geocoding）
- 🗺️ 坐标转地址（Reverse Geocoding）

---

## ⚠️ **常见问题**

### **Q1: Cursor 找不到 MCP 配置？**

**A:** 尝试以下步骤：
1. 确认 Cursor 版本支持 MCP（需要较新版本）
2. 检查配置文件路径是否正确
3. 重启 Cursor
4. 查看 Cursor 日志（Help → Toggle Developer Tools）

---

### **Q2: 提示 "uvx command not found"？**

**A:** 确保 uv 已安装：
```bash
pip install uv
```

然后验证：
```bash
uvx --version
```

---

### **Q3: API Key 无效？**

**A:** 检查：
1. API Key 是否正确复制
2. Outscraper 账户是否有余额
3. 在 [Outscraper Profile](https://app.outscraper.cloud/profile) 重新生成 API Key

---

## 📊 **使用成本**

- **Google Maps 搜索**: ~$2/1000 结果
- **评论提取**: ~$2/1000 条评论
- **其他服务**: 按需计费

查看详细价格：https://outscraper.com/pricing/

---

## 🔗 **相关链接**

- **Outscraper API 文档**: https://app.outscraper.cloud/api-docs
- **MCP Server GitHub**: https://github.com/outscraper/outscraper-mcp
- **Cursor 文档**: https://cursor.sh/docs

---

## 🎉 **下一步**

1. ✅ 重启 Cursor
2. ✅ 在对话中输入 `@outscraper` 测试
3. ✅ 尝试搜索 Google Maps 数据
4. ✅ 集成到你的项目工作流

**祝使用愉快！** 🚀


