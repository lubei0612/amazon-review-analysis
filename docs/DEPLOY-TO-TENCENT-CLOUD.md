# 🚀 腾讯云部署指令

## 📋 本次更新内容

### ✅ 已修复和优化：

1. **简化"查看全部"弹窗标题**
   - 原标题：`⚡ xx - 快速分析数据（基于100条评论分析）`
   - 新标题：`📊 xx - 查看全部`

2. **两级分析系统完整实现**
   - ⚡ Chrome插件：快速分析（100条评论）
   - 📊 Web端：完整分析（1000条评论）

3. **后端完整支持analysisMode**
   - API接收并保存analysisMode参数
   - TaskService存储分析模式
   - 分析结果meta包含analysisMode标识

4. **前端数据修复**
   - 统一百分比格式化（修复0.16%显示问题）
   - 移除ReviewDialog的结果数量显示
   - 为空的reason字段添加默认值"暂无说明"

---

## 🔧 腾讯云服务器部署步骤

### 方法一：一键部署（推荐）

复制以下**完整命令**到腾讯云服务器执行：

```bash
cd /opt/amazon-review-analysis && \
git pull origin main && \
docker-compose down && \
docker-compose up -d --build && \
echo "等待容器启动..." && \
sleep 30 && \
echo "检查容器状态..." && \
docker-compose ps && \
echo "最新日志..." && \
docker-compose logs --tail=30
```

---

### 方法二：分步部署（便于观察）

#### 步骤1：进入项目目录

```bash
cd /opt/amazon-review-analysis
```

#### 步骤2：拉取最新代码

```bash
git pull origin main
```

**预期输出**：
```
remote: Enumerating objects: ...
Updating 468a825..4f06f44
Fast-forward
 chrome-extension/content.js        | 3 +--
 src/services/ApiRoutes.js          | 4 +++-
 src/services/TaskService.js        | 2 ++
 TWO-TIER-ANALYSIS-SYSTEM.md        | 333 ++++++++++++++++++++++++++++++
 4 files changed, 342 insertions(+), 8 deletions(-)
```

#### 步骤3：停止旧容器

```bash
docker-compose down
```

**预期输出**：
```
Stopping amazon-review-frontend ... done
Stopping amazon-review-backend  ... done
Removing amazon-review-frontend ... done
Removing amazon-review-backend  ... done
```

#### 步骤4：重新构建并启动

```bash
docker-compose up -d --build
```

**预期输出**：
```
Building backend...
Building frontend...
Creating amazon-review-backend  ... done
Creating amazon-review-frontend ... done
```

#### 步骤5：等待容器启动

```bash
sleep 30
```

#### 步骤6：检查容器状态

```bash
docker-compose ps
```

**预期输出**：
```
           Name                         Command               State                  Ports
-------------------------------------------------------------------------------------------------------
amazon-review-backend    docker-entrypoint.sh node ...   Up (healthy)   0.0.0.0:8088->8088/tcp
amazon-review-frontend   nginx -g daemon off;            Up (healthy)   0.0.0.0:8089->8089/tcp
```

#### 步骤7：查看日志（确认无错误）

```bash
docker-compose logs -f --tail=50
```

**按 Ctrl+C 退出日志查看**

---

## 🔍 验证部署

### 1. 健康检查

```bash
# 后端健康检查
curl http://localhost:8088/api/health

# 前端健康检查
curl http://localhost:8089
```

### 2. 浏览器访问

- **前端**：http://43.130.35.117:8089
- **后端API**：http://43.130.35.117:8088/api/health

### 3. 功能验证清单

#### Chrome插件验证：
- [ ] 按钮显示 `⚡ 快速分析 (100条)`
- [ ] 点击后显示 "正在创建快速分析任务..."
- [ ] 分析完成后每模块显示Top 5
- [ ] "查看全部"弹窗标题为 `📊 xx - 查看全部`
- [ ] 底部按钮显示 `📊 Web端完整分析（所有评论）→`

#### Web端验证：
- [ ] 创建新报告（ASIN: `B0CHWRXH8B`）
- [ ] 报告页面显示 `📊 完整分析` 绿色徽章
- [ ] 百分比显示正常（如 28.5%，不是 0.285%）
- [ ] 所有模块数据完整
- [ ] 可正常下载、翻译、导出

