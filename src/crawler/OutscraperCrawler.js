// ========================
// Outscraper 爬虫 - 专业Amazon评论抓取
// ========================

const axios = require('axios')
const logger = require('../../utils/logger')

class OutscraperCrawler {
  constructor() {
    this.apiKey = process.env.OUTSCRAPER_API_KEY
    this.baseURL = 'https://api.app.outscraper.com'
    
    // ✅ Outscraper 定价：$2/1000条评论，免费试用500次
    this.costPer1000Reviews = 2 // USD
    
    if (!this.apiKey) {
      logger.warn('⚠️ OUTSCRAPER_API_KEY 未配置，Outscraper爬虫不可用')
    } else {
      logger.info('✅ Outscraper爬虫已初始化')
      logger.info(`💰 成本: $${this.costPer1000Reviews}/1000条评论`)
    }
  }
  
  /**
   * 检查Outscraper是否可用
   */
  isAvailable() {
    return !!this.apiKey
  }
  
  /**
   * 获取产品评论
   * @param {string} asin - Amazon ASIN
   * @param {number} maxReviews - 最大评论数（默认200）
   * @param {function} onProgress - 进度回调
   * @param {string} domain - Amazon站点（默认'amazon.com'）
   */
  async getReviews(asin, maxReviews = 200, onProgress = null, domain = 'amazon.com') {
    if (!this.isAvailable()) {
      throw new Error('Outscraper未配置，请在.env中设置OUTSCRAPER_API_KEY')
    }
    
    logger.info(`🚀 开始使用Outscraper爬取 ASIN: ${asin}，目标: ${maxReviews}条评论`)
    logger.info(`💰 预计成本: $${((maxReviews / 1000) * this.costPer1000Reviews).toFixed(4)}`)
    
    try {
      // ✅ Step 1: 发起爬取任务
      if (onProgress) {
        onProgress({
          current: 0,
          total: maxReviews,
          progress: 5,
          message: '正在向Outscraper发送请求...'
        })
      }
      
      // ✅ 方案1: 直接使用ASIN（更简洁）
      const taskId = await this.createTask(asin, maxReviews, domain)
      
      logger.info(`✓ Outscraper任务已创建: ${taskId}`)
      
      // ✅ Step 2: 轮询任务状态（等待完成）
      if (onProgress) {
        onProgress({
          current: 0,
          total: maxReviews,
          progress: 10,
          message: 'Outscraper正在抓取数据...'
        })
      }
      
      const result = await this.waitForCompletion(taskId, onProgress, maxReviews)
      
      // ✅ Step 3: 解析数据
      if (onProgress) {
        onProgress({
          current: maxReviews,
          total: maxReviews,
          progress: 95,
          message: '正在解析数据...'
        })
      }
      
      const reviews = this.parseReviews(result, asin)
      
      logger.info(`🎉 Outscraper爬取完成，共获取 ${reviews.length} 条评论`)
      logger.info(`💰 实际成本: $${((reviews.length / 1000) * this.costPer1000Reviews).toFixed(4)}`)
      
      if (onProgress) {
        onProgress({
          current: reviews.length,
          total: maxReviews,
          progress: 100,
          message: `完成！共获取 ${reviews.length} 条评论`
        })
      }
      
      return reviews.slice(0, maxReviews)
      
    } catch (error) {
      logger.error('Outscraper爬取失败:', error.message)
      throw error
    }
  }
  
  /**
   * 创建爬取任务
   */
  async createTask(asin, limit, domain = 'amazon.com') {
    const url = `${this.baseURL}/amazon/reviews`
    
    logger.info(`📡 发送请求到 Outscraper: ${url}`)
    logger.info(`   参数: query=${asin}, limit=${limit}, domain=${domain}`)
    
    const response = await axios.get(url, {
      params: {
        query: asin,  // ✅ 直接使用ASIN
        limit: limit,
        domain: domain,  // ✅ 添加domain参数
        filterByReviewer: 'all_reviews',  // ✅ 所有评论者（包括未验证购买）
        filterByStar: 'all_stars',  // ✅ 所有星级
        async: true  // ✅ 异步模式，返回taskId
      },
      headers: {
        'X-API-KEY': this.apiKey
      },
      timeout: 60000
    })
    
    logger.info(`✅ Outscraper响应:`, JSON.stringify(response.data).substring(0, 500))
    
    // ✅ Outscraper异步响应格式: { id: "task_id" }
    if (!response.data || !response.data.id) {
      throw new Error('Outscraper任务创建失败: 无效的响应')
    }
    
    return response.data.id
  }
  
