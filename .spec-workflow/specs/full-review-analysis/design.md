# Design Document - 全量评论分析与UI优化

## System Architecture

### 整体架构

```
┌──────────────────────────────────────────────────────────┐
│                     用户界面层                            │
│  ┌────────────────┐         ┌────────────────┐          │
│  │  Chrome 插件    │         │  Web 界面       │          │
│  │  (输入ASIN)    │         │  (可视化报告)   │          │
│  └────────────────┘         └────────────────┘          │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│                    后端API层                              │
│  ┌────────────────────────────────────────┐             │
│  │  TaskService (任务管理)                 │             │
│  │  - 创建任务                             │             │
│  │  - 进度追踪                             │             │
│  │  - 结果缓存                             │             │
│  └────────────────────────────────────────┘             │
└──────────────────────────────────────────────────────────┘
         ↓                              ↓
┌──────────────────┐          ┌──────────────────┐
│   爬虫层          │          │   AI分析层        │
│  CrawlerFacade   │          │  AnalysisService │
│  - RapidAPI      │          │  - Gemini 2.5    │
│  - Puppeteer     │          │  - 深度分析      │
└──────────────────┘          └──────────────────┘
```

---

## Component Design

### 1. 爬虫层优化

#### CrawlerFacade 修改

**目标**: 支持全量评论爬取

```javascript
class CrawlerFacade {
  async scrapeReviews(asin, options = {}) {
    const {
      maxReviews = Infinity,  // 改为无限制
      onProgress = null,
      mode = 'full'           // 'full' | 'sample'
    } = options
    
    // 策略1: RapidAPI 爬取
    let reviews = await this.tryRapidAPI(asin, maxReviews, onProgress)
    
    // 策略2: 如果不足，使用 Puppeteer 补充
    if (reviews.length < maxReviews) {
      const additionalReviews = await this.tryPuppeteer(asin, maxReviews - reviews.length, onProgress)
      reviews = [...reviews, ...additionalReviews]
    }
    
    // 智能采样（如果评论过多）
    if (mode === 'sample' && reviews.length > 1000) {
      reviews = this.intelligentSample(reviews, 1000)
    }
    
    return this.deduplicate(reviews)
  }
  
  // 智能采样：保留高质量评论
  intelligentSample(reviews, targetCount) {
    // 1. 保留所有5星和1星（极端评价）
    const extremeReviews = reviews.filter(r => r.rating === 5 || r.rating === 1)
    
    // 2. 保留verified purchase
    const verifiedReviews = reviews.filter(r => r.isVerified && r.rating >= 2 && r.rating <= 4)
    
    // 3. 保留长评论（信息量大）
    const longReviews = reviews.filter(r => (r.content?.length || 0) > 200)
    
    // 4. 合并并去重
    const selected = [...new Set([...extremeReviews, ...verifiedReviews, ...longReviews])]
    
    // 5. 如果还不够，随机补充
    if (selected.length < targetCount) {
      const remaining = reviews.filter(r => !selected.includes(r))
      selected.push(...remaining.slice(0, targetCount - selected.length))
    }
    
    return selected.slice(0, targetCount)
  }
}
```

#### RapidAPI 分页优化

```javascript
class RapidAPICrawler {
  async getAllReviews(asin, onProgress = null) {
    let allReviews = []
    let page = 1
    let hasMore = true
    
    while (hasMore && page <= 50) {  // 最多50页（约5000条）
      try {
        const response = await this.fetchReviewsPage(asin, page)
        
        if (!response?.data?.reviews || response.data.reviews.length === 0) {
          hasMore = false
          break
        }
        
        const reviews = this.parseReviews(response.data.reviews, asin)
        allReviews = [...allReviews, ...reviews]
        
        if (onProgress) {
          onProgress({
            current: allReviews.length,
            page: page,
            source: 'RapidAPI'
          })
        }
        
        page++
        await this.delay(1000)  // 避免速率限制
        
      } catch (error) {
        logger.warn(`RapidAPI 第${page}页失败:`, error.message)
        hasMore = false
      }
    }
    
    return allReviews
  }
}
```

---

### 2. AI分析层优化

#### PromptTemplates 更新

**新增：消费者画像深度分析 Prompt**

```javascript
// src/ai/PromptTemplates.js

static getConsumerProfilePrompt() {
  return `你是一位专业的消费者行为分析师。请基于以下Amazon产品评论，进行深度的消费者画像分析。

请严格按照以下JSON格式返回结果：

