# Tasks Document - UI数据渲染修复

## 任务概览

本任务列表将修复工作拆解为原子化的可执行任务，每个任务专注于单一问题域。

---

## Phase 1: 后端AI分析优化

- [x] 1.1 优化消费者画像Prompt - 确保4维度数据完整性
  - File: `src/ai/PromptTemplates.js` (method: `getConsumerProfilePrompt`)
  - 修改AI提示词，确保返回每个维度至少5条数据
  - 确保AI同时返回positiveCount（4-5星）和negativeCount（1-3星）
  - 添加"原评论示例"要求（3条评论）
  - _Leverage: 现有的PromptTemplates类结构_
  - _Requirements: 1.1 - 消费者画像数据完整性_
  - _Prompt: Role: AI Prompt Engineer specializing in Gemini API and data extraction | Task: Optimize getConsumerProfilePrompt method to ensure each dimension (persona, usageTime, usageLocation, behavior) returns at least 5 keywords with both positiveCount and negativeCount. Add requirement for 3 example reviews linking keywords to actual review content. | Restrictions: Do not change method signature, maintain existing JSON structure, ensure prompts are clear and unambiguous for Gemini AI | Success: AI consistently returns 5+ items per dimension, all items have both positive and negative counts (even if 0), includes 3 example reviews with dimension/keyword links_

- [x] 1.2 优化使用场景Prompt - 确保10+场景且原因简洁
  - File: `src/ai/PromptTemplates.js` (method: `getUsageScenariosPrompt`)
  - 修改AI提示词，要求至少10个使用场景
  - 明确要求reason字段控制在200字以内（简洁清晰）
  - 要求AI返回count字段（具体提及次数）
  - _Leverage: 现有的scenarios数据结构_
  - _Requirements: 2 - 使用场景数据优化_
  - _Prompt: Role: AI Prompt Engineer with expertise in scenario analysis and concise text generation | Task: Modify getUsageScenariosPrompt to require at least 10-15 usage scenarios. Instruct AI to keep reason field within 200 characters max, clear and concise. Add count field (integer) for number of mentions. | Restrictions: Maintain existing percentage calculation logic, do not change JSON structure beyond adding count field | Success: AI returns 10-15 scenarios consistently, reason texts are concise (<200 chars), count field is included and accurate_

- [x] 1.3 优化星级影响度Prompt - 确保每星级10+关注点
  - File: `src/ai/PromptTemplates.js` (method: `getStarRatingImpactPrompt`)
  - 完全重写Prompt，要求AI为每个星级（1-5）识别至少10个关注点
  - 数据结构：`{factor, rating: 1-5, sentiment: 'positive'|'negative', percentage, reason}`
  - 确保数据可用于散点图渲染（X轴=星级，Y轴=情感倾向）
  - _Leverage: 现有的ratingDistribution计算逻辑_
  - _Requirements: 3 - 星级影响度数据完整性_
  - _Prompt: Role: Data Analyst and AI Prompt Engineer specializing in rating analysis | Task: Completely rewrite getStarRatingImpactPrompt to extract at least 10 factors per star rating (1-5 stars). Each factor must include: factor name, rating (1-5), sentiment (positive/negative), percentage, and reason. Data must be structured for scatter plot visualization. | Restrictions: Do not change method signature, ensure consistent data format for all star levels | Success: AI returns 10+ factors per star rating, data includes all required fields, structured for scatter plot with X=rating, Y=sentiment_

- [x] 1.4 优化产品体验Prompt - 确保正向/负向各8+条
  - Files: 
    - `src/ai/PromptTemplates.js` (method: `getProductExperienceStrengthsPrompt`)
    - `src/ai/PromptTemplates.js` (method: `getProductExperienceWeaknessesPrompt`)
  - 修改两个方法的Prompt，明确要求至少8-10条数据
  - 确保reason字段控制在150字以内
  - 验证percentage格式（0-1小数）
  - _Leverage: 现有的strengths/weaknesses数据结构_
  - _Requirements: 4 - 产品体验数据完整性_
  - _Prompt: Role: Product Review Analyst and AI Prompt Engineer | Task: Modify both getProductExperienceStrengthsPrompt and getProductExperienceWeaknessesPrompt to require 8-10 items each. Instruct AI to keep reason field within 150 characters. Verify percentage is in decimal format (0-1). | Restrictions: Maintain existing percentage calculation, do not change desc/descCn structure | Success: AI returns 8-10 strengths and 8-10 weaknesses consistently, reasons are concise (<150 chars), percentages sum to ~1.0_

