// ========================
// 任务服务 - 管理分析任务
// ========================

const { v4: uuidv4 } = require('uuid')
const CrawlerFacade = require('../crawler/CrawlerFacade')
const DataCleaner = require('../crawler/DataCleaner')
const AnalysisService = require('../ai/AnalysisService')
const logger = require('../../utils/logger')

class TaskService {
  constructor() {
    this.tasks = new Map()  // 内存存储（生产环境应使用数据库）
    this.analysisService = new AnalysisService()
    
    // ✅ 使用统一的爬虫门面
    this.crawler = new CrawlerFacade()
    
    // 显示爬虫状态
    const recommendations = this.crawler.getRecommendations()
    logger.info(`📊 ${recommendations.message}`)
  }
  
  /**
   * 创建分析任务
   * @param {object} taskData - 任务数据
   * @returns {string} taskId
   */
  async createTask(taskData) {
    const taskId = uuidv4()
    
    const task = {
      taskId,
      asin: taskData.asin,
      productUrl: taskData.productUrl,
      reviewCount: taskData.reviewCount,
      cookies: taskData.cookies,
      apiKey: taskData.apiKey,  // ✅ 保存 API Key
      analysisOptions: taskData.analysisOptions || {},
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      result: null,
      error: null
    }
    
    this.tasks.set(taskId, task)
    
    // 异步执行任务
    this.executeTask(taskId).catch(error => {
      logger.error(`任务 ${taskId} 执行失败:`, error.message)
    })
    
    return taskId
  }
  
  /**
   * 执行任务
   */
  async executeTask(taskId) {
    const task = this.tasks.get(taskId)
    
    if (!task) {
      throw new Error(`任务 ${taskId} 不存在`)
    }
    
    try {
      // 1. 开始爬取评论
      this.updateTask(taskId, { status: 'scraping', progress: 0 })
      
      let rawReviews = []
      
      // ✅ 全量爬取模式（不限制数量）
      // 如果产品页面提供了评论数，则爬取全部；否则默认爬取所有可用评论
      const targetCount = task.reviewCount || Infinity
      
      logger.info(`🎯 目标爬取数量: ${targetCount === Infinity ? '全量（无限制）' : targetCount + ' 条'}`)
      logger.info(`📊 产品总评论数: ${task.reviewCount || '未知'}`)
      logger.info(`⚡ 爬取策略: 全量模式（不设上限）`)
      
      // ✅ 使用统一的爬虫接口（自动降级：Outscraper → RapidAPI）
      const crawlResult = await this.crawler.crawlReviews(task.asin, {
        maxReviews: targetCount,
        onProgress: (progress) => {
          this.updateTask(taskId, { 
            progress: Math.min(progress.progress * 0.5, 50)  // 爬取占50%进度
          })
        },
        domain: 'amazon.com'
      })
      
      rawReviews = crawlResult.reviews
      logger.info(`✅ ${crawlResult.source} 爬取完成: ${rawReviews.length} 条评论`)
      
      // 2. 数据清洗
      logger.info(`开始清洗 ${rawReviews.length} 条评论`)
      
      const cleanedReviews = DataCleaner.cleanReviews(rawReviews)
      const deduplicatedReviews = DataCleaner.deduplicate(cleanedReviews)
      const sortedReviews = DataCleaner.sortByDate(deduplicatedReviews, 'desc')
      
      logger.info(`清洗完成，有效评论 ${sortedReviews.length} 条`)
      
      // 3. AI分析
      this.updateTask(taskId, { status: 'analyzing', progress: 50 })
      
      const analysisResult = await this.analysisService.analyzeAll(sortedReviews)
      
      // 4. 完成
      this.updateTask(taskId, {
        status: 'completed',
        progress: 100,
        result: {
          reviews: sortedReviews,
          analysis: analysisResult.data,
          statistics: DataCleaner.getStatistics(sortedReviews),
          meta: analysisResult.meta
        }
      })
      
      logger.info(`✅ 任务 ${taskId} 完成！`)
      
    } catch (error) {
      logger.error(`❌ 任务 ${taskId} 失败:`, error.message)
      
      this.updateTask(taskId, {
        status: 'failed',
        error: error.message
      })
    }
  }
  
  /**
   * 获取任务状态
   */
  getTask(taskId) {
    return this.tasks.get(taskId)
  }
  
  /**
   * 更新任务
   */
  updateTask(taskId, updates) {
    const task = this.tasks.get(taskId)
    
    if (!task) {
      throw new Error(`任务 ${taskId} 不存在`)
    }
    
    Object.assign(task, updates, { updatedAt: new Date() })
    this.tasks.set(taskId, task)
    
    return task
  }
  
  /**
   * 获取所有任务
   */
  getAllTasks() {
    return Array.from(this.tasks.values())
  }
  
  /**
   * 删除任务
   */
  deleteTask(taskId) {
    return this.tasks.delete(taskId)
  }
}

// 单例模式
const taskService = new TaskService()

module.exports = taskService

















































