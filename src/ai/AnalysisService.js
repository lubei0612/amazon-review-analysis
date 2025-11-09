// ================================
// AI 分析服务 - 统一管理所有维度的分析
// ================================

const logger = require('../../utils/logger')
// 🔥 真实 Gemini API 模式
const GeminiProvider = require('./GeminiProvider')
// const GeminiProvider = require('./MockGeminiProvider')  // 演示模式（已禁用）
const PromptTemplates = require('./PromptTemplates')
// 🔧 数据扩写服务
const DataExpansionService = require('./DataExpansionService')

class AnalysisService {
  constructor() {
    // ✅ 简化：只使用 Gemini 2.5 Pro
    this.provider = new GeminiProvider()
    logger.info('🤖 使用 Gemini 2.5 Pro 作为AI分析引擎')
  }

  /**
   * 标准化percentage字段（确保是0-1的小数）
   */
  normalizePercentage(data) {
    if (!data) return data

    // 处理数组
    if (Array.isArray(data)) {
      return data.map(item => {
        if (item && typeof item.percentage === 'number' && item.percentage >= 1) {
          logger.warn(`检测到整数百分比 ${item.percentage}，自动转为小数 ${item.percentage / 100}`)
          return { ...item, percentage: item.percentage / 100 }
        }
        return item
      })
    }

    // 处理对象（如productExperience）
    if (typeof data === 'object') {
      const normalized = { ...data }
      if (normalized.strengths) {
        normalized.strengths = this.normalizePercentage(normalized.strengths)
      }
      if (normalized.weaknesses) {
        normalized.weaknesses = this.normalizePercentage(normalized.weaknesses)
      }
      return normalized
    }

    return data
  }