---

## Phase 2: 前端Vue组件修复

- [x] 2.1 修复ConsumerProfile组件 - 四维度图表渲染
  - File: `web/src/components/ConsumerProfile.vue`
  - 修复四个维度的柱状图配置，确保同时显示绿色柱（positiveCount）和红色柱（negativeCount）
  - 修复ECharts series配置：两个bar系列（positive/negative）
  - 处理count=0的情况：显示0高度柱子而非隐藏
  - 添加"原评论示例"区域（展示3条评论卡片）
  - _Leverage: 现有的ECharts柱状图配置, Element Plus Card组件_
  - _Requirements: 1.1 - 消费者画像数据完整性_
  - _Prompt: Role: Vue 3 Frontend Developer with ECharts expertise | Task: Fix ConsumerProfile.vue to render four dimension charts (persona, usageTime, usageLocation, behavior) correctly. Ensure each chart shows both green bars (positiveCount) and red bars (negativeCount) side by side. Handle zero values by showing 0-height bars. Add section below charts displaying 3 example review cards. | Restrictions: Do not change component props structure, use existing ECharts instance lifecycle, maintain current color scheme (green #10B981, red #EF4444) | Success: All four charts render correctly with both positive and negative bars, zero counts show as empty bars, 3 example reviews displayed with rating/userName/content_

- [x] 2.2 修复UsageScenarios组件 - 表格优化（2行+展开+tooltip）
  - File: `web/src/components/UsageScenarios.vue`
  - 修改表格渲染，确保显示10+条场景数据
  - 提及占比列：显示格式"percentage% (count条)"
  - 原因列优化：
    - CSS: `display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden`
    - 添加"展开"按钮（超过2行时显示）
    - 添加Tooltip（hover显示完整内容）
  - _Leverage: Element Plus Table, Tooltip组件_
  - _Requirements: 2 - 使用场景数据优化, 7 - 响应式布局优化_
  - _Prompt: Role: Vue 3 Frontend Developer specializing in Element Plus and responsive tables | Task: Optimize UsageScenarios.vue table to display 10+ scenarios. Format percentage column as "XX% (XX条)". Optimize reason column with CSS line-clamp (2 lines max), add expand button for long text, add tooltip on hover for full content. | Restrictions: Do not break existing table sorting/filtering, use Element Plus Tooltip component, maintain table responsiveness | Success: Table shows 10+ scenarios, percentage displays with count, reason text shows max 2 lines with expand button for longer text, hover tooltip shows full reason_

- [x] 2.3 修复StarRatingImpact组件 - 散点图渲染
  - File: `web/src/components/StarRatingImpact.vue`
  - 重新实现散点图配置：
    - X轴：1-5星（categorical）
    - Y轴：情感倾向（positive=1, negative=-1）
    - 数据点：绿色=positive，红色=negative
  - 渲染数据列表：按星级分组显示，每个星级至少10条关注点
  - 删除星级卡片UI（简化设计）
  - _Leverage: ECharts scatter图表类型_
  - _Requirements: 3 - 星级影响度数据完整性_
  - _Prompt: Role: Data Visualization Developer with ECharts scatter plot expertise | Task: Rebuild StarRatingImpact.vue scatter plot configuration. X-axis: 1-5 stars (categorical), Y-axis: sentiment (1=positive, -1=negative). Plot points with green (#10B981) for positive, red (#EF4444) for negative. Display data list grouped by star rating (10+ factors per rating). Remove star rating card UI. | Restrictions: Do not change component props, maintain existing chart container sizing, ensure chart is responsive | Success: Scatter plot renders correctly with all star ratings on X-axis, points colored by sentiment, data list shows 10+ factors per star, no card UI present_

- [x] 2.4 修复ProductExperience组件 - 正向/负向观点渲染
  - File: `web/src/components/ProductExperience.vue`
  - 确保负向观点（weaknesses）排在前面，正向观点（strengths）排在后面
  - 确保各显示至少8条数据
  - 原因列优化：限制2行+展开按钮+tooltip
  - 百分比格式化：0.35 → "35.0%"
  - 数据不足时显示警告："数据量较少，仅供参考"
  - _Leverage: Element Plus Table, Alert组件_
  - _Requirements: 4 - 产品体验数据完整性, 7 - 响应式布局优化_
  - _Prompt: Role: Vue 3 Developer with experience in data formatting and user feedback | Task: Fix ProductExperience.vue to display weaknesses first, then strengths (8+ items each). Format percentages as "XX.X%". Optimize reason column with 2-line clamp + expand button + tooltip. Show warning alert if data has fewer than 8 items. | Restrictions: Maintain existing data structure, use Element Plus Alert for warnings, ensure table is readable | Success: Weaknesses displayed before strengths, each section has 8+ items, percentages formatted correctly, reason text limited to 2 lines with expand/tooltip, warning shown for insufficient data_

---

## Phase 3: 翻译功能修复

- [x] 3.1 修复所有组件的翻译功能 - 中英文切换
  - Files:
    - `web/src/components/ConsumerProfile.vue`
    - `web/src/components/UsageScenarios.vue`
    - `web/src/components/StarRatingImpact.vue`
    - `web/src/components/ProductExperience.vue`
    - `web/src/components/PurchaseMotivation.vue`
    - `web/src/components/UnmetNeeds.vue`
  - 为每个组件添加独立的`currentLang` ref ('zh' | 'en')
  - 使用computed属性根据currentLang选择显示字段（keyword/keywordCn, desc/descCn）
  - 修复toggleLanguage方法：切换语言，不隐藏内容
  - 按钮文本：根据当前语言显示"翻译"（中文状态）或"中文"（英文状态）
  - _Leverage: Vue 3 Composition API (ref, computed)_
  - _Requirements: 5 - 翻译功能修复_
  - _Prompt: Role: Vue 3 Developer with i18n experience | Task: Fix translation functionality in all 6 components (ConsumerProfile, UsageScenarios, StarRatingImpact, ProductExperience, PurchaseMotivation, UnmetNeeds). Add independent currentLang ref to each component. Use computed properties to select display fields based on language. Implement toggleLanguage to switch language without hiding content. Update button text based on current language state. | Restrictions: Do not use global i18n library, keep translation state independent per component, do not change data structure | Success: Clicking translate button switches language smoothly, content remains visible during switch, button text reflects current state, all components work independently_

---

## Phase 4: UI颜色统一

- [x] 4.1 全局替换紫色为蓝色 - 统一配色方案
  - Files: 搜索所有`.vue`文件中的紫色代码
  - 搜索关键词：`#667eea`, `#764ba2`, `purple`, `violet`
  - 替换规则：
    - `#667eea` → `#3B82F6`
    - `#764ba2` → `#2563EB`
    - `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` → `linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)`
  - 保持不变：绿色#10B981（正向）、红色#EF4444（负向）、背景#FAFBFC、文字#1F2937/#6B7280
  - _Leverage: 全局搜索替换工具_
  - _Requirements: 6 - UI颜色规范统一_
  - _Prompt: Role: Frontend Developer with expertise in CSS and design systems | Task: Perform global search and replace of purple colors to blue in all Vue components. Search for #667eea, #764ba2, purple, violet keywords. Replace with blue equivalents (#3B82F6, #2563EB). Maintain existing green/red/gray colors for data visualization. | Restrictions: Do not change structural CSS, only replace color values, verify no unintended replacements | Success: All purple colors replaced with blue, no visual regressions, color scheme is consistent across all components, positive/negative/neutral colors unchanged_

---

## Phase 5: 端到端验证

- [x] 5.1 使用Chrome DevTools验证所有修复
  - 启动后端和前端服务
  - 使用Chrome DevTools MCP访问 http://localhost:3002
  - 创建新报告，等待AI分析完成
  - 逐一验证每个模块：
    - 消费者画像：4维度图表、绿红柱子、原评论示例
    - 使用场景：10+场景、2行文本、展开/tooltip
    - 星级影响度：散点图、10+关注点/星级
    - 产品体验：8+正向、8+负向、负向在前
    - 翻译功能：所有模块切换正常、内容不消失
    - UI颜色：全部蓝色系、无紫色残留
  - 记录所有发现的问题，并修复
  - _Leverage: Chrome DevTools MCP工具_
  - _Requirements: All_
  - _Prompt: Role: QA Engineer with expertise in end-to-end testing and Chrome DevTools | Task: Perform comprehensive end-to-end verification of all fixes using Chrome DevTools MCP. Start services, create new report, verify all requirements: ConsumerProfile (4 dimensions with green/red bars + examples), UsageScenarios (10+ scenarios with 2-line text + expand/tooltip), StarRatingImpact (scatter plot + 10+ factors per star), ProductExperience (8+ items each, negatives first), Translation (all modules work without hiding content), UI Colors (all blue, no purple). Document all issues found. | Restrictions: Test in real browser environment, do not mock data, verify all user interactions | Success: All modules render correctly, all data requirements met, translation works smoothly, UI colors are consistent blue, no bugs or visual issues found_

- [ ] 5.2 修复验证中发现的问题（如有）
  - 根据5.1的验证结果，修复所有发现的问题
  - 重新验证修复效果
  - 确保所有需求都已完美实现
  - _Leverage: 相关组件和Prompt文件_
  - _Requirements: All_
  - _Prompt: Role: Senior Full-stack Developer with debugging expertise | Task: Fix all issues discovered during end-to-end verification (task 5.1). Address each issue systematically, re-verify fixes, ensure all requirements are perfectly implemented. | Restrictions: Do not introduce new bugs, maintain code quality, follow existing patterns | Success: All issues from verification are resolved, re-verification passes completely, system meets all requirements without any compromises_

---

## Phase 6: 文档和清理

- [x] 6.1 更新docs文档，记录修复内容
  - File: `docs/UI数据渲染修复完成-2025-11-07.md`
  - 创建修复总结文档，包含：
    - 修复的问题列表
    - 技术方案概述
    - AI Prompt优化要点
    - Vue组件修复要点
    - 验证结果截图
  - _Leverage: 现有的docs目录结构_
  - _Requirements: All（文档记录）_
  - _Prompt: Role: Technical Writer with software development background | Task: Create comprehensive fix summary document in docs/UI数据渲染修复完成-2025-11-07.md. Include: list of fixed issues, technical approach summary, AI prompt optimization highlights, Vue component fix highlights, verification results with screenshots. | Restrictions: Write in clear Chinese, focus on successful cases only (as per user's development habit), do not document failed attempts | Success: Document is clear and comprehensive, covers all fixes, provides good reference for future development_

- [ ] 6.2 用spec-workflow工具记录实现日志
  - 使用`log-implementation`工具记录所有任务的实现细节
  - 记录修改的文件、新增的artifacts（组件、方法、配置）
  - 提供统计信息（代码行数变更）
  - _Leverage: spec-workflow log-implementation工具_
  - _Requirements: All（实现记录）_
  - _Prompt: Role: DevOps Engineer with expertise in implementation tracking | Task: Use log-implementation tool to record all task implementation details. For each completed task, log: taskId, summary, filesModified, filesCreated, statistics (linesAdded, linesRemoved), and artifacts (components, functions, apiEndpoints, integrations). Ensure comprehensive tracking for future AI agents to discover existing code. | Restrictions: Must provide detailed artifacts field, follow tool's schema exactly, record all significant changes | Success: All tasks logged with detailed artifacts, implementation history is searchable, future AI agents can discover this work to avoid duplication_

---

## 任务执行指南

1. **按顺序执行**：从Phase 1开始，依次完成每个任务
2. **标记进度**：开始任务时改为`[- ]`，完成时改为`[x]`
3. **使用_Prompt**：每个任务的_Prompt字段提供了详细的执行指导
4. **验证完成**：每个Phase完成后，运行相关测试验证效果
5. **记录日志**：完成关键任务后，使用log-implementation工具记录

## 预期成果

- ✅ AI分析返回完整数据（消费者画像4维度、使用场景10+、星级影响度10+/星级、产品体验8+）
- ✅ 所有Vue组件正确渲染数据（图表、表格、列表）
- ✅ 翻译功能正常（中英文切换不消失）
- ✅ UI颜色统一（全部蓝色系）
- ✅ 响应式布局优化（文本2行+展开+tooltip）
- ✅ Chrome DevTools验证通过（无bug、无视觉问题）

