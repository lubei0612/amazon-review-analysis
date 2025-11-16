# Requirements: Web Report Enhancement (Web端报告增强)

**Spec Name**: `web-report-enhancement`
**Created**: 2025-11-05
**Status**: Draft

## 1. Problem Statement (问题陈述)

当前系统存在以下关键问题：

### 1.1 紧急技术问题
- **API配额耗尽**：Gemini API配额已用完，导致所有分析失败
- **数据渲染错误**：前端显示旧的缓存数据（耳机案例）而非最新分析结果
- **路由配置问题**：从详情页点击首页图标无法正确返回
- **用户体验问题**：创建报告后直接跳转到详情页等待，而非在列表中显示进度

### 1.2 功能缺失（对标 Shulex VOC）
参考网站：https://apps.voc.ai/voc
- 缺少报告元数据展示（分析的商品名称、评论数、创建时间）
- 缺少PDF报告下载功能
- 消费者画像缺少总结（最常提到的人群特征、使用时刻、使用地点、行为）
- 原评论无法放大查看完整内容
- 所有数据一次性渲染，缺少"加载更多"功能（应默认显示10条）
- 缺少竞品分析功能
- 评论抓取量限制（当前100条，Shulex可达19,836条）
- 缺少翻译功能

### 1.3 项目管理问题
- 缺少规范的Git代码管理
- Docker部署方案不完善
- 项目文件混乱（文档散落各处，多余的.bat文件）

## 2. User Stories (用户故事)

### 2.1 核心修复 (P0 - Critical)

**US-001: API配额管理**
```gherkin
As a: 系统管理员
I want to: 优雅地处理API配额耗尽的情况
So that: 用户能看到清晰的错误提示，而非系统崩溃

GIVEN API配额已耗尽
WHEN 用户发起新的分析任务
THEN 系统应返回友好的错误提示
AND 建议用户联系管理员或充值
AND 不应该返回旧的缓存数据
```

**US-002: 数据缓存清理**
```gherkin
As a: 终端用户
I want to: 看到最新的分析结果
So that: 我能基于准确数据做决策

GIVEN 新的分析任务已完成
WHEN 我查看报告详情页
THEN 应显示最新的分析数据
AND 清除所有旧的缓存数据
AND 如果分析失败，应显示错误而非旧数据
```

**US-003: 路由导航修复**
```gherkin
As a: 终端用户
I want to: 从报告详情页返回首页
So that: 我能继续浏览其他报告

GIVEN 我在报告详情页
WHEN 我点击侧边栏的"首页"图标
THEN 应正确跳转到首页
AND 显示完整的报告列表
```

**US-004: 报告创建体验优化**
```gherkin
As a: 终端用户
I want to: 在首页创建报告并查看进度
So that: 我能在列表中管理多个分析任务

GIVEN 我在首页点击"Create Report"
WHEN 我输入ASIN并确认
THEN 应在首页报告列表中新增一条记录
AND 显示"分析中"状态和进度条
AND 我可以继续浏览或创建其他报告
AND 分析完成后，列表中的状态更新为"已完成"
```

### 2.2 功能增强 (P1 - High Priority)

**US-005: 报告元数据展示**
```gherkin
As a: 终端用户
I want to: 在报告详情页看到完整的元数据
So that: 我了解分析的范围和质量

GIVEN 我打开一个报告详情页
WHEN 页面加载完成
THEN 应在顶部显示：
  - 产品名称（中英文）
  - 产品图片
  - ASIN
  - 已分析评论数（如：19,836）
  - 分析时间
  - 下载PDF按钮
```

**US-006: PDF报告导出**
```gherkin
As a: 终端用户
I want to: 下载完整的分析报告为PDF
So that: 我能离线查看或分享给同事

GIVEN 我在报告详情页
WHEN 我点击"下载报告"按钮
THEN 系统生成包含所有分析内容的PDF文件
AND 自动下载到本地
AND PDF包含所有图表、数据和格式
```

