// ========================
// AI Prompt 模板 - 六大维度分析
// ========================

class PromptTemplates {
  /**
   * 系统提示词（适用于所有分析）
   */
  static getSystemPrompt() {
    return `你是一位专业的Amazon产品评论分析专家，擅长从大量用户评论中提取关键信息和商业洞察。

你的分析风格：
- 数据驱动：基于评论内容的客观分析，不添加主观推测
- 结构化：使用清晰的分类和层次结构组织信息
- 量化：尽可能用数字和百分比表达观点的普遍性
- 可操作：提供具体的商业建议和改进方向

输出要求：
- 必须返回有效的JSON格式
- 所有字段都必须填写（不能为空或null）
- 百分比数字不要加%符号，直接返回数字
- 数据必须基于实际评论内容
- 使用中文输出`
  }

  /**
   * 1. 消费者画像分析（深度版本）
   */
  static getConsumerProfilePrompt(reviews) {
    const reviewText = reviews.slice(0, 200).map((r, i) => 
      `[${i+1}] 评分:${r.rating}星 | 作者:${r.author?.name || '匿名'} | ${r.title} | ${r.content}`
    ).join('\n')

    return `你是一位专业的消费者行为分析师。请基于以下Amazon产品评论，进行深度的消费者画像分析。

评论数据（共${reviews.length}条，分析前200条）：
${reviewText}

请严格按照以下JSON格式返回分析结果：

{
  "genderRatio": {
    "male": 7.23,
    "female": 31.45,
    "unknown": 61.32
  },
  "demographics": [
    {
      "persona": "婴儿父母",
      "percentage": 24.15,
      "reason": "许多评论提到为0-1岁婴儿购买，是最大的消费群体"
    },
    {
      "persona": "幼儿父母",
      "percentage": 14.50,
      "reason": "评论中频繁提及1-3岁幼儿使用场景"
    },
    {
      "persona": "孕妇/准妈妈",
      "percentage": 10.20,
      "reason": "部分评论提到为即将出生的宝宝准备"
    }
  ],
  "usageTime": [
    {
      "occasion": "生日派对",
      "percentage": 26.00,
      "reason": "许多评论提到在生日派对等特殊场合使用，强调了它适合此类活动"
    },
    {
      "occasion": "复活节",
      "percentage": 14.00,
      "reason": "一些评论指出这件衣服是在复活节庆祝活动中穿的，并指出了它的季节性"
    },
    {
      "occasion": "日常使用",
      "percentage": 12.00,
      "reason": "部分用户表示日常生活中经常使用"
    }
  ],
  "usageLocation": [
    {
      "place": "家庭聚会",
      "percentage": 20.00,
      "reason": "评论中经常提到在家庭聚会场合使用"
    },
    {
      "place": "户外活动",
      "percentage": 15.00,
      "reason": "用户提到在公园等户外场所使用"
    },
    {
      "place": "派对会场",
      "percentage": 10.00,
      "reason": "多次提到在派对等社交场合使用"
    }
  ],
  "behaviors": [
    {
      "behavior": "送礼",
      "percentage": 16.00,
      "reason": "许多评论提到购买这件衣服作为礼物送给新父母或孩子的礼物"
    },
    {
      "behavior": "拍照留念",
      "percentage": 10.00,
      "reason": "多个评论提到这件衣服非常适合拍照"
    },
    {
      "behavior": "等待特殊活动",
      "percentage": 9.00,
      "reason": "用户购买后等待特定场合再使用"
    }
  ]
}

**深度分析要求（必须严格遵守）：**

1. **性别比例识别（genderRatio）** - ⚠️ 最重要的分析维度：
   
   **🎯 多层次识别策略（按优先级从高到低）：**
   
   **第一层：直接性别线索词（最可靠，权重100%）**
   - 男性：he, him, his, son, boy, dad, father, husband, boyfriend, nephew, grandson, brother, man, male, gentleman, Mr., male customer
   - 女性：she, her, hers, daughter, girl, mom, mother, wife, girlfriend, niece, granddaughter, sister, woman, female, lady, Mrs., Ms., female customer
   
   **第二层：评论者姓名判断（可靠，权重90%）**
   - 常见男性名：John, Michael, David, James, Robert, William, Richard, Thomas, Mark, Daniel, etc.
   - 常见女性名：Mary, Jennifer, Linda, Patricia, Susan, Jessica, Sarah, Karen, Lisa, Nancy, Emily, etc.
   - 注意：如果姓名无法判断性别，归为unknown
   
   **第三层：购买关系推测（中等可靠，权重70%）**
   - "bought for my husband/boyfriend/dad/son" → 购买者可能是女性
   - "bought for my wife/girlfriend/mom/daughter" → 购买者可能是男性
   - "gift for him" → 购买者可能是女性
   - "gift for her" → 购买者可能是男性
   - "my husband loves it" → 评论者可能是女性
   - "my wife loves it" → 评论者可能是男性
   
   **第四层：产品类型推测（低可靠，权重40%，谨慎使用）**
   - 如果产品是女性专用（如女装、化妆品、女性护理用品）→ 推测女性比例更高（但不绝对，可能是男性送礼）
   - 如果产品是男性专用（如男装、男性美容用品、男性工具）→ 推测男性比例更高
   - 如果是中性产品（如电子产品、家居用品）→ 不做性别推测
   
   **第五层：语气和表达方式（最不可靠，权重20%，仅供参考）**
   - 细腻、情感化的表达可能偏向女性（但不绝对）
   - 简洁、技术化的表达可能偏向男性（但不绝对）
   
   **⚠️ 关键计算要求：**
   - male + female + unknown = 100.00（必须严格相加等于100，这是铁律！）
   - 百分比精确到小数点后2位（如：male: 35.00, female: 42.00, unknown: 23.00）
   - ⚠️ **验证公式：35.00 + 42.00 + 23.00 = 100.00 ✓**
   - 🎯 **目标识别率：male + female 必须 ≥ 30%**（Shulex标准是20%，我们要做到30%+）
   - 
   - ⚠️ **极度宽松策略 - 非常重要！**
   - ✅ **第1优先级：只要有一点点线索，就大胆推测！**
     * 名字看起来像男性（John, Michael, David...）→ 直接标记为男性
     * 名字看起来像女性（Mary, Jennifer, Lisa...）→ 直接标记为女性
     * 即使不是100%确定，只要有50%以上可能，就推测！
   
   - ✅ **第2优先级：根据产品类型推测**
     * 手机类产品：默认男性55%，女性45%（技术产品男性略多）
     * 服装类产品：根据款式推测（男装→男性多，女装→女性多）
     * 家居类产品：女性比例通常更高（60%女性，40%男性）
     * 儿童产品：购买者多为女性（妈妈）→ 女性60%，男性40%
   
   - ✅ **第3优先级：语气和表达推测（宽松使用）**
     * 细腻描述、emoji多、感叹号多 → 可能是女性
     * 简洁、技术词汇多 → 可能是男性
   
   - ⚠️ **严禁过度保守！**
   - 如果male + female < 20%，说明你太保守了，必须重新分析！
   - 宁可推测错误，也不要标记为unknown！
   - unknown应该只用于真的完全无法判断的情况（如纯数字评论、外语评论）
   
   **分析流程：**
   1. 逐条分析每条评论，应用上述5层策略
   2. 对每条评论标记：男性(M)、女性(F)、不确定(U)
   3. 统计：M条评论、F条评论、U条评论
   4. 计算比例：male = M/总评论数×100.00, female = F/总评论数×100.00, unknown = 100.00 - male - female
   5. **最后验证：male + female + unknown = 100.00**（如果不等于100.00，调整unknown使其相等）
   
2. **人群特征（demographics）**：
   - 识别年龄/人群：baby（婴儿0-1岁）, toddler（幼儿1-3岁）, kid/child（儿童3-12岁）, teen（青少年13-18岁）, adult（成人18+）, pregnant（孕妇）, elderly（老年人）
   - 识别角色：parents（父母）, grandparents（祖父母）, teacher（老师）, nurse（护士）等
   - 返回TOP 3-5项，百分比精确到小数点后2位
   - 每项附带详细原因说明（50-100字）

3. **使用时刻（usageTime）**：
   - 特殊节日：birthday, Christmas, Easter, Halloween, Thanksgiving, Valentine's Day
   - 人生大事：wedding, baby shower, graduation, baptism, christening
   - 日常场景：daily, everyday, weekend, vacation, holiday
   - 返回TOP 3-5项，百分比精确到小数点后2位

4. **使用地点（usageLocation）** - ⚠️ **必须返回真实数据，禁止"数据不足"或"--"**：
   
   **🎯 强制推测策略（必须执行）：**
   
   **第1步：明确提及（优先级最高）**
   - 如果评论中明确提到地点：
     * "在家用"、"at home" → 家中
     * "公园里"、"at park" → 户外/公园
     * "上班用"、"at work" → 办公室/工作场所
     * "学校"、"school" → 学校
   
   **第2步：场景推测（如果第1步没找到）**
   - 根据使用场景推测地点：
     * 提到睡觉、做饭、看电视、充电 → 家中
     * 提到聚会、庆祝、拍照 → 派对会场/家庭聚会
     * 提到运动、玩耍、散步 → 户外/公园
     * 提到学习、上课 → 学校/图书馆
     * 提到commute、travel、出差 → 交通工具/旅途
   
   **第3步：产品类型默认推测（如果前两步都没找到，强制使用）**
   - **手机类产品**（如iPhone）：
     1. 家中 (60%) - 最常使用地点
     2. 工作场所/办公室 (20%) - 工作通讯
     3. 交通工具/路上 (15%) - 通勤使用
     4. 公共场所 (5%) - 餐厅、商场等
   
   - **其他产品类型**：
     * 家居用品 → 家中 (80%), 办公室 (15%), 其他 (5%)
     * 户外装备 → 户外/公园 (70%), 家中 (20%), 旅行 (10%)
     * 服装类 → 日常生活 (50%), 派对 (25%), 工作 (15%), 运动 (10%)
   
   **⚠️ 严格要求：**
   - ❌ **绝对禁止返回"数据不足"、"--"、"无法分析"等**
   - ✅ **必须至少返回3个使用地点**
   - ✅ 如果评论中真的没有明确信息，使用第3步的产品类型默认值
   - ✅ 百分比精确到小数点后2位
   - ✅ 每个地点必须有reason说明（可以说"根据产品特性推测"）

5. **行为特征（behaviors）**：
   - 购买行为：gift（送礼）, collect（收藏）, replace（替换）
   - 使用行为：photoshoot（拍照）, display（展示）, wear daily（日常穿着）
   - 返回TOP 3-5项，百分比精确到小数点后2位

**百分比计算说明：**
- genderRatio：三者之和=100.00
- demographics, usageTime, usageLocation, behaviors：各自独立计算，不要求加总100%
- 计算方式：(该项提及次数 / 该维度总提及次数) × 100
- 精确到小数点后2位（如：24.15, 14.50）

**输出格式要求：**
- 必须返回有效的JSON格式
- 所有字段必须用中文（persona, occasion, place, behavior, reason）
- 百分比是纯数字，不要加%符号
- reason说明要具体，引用评论关键词

**⚠️ 最终检查（必须通过）：**
1. ✅ genderRatio: male + female + unknown = 100.00
2. ✅ demographics: 至少3个persona，每个有percentage和reason
3. ✅ usageTime: 至少3个occasion，每个有percentage和reason
4. ✅ **usageLocation: 必须至少3个place，不允许为空数组或"数据不足"**
5. ✅ behaviors: 至少3个behavior，每个有percentage和reason

**如果usageLocation为空或返回"数据不足"，系统会报错！请务必返回真实数据！**

请仔细分析评论内容，提取真实的消费者画像特征。`
  }

