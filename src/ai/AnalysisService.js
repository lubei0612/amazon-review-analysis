// ================================
// AI 分析服务 - 统一管理所有维度的分析
// ================================

const logger = require('../../utils/logger')
const GeminiProvider = require('./GeminiProvider')
const PromptTemplates = require('./PromptTemplates')

class AnalysisService {
  constructor() {
    // ✅ 简化：只使用 Gemini 2.5 Pro
    this.provider = new GeminiProvider()
    logger.info('🤖 使用 Gemini 2.5 Pro 作为AI分析引擎')
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
      const results = {
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
    const userPrompt = PromptTemplates.getConsumerProfilePrompt(reviews)
    const response = await this.provider.analyze(systemPrompt, userPrompt)
    
    if (!response.success) {
      throw new Error(response.error)
    }
    
    return response.data
  }

  // ===== 2. 使用场景 =====
  async analyzeUsageScenarios(reviews, systemPrompt) {
    const userPrompt = PromptTemplates.getUsageScenariosPrompt(reviews)
    const response = await this.provider.analyze(systemPrompt, userPrompt)
    
    if (!response.success) {
      throw new Error(response.error)
    }
    
    return response.data
  }

  // ===== 3. 星级影响度 =====
  async analyzeStarRatingImpact(reviews, systemPrompt) {
    const userPrompt = PromptTemplates.getStarRatingImpactPrompt(reviews)
    const response = await this.provider.analyze(systemPrompt, userPrompt)
    
    if (!response.success) {
      throw new Error(response.error)
    }
    
    return response.data
  }

  // ===== 4a. 产品体验 - 优点 =====
  async analyzeProductStrengths(reviews, systemPrompt) {
    const positiveReviews = reviews.filter(r => r.rating >= 4)
    if (positiveReviews.length === 0) return []
    
    const userPrompt = PromptTemplates.getProductExperienceStrengthsPrompt(positiveReviews)
    const response = await this.provider.analyze(systemPrompt, userPrompt)
    
    if (!response.success) {
      throw new Error(response.error)
    }
    
    return response.data
  }

  // ===== 4b. 产品体验 - 缺点 =====
  async analyzeProductWeaknesses(reviews, systemPrompt) {
    const negativeReviews = reviews.filter(r => r.rating <= 3)
    if (negativeReviews.length === 0) return []
    
    const userPrompt = PromptTemplates.getProductExperienceWeaknessesPrompt(negativeReviews)
    const response = await this.provider.analyze(systemPrompt, userPrompt)
    
    if (!response.success) {
      throw new Error(response.error)
    }
    
    return response.data
  }

  // ===== 5. 购买动机 =====
  async analyzePurchaseMotivation(reviews, systemPrompt) {
    const userPrompt = PromptTemplates.getPurchaseMotivationPrompt(reviews)
    const response = await this.provider.analyze(systemPrompt, userPrompt)
    
    if (!response.success) {
      throw new Error(response.error)
    }
    
    return response.data
  }

  // ===== 6. 未被满足的需求 =====
  async analyzeUnmetNeeds(reviews, systemPrompt) {
    const userPrompt = PromptTemplates.getUnmetNeedsPrompt(reviews)
    const response = await this.provider.analyze(systemPrompt, userPrompt)
    
    if (!response.success) {
      throw new Error(response.error)
    }
    
    return response.data
  }
}

module.exports = AnalysisService

