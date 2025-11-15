// ================================
// 爬虫门面类 - Apify专用版本
// ================================
// 
// 职责：
// 1. 使用Apify作为唯一爬虫
// 2. 统一返回数据格式
// 3. 提供进度回调
// 
// 使用示例：
// const crawler = new CrawlerFacade()
// const reviews = await crawler.crawlReviews('B08N5WRWNW', {
//   maxReviews: 500,
//   onProgress: (data) => console.log(data)
// })

const logger = require('../../utils/logger')
const ApifyAmazonCrawler = require('./ApifyAmazonCrawler')

class CrawlerFacade {
  constructor() {
    // 初始化Apify爬虫
    this.apify = new ApifyAmazonCrawler()
    
    logger.info('✅ CrawlerFacade已初始化')
    logger.info(`   爬虫: Apify (${this.apify.isAvailable() ? '可用' : '未配置'})`)
    
    if (!this.apify.isAvailable()) {
      logger.warn('⚠️ APIFY_API_TOKEN未配置，请在.env文件中设置')
    }
  }
  
  /**
   * 爬取评论
   * 
   * @param {string} asin - Amazon ASIN
   * @param {object} options - 配置项
   * @param {number} options.maxReviews - 最大评论数（默认Infinity，全量爬取）
   * @param {function} options.onProgress - 进度回调
   * @param {string} options.domain - Amazon站点（默认'amazon.com'）
   * @returns {Promise<Object>} 包含reviews和productInfo的对象
   */
  async crawlReviews(asin, options = {}) {
    const {
      maxReviews = Infinity,
      onProgress = null,
      domain = 'amazon.com'
    } = options
    
    // 检查Apify是否可用
    if (!this.apify.isAvailable()) {
      throw new Error('Apify未配置，请在.env中设置APIFY_API_TOKEN')
    }
    
    logger.info(`🔄 开始爬取评论: ${asin}`)
    logger.info(`   目标评论数: ${maxReviews === Infinity ? '全量（无限制）' : maxReviews + '条'}`)
    logger.info(`   Amazon站点: ${domain}`)
    
      try {
      logger.info('🚀 使用 Apify 爬虫...')
        
        const result = await this.apify.getReviews(
          asin,
          maxReviews,
          onProgress
        )
        
        const reviews = result.reviews || result // 兼容旧格式
        const productInfo = result.productInfo || {}
        
        logger.info(`✅ Apify成功，获取 ${reviews.length} 条评论`)
        
      // 检查空数据
        if (reviews.length === 0) {
        logger.warn('⚠️ Apify返回0条评论')
        throw new Error('未找到评论数据，请检查ASIN是否正确')
        }
        
        return {
          success: true,
          source: 'Apify',
          reviews: reviews,
          productInfo: productInfo,
          count: reviews.length,
          asin: asin
        }
        
      } catch (error) {
      logger.error(`❌ Apify爬取失败: ${error.message}`)
      throw new Error(`评论爬取失败: ${error.message}`)
    }
  }
  
  /**
   * 获取产品信息（Apify支持）
   * 
   * @param {string} asin - Amazon ASIN
   * @param {string} marketplace - Amazon站点（默认'amazon.com'）
   * @returns {Promise<Object>} 产品信息
   */
  async getProductInfo(asin, marketplace = 'amazon.com') {
    if (!this.apify.isAvailable()) {
      logger.warn('⚠️ Apify未配置，无法获取产品信息')
      return {
        title: 'Amazon Product',
        price: 'N/A',
        rating: 0,
        reviewsCount: 0,
        asin: asin
      }
    }
    
    try {
      logger.info(`📦 获取产品信息: ${asin} (${marketplace})`)
      
      // Apify在爬取评论时会自动返回产品信息
      // 如果需要单独获取，可以调用一次爬取并只取productInfo
      const result = await this.apify.getReviews(asin, 1)
      const productInfo = result.productInfo || {}
      
      logger.info(`✅ 产品信息获取成功`)
      
      return {
        title: productInfo.title || 'Amazon Product',
        price: productInfo.price || 'N/A',
        rating: productInfo.rating || 0,
        reviewsCount: productInfo.reviewsCount || 0,
        asin: asin,
        image: productInfo.image || ''
      }
      
    } catch (error) {
      logger.warn(`获取产品信息失败: ${error.message}`)
      return {
        title: 'Amazon Product',
        price: 'N/A',
        rating: 0,
        reviewsCount: 0,
        asin: asin
      }
    }
  }
  
  /**
   * 检查爬虫可用性
   * 
   * @returns {Object} 爬虫状态
   */
  getStatus() {
    return {
      apify: {
        available: this.apify.isAvailable(),
        name: 'Apify',
        priority: 'primary',
        features: ['reviews', 'product_info', 'high_success_rate', 'large_scale']
      }
    }
  }
  
  /**
   * 获取推荐的爬虫配置建议
   */
  getRecommendations() {
    const status = this.getStatus()
    
    if (!status.apify.available) {
      return {
        status: 'error',
        message: '❌ Apify未配置',
        note: '系统需要Apify API Token才能运行',
        actions: [
          '1. 访问 https://apify.com/ 注册账号',
          '2. 获取API Token',
          '3. 在.env文件中设置 APIFY_API_TOKEN=your_token_here',
          '4. 重启服务'
        ]
      }
    }
    
      return {
        status: 'excellent',
      message: '✅ Apify已配置，系统就绪！',
      features: [
        '✓ 支持大规模爬取（2000+条评论）',
        '✓ 多排序策略（recent + helpful + top）',
        '✓ 自动去重',
        '✓ 稳定可靠'
      ]
    }
  }
}

module.exports = CrawlerFacade