  /**
   * 2. 使用场景分析
   */
  static getUsageScenariosPrompt(reviews) {
    const reviewText = reviews.slice(0, 100).map((r, i) => 
      `[${i+1}] ${r.rating}星 | ${r.title} | ${r.content}`
    ).join('\n')

    return `你是一位专业的产品使用场景分析师。请基于以下${reviews.length}条Amazon产品评论，深度分析用户的使用场景。

⚠️ 重要：即使评论中没有明确提到使用场景，也要根据产品特性、用户评价内容、购买动机等推理出合理的使用场景。必须返回至少3-5个场景。

评论数据（共${reviews.length}条，分析前100条）：
${reviewText}

返回JSON格式（直接返回数组，不需要scenarios包装）：
[
  {
    "name": "零食准备",
    "percentage": 35,
    "description": "用户将产品用于快速制作健康零食，特别是为孩子准备苹果片",
    "reason": "许多用户提到该产品在快速切片苹果时的有效性，特别是对于儿童和膳食准备方面的有效性。这表明它已成为家庭零食准备的实用工具"
  },
  {
    "name": "家庭日常",
    "percentage": 28,
    "description": "家庭日常使用，简化水果处理流程",
    "reason": "一些评论强调，该产品非常适合家庭，特别是为儿童制作苹果片"
  },
  {
    "name": "聚会活动",
    "percentage": 20,
    "description": "在聚会或活动中快速准备水果拼盘",
    "reason": "用户提到在聚会时使用，效率高"
  },
  {
    "name": "送礼",
    "percentage": 12,
    "description": "作为礼物送给亲友",
    "reason": "部分用户购买后作为礼物赠送"
  },
  {
    "name": "烘焙制作",
    "percentage": 5,
    "description": "用于烘焙前的苹果处理",
    "reason": "少数用户用于制作苹果派等烘焙食品"
  }
]

关键要求：
1. 【必须中文输出】所有字段必须使用中文
2. 【字段名】name必须是3-10字符的中文短标题（如"零食准备"、"家庭日常"、"送礼"）
3. 【百分比计算】percentage是该场景在所有场景中的实际占比
   - 计算方式：(该场景提及次数 / 所有场景总提及次数) × 100
   - 注意：只返回前5个最重要的场景，但百分比是相对于所有发现的场景计算的
   - 因此前5个的百分比加起来通常在60-80%，剩余的20-40%在其他未返回的场景中
4. description是场景的简短中文描述
5. reason是你的深度中文分析（为什么用户在这个场景使用）

⚠️ **必须返回恰好5个使用场景！不允许返回4个或更少！**
- 如果评论中明确提到的场景不足5个，请根据产品特性、用户评价、常见使用场景进行合理推理
- 即使评论中没有明确提及，也要推理出5个使用场景
- 例如：手机可能用于"日常通讯"、"拍照摄影"、"娱乐影音"、"移动办公"、"社交媒体"
- 宁可推测，也不要少于5个！`
  }

