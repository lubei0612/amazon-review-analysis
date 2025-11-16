# Requirements Document - RapidAPI评论采集功能测试与验证

## Introduction

本需求文档定义了对**RapidAPI评论采集功能**进行全面测试和验证的要求。RapidAPI服务商已通知服务现已可用，需要验证该服务能否稳定、准确地采集Amazon产品的所有评论，并确保其作为系统三层爬虫降级策略中的备用方案1能够正常工作。

### 背景
即贸Amazon评论分析系统采用三层爬虫降级策略：
- 🥇 **Outscraper**（主爬虫）- 高成功率，优先使用
- 🥈 **RapidAPI**（备用爬虫1）- 快速响应，自动降级 ← **本次测试重点**
- 🥉 **Puppeteer**（备用爬虫2）- 完全免费，终极方案

RapidAPI爬虫代码已实现（`src/crawler/RapidAPICrawler.js`）并集成到系统中，但尚未经过完整的功能验证。

### 价值
- ✅ 确保系统的高可用性（降级策略有效）
- ✅ 验证RapidAPI服务质量（评论数量、准确性、速度）
- ✅ 为生产环境部署提供可靠的测试数据
- ✅ 优化成本结构（RapidAPI比自建Puppeteer更快）

## Alignment with Product Vision

本测试方案支持项目的核心目标：

### 1. 高可用性保障
- **产品目标**: 确保用户无论何时都能获取评论数据
- **本方案**: 验证RapidAPI作为备用方案的可靠性，确保Outscraper失败时能无缝降级

### 2. 成本优化
- **产品目标**: 在保证质量的前提下控制API成本
- **本方案**: 验证RapidAPI的500次/月免费额度可用性，作为成本优化手段

### 3. 数据质量保证
- **产品目标**: 提供准确、完整的AI分析结果
- **本方案**: 验证RapidAPI采集的评论数据质量是否满足AI分析要求

### 4. 用户体验提升
- **产品目标**: 快速响应用户请求（60秒内完成分析）
- **本方案**: 验证RapidAPI的响应速度是否满足用户体验要求

## Requirements

### Requirement 1: 环境配置验证

**User Story:** 作为系统管理员，我希望能够验证RapidAPI的配置是否正确，以便确保系统能够正常调用RapidAPI服务。

#### Acceptance Criteria

1. WHEN 运行测试脚本 THEN 系统 SHALL 检查环境变量 `RAPIDAPI_KEY` 是否已配置
2. IF `RAPIDAPI_KEY` 未配置 THEN 系统 SHALL 显示明确的错误提示和配置指引
3. WHEN `RAPIDAPI_KEY` 已配置 THEN 系统 SHALL 验证API密钥格式是否正确（非空、长度合理）
4. WHEN 初始化RapidAPI爬虫 THEN 系统 SHALL 显示可用的Amazon站点列表（CA, UK, DE等）
5. WHEN 配置验证通过 THEN 系统 SHALL 记录配置信息到日志（密钥需脱敏显示）

### Requirement 2: API连接测试

**User Story:** 作为开发人员，我希望能够测试RapidAPI的连接状态，以便确认服务商的API端点是否正常工作。

#### Acceptance Criteria

1. WHEN 执行连接测试 THEN 系统 SHALL 向RapidAPI发送一个简单的测试请求
2. IF API响应成功（HTTP 200） THEN 系统 SHALL 显示"连接成功"提示
3. IF API响应失败（HTTP 401/403） THEN 系统 SHALL 显示"认证失败"错误并提供排查建议
4. IF API响应失败（HTTP 429） THEN 系统 SHALL 显示"速率限制"警告并建议等待
5. WHEN 连接测试完成 THEN 系统 SHALL 记录响应时间和HTTP状态码

### Requirement 3: 评论采集功能测试

**User Story:** 作为测试人员，我希望能够验证RapidAPI能否成功采集Amazon产品的评论，以便确认其核心功能正常。

#### Acceptance Criteria