**US-007: 消费者画像总结**
```gherkin
As a: 市场分析师
I want to: 快速了解消费者画像的关键洞察
So that: 我能在30秒内抓住核心信息

GIVEN 我查看消费者画像模块
WHEN 页面渲染完成
THEN 应在顶部显示总结文本：
  "消费者最常提到的人群特征是son，使用时刻是everyday，
   使用地点是gym，行为是workout。关注这些热门关键词，
   挖掘消费者使用场景背后的痛点。"
AND 总结基于数据自动生成
```

**US-008: 原评论弹窗查看**
```gherkin
As a: 终端用户
I want to: 点击原评论卡片查看完整内容
So that: 我能阅读被省略的长评论

GIVEN 消费者画像或其他模块展示了原评论示例
WHEN 我点击某条评论卡片
THEN 弹出一个模态窗口
AND 显示完整的评论内容（无省略号）
AND 包含：评论者、评分、时间、完整文本
AND 可以点击"关闭"或遮罩关闭
```

**US-009: 数据分页加载**
```gherkin
As a: 终端用户
I want to: 默认只看到前10条数据
So that: 页面加载速度快，不会被信息淹没

GIVEN 任何数据列表模块（使用场景、产品体验等）
WHEN 页面首次加载
THEN 默认显示前10条数据
AND 底部显示"加载更多"按钮
AND 点击后加载下一批10条
AND 如果数据少于10条，不显示按钮
```

### 2.3 高级功能 (P2 - Medium Priority)

**US-010: 竞品分析**
```gherkin
As a: 产品经理
I want to: 对比多个竞品的分析数据
So that: 我能识别市场机会和威胁

GIVEN 我在报告详情页
WHEN 我点击"竞品分析"标签
THEN 显示对比表格
AND 包含4-5个竞品的核心数据（参考Shulex）
AND 可以点击竞品ASIN跳转到对应报告
```

**US-011: 大规模评论抓取**
```gherkin
As a: 数据分析师
I want to: 分析超过100条评论（理想情况下1000-20000条）
So that: 我能获得更全面和准确的洞察

GIVEN 我创建一个新的分析任务
WHEN 我选择"深度分析"模式
THEN 系统尝试抓取最多20,000条评论
AND 使用分批分析策略（避免AI token限制）
AND 显示实时进度（已抓取 X / 目标 Y）
```

**US-012: 国际化翻译**
```gherkin
As a: 国际用户
I want to: 选择界面语言（中文/英文）
So that: 我能用母语阅读报告

GIVEN 我在任意页面
WHEN 我点击语言切换按钮
THEN 界面文本切换到对应语言
AND 语言选择保存到localStorage
AND 下次访问时记住我的选择
```

### 2.4 技术债务 (P2 - Medium Priority)

**US-013: Git代码管理**
```gherkin
As a: 开发者
I want to: 规范的Git仓库和提交历史
So that: 我能追踪代码变更和协作开发

GIVEN 项目已初始化Git仓库
WHEN 我查看commit历史
THEN 看到清晰的提交信息
AND 敏感文件（.env）被.gitignore排除
AND 有合理的分支策略
```

**US-014: Docker部署优化**
```gherkin
As a: DevOps工程师
I want to: 一键部署到腾讯云
So that: 我能快速发布到生产环境

GIVEN Docker Compose文件已配置
WHEN 我运行docker-compose up
THEN 前后端服务同时启动
AND 环境变量从.env加载
AND Nginx反向代理配置正确
AND 服务健康检查通过
```

**US-015: 项目文件整理**
```gherkin
As a: 维护者
I want to: 清晰的项目文件结构
So that: 我能快速找到需要的文件

GIVEN 项目根目录
WHEN 我浏览文件结构
THEN 所有文档集中在docs/文件夹
AND 删除了多余的.bat文件（保留必要的）
AND README指向正确的文档
AND 有清晰的文件夹命名约定
```

## 3. Acceptance Criteria (验收标准)

### 3.1 功能性标准

1. **数据准确性**：
   - ✅ 新分析的数据正确显示，不混淆旧数据
   - ✅ API失败时显示错误，不返回缓存数据
   - ✅ 每个维度的数据与AI分析结果一致