  /**
   * 等待任务完成
   */
  async waitForCompletion(taskId, onProgress = null, maxReviews = 200) {
    const statusUrl = `${this.baseURL}/requests/${taskId}` // ✅ 修复：使用正确的端点
    const maxAttempts = 60  // 最多等待10分钟（每10秒检查一次）
    let attempts = 0
    
    while (attempts < maxAttempts) {
      try {
        const response = await axios.get(statusUrl, {
          headers: {
            'X-API-KEY': this.apiKey
          },
          timeout: 30000
        })
        
        const status = response.data.status
        logger.info(`📊 Outscraper任务状态: ${status} (${attempts + 1}/${maxAttempts})`)
        
        if (status === 'Success') {
          logger.info('✓ Outscraper任务完成！')
          // ✅ 添加调试日志：查看完整返回数据
          logger.info('📋 Outscraper完整响应:', JSON.stringify(response.data, null, 2).substring(0, 3000))
          logger.info('📋 data字段类型:', typeof response.data.data)
          logger.info('📋 data字段内容:', JSON.stringify(response.data.data, null, 2).substring(0, 3000))
          return response.data.data || []
        } else if (status === 'Failed') {
          throw new Error(`Outscraper任务失败: ${response.data.error || '未知错误'}`)
        }
        
        // ✅ 更新进度（10% -> 90%，爬取过程）
        if (onProgress) {
          const progress = 10 + Math.min(80, Math.floor((attempts / maxAttempts) * 80))
          onProgress({
            current: Math.floor((progress / 100) * maxReviews),
            total: maxReviews,
            progress: progress,
            message: `Outscraper正在抓取数据... (${attempts * 10}秒)`
          })
        }
        
        // 等待10秒后重试
        await this.delay(10000)
        attempts++
        
      } catch (error) {
        // ✅ 处理网络错误和404错误，都进行重试
        const isNetworkError = error.code === 'ECONNRESET' || 
                               error.code === 'ETIMEDOUT' || 
                               error.code === 'ENOTFOUND' ||
                               error.code === 'ECONNREFUSED' ||
                               error.message?.includes('socket hang up') ||
                               error.message?.includes('timeout') ||
                               error.response?.status === 404
        
        if (isNetworkError && attempts < maxAttempts) {
          logger.warn(`⚠️ 网络错误或任务未完成，10秒后重试... (${error.message})`)
          await this.delay(10000)
          attempts++
        } else if (attempts >= maxAttempts) {
          throw new Error(`任务超时（${maxAttempts}次尝试）: ${error.message}`)
        } else {
          throw error
        }
      }
    }
    
    throw new Error('Outscraper任务超时（10分钟）')
  }
  
  /**
   * 解析评论数据为统一格式
   */
  parseReviews(rawData, asin) {
    if (!rawData || !Array.isArray(rawData)) {
      logger.warn('Outscraper数据格式不正确')
      return []
    }
    
    const allReviews = []
    
    // ✅ Outscraper返回格式: data = [[ review1, review2, ... ]]
    // data[0] 是第一个查询的评论数组
    logger.info(`📦 收到 ${rawData.length} 个查询结果`)
    
    // 展平所有查询结果
    const flatData = rawData.flat()
    logger.info(`📦 展平后评论数量: ${flatData.length}`)
    
    for (const item of flatData) {
      // 跳过空对象
      if (!item || typeof item !== 'object') continue
      
      try {
        // ✅ Outscraper评论对象的标准字段
        // {
        //   "id": "RCA7TI5EBH5VK",
        //   "product_asin": "B0BSHF7WHW",
        //   "title": "评论标题",
        //   "body": "评论内容...",
        //   "rating": 5,
        //   "rating_text": "5.0 out of 5 stars",
        //   ...
        // }
        
        const rawContent = item.body || item.review_text || item.text || ''
        const cleanedContent = this.cleanReviewContent(rawContent)
        
        // 只处理有内容的评论
        if (!cleanedContent && !item.title) continue
        
        const review = {
          reviewId: item.id || item.review_id || `review_${Date.now()}_${Math.random()}`,
          asin: item.product_asin || item.asin || asin,
          rating: this.parseRating(item.rating || item.rating_text),
          title: item.title || item.review_title || '',
          content: cleanedContent,
          author: {
            name: item.author_name || item.author_title || item.author || 'Anonymous',
            url: item.author_link || item.author_url || item.profile_url || ''
          },
          date: this.parseDate(item.review_date || item.review_datetime || item.date),
          isVerified: item.is_verified || item.verified_purchase || false,
          helpfulVotes: this.parseHelpfulVotes(item.helpful) || item.review_votes || item.helpful_votes || 0,
          images: Array.isArray(item.images) ? item.images : 
                 Array.isArray(item.review_images) ? item.review_images : 
                 item.image_url ? [item.image_url] : [],
          // 额外字段
          location: item.author_location || item.location || '',
          variant: item.variant || item.variation || '',
          hasVideo: item.has_video || false
        }
        
        allReviews.push(review)
        
      } catch (error) {
        logger.error('解析单条评论失败:', error.message)
      }
    }
    
    logger.info(`✅ 成功解析 ${allReviews.length} 条评论`)
    return allReviews
  }
  
