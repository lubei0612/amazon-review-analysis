# Requirements Document

## Introduction

修复Web端报告页面的数据渲染和UI显示问题。当前系统已完成基础功能开发，但存在多个关键问题：部分维度数据缺失、图表渲染不完整、翻译功能异常、UI颜色不符合设计规范、以及用户体验问题（如文本超出界面）。

此修复将确保所有7个分析维度的数据完整性、视觉一致性和良好的用户体验。

## Alignment with Product Vision

根据产品定位（AI-powered Amazon评论分析工具），本次修复直接影响核心价值交付：
- 确保AI分析结果完整呈现（消费者画像、使用场景、星级影响度等）
- 提升数据可视化质量（图表完整性、颜色规范）
- 改善用户体验（响应式布局、文本截断、翻译功能）
- 符合"简约设计"原则（KISS原则）

## Requirements

### Requirement 1: 消费者画像数据完整性

**User Story:** 作为产品分析师，我希望看到完整的消费者画像数据（包含4-5星和1-3星的对比），以便全面了解不同评价用户的特征差异

#### Acceptance Criteria

1. WHEN 用户查看消费者画像模块 THEN 系统 SHALL 显示四个维度的图表：人物角色、使用时刻、使用地点、行为
2. WHEN 系统渲染每个维度的柱状图 THEN 每条数据 SHALL 同时包含绿色柱（4-5星）和红色柱（1-3星）
3. WHEN AI分析返回数据 THEN 每个维度 SHALL 至少包含5条关键词数据
4. WHEN 用户查看消费者画像 THEN 系统 SHALL 在底部显示3条原评论示例（引用提到关键词的真实评论）
5. IF 某个星级评论数量为0 THEN 系统 SHALL 显示0高度的柱子，而非隐藏

### Requirement 2: 使用场景数据优化

**User Story:** 作为产品经理，我希望看到至少10个使用场景及其完整的原因说明，以便快速了解产品的主要应用领域

#### Acceptance Criteria

1. WHEN AI分析使用场景 THEN 系统 SHALL 识别并返回至少10个不同的使用场景
2. WHEN AI生成场景原因 THEN 系统 SHALL 确保原因文本简洁清晰（建议控制在200字以内）
3. WHEN 系统渲染场景原因 THEN 文本 SHALL 完整显示，允许最多显示两行（line-clamp: 2）
4. IF 原因文本超过两行显示空间 THEN 系统 SHALL 提供点击展开功能查看完整内容
5. WHEN 用户查看场景原因列 THEN 文本 SHALL 完全显示在界面内，不出现横向滚动或溢出
6. WHEN 系统显示场景提及占比 THEN SHALL 同时显示百分比和具体评论数（如"14.3% (123条)"）

### Requirement 3: 星级影响度数据完整性

**User Story:** 作为数据分析师，我希望看到每个星级（1-5星）至少10个关注点，以便深入理解不同评价用户的诉求差异

#### Acceptance Criteria

1. WHEN AI分析星级影响度 THEN 系统 SHALL 识别每个星级（1-5星）的关注点
2. WHEN 系统渲染星级关注点 THEN 每个星级 SHALL 至少包含10条正向或负向关注点
3. WHEN 用户查看星级影响度 THEN 系统 SHALL 显示散点图（X轴：星级，Y轴：情感倾向）
4. WHEN 系统渲染散点图 THEN SHALL 清晰区分绿点（正向）和红点（负向）
5. WHEN 用户查看星级影响度 THEN 系统 SHALL NOT 显示星级卡片列表（仅保留散点图和关注点列表）

### Requirement 4: 产品体验数据完整性

**User Story:** 作为产品负责人，我希望看到完整的正向和负向观点（各至少8条），以便平衡地了解产品优劣势

#### Acceptance Criteria

1. WHEN AI分析产品体验 THEN 系统 SHALL 识别至少8条负向观点和8条正向观点
2. WHEN 系统渲染产品体验 THEN 负向观点 SHALL 排在正向观点之前
3. WHEN 用户查看每条观点 THEN 系统 SHALL 显示：观点名称、提及占比、详细原因（限150字）
4. IF 某类观点数量不足8条 THEN 系统 SHALL 在前端显示警告提示"数据量较少，仅供参考"

### Requirement 5: 翻译功能修复

**User Story:** 作为国际用户，我希望点击"翻译"按钮能正常切换中英文，而不是内容消失

#### Acceptance Criteria

1. WHEN 用户点击任意模块的"翻译"按钮 THEN 系统 SHALL 切换该模块的显示语言（中文↔英文）
2. WHEN 翻译切换后 THEN 内容 SHALL 保持显示，不应消失或隐藏
3. WHEN 显示中文时 THEN 按钮文本 SHALL 显示"翻译"或"Translate"
4. WHEN 显示英文时 THEN 按钮文本 SHALL 显示"中文"或"Chinese"
5. WHEN 用户刷新页面 THEN 系统 SHALL 重置为中文显示

### Requirement 6: UI颜色规范统一

**User Story:** 作为用户，我希望界面采用简约一致的配色方案，提升视觉专业度

#### Acceptance Criteria

1. WHEN 系统渲染任何渐变元素 THEN SHALL 使用蓝色系渐变（#3B82F6 → #2563EB），替代紫色
2. WHEN 系统显示正向数据 THEN SHALL 使用绿色 #10B981
3. WHEN 系统显示负向数据 THEN SHALL 使用红色 #EF4444
4. WHEN 系统渲染背景 THEN SHALL 使用浅灰 #FAFBFC
5. WHEN 系统显示文字 THEN SHALL 使用深灰 #1F2937（主文字）和 #6B7280（次要文字）

### Requirement 7: 响应式布局优化

**User Story:** 作为用户，我希望所有内容都完整显示在界面内，并能查看完整信息

#### Acceptance Criteria

1. WHEN 文本内容较长 THEN 系统 SHALL 优先完整显示（允许2行），而非截断
2. WHEN 表格列过宽 THEN 系统 SHALL 限制最大宽度并使用line-clamp控制行数
3. WHEN 用户在不同屏幕尺寸查看 THEN 系统 SHALL 保持良好的可读性
4. IF 内容超过2行显示空间 THEN 系统 SHALL 提供展开按钮查看完整内容
5. WHEN 用户hover长文本 THEN 系统 SHALL 显示完整内容的tooltip

## Non-Functional Requirements

### Code Architecture and Modularity
- **组件复用**: 共享的图表组件（柱状图、散点图）应提取为独立组件
- **数据验证**: 前端应验证AI返回的数据完整性，缺失时显示友好提示
- **状态管理**: 翻译状态应在各组件间独立管理，避免相互影响

### Performance
- 图表渲染性能：ECharts初始化时间 < 500ms
- 翻译切换响应时间 < 100ms
- 数据处理：支持处理500+条评论的分析结果

### Usability
- 所有交互元素应有明确的视觉反馈（hover、active状态）
- 数据缺失时应显示友好的空状态提示
- 长文本应提供完整内容的查看方式（tooltip或展开）

### Reliability
- AI分析返回异常数据时，前端应能正常降级显示
- 翻译功能异常时，应保持中文显示，不影响核心功能

