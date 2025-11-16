# Requirements Document - Gemini API配置验证

## Introduction

本需求文档定义了对Gemini API配置进行验证的要求，确保API密钥有效、配置正确，并且能够成功调用Gemini AI服务进行评论分析。

### 背景
用户提供了从Google AI Studio获取的Gemini API密钥，需要验证：
- API密钥格式和有效性
- 与Gemini服务的连接
- AI分析功能的可用性
- 与现有系统的集成

### 价值
- ✅ 确保AI分析功能可用
- ✅ 验证完整的评论分析流程
- ✅ 提供详细的错误诊断
- ✅ 确保系统端到端可用

## Requirements

### Requirement 1: API密钥配置验证

**User Story:** 作为系统管理员，我希望验证Gemini API密钥已正确配置，以便确保系统能够调用AI服务。

#### Acceptance Criteria

1. WHEN 检查环境变量 THEN 系统 SHALL 验证GEMINI_API_KEY已配置
2. WHEN 密钥存在 THEN 系统 SHALL 验证密钥格式非空
3. WHEN 密钥格式验证 THEN 系统 SHALL 检查密钥长度合理（>20字符）
4. WHEN 配置检查完成 THEN 系统 SHALL 记录配置状态到日志

### Requirement 2: Gemini服务连接测试

**User Story:** 作为开发人员，我希望测试与Gemini API的连接，以便确认服务可访问。

#### Acceptance Criteria

1. WHEN 初始化GeminiProvider THEN 系统 SHALL 成功创建实例
2. WHEN 发送测试请求 THEN 系统 SHALL 能够连接到Gemini API
3. IF 连接失败 THEN 系统 SHALL 提供详细的错误信息（认证、网络、配额等）
4. WHEN 连接成功 THEN 系统 SHALL 记录响应时间

### Requirement 3: AI分析功能测试

**User Story:** 作为质量工程师，我希望验证Gemini能够正确分析评论数据，以便确保核心功能可用。

#### Acceptance Criteria

1. WHEN 提供测试评论数据 THEN Gemini SHALL 返回分析结果
2. WHEN 分析完成 THEN 结果 SHALL 包含必需的字段（消费者画像、使用场景等）
3. WHEN 分析结果格式验证 THEN 数据 SHALL 符合系统预期格式
4. IF 分析失败 THEN 系统 SHALL 记录详细的错误信息
5. WHEN 分析成功 THEN 系统 SHALL 记录处理时间和token使用量

### Requirement 4: 端到端流程验证

**User Story:** 作为产品经理，我希望验证从评论爬取到AI分析的完整流程，以便确认系统整体可用。

#### Acceptance Criteria

1. WHEN 启动完整流程 THEN 系统 SHALL 使用RapidAPI爬取测试评论
2. WHEN 评论爬取成功 THEN 系统 SHALL 自动触发Gemini分析
3. WHEN AI分析完成 THEN 系统 SHALL 生成完整的6维度报告
4. WHEN 流程完成 THEN 系统 SHALL 显示总耗时和各阶段耗时
5. IF 任何步骤失败 THEN 系统 SHALL 明确指出失败原因

## Success Metrics

验证成功的标准：

1. **配置完整性**: GEMINI_API_KEY已配置且格式正确
2. **连接测试**: 能够成功连接Gemini API
3. **功能测试**: 能够成功分析测试数据
4. **端到端测试**: 完整流程成功率≥80%

---

**文档版本**: v1.0  
**创建日期**: 2025-11-03  
**状态**: 待验证