  /**
   * 解析评分（支持多种格式）
   */
  parseRating(ratingStr) {
    if (typeof ratingStr === 'number') return ratingStr
    if (!ratingStr) return 0
    
    // "5.0" 或 "5" 或 "5.0 out of 5 stars"
    const match = ratingStr.toString().match(/(\d+(\.\d+)?)/)
    return match ? parseFloat(match[1]) : 0
  }
  
  /**
   * 解析有用投票数（支持多种格式）
   */
  parseHelpfulVotes(helpfulStr) {
    if (typeof helpfulStr === 'number') return helpfulStr
    if (!helpfulStr) return 0
    
    // "One person found this helpful" -> 1
    // "5 people found this helpful" -> 5
    // "23 people found this helpful" -> 23
    const oneMatch = helpfulStr.toString().match(/^one\s+person/i)
    if (oneMatch) return 1
    
    const numMatch = helpfulStr.toString().match(/(\d+)\s+people/i)
    return numMatch ? parseInt(numMatch[1]) : 0
  }
  
  /**
   * 清理评论内容（移除JavaScript/CSS代码）
   */
  cleanReviewContent(content) {
    if (!content) return ''
    
    let cleaned = content
    
    // 1. 移除开头的JavaScript代码: (function() {...})();
    cleaned = cleaned.replace(/^\(function\(\)\s*\{[\s\S]*?\}\)\(\);\s*/g, '')
    
    // 2. 移除所有CSS代码块: .classname { ... } 或 selector:pseudo { ... }
    cleaned = cleaned.replace(/[.\w-]+:[a-z-]+\s*\{[^}]*\}\s*/g, '')
    cleaned = cleaned.replace(/\.[a-zA-Z-_]+\s*\{[^}]*\}\s*/g, '')
    
    // 3. 移除HTML标签残留
    cleaned = cleaned.replace(/<[^>]+>/g, '')
    
    // 4. 移除末尾的 "Read more" 或 "Read less"
    cleaned = cleaned.replace(/\s*(Read more|Read less)(\s+of this review)?$/gi, '')
    
    // 5. 移除开头的空白和特殊字符
    cleaned = cleaned.replace(/^[\s.,;:!?-]+/, '')
    
    // 6. 移除多余的空白字符
    cleaned = cleaned.replace(/\s+/g, ' ').trim()
    
    return cleaned
  }
  
  /**
   * 解析日期
   */
  parseDate(dateStr) {
    if (!dateStr) return new Date()
    
    try {
      // Outscraper通常返回ISO格式或Unix时间戳
      if (typeof dateStr === 'number') {
        return new Date(dateStr * 1000) // Unix时间戳（秒）
      }
      return new Date(dateStr)
    } catch (error) {
      logger.warn(`日期解析失败: ${dateStr}`)
      return new Date()
    }
  }
  
  /**
   * 延迟函数
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  /**
   * 获取账户配额（可选）
   */
  async getAccountInfo() {
    try {
      const response = await axios.get(`${this.baseURL}/profile`, {
        headers: {
          'X-API-KEY': this.apiKey
        },
        timeout: 10000
      })
      
      logger.info('📊 Outscraper账户信息:')
      logger.info(`   剩余配额: ${response.data.credits_left || 'N/A'}`)
      logger.info(`   总配额: ${response.data.credits_total || 'N/A'}`)
      
      return response.data
    } catch (error) {
      logger.error('获取账户信息失败:', error.message)
      return null
    }
  }
}

module.exports = OutscraperCrawler