  /**
   * 3. 星级影响度分析（暂时不用）
   */
  static getStarRatingImpactPrompt(reviews) {
    const reviewText = reviews.map(r => 
      `${r.rating}星 | ${r.title} | ${r.content}`
    ).join('\n')

    return `分析不同星级评论的关注点差异。

评论数据：
${reviewText}

返回JSON格式：
{
  "ratingDistribution": {
    "5star": 60,
    "4star": 25,
    "3star": 10,
    "2star": 3,
    "1star": 2
  },
  "keyFactors": [
    {
      "factor": "易用性",
      "positiveImpact": 80,
      "negativeImpact": 10,
      "reason": "易用性是影响评分的最关键因素"
    }
  ]
}`
  }

  /**
   * 4. 产品体验分析 - 好评
   */
  static getProductExperienceStrengthsPrompt(reviews) {
    const positiveReviews = reviews.filter(r => r.rating >= 4)
    const reviewText = positiveReviews.slice(0, 100).map(r => 
      `${r.rating}星 | ${r.content}`
    ).join('\n')

    return `分析产品的优点（只返回前5条）。

评论数据（4-5星好评，共${positiveReviews.length}条）：
${reviewText}

返回JSON格式（直接返回数组，不需要strengths包装）：
[
  {
    "aspect": "易用性",
    "percentage": 35,
    "reason": "许多用户都欣赏切片机的易用性和清洁性，使苹果切片成为一项轻松的任务。"
  },
  {
    "aspect": "坚固耐用",
    "percentage": 28,
    "reason": "许多评论者喜欢切片机的耐用材质和坚固结构。"
  },
  {
    "aspect": "锋利刀片",
    "percentage": 22,
    "reason": "用户赞扬刀片锋利，切片整齐。"
  },
  {
    "aspect": "性价比高",
    "percentage": 10,
    "reason": "用户认为产品物有所值。"
  },
  {
    "aspect": "易清洗",
    "percentage": 5,
    "reason": "清洁方便，节省时间。"
  }
]

关键要求：
1. 【必须中文输出】所有字段必须使用中文，包括aspect和reason
2. 【字段名】aspect必须是3-10字符的中文短标题（如"易用性"、"坚固耐用"、"锋利刀片"）
3. 【百分比计算】percentage是该优点在所有优点中的实际占比
   - 计算方式：(该优点提及次数 / 所有优点总提及次数) × 100
   - 注意：只返回前5个最重要的优点，但百分比是相对于所有发现的优点计算的
   - 因此前5个的百分比加起来通常在60-80%，剩余的20-40%在其他未返回的优点中
   - 示例：如果发现10个优点，前5个提及次数是 50, 40, 30, 20, 15（总185次中的155次）
     那么百分比是：27%, 22%, 16%, 11%, 8%（总计84%，剩余16%在其他5个优点中）
4. reason是简短的中文AI总结（1-2句话）
5. 不要返回其他字段（examples、keywords、mentionCount等）`
  }

