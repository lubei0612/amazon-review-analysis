// ========================
// RapidAPI 爬虫 - 快速高效的Amazon评论抓取
// ========================

const axios = require('axios')
const logger = require('../../utils/logger')

class RapidAPICrawler {
  constructor() {
    this.apiKey = process.env.RAPIDAPI_KEY
    this.apiHost = process.env.RAPIDAPI_HOST || 'real-time-amazon-data.p.rapidapi.com'
    this.baseURL = `https://${this.apiHost}`
    
    // ✅ 可用站点列表（按优先级排序）
    // 注意：US站点可能需要付费套餐，CA/UK等站点通常免费可用
    this.availableDomains = ['CA', 'UK', 'DE', 'FR', 'IT', 'ES', 'JP']
    this.currentDomain = 'CA' // 默认使用加拿大站点
    
    if (!this.apiKey) {
      logger.warn('⚠️ RAPIDAPI_KEY 未配置，RapidAPI爬虫不可用')
    } else {
      logger.info('✅ RapidAPI爬虫已初始化')
      logger.info(`📍 默认站点: ${this.currentDomain}`)
    }
  }
  
  /**
   * 检查RapidAPI是否可用
   */
  isAvailable() {
    return !!this.apiKey
  }
  
  /**
   * 获取产品评论
   * @param {string} asin - Amazon ASIN
   * @param {number} maxReviews - 最大评论数（默认500）
   * @param {function} onProgress - 进度回调
   */
  async getReviews(asin, maxReviews = 500, onProgress = null) {
    if (!this.isAvailable()) {
      throw new Error('RapidAPI未配置，请在.env中设置RAPIDAPI_KEY')
    }
    
    const allReviews = []
    const reviewsPerPage = 10 // RapidAPI每页约10条评论
    const maxPages = Math.ceil(maxReviews / reviewsPerPage)
    
    logger.info(`🚀 开始使用RapidAPI爬取 ASIN: ${asin}，目标: ${maxReviews}条评论`)
    
    for (let page = 1; page <= maxPages; page++) {
      try {
        const response = await this.fetchReviewsPage(asin, page)
        
        // ✅ 增强日志：查看完整响应结构
        logger.info('📋 API响应状态:', response?.status || 'unknown')
        logger.info('📋 响应顶层keys:', Object.keys(response || {}))
        
        // ✅ 检查响应状态
        if (!response || response.status !== 'OK') {
          logger.warn(`第 ${page} 页API返回非OK状态: ${response?.status || 'unknown'}`)
          if (response && Object.keys(response).length > 0) {
            logger.info('完整响应:', JSON.stringify(response).substring(0, 500))
          }
          break
        }
        
        if (!response.data) {
          logger.warn(`第 ${page} 页无data字段，停止爬取`)
          break
        }
        
        // ✅ 正确的响应格式：{ status: "OK", data: { reviews: [...] } }
        const reviewsData = response.data.reviews
        
        if (!reviewsData || !Array.isArray(reviewsData) || reviewsData.length === 0) {
          logger.warn(`第 ${page} 页无评论数据，停止爬取`)
          logger.info('data内容:', JSON.stringify(response.data).substring(0, 300))
          break
        }
        
        const reviews = this.parseReviews(reviewsData, asin)
        allReviews.push(...reviews)
        
        // ✅ 进度回调
        const progress = Math.min(100, Math.round((allReviews.length / maxReviews) * 100))
        if (onProgress) {
          onProgress({
            current: allReviews.length,
            total: maxReviews,
            progress: progress,
            message: `已爬取 ${allReviews.length}/${maxReviews} 条评论（RapidAPI快速模式）`
          })
        }
        
        logger.info(`✓ 第 ${page} 页爬取成功，累计 ${allReviews.length} 条评论`)
        
        // 达到目标或没有更多评论
        if (allReviews.length >= maxReviews) {
          logger.info(`✓ 已达到目标评论数: ${allReviews.length}`)
          break
        }
        
        // RapidAPI速率限制：每秒最多2次请求
        await this.delay(500)
        
      } catch (error) {
        logger.error(`第 ${page} 页爬取失败:`, error.message)
        
        if (this.isRateLimitError(error)) {
          logger.warn('⏳ RapidAPI速率限制，等待5秒后重试...')
          await this.delay(5000)
          page-- // 重试当前页
        } else if (this.isAuthError(error)) {
          throw new Error('RapidAPI认证失败，请检查API Key是否正确')
        } else {
          // 其他错误，如果已有数据则继续，否则抛出
          if (allReviews.length === 0) throw error
          logger.warn(`继续使用已爬取的 ${allReviews.length} 条评论`)
          break
        }
      }
    }
    
    logger.info(`🎉 RapidAPI爬取完成，共获取 ${allReviews.length} 条评论`)
    return allReviews.slice(0, maxReviews)
  }
  