1. WHEN 输入有效的ASIN THEN 系统 SHALL 调用RapidAPI获取该产品的评论
2. WHEN 评论采集开始 THEN 系统 SHALL 显示实时进度信息（当前数量/目标数量/进度百分比）
3. WHEN 评论采集成功 THEN 系统 SHALL 返回至少1条有效评论数据
4. IF 单次请求返回0条评论 THEN 系统 SHALL 记录警告并尝试下一页
5. WHEN 达到目标评论数 THEN 系统 SHALL 停止采集并返回结果
6. WHEN 采集过程中发生错误 AND 已获取部分评论 THEN 系统 SHALL 返回已获取的评论而非完全失败
7. WHEN 评论采集完成 THEN 系统 SHALL 记录总耗时和平均速度（评论/秒）

### Requirement 4: 评论数据格式验证

**User Story:** 作为数据工程师，我希望验证RapidAPI返回的评论数据格式是否符合系统要求，以便确保后续AI分析能够正常进行。

#### Acceptance Criteria

1. WHEN 获取到评论数据 THEN 每条评论 SHALL 包含必需字段（reviewId, asin, rating, content）
2. WHEN 验证评分字段 THEN rating值 SHALL 在1-5之间的数字
3. WHEN 验证内容字段 THEN content或title至少有一个非空
4. WHEN 验证作者字段 THEN author.name SHALL 存在（可以是"Anonymous"）
5. WHEN 验证日期字段 THEN date SHALL 是有效的日期对象或ISO格式字符串
6. WHEN 验证可选字段 THEN isVerified, helpfulVotes, images等字段存在但可为空
7. WHEN 数据格式验证失败 THEN 系统 SHALL 记录具体的验证错误信息

### Requirement 5: 多ASIN测试覆盖

**User Story:** 作为质量工程师，我希望能够测试多个不同的产品ASIN，以便验证RapidAPI的稳定性和适用性。

#### Acceptance Criteria

1. WHEN 执行完整测试 THEN 系统 SHALL 测试至少2个不同的热门产品ASIN
2. WHEN 测试多个ASIN THEN 每个ASIN SHALL 独立记录测试结果（通过/失败）
3. WHEN 单个ASIN测试失败 THEN 系统 SHALL 继续执行剩余测试而非中断
4. WHEN 所有测试完成 THEN 系统 SHALL 生成测试摘要报告（总数、通过数、失败数、成功率）
5. WHEN 测试之间切换 THEN 系统 SHALL 等待适当的时间间隔（避免速率限制）

### Requirement 6: 错误处理与降级测试

**User Story:** 作为系统架构师，我希望验证RapidAPI的错误处理机制，以及在RapidAPI失败时系统能否正确降级到Puppeteer。

#### Acceptance Criteria

1. WHEN RapidAPI返回速率限制错误（429） THEN 系统 SHALL 自动等待并重试
2. WHEN RapidAPI返回认证错误（401/403） THEN 系统 SHALL 抛出明确的认证失败错误
3. WHEN RapidAPI返回其他HTTP错误 AND 已有部分数据 THEN 系统 SHALL 返回部分数据而非失败
4. WHEN RapidAPI完全不可用 THEN CrawlerFacade SHALL 自动降级到Puppeteer爬虫
5. WHEN 降级发生 THEN 系统 SHALL 记录降级原因和时间到日志

### Requirement 7: 性能基准测试

**User Story:** 作为产品经理，我希望了解RapidAPI的性能表现，以便评估其是否满足60秒分析完成的用户体验目标。

#### Acceptance Criteria

1. WHEN 采集20条评论 THEN 系统 SHALL 在10秒内完成
2. WHEN 采集100条评论 THEN 系统 SHALL 在30秒内完成
3. WHEN 采集500条评论 THEN 系统 SHALL 在60秒内完成
4. WHEN 性能测试完成 THEN 系统 SHALL 显示每条评论的平均采集时间
5. IF 性能不达标 THEN 测试报告 SHALL 标记为"性能警告"并记录实际耗时

### Requirement 8: 与现有系统集成验证

**User Story:** 作为系统集成工程师，我希望验证RapidAPI能够与现有系统无缝集成，特别是与CrawlerFacade的降级策略和AI分析服务的对接。

#### Acceptance Criteria

1. WHEN RapidAPI作为备用爬虫 THEN CrawlerFacade SHALL 能够正确调用它
2. WHEN RapidAPI返回的数据 THEN DataCleaner SHALL 能够正常清洗处理
3. WHEN 评论数据传入AI分析 THEN AnalysisService SHALL 能够正常分析（格式兼容）
4. WHEN 完整流程测试 THEN 系统 SHALL 能从RapidAPI爬取到AI分析完整跑通
5. WHEN 集成测试完成 THEN 系统 SHALL 生成端到端测试报告