{
  "genderRatio": {
    "male": 数字（百分比，精确到小数点后2位）,
    "female": 数字,
    "unknown": 数字
  },
  "demographics": [
    {
      "persona": "人群标签（如：婴儿父母、年轻女性、中年男性）",
      "percentage": 数字（百分比，精确到小数点后2位）,
      "reason": "详细原因说明（50-100字）"
    }
  ],
  "usageTime": [
    {
      "occasion": "使用时刻（如：生日、婚礼、日常）",
      "percentage": 数字,
      "reason": "详细原因"
    }
  ],
  "usageLocation": [
    {
      "place": "使用地点（如：家庭、户外、学校）",
      "percentage": 数字,
      "reason": "详细原因"
    }
  ],
  "behaviors": [
    {
      "behavior": "行为特征（如：送礼、自用、拍照）",
      "percentage": 数字,
      "reason": "详细原因"
    }
  ]
}

**分析要求：**

1. **性别识别线索**：
   - 代词：he/she/him/her/his/hers
   - 关系：husband/wife/boyfriend/girlfriend/son/daughter
   - 称谓：mom/dad/mother/father
   - 如无法判断，归入unknown

2. **人群特征识别**：
   - 婴儿（0-1岁）：baby, infant, newborn
   - 幼儿（1-3岁）：toddler, little one
   - 儿童（3-12岁）：kid, child
   - 青少年（13-18岁）：teen, teenager
   - 成人（18+）：adult, grown-up
   - 孕妇：pregnant, expecting

3. **使用时刻识别**：
   - 特殊节日：birthday, Christmas, Easter, Halloween
   - 人生大事：wedding, baby shower, graduation
   - 日常场景：daily, everyday, casual

4. **使用地点识别**：
   - 家庭：home, house, bedroom
   - 户外：outdoor, park, beach
   - 公共场所：school, church, party

5. **行为特征识别**：
   - 送礼：gift, present, gave as
   - 拍照：photo, picture, photoshoot
   - 收藏：collection, display

**注意事项：**
- 所有百分比之和应该为100%（允许误差±2%）
- 每个子维度返回TOP 3-5项
- 原因说明要具体，引用评论关键词
- 如果某个维度信息不足，可以标注"信息不足"

评论数据：
{{REVIEWS}}`
}
```

**更新：其他维度 Prompt**

```javascript
static getUsageScenariosPrompt() {
  return `分析产品使用场景，返回JSON格式：

{
  "scenarios": [
    {
      "scenario": "场景名称",
      "percentage": 数字（精确到小数点后2位）,
      "description": "场景描述（30-50字）",
      "reason": "为什么用户在这个场景使用（引用评论）"
    }
  ]
}

要求：
- 返回TOP 5-7个场景
- 按占比从高到低排序
- 场景描述要生动具体
- 原因说明要有评论支撑

评论数据：
{{REVIEWS}}`
}

static getUnmetNeedsPrompt() {
  return `分析用户未被满足的需求，返回JSON格式：

{
  "unmetNeeds": [
    {
      "need": "需求描述（具体且可操作）",
      "percentage": 数字（精确到小数点后2位）,
      "severity": "严重程度（高/中/低）",
      "examples": ["评论引用1", "评论引用2"],
      "suggestions": ["改进建议1", "改进建议2"],
      "reason": "详细原因说明（50-100字）"
    }
  ]
}

要求：
- 返回TOP 5-8个需求
- 优先提取具体问题（不要笼统描述）
- 每个需求附带至少2个评论引用
- 提供可操作的改进建议
- 按严重程度和占比排序

评论数据：
{{REVIEWS}}`
}

// 类似地更新其他Prompt...
```

#### AnalysisService 修改

```javascript
class AnalysisService {
  async analyzeConsumerProfile(reviews, systemPrompt) {
    const userPrompt = PromptTemplates.getConsumerProfilePrompt()
      .replace('{{REVIEWS}}', this.formatReviewsForAI(reviews))
    
    const result = await this.provider.analyze(systemPrompt, userPrompt)
    
    // 验证和清洗数据
    return this.validateConsumerProfile(result.data)
  }
  
  validateConsumerProfile(data) {
    // 确保所有必需字段存在
    const validated = {
      genderRatio: data.genderRatio || { male: 0, female: 0, unknown: 100 },
      demographics: (data.demographics || []).slice(0, 5),
      usageTime: (data.usageTime || []).slice(0, 5),
      usageLocation: (data.usageLocation || []).slice(0, 5),
      behaviors: (data.behaviors || []).slice(0, 5)
    }
    
    // 百分比归一化
    const normalizePercentages = (items) => {
      const total = items.reduce((sum, item) => sum + (item.percentage || 0), 0)
      if (total > 0) {
        items.forEach(item => {
          item.percentage = parseFloat(((item.percentage / total) * 100).toFixed(2))
        })
      }
      return items
    }
    
    validated.demographics = normalizePercentages(validated.demographics)
    validated.usageTime = normalizePercentages(validated.usageTime)
    validated.usageLocation = normalizePercentages(validated.usageLocation)
    validated.behaviors = normalizePercentages(validated.behaviors)
    
    return validated
  }
}
```

---

### 3. 前端UI层设计

#### 3.1 消费者画像组件

**文件**: `web/src/components/ConsumerProfile.vue`

