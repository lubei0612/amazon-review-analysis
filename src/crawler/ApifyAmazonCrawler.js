// ========================
// Apify Amazon Reviews 爬虫
// ========================

const axios = require('axios')
const logger = require('../../utils/logger')

class ApifyAmazonCrawler {
  constructor() {
    this.apiToken = process.env.APIFY_API_TOKEN
    this.actorId = 'axesso_data/amazon-reviews-scraper'
    this.baseURL = 'https://api.apify.com/v2'
    
    if (!this.apiToken) {
      logger.warn('⚠️ APIFY_API_TOKEN 未配置，Apify爬虫不可用')
    } else {
      logger.info('✅ Apify Amazon 爬虫已初始化')
      logger.info('📍 使用 Axesso Data Service')
    }
  }
  
  /**
   * 检查爬虫是否可用
   */
  isAvailable() {
    return !!this.apiToken
  }
  
  /**
   * 获取产品评论（全量模式）
   * @param {string} asin - Amazon ASIN
   * @param {number} maxReviews - 最大评论数（默认Infinity表示全量）
   * @param {function} onProgress - 进度回调
   */
  async getReviews(asin, maxReviews = Infinity, onProgress = null) {
    if (!this.isAvailable()) {
      throw new Error('Apify未配置，请在.env中设置APIFY_API_TOKEN')
    }
    
    // 计算需要的页数（每页约10条评论）
    const maxPages = maxReviews === Infinity ? 10 : Math.min(Math.ceil(maxReviews / 10), 10)
    
    logger.info(`🚀 开始使用Apify爬取 ASIN: ${asin}，目标: ${maxReviews === Infinity ? '全量' : maxReviews + '条'}评论`)
    logger.info(`📄 将爬取 ${maxPages} 页数据`)
    
    try {
      // 1. 启动 Actor 运行
      const runId = await this.startActorRun(asin, maxPages)
      
      // 2. 等待运行完成并获取结果
      const reviews = await this.waitForResults(runId, onProgress)
      
      // 3. 转换为标准格式
      const standardizedReviews = this.parseReviews(reviews)
      
      logger.info(`✅ Apify爬取完成，共获取 ${standardizedReviews.length} 条评论`)
      
      // 限制返回数量
      if (maxReviews !== Infinity && standardizedReviews.length > maxReviews) {
        return standardizedReviews.slice(0, maxReviews)
      }
      
      return standardizedReviews
      
    } catch (error) {
      logger.error(`❌ Apify爬取失败: ${error.message}`)
      throw error
    }
  }
  
  /**
   * 启动 Actor 运行
   */
  async startActorRun(asin, maxPages) {
    const input = {
      input: [{
        asin: asin,
        domainCode: 'com',
        sortBy: 'recent',
        maxPages: maxPages,
        reviewerType: 'verified_reviews',
        formatType: 'current_format',
        mediaType: 'all_contents'
      }]
    }
    
    logger.info('📡 正在启动 Apify Actor...')
    
    try {
      // ✅ 修正 API 路径：使用 ~username~actorname 格式
      const actorPath = this.actorId.replace('/', '~')
      
      const response = await axios.post(
        `${this.baseURL}/acts/${actorPath}/runs`,
        input,
        {
          params: { token: this.apiToken },
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000
        }
      )
      
      const runId = response.data.data.id
      logger.info(`✓ Actor 已启动，运行ID: ${runId}`)
      
      return runId
      
    } catch (error) {
      logger.error(`❌ 启动 Actor 失败: ${error.message}`)
      if (error.response) {
        logger.error(`   状态码: ${error.response.status}`)
        logger.error(`   响应: ${JSON.stringify(error.response.data)}`)
      }
      throw new Error(`启动 Apify Actor 失败: ${error.message}`)
    }
  }
  