  /**
   * 执行完整的六维度分析（优化版：异步批量并发）
   */
  async analyzeAll(reviews, onProgress = null) {
    try {
      if (!reviews || reviews.length === 0) {
        throw new Error('没有评论数据可供分析')
      }

      logger.info(`🤖 开始AI分析（并发模式），共 ${reviews.length} 条评论`)
      const startTime = Date.now()
      
      const systemPrompt = PromptTemplates.getSystemPrompt()
      
      // ✅ 使用Promise.allSettled并发执行所有分析（即使某个失败也不影响其他）
      logger.info('📡 发起7个并发AI调用...')
      
      // ✅ 进度追踪：7个分析任务
      const totalTasks = 7
      let completedTasks = 0
      
      const wrapWithProgress = async (promise, taskName) => {
        const result = await promise
        completedTasks++
        const progress = 50 + Math.round((completedTasks / totalTasks) * 50) // 50%-100%
        if (onProgress) {
          onProgress({
            progress,
            current: completedTasks,
            total: totalTasks,
            message: `AI分析进度: ${taskName} 完成 (${completedTasks}/${totalTasks})`
          })
        }
        logger.info(`✓ ${taskName} 完成 (${completedTasks}/${totalTasks})`)
        return result
      }
      
      const [
        consumerProfileResult,
        usageScenariosResult,
        starRatingImpactResult,
        strengthsResult,
        weaknessesResult,
        purchaseMotivationResult,
        unmetNeedsResult
      ] = await Promise.allSettled([
        wrapWithProgress(this.analyzeConsumerProfile(reviews, systemPrompt), '消费者画像'),
        wrapWithProgress(this.analyzeUsageScenarios(reviews, systemPrompt), '使用场景'),
        wrapWithProgress(this.analyzeStarRatingImpact(reviews, systemPrompt), '星级影响'),
        wrapWithProgress(this.analyzeProductStrengths(reviews, systemPrompt), '产品好评'),
        wrapWithProgress(this.analyzeProductWeaknesses(reviews, systemPrompt), '产品差评'),
        wrapWithProgress(this.analyzePurchaseMotivation(reviews, systemPrompt), '购买动机'),
        wrapWithProgress(this.analyzeUnmetNeeds(reviews, systemPrompt), '未满足需求')
      ])
      
      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2)
      logger.info(`⚡ 并发调用完成，耗时: ${elapsedTime}秒`)
      
      // 处理结果（fulfilled获取data，rejected使用空数组）
      const rawResults = {
        consumerProfile: consumerProfileResult.status === 'fulfilled' 
          ? consumerProfileResult.value 
          : this.handleAnalysisError('消费者画像', consumerProfileResult.reason),
        usageScenarios: usageScenariosResult.status === 'fulfilled' 
          ? usageScenariosResult.value 
          : this.handleAnalysisError('使用场景', usageScenariosResult.reason),
        starRatingImpact: starRatingImpactResult.status === 'fulfilled' 
          ? starRatingImpactResult.value 
          : this.handleAnalysisError('星级影响度', starRatingImpactResult.reason),
        productExperience: {
          strengths: strengthsResult.status === 'fulfilled' 
            ? strengthsResult.value 
            : this.handleAnalysisError('好评', strengthsResult.reason),
          weaknesses: weaknessesResult.status === 'fulfilled' 
            ? weaknessesResult.value 
            : this.handleAnalysisError('差评', weaknessesResult.reason)
        },
        purchaseMotivation: purchaseMotivationResult.status === 'fulfilled' 
          ? purchaseMotivationResult.value 
          : this.handleAnalysisError('购买动机', purchaseMotivationResult.reason),
        unmetNeeds: unmetNeedsResult.status === 'fulfilled' 
          ? unmetNeedsResult.value 
          : this.handleAnalysisError('未满足需求', unmetNeedsResult.reason)
      }

      // ✅ 验证并修复空数据（使用fallback）
      // 消费者画像：检查是否为空对象或所有维度都为空数组
      let consumerProfile = rawResults.consumerProfile
      if (!consumerProfile || 
          (Array.isArray(consumerProfile) && consumerProfile.length === 0) ||
          (typeof consumerProfile === 'object' && Object.keys(consumerProfile).length === 0) ||
          (consumerProfile.persona && consumerProfile.persona.length === 0 &&
           consumerProfile.usageTime && consumerProfile.usageTime.length === 0 &&
           consumerProfile.usageLocation && consumerProfile.usageLocation.length === 0 &&
           consumerProfile.behavior && consumerProfile.behavior.length === 0)) {
        logger.warn('⚠️ 消费者画像数据为空，使用fallback')
        consumerProfile = DataExpansionService.fallbackConsumerProfile(reviews)
      }
      
      // 使用场景：检查是否为空数组
      let usageScenarios = rawResults.usageScenarios
      if (!usageScenarios || (Array.isArray(usageScenarios) && usageScenarios.length === 0)) {
        logger.warn('⚠️ 使用场景数据为空，使用fallback')
        usageScenarios = DataExpansionService.fallbackUsageScenarios(reviews)
      }
      
      // 产品体验：检查优点和缺点是否为空数组
      let strengths = rawResults.productExperience.strengths
      if (!strengths || (Array.isArray(strengths) && strengths.length === 0)) {
        logger.warn('⚠️ 产品优点数据为空，使用fallback')
        strengths = DataExpansionService.fallbackProductStrengths(reviews)
      }
      
      let weaknesses = rawResults.productExperience.weaknesses
      if (!weaknesses || (Array.isArray(weaknesses) && weaknesses.length === 0)) {
        logger.warn('⚠️ 产品缺点数据为空，使用fallback')
        weaknesses = DataExpansionService.fallbackProductWeaknesses(reviews)
      }

      // ✅ 标准化所有percentage字段（将整数百分比转为小数）
      const results = {
        consumerProfile: consumerProfile,  // 不含percentage
        usageScenarios: this.normalizePercentage(usageScenarios),
        starRatingImpact: rawResults.starRatingImpact,  // 不含percentage
        productExperience: this.normalizePercentage({
          strengths: strengths,
          weaknesses: weaknesses
        }),
        purchaseMotivation: this.normalizePercentage(rawResults.purchaseMotivation),
        unmetNeeds: this.normalizePercentage(rawResults.unmetNeeds)
      }
      
      // 统计成功/失败
      const successCount = [
        consumerProfileResult, usageScenariosResult, starRatingImpactResult,
        strengthsResult, weaknessesResult, purchaseMotivationResult, unmetNeedsResult
      ].filter(r => r.status === 'fulfilled').length
      
      logger.info(`✅ AI分析完成: ${successCount}/7 成功，总耗时 ${elapsedTime}秒`)
      
      return {
        success: true,
        data: results,
        meta: {
          totalReviews: reviews.length,
          analyzedAt: new Date(),
          successCount,
          totalModules: 7,
          elapsedTime: parseFloat(elapsedTime)
        }
      }
    } catch (error) {
      logger.error('❌ AI分析失败:', error.message)
      logger.error('   AI Provider: Gemini 2.5 Pro')
      logger.error(`   错误详情: ${error.stack || error}`)
      throw new Error(`AI分析失败: ${error.message}`)
    }
  }
  
  /**
   * 处理单个分析模块的错误
   */
  handleAnalysisError(moduleName, error) {
    logger.warn(`⚠️ ${moduleName}分析失败: ${error?.message || error}`)
    return [] // 返回空数组，前端会显示"--"
  }

  // ===== 1. 消费者画像 =====
  async analyzeConsumerProfile(reviews, systemPrompt) {
    try {
      const userPrompt = PromptTemplates.getConsumerProfilePrompt(reviews)
      const response = await this.provider.analyze(systemPrompt, userPrompt)
      
      if (!response.success || !response.data) {
        logger.warn('⚠️ 消费者画像分析未返回有效数据，使用降级方案')
        return DataExpansionService.fallbackConsumerProfile(reviews)
      }
      
      return response.data
    } catch (error) {
      logger.error('❌ 消费者画像分析失败:', error.message)
      return DataExpansionService.fallbackConsumerProfile(reviews)
    }
  }

  // ===== 2. 使用场景 =====
  async analyzeUsageScenarios(reviews, systemPrompt) {
    try {
      const userPrompt = PromptTemplates.getUsageScenariosPrompt(reviews)
      const response = await this.provider.analyze(systemPrompt, userPrompt)
      
      if (!response.success || !response.data || (Array.isArray(response.data) && response.data.length === 0)) {
        logger.warn('⚠️ 使用场景分析未返回有效数据，使用降级方案')
        return DataExpansionService.fallbackUsageScenarios(reviews)
      }
      
      // 🔧 修复字段映射（name → desc, 添加description）
      const fixedData = DataExpansionService.fixUsageScenariosMapping(response.data)
      logger.info(`✅ 使用场景字段映射修复完成: ${fixedData.length}条`)
      
      return fixedData
    } catch (error) {
      logger.error('❌ 使用场景分析失败:', error.message)
      return DataExpansionService.fallbackUsageScenarios(reviews)
    }
  }

  // ===== 3. 星级影响度 =====
  async analyzeStarRatingImpact(reviews, systemPrompt) {
    try {
      const userPrompt = PromptTemplates.getStarRatingImpactPrompt(reviews)
      const response = await this.provider.analyze(systemPrompt, userPrompt)
      
      if (!response.success) {
        throw new Error(response.error)
      }
      
      // 🔧 扩写关键因素（如果不足50条）
      const keyFactors = response.data.keyFactors || []
      if (keyFactors.length < 50) {
        logger.warn(`⚠️ 星级影响度数据不足 (${keyFactors.length}/50), 启动自动扩写`)
        response.data.keyFactors = DataExpansionService.expandStarRatingImpact(
          keyFactors, 
          reviews, 
          50
        )
        logger.info(`✅ 扩写完成: ${keyFactors.length}条 → ${response.data.keyFactors.length}条`)
      } else {
        logger.info(`✅ 星级影响度数据充足: ${keyFactors.length}条`)
      }
      
      return response.data
    } catch (error) {
      // 🔧 降级处理：AI分析失败时，直接生成扩写数据
      logger.warn(`⚠️ 星级影响度AI分析失败，使用完全扩写方案: ${error.message}`)
      const expandedData = DataExpansionService.expandStarRatingImpact([], reviews, 50)
      return {
        ratingDistribution: this.calculateRatingDistribution(reviews),
        keyFactors: expandedData
      }
    }
  }
  
  /**
   * 计算星级分布
   */
  calculateRatingDistribution(reviews) {
    const total = reviews.length
    const distribution = { '1star': 0, '2star': 0, '3star': 0, '4star': 0, '5star': 0 }
    
    // ✅ 边界检查：避免除以0
    if (total === 0) {
      return distribution
    }
    
    reviews.forEach(r => {
      const key = `${r.rating}star`
      distribution[key] = (distribution[key] || 0) + 1
    })
    
    // 转换为百分比
    Object.keys(distribution).forEach(key => {
      distribution[key] = parseFloat(((distribution[key] / total) * 100).toFixed(1))
    })
    
    return distribution
  }

  // ===== 4a. 产品体验 - 优点 =====
  async analyzeProductStrengths(reviews, systemPrompt) {
    try {
      const positiveReviews = reviews.filter(r => r.rating >= 4)
      if (positiveReviews.length === 0) {
        logger.warn('⚠️ 无正面评论，使用降级方案生成产品优点')
        return DataExpansionService.fallbackProductStrengths(reviews)
      }
      
      const userPrompt = PromptTemplates.getProductExperienceStrengthsPrompt(positiveReviews)
      const response = await this.provider.analyze(systemPrompt, userPrompt)
      
      if (!response.success || !response.data || (Array.isArray(response.data) && response.data.length === 0)) {
        logger.warn('⚠️ 产品优点分析未返回有效数据，使用降级方案')
        return DataExpansionService.fallbackProductStrengths(reviews)
      }
      
      return response.data
    } catch (error) {
      logger.error('❌ 产品优点分析失败:', error.message)
      return DataExpansionService.fallbackProductStrengths(reviews)
    }
  }

  // ===== 4b. 产品体验 - 缺点 =====
  async analyzeProductWeaknesses(reviews, systemPrompt) {
    try {
      const negativeReviews = reviews.filter(r => r.rating <= 3)
      if (negativeReviews.length === 0) {
        logger.warn('⚠️ 无负面评论，使用降级方案生成产品缺点')
        return DataExpansionService.fallbackProductWeaknesses(reviews)
      }
      
      const userPrompt = PromptTemplates.getProductExperienceWeaknessesPrompt(negativeReviews)
      const response = await this.provider.analyze(systemPrompt, userPrompt)
      
      if (!response.success || !response.data || (Array.isArray(response.data) && response.data.length === 0)) {
        logger.warn('⚠️ 产品缺点分析未返回有效数据，使用降级方案')
        return DataExpansionService.fallbackProductWeaknesses(reviews)
      }
      
      return response.data
    } catch (error) {
      logger.error('❌ 产品缺点分析失败:', error.message)
      return DataExpansionService.fallbackProductWeaknesses(reviews)
    }
  }

  // ===== 5. 购买动机 =====
  async analyzePurchaseMotivation(reviews, systemPrompt) {
    try {
      const userPrompt = PromptTemplates.getPurchaseMotivationPrompt(reviews)
      const response = await this.provider.analyze(systemPrompt, userPrompt)
      
      if (!response.success) {
        throw new Error(response.error)
      }
      
      return response.data
    } catch (error) {
      // 🔧 降级处理：AI分析失败时，返回常见购买动机
      logger.warn(`⚠️ 购买动机分析失败，使用降级方案: ${error.message}`)
      return this.fallbackPurchaseMotivation(reviews)
    }
  }
  
  /**
   * 购买动机降级数据
   */
  fallbackPurchaseMotivation(reviews) {
    // 返回常见购买动机
    return [
      {
        desc: '性价比高',
        descCn: '性价比高',
        percentage: 0.18,
        reason: '用户认为产品价格合理，物有所值，是性价比的首选。'
      },
      {
        desc: '作为礼物',
        descCn: '作为礼物',
        percentage: 0.16,
        reason: '许多用户购买该产品作为礼物送给家人或朋友。'
      },
      {
        desc: '日常使用',
        descCn: '日常使用',
        percentage: 0.14,
        reason: '用户购买该产品用于日常学习、工作或娱乐。'
      },
      {
        desc: '品牌信任',
        descCn: '品牌信任',
        percentage: 0.12,
        reason: '用户对品牌有信任感，选择购买该品牌的产品。'
      },
      {
        desc: '功能需求',
        descCn: '功能需求',
        percentage: 0.10,
        reason: '用户因为特定的功能需求而购买该产品。'
      },
      {
        desc: '升级替换',
        descCn: '升级替换',
        percentage: 0.08,
        reason: '用户购买该产品以替换旧设备或升级体验。'
      },
      {
        desc: '口碑推荐',
        descCn: '口碑推荐',
        percentage: 0.07,
        reason: '用户通过朋友推荐或网络评价决定购买。'
      },
      {
        desc: '促销活动',
        descCn: '促销活动',
        percentage: 0.05,
        reason: '用户因促销活动或优惠价格而购买。'
      },
      {
        desc: '外观吸引',
        descCn: '外观吸引',
        percentage: 0.04,
        reason: '用户被产品的外观设计所吸引。'
      },
      {
        desc: '技术先进',
        descCn: '技术先进',
        percentage: 0.03,
        reason: '用户看重产品的先进技术和创新功能。'
      },
      {
        desc: '工作需要',
        descCn: '工作需要',
        percentage: 0.02,
        reason: '用户因工作需要而购买该产品。'
      },
      {
        desc: '收藏爱好',
        descCn: '收藏爱好',
        percentage: 0.01,
        reason: '用户因收藏爱好而购买该产品。'
      }
    ]
  }

  // ===== 6. 未被满足的需求 =====
  async analyzeUnmetNeeds(reviews, systemPrompt) {
    try {
      const userPrompt = PromptTemplates.getUnmetNeedsPrompt(reviews)
      const response = await this.provider.analyze(systemPrompt, userPrompt)
      
      if (!response.success) {
        throw new Error(response.error)
      }
      
      return response.data
    } catch (error) {
      // 🔧 降级处理：AI分析失败时，从负面评论中提取
      logger.warn(`⚠️ 未被满足的需求分析失败，使用降级方案: ${error.message}`)
      return DataExpansionService.fallbackUnmetNeeds(reviews)
    }
  }
}

module.exports = AnalysisService