---

## 🐛 故障排查

### 问题1：容器无法启动

```bash
# 查看详细错误
docker-compose logs backend
docker-compose logs frontend

# 检查端口占用
lsof -ti:8088 | xargs kill -9
lsof -ti:8089 | xargs kill -9

# 重新启动
docker-compose up -d
```

### 问题2：前端无法访问后端

```bash
# 检查Docker网络
docker network ls
docker network inspect amazon-review-analysis_default

# 重建网络
docker-compose down
docker network prune -f
docker-compose up -d
```

### 问题3：代码未更新

```bash
# 强制重新构建
docker-compose down -v
docker system prune -af
git pull origin main
docker-compose up -d --build --force-recreate
```

### 问题4：端口冲突

```bash
# 查找占用8088端口的进程
lsof -i:8088
# 杀死进程
kill -9 <PID>

# 查找占用8089端口的进程
lsof -i:8089
# 杀死进程
kill -9 <PID>
```

---

## 📊 系统状态监控

### 查看容器状态

```bash
docker-compose ps
```

### 查看容器资源使用

```bash
docker stats
```

### 查看实时日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 只查看后端日志
docker-compose logs -f backend

# 只查看前端日志
docker-compose logs -f frontend
```

### 查看最近50行日志

```bash
docker-compose logs --tail=50
```

---

## 🔄 回滚到上一版本（如果需要）

```bash
cd /opt/amazon-review-analysis
git log --oneline -5  # 查看最近5次提交
git reset --hard 468a825  # 回滚到上一版本
docker-compose down
docker-compose up -d --build
```

---

## 📝 更新日志

### Commit: `4f06f44`

**标题**：fix: Simplify modal title and add backend support for analysisMode

**更改文件**：
1. `chrome-extension/content.js` - 简化弹窗标题
2. `src/services/ApiRoutes.js` - API支持analysisMode
3. `src/services/TaskService.js` - 保存和返回analysisMode
4. `TWO-TIER-ANALYSIS-SYSTEM.md` - 完整系统文档（新增）

**核心改进**：
- ✅ Chrome插件"查看全部"弹窗标题简化
- ✅ 后端完整支持两级分析系统
- ✅ 分析模式在整个数据流中正确传递和显示

---

## 🎯 测试建议

### 1. Chrome插件快速分析测试

```
1. 访问Amazon产品页面
2. 点击插件 "⚡ 快速分析 (100条)"
3. 等待约30秒
4. 验证分析结果显示
5. 点击"查看全部"验证弹窗标题
6. 点击"Web端完整分析"验证跳转
```

### 2. Web端完整分析测试

```
1. 访问 http://43.130.35.117:8089
2. 创建新报告（ASIN: B0CHWRXH8B）
3. 等待约2-3分钟
4. 验证报告显示 "📊 完整分析" 徽章
5. 验证百分比显示正确
6. 验证所有模块数据完整
```

---

## ⚡ 快速命令参考

```bash
# 部署
cd /opt/amazon-review-analysis && git pull && docker-compose down && docker-compose up -d --build

# 查看日志
docker-compose logs -f --tail=50

# 重启服务
docker-compose restart

# 完全重建
docker-compose down -v && docker system prune -af && docker-compose up -d --build

# 检查健康
curl http://localhost:8088/api/health && curl -I http://localhost:8089
```

---

## 📞 支持信息

- **服务器IP**：43.130.35.117
- **后端端口**：8088
- **前端端口**：8089
- **Git仓库**：https://github.com/lubei0612/amazon-review-analysis.git
- **最新Commit**：4f06f44

---

## ✅ 部署完成检查

完成以下检查后，部署即为成功：

- [ ] `docker-compose ps` 显示两个容器都是 `Up (healthy)`
- [ ] 前端可访问：http://43.130.35.117:8089
- [ ] 后端健康检查通过：http://43.130.35.117:8088/api/health
- [ ] 日志中无ERROR级别错误
- [ ] Chrome插件按钮显示正确文字
- [ ] Web端可创建新报告并显示分析模式徽章

**部署愉快！🎉**