  /**
   * 获取单页评论数据
   */
  async fetchReviewsPage(asin, page = 1, country = null) {
    const url = `${this.baseURL}/product-reviews`
    const targetCountry = country || this.currentDomain
    
    logger.info(`📡 请求第 ${page} 页 (站点: ${targetCountry}): ${url}`)
    
    const response = await axios.get(url, {
      params: {
        asin: asin,
        country: targetCountry, // ✅ 使用country参数（不是domain）
        page: page,
        sort_by: 'MOST_RECENT', // ✅ 使用大写MOST_RECENT
        star_rating: 'ALL',
        verified_purchases_only: 'false',
        images_or_videos_only: 'false',
        current_format_only: 'false'
      },
      headers: {
        'x-rapidapi-key': this.apiKey, // ✅ 小写header名称
        'x-rapidapi-host': this.apiHost
      },
      timeout: 30000
    })
    
    // ✅ 直接返回 response.data（RapidAPI的标准响应格式）
    return response.data
  }
  
  /**
   * 解析评论数据为统一格式
   */
  parseReviews(rawReviews, asin) {
    if (!rawReviews || !Array.isArray(rawReviews)) {
      logger.warn('评论数据格式不正确')
      return []
    }
    
    return rawReviews.map(r => {
      try {
        return {
          reviewId: r.review_id || `review_${Date.now()}_${Math.random()}`,
          asin: asin,
          // ✅ RapidAPI实际字段名：review_star_rating（字符串类型）
          rating: this.parseRating(r.review_star_rating || r.rating_text || r.rating),
          // ✅ RapidAPI实际字段名：review_title
          title: r.review_title || r.title || '',
          // ✅ RapidAPI实际字段名：review_comment
          content: r.review_comment || r.body || r.review_text || '',
          author: {
            // ✅ RapidAPI实际字段名：review_author
            name: r.review_author || r.reviewer_name || 'Anonymous',
            // ✅ RapidAPI实际字段名：review_author_url
            url: r.review_author_url || r.profile_url || ''
          },
          // ✅ RapidAPI实际字段名：review_date
          date: this.parseDate(r.review_date || r.date_text || r.date),
          // ✅ RapidAPI实际字段名：is_verified_purchase
          isVerified: r.is_verified_purchase || r.verified_purchase || false,
          // ✅ RapidAPI实际字段名：helpful_vote_statement
          helpfulVotes: this.parseHelpfulVotes(r.helpful_vote_statement || r.helpful_text),
          // ✅ RapidAPI实际字段名：review_images
          images: r.review_images || r.images || [],
          // 额外字段
          reviewLink: r.review_link || '',
          authorAvatar: r.review_author_avatar || '',
          reviewVideo: r.review_video || null,
          isVine: r.is_vine || false,
          reviewedProductAsin: r.reviewed_product_asin || asin
        }
      } catch (error) {
        logger.error('解析单条评论失败:', error.message)
        return null
      }
    }).filter(r => r !== null && (r.content || r.title)) // ✅ 只要有标题或内容就保留
  }
  
  /**
   * 解析评分（支持多种格式）
   */
  parseRating(ratingStr) {
    if (typeof ratingStr === 'number') return ratingStr
    if (!ratingStr) return 0
    
    // "5.0 out of 5 stars" -> 5
    const match = ratingStr.toString().match(/(\d+(\.\d+)?)/)
    return match ? parseFloat(match[1]) : 0
  }
  
  /**
   * 解析日期
   */
  parseDate(dateStr) {
    if (!dateStr) return new Date()
    
    try {
      // "Reviewed in the United States on January 1, 2024"
      const match = dateStr.match(/on (.+)$/)
      if (match) {
        return new Date(match[1])
      }
      return new Date(dateStr)
    } catch (error) {
      logger.warn(`日期解析失败: ${dateStr}`)
      return new Date()
    }
  }
  
  /**
   * 解析"有用"投票数
   */
  parseHelpfulVotes(statement) {
    if (!statement) return 0
    
    // "123 people found this helpful" -> 123
    const match = statement.match(/(\d+)/)
    return match ? parseInt(match[1]) : 0
  }
  
  /**
   * 判断是否为速率限制错误
   */
  isRateLimitError(error) {
    return error.response?.status === 429 || 
           error.message?.includes('rate limit') ||
           error.message?.includes('Too Many Requests')
  }
  
  /**
   * 判断是否为认证错误
   */
  isAuthError(error) {
    return error.response?.status === 401 || 
           error.response?.status === 403 ||
           error.message?.includes('Unauthorized') ||
           error.message?.includes('Forbidden')
  }
  
  /**
   * 延迟函数
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  /**
   * 获取API使用统计（可选）
   */
  async getApiStats() {
    try {
      logger.info('📊 获取RapidAPI使用统计...')
      // RapidAPI通常不提供实时统计API，需要在控制台查看
      return {
        message: '请访问 RapidAPI 控制台查看详细统计',
        url: 'https://rapidapi.com/developer/dashboard'
      }
    } catch (error) {
      logger.error('获取API统计失败:', error.message)
      return null
    }
  }
}

module.exports = RapidAPICrawler
















































