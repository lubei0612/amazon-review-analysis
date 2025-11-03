# 📂 Batch Files Guide / 批处理文件指南

## 🎯 Available Scripts / 可用脚本

项目根目录包含 **4个核心批处理文件**，涵盖所有常用操作：

### 1. 🚀 START.bat
**主启动脚本 - Main Startup Script**

提供完整的启动菜单：
- **[1] 标准模式** - 仅启动后端API（推荐，配合Chrome插件使用）
- **[2] 完整模式** - 启动后端 + Web前端（开发/演示用）
- **[3] 仅前端** - 只启动Web界面（需要后端已运行）

**使用方式：**
```bash
# 双击运行或命令行执行
START.bat
```

**适用场景：**
- 首次使用，不确定启动哪个模式
- 需要Web前端进行演示
- 开发测试需要完整环境

---

### 2. ⚡ START-BACKEND.bat
**快速启动后端 - Quick Start Backend Only**

快速启动后端API服务，无需菜单选择。

**使用方式：**
```bash
# 双击运行或命令行执行
START-BACKEND.bat
```

**适用场景：**
- 日常使用Chrome插件进行评论分析
- 只需要API服务，不需要Web界面
- 快速启动测试

**服务信息：**
- API地址：http://localhost:3001
- 健康检查：http://localhost:3001/api/health

---

### 3. 🧪 TEST-FULL-ANALYSIS.bat
**全量分析测试 - Full Volume Analysis Test**

测试全量评论分析功能的专用脚本。

**使用方式：**
```bash
# 双击运行或命令行执行
TEST-FULL-ANALYSIS.bat
```

**功能特性：**
- ✅ 自动检查系统环境（Node.js、依赖）
- ✅ 验证API Key配置（RapidAPI、Gemini）
- ✅ 运行完整的全量分析测试
- ✅ 显示详细的测试结果

**测试内容：**
1. 全量爬取评论（无数量限制）
2. 深度AI分析（7个维度并发）
3. 性别比例识别（male/female/unknown）
4. 消费者画像分析（demographics, usageTime, usageLocation, behaviors）
5. 百分比精确到小数点后2位

**预期输出：**
```
📥 步骤1: 全量爬取评论
   ✅ 爬取完成！共获取 157 条评论

🤖 步骤2: 深度AI分析
   ✅ AI分析完成！耗时: 45.32秒

📊 步骤3: 分析结果展示
   性别比例：
      男性: 12.35%
      女性: 28.67%
      未知: 58.98%
   
   人群特征（TOP 3）：
      1. 婴儿父母: 24.15%
         详细原因说明...
```

**适用场景：**
- 测试全量分析功能是否正常
- 验证新的ASIN产品
- 性能测试和调试
- 检查AI分析质量

---

### 4. 🛑 STOP-ALL.bat
**停止所有服务 - Stop All Services**

一键停止所有正在运行的后端和前端服务。

**使用方式：**
```bash
# 双击运行或命令行执行
STOP-ALL.bat
```

**停止的服务：**
- ✅ 后端API服务（Node.js on port 3001）
- ✅ Web前端服务（Vite on port 5173）
- ✅ 所有相关的Node.js进程

**适用场景：**
- 关闭所有服务
- 重启系统前清理
- 端口被占用需要释放

---

## 🔄 典型使用流程

### 场景1：日常使用Chrome插件分析评论

```bash
1. 双击 START-BACKEND.bat         # 启动后端
2. 打开Chrome浏览器
3. 访问Amazon产品页
4. 点击Chrome插件图标
5. 开始分析评论
6. 完成后双击 STOP-ALL.bat       # 停止服务
```

### 场景2：Web界面演示

```bash
1. 双击 START.bat                  # 选择[2]完整模式
2. 浏览器自动打开 http://localhost:5173
3. 输入ASIN进行分析
4. 查看分析结果
5. 完成后双击 STOP-ALL.bat
```

### 场景3：测试全量分析功能

```bash
1. 双击 TEST-FULL-ANALYSIS.bat    # 运行测试
2. 等待测试完成（1-5分钟）
3. 查看终端输出的详细结果
4. 验证性别比例、人群特征等数据
```

---

## ⚙️ 配置要求

所有脚本运行前会自动检查：

### 必需项 ✅
- **Node.js**: v18.x 或更高版本
- **.env文件**: 包含必要的API密钥
  - `RAPIDAPI_KEY`: RapidAPI服务密钥
  - `GEMINI_API_KEY`: Gemini AI密钥

### 自动处理 ⚡
- 依赖安装：首次运行自动执行 `npm install`
- 环境检测：自动检测Node.js版本和.env配置
- 错误提示：配置缺失时显示详细说明

---

## 🚨 常见问题

### Q1: 双击bat文件后闪退？
**原因：** Node.js未安装或.env文件缺失

**解决：**
```bash
1. 安装Node.js (https://nodejs.org/)
2. 复制 env.example 为 .env
3. 填写API密钥
4. 重新运行bat文件
```

### Q2: 端口被占用？
**错误：** `Error: listen EADDRINUSE: address already in use :::3001`

**解决：**
```bash
1. 双击 STOP-ALL.bat 停止所有服务
2. 或手动关闭占用端口的进程
3. 重新启动
```

### Q3: TEST-FULL-ANALYSIS.bat 测试失败？
**可能原因：**
- API Key未配置或无效
- 网络连接问题
- RapidAPI配额用尽

**解决：**
```bash
1. 检查.env文件中的API密钥
2. 验证网络连接
3. 查看RapidAPI账户配额
4. 查看logs/目录日志文件
```

---

## 📊 文件对比

| 文件名 | 大小 | 功能 | 使用频率 |
|--------|------|------|----------|
| **START.bat** | ~6.5KB | 完整启动菜单 | ⭐⭐⭐ 中等 |
| **START-BACKEND.bat** | ~1.4KB | 快速启动后端 | ⭐⭐⭐⭐⭐ 最高 |
| **TEST-FULL-ANALYSIS.bat** | ~7.5KB | 测试全量分析 | ⭐⭐ 测试时 |
| **STOP-ALL.bat** | ~1.9KB | 停止所有服务 | ⭐⭐⭐⭐ 高 |

---

## 🔧 技术细节

### 脚本功能
所有脚本都包含：
1. **UTF-8编码支持**（chcp 65001）
2. **自动环境检测**（Node.js、.env）
3. **依赖自动安装**（首次运行）
4. **友好错误提示**（配置缺失时）
5. **彩色终端输出**（增强可读性）

### 兼容性
- ✅ Windows 10/11
- ✅ PowerShell 5.x+
- ✅ Command Prompt (cmd.exe)
- ✅ Windows Terminal

---

## 📝 更新日志

### v2.0 (2025-11-03)
- ✅ 删除所有重复和过时的bat文件
- ✅ 保留4个核心脚本
- ✅ 新增 TEST-FULL-ANALYSIS.bat 测试脚本
- ✅ 统一使用英文命名（避免中文显示问题）
- ✅ 增强错误检测和提示

### v1.0 (2025-11-02)
- 初始版本，包含多个启动脚本

---

## 🎯 推荐使用

| 场景 | 推荐脚本 |
|------|----------|
| **日常使用** | START-BACKEND.bat |
| **首次使用** | START.bat (选择模式) |
| **功能测试** | TEST-FULL-ANALYSIS.bat |
| **关闭服务** | STOP-ALL.bat |
| **Web演示** | START.bat (选择[2]完整模式) |

---

**快速启动：** 大多数情况下，双击 `START-BACKEND.bat` 即可开始使用！🚀