## Non-Functional Requirements

### Code Architecture and Modularity

- **单一职责原则**: 测试脚本应专注于RapidAPI功能验证，不涉及其他爬虫测试
- **模块化设计**: 测试用例应该独立可运行，支持单独执行某个测试场景
- **依赖管理**: 测试脚本应复用现有的RapidAPICrawler类，避免重复代码
- **清晰接口**: 测试结果应以标准化格式输出（JSON或结构化日志）

### Performance

- **测试执行时间**: 完整测试套件应在5分钟内完成
- **资源占用**: 测试过程中内存占用不应超过500MB
- **并发控制**: 遵守RapidAPI的速率限制（每秒最多2次请求）
- **超时设置**: 单个API请求超时时间设置为30秒

### Security

- **API密钥保护**: 测试脚本应从环境变量读取密钥，不得硬编码
- **日志脱敏**: 输出日志中的API密钥应脱敏显示（仅显示前10个字符）
- **数据隐私**: 测试获取的用户评论数据不应持久化存储（测试完成后清理）

### Reliability

- **错误恢复**: 单个测试用例失败不应影响其他测试用例执行
- **重试机制**: 对于速率限制错误应自动重试，最多3次
- **幂等性**: 测试脚本可以多次运行而不产生副作用
- **日志完整性**: 所有测试步骤和结果必须完整记录到日志

### Usability

- **清晰的输出**: 测试结果应使用表情符号和颜色区分（✅成功、❌失败、⏳进行中）
- **进度反馈**: 长时间运行的测试应显示实时进度
- **错误指引**: 测试失败时应提供明确的排查建议和解决方案
- **文档齐全**: 提供完整的测试指南和常见问题排查文档

### Maintainability

- **代码注释**: 关键测试逻辑应有详细注释说明
- **版本控制**: 测试脚本应纳入Git版本控制
- **测试数据管理**: 使用固定的热门产品ASIN作为测试数据（确保长期可用）
- **向后兼容**: 测试脚本应兼容Node.js 18+版本

## Success Metrics

测试成功的标准：

1. **功能完整性**: 所有8个需求的测试用例100%通过
2. **数据质量**: 采集的评论数据格式验证通过率≥95%
3. **性能达标**: 采集速度满足时间要求（20条<10秒，100条<30秒）
4. **成功率**: 多ASIN测试成功率≥80%
5. **集成兼容**: 端到端流程测试无阻塞性错误

## Out of Scope

本测试方案**不包括**以下内容：

- ❌ Outscraper爬虫的测试（已有独立测试）
- ❌ Puppeteer爬虫的测试（已有独立测试）
- ❌ AI分析功能的测试（已有独立测试）
- ❌ Web前端界面的测试
- ❌ Chrome扩展的测试
- ❌ 数据库存储功能的测试
- ❌ RapidAPI的成本分析和配额管理（已有文档）
- ❌ 生产环境部署和监控

## Dependencies

本测试依赖以下资源：

### 技术依赖
- Node.js 18+
- RapidAPICrawler类（`src/crawler/RapidAPICrawler.js`）
- Logger工具（`utils/logger.js`）
- dotenv库（环境变量加载）
- axios库（HTTP请求）

### 外部服务
- RapidAPI账号和有效的API密钥
- RapidAPI "Real-Time Amazon Data" API订阅
- 网络连接（访问RapidAPI服务）

### 测试数据
- 热门产品ASIN列表（如Apple AirPods Pro、Apple AirTag等）
- 这些产品需在加拿大Amazon站点（CA）有充足评论

## Risks and Mitigations

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| RapidAPI服务仍不稳定 | 高 | 准备详细的错误日志收集，及时反馈给服务商 |
| API配额不足 | 中 | 使用免费测试账号，每个测试用例仅采集20条评论 |
| 测试ASIN在CA站点无评论 | 中 | 准备多个备选ASIN，选择全球热门产品 |
| 速率限制导致测试时间过长 | 低 | 在测试用例之间添加适当延迟 |
| 数据格式变化 | 中 | 实现灵活的格式兼容逻辑，支持多种字段名 |

---

**文档版本**: v1.0  
**创建日期**: 2025-11-03  
**作者**: AI Assistant (Claude Sonnet 4.5)  
**审核状态**: 待审核