  /**
   * 4. 产品体验分析 - 差评
   */
  static getProductExperienceWeaknessesPrompt(reviews) {
    const negativeReviews = reviews.filter(r => r.rating <= 3)
    const reviewText = negativeReviews.slice(0, 100).map(r => 
      `${r.rating}星 | ${r.content}`
    ).join('\n')

    return `分析产品的缺点（只返回前5条）。

评论数据（1-3星差评，共${negativeReviews.length}条）：
${reviewText}

返回JSON格式（直接返回数组，不需要weaknesses包装）：
[
  {
    "aspect": "难以使用",
    "percentage": 40,
    "reason": "大量用户对切片机无法完全切开苹果表示沮丧，需要额外的努力。"
  },
  {
    "aspect": "刀片不够锋利",
    "percentage": 30,
    "reason": "许多评论表示刀片不够锋利，导致苹果切片困难。"
  },
  {
    "aspect": "质量差",
    "percentage": 15,
    "reason": "部分用户反映产品材质不够结实，容易损坏。"
  },
  {
    "aspect": "尺寸问题",
    "percentage": 10,
    "reason": "一些用户抱怨产品尺寸不合适。"
  },
  {
    "aspect": "清洁困难",
    "percentage": 5,
    "reason": "部分用户反映清洁不方便。"
  }
]

关键要求：
1. 【必须中文输出】所有字段必须使用中文，包括aspect和reason
2. 【字段名】aspect必须是3-10字符的中文短标题（如"难以使用"、"刀片不够锋利"、"切割不均匀"）
3. 【百分比计算】percentage是该缺点在所有缺点中的实际占比
   - 计算方式：(该缺点提及次数 / 所有缺点总提及次数) × 100
   - 注意：只返回前5个最重要的缺点，但百分比是相对于所有发现的缺点计算的
   - 因此前5个的百分比加起来通常在60-80%，剩余的20-40%在其他未返回的缺点中
   - 示例：如果发现8个缺点，前5个提及次数是 40, 30, 20, 15, 10（总130次中的115次）
     那么百分比是：31%, 23%, 15%, 12%, 8%（总计89%，剩余11%在其他3个缺点中）
4. reason是简短的中文AI总结（1-2句话）
5. 不要返回其他字段（examples、keywords、mentionCount等）`
  }

