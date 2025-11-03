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
   * 1. 消费者画像分析
   */
  static getConsumerProfilePrompt(reviews) {
    const reviewText = reviews.slice(0, 100).map(r => 
      `评分:${r.rating}星 | ${r.title} | ${r.content}`
    ).join('\n')

    return `分析以下Amazon产品评论，提取消费者画像信息。

评论数据（共${reviews.length}条，显示前100条）：
${reviewText}

请分析并返回JSON格式（每个维度返回前3条）：
{
  "dimensions": {
    "personas": [
      {"desc": "父母", "percentage": 7, "reason": "评论中频繁提到为孩子购买，家长是主要购买群体"},
      {"desc": "孩子", "percentage": 5, "reason": "多次提到儿童使用场景"},
      {"desc": "老年人", "percentage": 3, "reason": "部分评论提到老人使用"}
    ],
    "moments": [
      {"desc": "每日", "percentage": 8, "reason": "用户表示日常生活中经常使用"},
      {"desc": "膳食准备", "percentage": 7, "reason": "多在准备正餐或零食时使用"},
      {"desc": "零食时间", "percentage": 4, "reason": "下午茶或休闲时刻使用"}
    ],
    "locations": [
      {"desc": "家", "percentage": 13, "reason": "大多数用户在家庭环境中使用"},
      {"desc": "厨房", "percentage": 10, "reason": "厨房是主要使用场景"},
      {"desc": "学校", "percentage": 3, "reason": "部分家长为孩子准备午餐盒"}
    ],
    "behaviors": [
      {"desc": "切片", "percentage": 23, "reason": "核心功能就是切片，使用频率最高"},
      {"desc": "取芯", "percentage": 5, "reason": "去除果核功能也被频繁提及"},
      {"desc": "准备零食", "percentage": 5, "reason": "为孩子准备健康零食"}
    ]
  }
}

关键要求：
1. 【必须中文输出】所有字段必须使用中文
2. 【字段名】desc必须是3-10字符的中文短标题（如"父母"、"孩子"、"每日"、"家"、"切片"）
3. 【百分比说明】percentage是该项在评论中的实际提及占比（4个维度独立计算，不要求加起来等于100%）
4. reason是你的中文分析原因（1-2句话）
5. 每个维度只返回前3条最重要的`
  }

  /**
   * 2. 使用场景分析
   */
  static getUsageScenariosPrompt(reviews) {
    const reviewText = reviews.slice(0, 100).map(r => 
      `${r.title} | ${r.content}`
    ).join('\n')

    return `分析以下评论，提取产品使用场景（只返回前5条）。

评论数据（共${reviews.length}条）：
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
5. reason是你的深度中文分析（为什么用户在这个场景使用）`
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