```vue
<template>
  <div class="consumer-profile">
    <!-- 性别比例可视化 -->
    <div class="gender-ratio">
      <h3>消费者画像</h3>
      <div class="gender-icons">
        <div class="gender-item male">
          <div class="icon-container">
            <svg class="person-icon"><!-- 男性人形图标 --></svg>
            <div class="fill-bar" :style="{ height: profile.genderRatio.male + '%' }"></div>
          </div>
          <span class="percentage">{{ profile.genderRatio.male }}%</span>
        </div>
        
        <div class="gender-item female">
          <div class="icon-container">
            <svg class="person-icon"><!-- 女性人形图标 --></svg>
            <div class="fill-bar" :style="{ height: profile.genderRatio.female + '%' }"></div>
          </div>
          <span class="percentage">{{ profile.genderRatio.female }}%</span>
        </div>
      </div>
    </div>
    
    <!-- 4维度卡片 -->
    <div class="profile-dimensions">
      <div class="dimension-card">
        <h4>人群特征</h4>
        <div class="dimension-list">
          <div v-for="item in profile.demographics.slice(0, 3)" :key="item.persona" class="dimension-item">
            <span class="label">{{ item.persona }}</span>
            <span class="value">{{ item.percentage }}%</span>
          </div>
        </div>
      </div>
      
      <div class="dimension-card">
        <h4>使用时刻</h4>
        <div class="dimension-list">
          <div v-for="item in profile.usageTime.slice(0, 3)" :key="item.occasion" class="dimension-item">
            <span class="label">{{ item.occasion }}</span>
            <span class="value">{{ item.percentage }}%</span>
          </div>
        </div>
      </div>
      
      <div class="dimension-card">
        <h4>使用地点</h4>
        <div class="dimension-list">
          <div v-for="item in profile.usageLocation.slice(0, 3)" :key="item.place" class="dimension-item">
            <span class="label">{{ item.place }}</span>
            <span class="value">{{ item.percentage }}%</span>
          </div>
        </div>
      </div>
      
      <div class="dimension-card">
        <h4>行为</h4>
        <div class="dimension-list">
          <div v-for="item in profile.behaviors.slice(0, 3)" :key="item.behavior" class="dimension-item">
            <span class="label">{{ item.behavior }}</span>
            <span class="value">{{ item.percentage }}%</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 详细列表（横向条形图） -->
    <div class="detailed-list">
      <h4>详细人群特征</h4>
      <div v-for="item in profile.demographics" :key="item.persona" class="bar-item">
        <span class="label">{{ item.persona }}</span>
        <span class="percentage">{{ item.percentage }}%</span>
        <div class="bar-container">
          <div class="bar" :style="{ width: item.percentage + '%' }"></div>
        </div>
        <el-tooltip :content="item.reason" placement="top">
          <i class="el-icon-info"></i>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.consumer-profile {
  padding: 24px;
  
  .gender-ratio {
    text-align: center;
    margin-bottom: 32px;
    
    h3 {
      font-size: 24px;
      margin-bottom: 24px;
    }
    
    .gender-icons {
      display: flex;
      justify-content: center;
      gap: 80px;
      
      .gender-item {
        text-align: center;
        
        .icon-container {
          position: relative;
          width: 80px;
          height: 120px;
          margin: 0 auto 16px;
          
          .person-icon {
            width: 100%;
            height: 100%;
            fill: #e0e0e0;
          }
          
          .fill-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            transition: height 1s ease-in-out;
            overflow: hidden;
          }
        }
        
        &.male {
          .fill-bar {
            background: linear-gradient(to top, #4a90e2, #7db4f0);
          }
        }
        
        &.female {
          .fill-bar {
            background: linear-gradient(to top, #ff69b4, #ffb6d9);
          }
        }
        
        .percentage {
          font-size: 18px;
          font-weight: bold;
        }
      }
    }
  }
  
  .profile-dimensions {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 32px;
    
    .dimension-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 16px;
      
      h4 {
        font-size: 16px;
        margin-bottom: 12px;
        color: #333;
      }
      
      .dimension-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #e0e0e0;
        
        &:last-child {
          border-bottom: none;
        }
        
        .label {
          color: #666;
        }
        
        .value {
          font-weight: bold;
          color: #4a90e2;
        }
      }
    }
  }
  
  .detailed-list {
    .bar-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      
      .label {
        width: 150px;
        font-size: 14px;
      }
      
      .percentage {
        width: 60px;
        text-align: right;
        font-weight: bold;
      }
      
      .bar-container {
        flex: 1;
        height: 24px;
        background: #f0f0f0;
        border-radius: 12px;
        overflow: hidden;
        
        .bar {
          height: 100%;
          background: linear-gradient(90deg, #4a90e2, #7db4f0);
          transition: width 0.8s ease-in-out;
        }
      }
    }
  }
}
</style>
```

继续设计其他组件...