  /**
   * 5. 购买动机分析
   */
  static getPurchaseMotivationPrompt(reviews) {
    const reviewText = reviews.slice(0, 100).map(r => 
      `${r.content}`
    ).join('\n')

    return `分析用户购买动机（只返回前5条）。

评论数据（共${reviews.length}条）：
${reviewText}

返回JSON格式（直接返回数组，不需要motivations包装）：
[
  {
    "type": "功能需求",
    "percentage": 40,
    "description": "需要快速切苹果的工具，提高烹饪效率",
    "reason": "大部分用户购买是为了满足特定功能需求"
  },
  {
    "type": "为孩子购买",
    "percentage": 25,
    "description": "为孩子准备健康零食，让孩子爱上吃水果",
    "reason": "家长群体是主要购买者"
  },
  {
    "type": "性价比高",
    "percentage": 20,
    "description": "价格合理，性能满足需求",
    "reason": "用户认为产品物有所值"
  },
  {
    "type": "送礼",
    "percentage": 10,
    "description": "作为礼物送给亲友",
    "reason": "部分用户购买用于赠送"
  },
  {
    "type": "替换旧品",
    "percentage": 5,
    "description": "替换老旧或损坏的切片器",
    "reason": "少数用户是重复购买或升级"
  }
]

关键要求：
1. 【必须中文输出】所有字段必须使用中文
2. 【字段名】type必须是3-10字符的中文短标题（如"性价比高"、"功能需求"、"送礼"、"优质材料"）
3. 【百分比计算】percentage是该动机在所有动机中的实际占比
   - 计算方式：(该动机提及次数 / 所有动机总提及次数) × 100
   - 注意：只返回前5个最重要的动机，但百分比是相对于所有发现的动机计算的
   - 因此前5个的百分比加起来通常在60-80%，剩余的20-40%在其他未返回的动机中
4. description是动机的详细中文描述
5. reason是你的中文分析原因
6. 不要返回keywords字段`
  }