  /**
   * 等待运行完成并获取结果
   */
  async waitForResults(runId, onProgress) {
    const maxWaitTime = 120000 // 最多等待 2 分钟
    const checkInterval = 3000 // 每 3 秒检查一次
    const startTime = Date.now()
    
    logger.info('⏳ 等待 Actor 运行完成...')
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        // 检查运行状态
        const statusResponse = await axios.get(
          `${this.baseURL}/actor-runs/${runId}`,
          { params: { token: this.apiToken } }
        )
        
        const status = statusResponse.data.data.status
        const stats = statusResponse.data.data.stats || {}
        
        // 进度回调
        if (onProgress && stats.requestsFinished && stats.requestsTotal) {
          const progress = Math.round((stats.requestsFinished / stats.requestsTotal) * 100)
          onProgress({
            current: stats.requestsFinished,
            total: stats.requestsTotal,
            progress: progress,
            source: 'Apify',
            message: `正在爬取... (${stats.requestsFinished}/${stats.requestsTotal} 请求)`
          })
        }
        
        logger.info(`📊 运行状态: ${status}`)
        
        if (status === 'SUCCEEDED') {
          logger.info('✅ Actor 运行成功，正在获取数据...')
          return await this.fetchResults(runId)
        }
        
        if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') {
          throw new Error(`Actor 运行失败，状态: ${status}`)
        }
        
        // 等待下次检查
        await new Promise(resolve => setTimeout(resolve, checkInterval))
        
      } catch (error) {
        if (error.message.includes('运行失败')) {
          throw error
        }
        logger.warn(`⚠️ 检查状态时出错: ${error.message}，继续等待...`)
        await new Promise(resolve => setTimeout(resolve, checkInterval))
      }
    }
    
    throw new Error('等待 Actor 运行超时（超过 2 分钟）')
  }
  
  /**
   * 获取运行结果
   */
  async fetchResults(runId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/actor-runs/${runId}/dataset/items`,
        { 
          params: { 
            token: this.apiToken,
            format: 'json'
          }
        }
      )
      
      const items = response.data
      logger.info(`📦 获取到 ${items.length} 条原始数据`)
      
      return items
      
    } catch (error) {
      logger.error(`❌ 获取结果失败: ${error.message}`)
      throw new Error(`获取 Apify 结果失败: ${error.message}`)
    }
  }
  
  /**
   * 解析 Apify 数据为标准格式
   */
  parseReviews(apifyData) {
    const reviews = []
    
    apifyData.forEach(item => {
      try {
        // Apify 返回的每个 item 就是一条评论
        // ✅ 修正：使用 DataCleaner 期望的字段名
        const review = {
          // 基本信息
          rating: this.parseRating(item.rating),
          title: item.title || '',
          content: item.text || '',  // ✅ 修正：body -> content
          date: this.parseDate(item.date),
          isVerified: item.verified === true,  // ✅ 修正：verified -> isVerified
          
          // 用户信息
          author: item.userName || 'Anonymous',  // ✅ 修正：userName -> author
          
          // 额外信息
          reviewId: item.reviewId || '',
          helpfulVotes: item.numberOfHelpful || 0,  // ✅ 修正：helpful -> helpfulVotes
          
          // 图片
          images: item.imageUrlList || [],
          
          // 元数据
          asin: item.asin || '',
          variant: item.variationId || '',  // ✅ 修正：variationId -> variant
          locale: item.locale || 'en_US'
        }
        
        reviews.push(review)
        
      } catch (error) {
        logger.warn(`⚠️ 解析单条评论失败: ${error.message}`)
      }
    })
    
    return reviews
  }
  
  /**
   * 解析评分
   */
  parseRating(ratingStr) {
    if (!ratingStr) return 0
    
    // "5.0 out of 5 stars" -> 5.0
    const match = ratingStr.match(/(\d+\.?\d*)\s*out\s*of/i)
    return match ? parseFloat(match[1]) : 0
  }
  
  /**
   * 解析日期
   */
  parseDate(dateStr) {
    if (!dateStr) return new Date().toISOString()
    
    try {
      // "Reviewed in the United Kingdom on 24 November 2024"
      const match = dateStr.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/)
      if (match) {
        const [, day, month, year] = match
        const monthMap = {
          'January': 0, 'February': 1, 'March': 2, 'April': 3,
          'May': 4, 'June': 5, 'July': 6, 'August': 7,
          'September': 8, 'October': 9, 'November': 10, 'December': 11
        }
        const date = new Date(year, monthMap[month], day)
        return date.toISOString()
      }
      
      return new Date(dateStr).toISOString()
    } catch (error) {
      return new Date().toISOString()
    }
  }
}

module.exports = ApifyAmazonCrawler

