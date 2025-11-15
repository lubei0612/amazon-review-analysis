# 🔌 MCP服务器使用指南

## 📋 已配置的MCP服务器

我们已经为项目配置了3个MCP服务器，它们可以增强AI助手的能力：

### 1️⃣ Spec Workflow MCP
**功能**：结构化规范驱动开发工作流工具

**配置信息**：
```json
{
  "command": "npx",
  "args": ["-y", "@pimzino/spec-workflow-mcp@latest", "d:\\Users\\Desktop\\maijiaplug"]
}
```

**主要功能**：
- ✅ 创建和管理开发规范（specs）
- ✅ 自动任务分解和执行追踪
- ✅ 实时Web仪表板（运行在 http://localhost:5000）
- ✅ 审批系统和版本控制
- ✅ 支持多语言（中文、英文等）

**使用示例**：

```
# 创建新规范
"Create a spec for user authentication feature"
"为用户认证功能创建一个规范"

# 查看所有规范
"List my specs"
"列出所有规范"

# 执行特定任务
"Execute task 1.2 in spec user-auth"
"执行 user-auth 规范中的任务 1.2"

# 查看规范状态
"Show status of spec user-auth"
"显示 user-auth 规范的状态"
```

**启动Web仪表板**（可选）：
```bash
npx -y @pimzino/spec-workflow-mcp@latest --dashboard
```
仪表板地址：http://localhost:5000

---

### 2️⃣ Chrome DevTools MCP
**功能**：Chrome浏览器自动化和性能分析

**配置信息**：
```json
{
  "command": "npx",
  "args": ["-y", "chrome-devtools-mcp@latest"]
}
```

**主要功能**：
- ✅ 网站性能追踪和分析
- ✅ 网络请求调试
- ✅ 自动化截图
- ✅ 控制台日志分析
- ✅ 基于Puppeteer的可靠自动化

**使用示例**：

```
# 性能分析
"Check the performance of https://www.amazon.com"
"分析Amazon网站的性能"

# 网站截图
"Take a screenshot of https://example.com"
"截取示例网站的截图"

# 网络请求分析
"Analyze network requests for https://example.com"
"分析示例网站的网络请求"

# 控制台日志
"Check console logs for https://example.com"
"检查示例网站的控制台日志"
```

**应用场景**：
- 本项目的Web端性能测试
- Chrome扩展的自动化测试
- 页面截图和UI验证

---

### 3️⃣ Outscraper MCP
**功能**：数据抓取服务（已配置）

**配置信息**：
```json
{
  "command": "uvx",
  "args": ["outscraper-mcp-server"],
  "env": {
    "OUTSCRAPER_API_KEY": "***"
  }
}
```

---

## 🚀 如何使用

### 在Windsurf中使用

MCP服务器会自动加载，你只需要在对话中提到相关功能即可：

**Spec Workflow示例**：
```
请帮我创建一个关于Amazon评论分析性能优化的规范
```

**Chrome DevTools示例**：
```
请测试我们项目的Web端首页性能（http://localhost:8089）
```

### 验证MCP服务器状态

在Windsurf/Cascade中，MCP服务器会在首次使用时自动启动。你可以通过以下方式验证：

1. **查看工具列表**：询问AI"你有哪些可用的工具？"
2. **直接使用**：按照上面的示例提示词进行测试

---

## 📚 详细文档

### Spec Workflow MCP
- GitHub: https://github.com/Pimzino/spec-workflow-mcp
- 提示词指南: https://github.com/Pimzino/spec-workflow-mcp/blob/main/docs/PROMPTING-GUIDE.md

### Chrome DevTools MCP
- GitHub: https://github.com/ChromeDevTools/chrome-devtools-mcp
- 工具参考: https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md
- 故障排查: https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/troubleshooting.md

---

## 🎯 项目应用场景

### 1. 使用Spec Workflow管理开发任务

```
创建一个规范：优化Amazon评论爬虫性能
包含以下任务：
1. 分析当前爬虫瓶颈
2. 实现并发爬取策略
3. 添加请求缓存
4. 性能测试和验证
```

### 2. 使用Chrome DevTools测试Web端

```
请使用Chrome DevTools测试以下页面的性能：
1. http://localhost:8089 (首页)
2. http://localhost:8089/report/123 (报告页)
分析加载时间、资源大小、网络请求等
```

### 3. 组合使用

```
1. 使用Chrome DevTools分析当前Web端性能
2. 基于分析结果，使用Spec Workflow创建优化规范
3. 执行优化任务
4. 再次使用Chrome DevTools验证优化效果
```

---

## 🔧 配置文件位置

MCP配置文件：`.cursorrules-mcp.json`

```json
{
  "mcpServers": {
    "outscraper": {
      "command": "uvx",
      "args": ["outscraper-mcp-server"],
      "env": {
        "OUTSCRAPER_API_KEY": "***"
      }
    },
    "spec-workflow": {
      "command": "npx",
      "args": [
        "-y",
        "@pimzino/spec-workflow-mcp@latest",
        "d:\\Users\\Desktop\\maijiaplug"
      ]
    },
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest"
      ]
    }
  }
}
```

---

## ⚠️ 注意事项

### Spec Workflow
- 第一次使用时会自动下载安装
- 建议先启动Web仪表板查看可视化界面
- 所有规范数据保存在 `.spec-workflow/` 目录

### Chrome DevTools
- 需要本地安装Chrome浏览器
- 第一次使用时会自动启动Chrome实例
- 请勿在浏览器中输入敏感信息（AI可以访问浏览器内容）

### 性能建议
- MCP服务器按需启动，不使用时不会占用资源
- Chrome DevTools会启动独立的Chrome实例，使用完后会自动关闭
- Spec Workflow的仪表板可以保持运行，用于监控所有项目

---

## 🎉 快速开始测试

### 测试Spec Workflow
```
请帮我创建一个简单的测试规范，名称为"hello-spec"，包含一个任务"说你好"
```

### 测试Chrome DevTools
```
请检查 https://developers.chrome.com 的性能
```

成功后你就可以在项目开发中使用这些强大的工具了！

---

**最后更新**: 2025-11-15  
**配置版本**: v1.0.0