2. **用户体验**：
   - ✅ 创建报告后留在首页，列表中显示进度
   - ✅ 从详情页可正确返回首页
   - ✅ 默认显示10条数据，支持加载更多
   - ✅ 原评论可点击放大查看

3. **性能**：
   - ✅ 首页加载时间 < 2秒
   - ✅ 报告详情页加载时间 < 3秒
   - ✅ PDF生成时间 < 10秒
   - ✅ 支持分析1000+条评论（分批处理）

4. **可靠性**：
   - ✅ API失败时优雅降级
   - ✅ 网络错误时显示友好提示
   - ✅ 浏览器刷新不丢失状态

### 3.2 非功能性标准

1. **代码质量**：
   - ✅ ESLint无错误
   - ✅ 组件复用率 > 60%
   - ✅ 关键函数有注释

2. **部署**：
   - ✅ Docker镜像构建成功
   - ✅ 一键部署到腾讯云
   - ✅ 服务健康检查通过

3. **文档**：
   - ✅ README完整清晰
   - ✅ 部署文档准确
   - ✅ API文档更新

## 4. Out of Scope (不包含的范围)

- ❌ 用户认证和权限管理（未来版本）
- ❌ 实时协作编辑报告（未来版本）
- ❌ 移动端原生APP（未来版本）
- ❌ 自动定时分析（未来版本）
- ❌ 邮件通知功能（未来版本）

## 5. Dependencies & Risks (依赖和风险)

### 5.1 外部依赖

| 依赖项 | 状态 | 风险级别 | 缓解措施 |
|--------|------|----------|----------|
| Gemini API | 配额耗尽 | 🔴 High | 立即充值或更换API Key |
| Apify API | 正常 | 🟡 Medium | 监控配额使用，设置告警 |
| 腾讯云服务器 | 待确认 | 🟡 Medium | 提前申请资源和权限 |

### 5.2 技术风险

| 风险 | 概率 | 影响 | 应对策略 |
|------|------|------|----------|
| 大规模评论抓取可能被Amazon限流 | High | High | 实现速率限制和重试机制 |
| PDF生成占用大量服务器资源 | Medium | Medium | 使用队列异步处理 |
| 前端状态管理复杂度增加 | Medium | Low | 使用Pinia进行集中状态管理 |

## 6. Success Metrics (成功指标)

### 6.1 业务指标

- 📊 报告创建成功率 > 95%
- 📊 用户停留时间 > 5分钟
- 📊 PDF下载率 > 30%

### 6.2 技术指标

- 📊 API错误率 < 2%
- 📊 页面加载时间 < 3秒（P95）
- 📊 服务器CPU使用率 < 70%

### 6.3 用户满意度

- 📊 客户反馈评分 > 4.5/5
- 📊 Bug报告 < 5个/周

## 7. Timeline & Phases (时间线和阶段)

### Phase 1: 紧急修复（1天）
- 修复API配额问题
- 修复数据缓存问题
- 修复路由导航
- 优化创建报告流程

### Phase 2: 核心功能增强（2-3天）
- 报告元数据展示
- PDF导出功能
- 消费者画像总结
- 原评论弹窗
- 数据分页加载

### Phase 3: 高级功能（3-4天）
- 竞品分析
- 大规模评论抓取
- 国际化翻译

### Phase 4: 技术债务清理（1-2天）
- Git代码管理
- Docker部署优化
- 项目文件整理

**总预估时间：7-10天**

## 8. References (参考资料)

- Shulex VOC: https://apps.voc.ai/voc
- Apify API文档: https://docs.apify.com/
- Vue 3官方文档: https://vuejs.org/
- Element Plus: https://element-plus.org/
- jsPDF: https://github.com/parallax/jsPDF

## 9. Approval (批准)

- [ ] Product Owner: 用户需求确认
- [ ] Tech Lead: 技术可行性确认
- [ ] Designer: UI/UX设计确认

---

**Next Steps**: 
1. 获得需求批准
2. 创建 `design.md` 设计文档
3. 创建 `tasks.md` 任务清单
4. 开始实施