  /**
   * 6. 未被满足的需求分析
   */
  static getUnmetNeedsPrompt(reviews) {
    const negativeReviews = reviews.filter(r => r.rating <= 3)
    const reviewText = negativeReviews.map(r => 
      `${r.rating}星 | ${r.content}`
    ).join('\n')

    return `从负面和中性评论中提取未被满足的需求（只返回前5条）。

评论数据（3星及以下，共${negativeReviews.length}条）：
${reviewText}

返回JSON格式（直接返回数组，不需要unmetNeeds包装）：
[
  {
    "need": "更锋利刀片",
    "percentage": 35,
    "severity": "高",
    "examples": ["希望刀片更锋利", "需要更好的切割效果"],
    "suggestions": ["增强刀片锋利度", "优化切割机制"],
    "reason": "用户表示希望刀片机无需额外努力即可完全切开苹果，说明当前产品在核心功能上还有改进空间"
  },
  {
    "need": "持久耐用",
    "percentage": 28,
    "severity": "高",
    "examples": ["容易损坏", "使用几次就坏了"],
    "suggestions": ["提升材料质量", "加固结构设计"],
    "reason": "耐用性是用户关注的重要因素"
  },
  {
    "need": "易于清洁",
    "percentage": 20,
    "severity": "中",
    "examples": ["难以清洗", "缝隙太多"],
    "suggestions": ["简化结构", "可拆卸设计"],
    "reason": "清洁便利性影响用户体验"
  },
  {
    "need": "尺寸适配",
    "percentage": 12,
    "severity": "中",
    "examples": ["太大了", "不适合小苹果"],
    "suggestions": ["推出多尺寸版本"],
    "reason": "不同水果尺寸需求不同"
  },
  {
    "need": "防滑设计",
    "percentage": 5,
    "severity": "低",
    "examples": ["容易滑动", "需要防滑垫"],
    "suggestions": ["底部增加防滑垫"],
    "reason": "提升使用安全性"
  }
]

关键要求：
1. 【必须中文输出】所有字段必须使用中文
2. 【字段名】need必须是3-10字符的中文短标题（如"持久耐用"、"更锋利刀片"、"易于清洁"）
3. 【百分比计算】percentage是该需求在所有未满足需求中的实际占比
   - 计算方式：(该需求提及次数 / 所有未满足需求总提及次数) × 100
   - 注意：只返回前5个最重要的需求，但百分比是相对于所有发现的需求计算的
   - 因此前5个的百分比加起来通常在60-80%，剩余的20-40%在其他未返回的需求中
4. severity是严重程度：高/中/低
5. examples是用户的原话引用（中文数组）
6. suggestions是改进建议（中文数组）
7. reason是你的中文分析原因`
  }
}

module.exports = PromptTemplates

