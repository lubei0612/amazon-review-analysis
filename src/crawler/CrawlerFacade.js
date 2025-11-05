// ================================
// 爬虫门面类 - 统一爬虫接口
// ================================
// 
// 职责：
// 1. 管理多个爬虫Provider（Outscraper、RapidAPI）
// 2. 实现降级策略（Outscraper失败 → RapidAPI）
// 3. 统一返回数据格式
// 4. 提供进度回调
// 
// 使用示例：
// const crawler = new CrawlerFacade()
// const reviews = await crawler.crawlReviews('B08N5WRWNW', {
//   maxReviews: 500,
//   onProgress: (data) => console.log(data)
// })

const logger = require('../../utils/logger')
const OutscraperCrawler = require('./OutscraperCrawler')
const RapidAPICrawler = require('./RapidAPICrawler')
const ApifyAmazonCrawler = require('./ApifyAmazonCrawler')  // ✅ 新增 Apify 爬虫
const PuppeteerCrawler = require('./PuppeteerCrawler')

class CrawlerFacade {
  constructor() {
    // 初始化所有爬虫Provider
    this.outscraper = new OutscraperCrawler()
    this.apify = new ApifyAmazonCrawler()  // ✅ Apify 爬虫
    this.rapidapi = new RapidAPICrawler()
    this.puppeteer = new PuppeteerCrawler()
    
    // ✅ 爬虫优先级（Apify优先，因为更稳定）
    // Apify → Outscraper → RapidAPI → Puppeteer
    this.primaryCrawler = this.apify.isAvailable() ? this.apify : this.outscraper
    this.fallbackCrawler = this.rapidapi
    this.lastResortCrawler = this.puppeteer
    
    // ✅ 读取环境变量：是否启用 Puppeteer 降级（默认禁用）
    this.enablePuppeteerFallback = process.env.ENABLE_PUPPETEER_FALLBACK === 'true'
    
    logger.info('✅ CrawlerFacade已初始化')
    logger.info(`   主爬虫: ${this.apify.isAvailable() ? 'Apify (可用)' : 'Outscraper (' + (this.outscraper.isAvailable() ? '可用' : '未配置') + ')'}`)
    logger.info(`   备用爬虫1: RapidAPI (${this.rapidapi.isAvailable() ? '可用' : '未配置'})`)
    logger.info(`   备用爬虫2: Puppeteer (${this.enablePuppeteerFallback ? (this.puppeteer.isAvailable() ? '可用' : '未配置') : '已禁用'})`)
  }
  
  /**
   * 爬取评论（带降级策略）
   * 
   * @param {string} asin - Amazon ASIN
   * @param {object} options - 配置项
   * @param {number} options.maxReviews - 最大评论数（默认Infinity，全量爬取）
   * @param {function} options.onProgress - 进度回调
   * @param {string} options.domain - Amazon站点（默认'amazon.com'）
   * @returns {Promise<Array>} 评论数组
   */
  async crawlReviews(asin, options = {}) {
    const {
      maxReviews = Infinity,
      onProgress = null,
      domain = 'amazon.com'
    } = options
    
    logger.info(`🔄 CrawlerFacade开始爬取: ${asin}`)
    logger.info(`   目标评论数: ${maxReviews === Infinity ? '全量（无限制）' : maxReviews + '条'}`)
    logger.info(`   Amazon站点: ${domain}`)
    
    // ✅ 优先使用 Apify（如果配置了）
    if (this.apify.isAvailable()) {
      try {
        logger.info('🚀 使用 Apify 主爬虫...')
        
        const result = await this.apify.getReviews(
          asin,
          maxReviews,
          onProgress
        )
        
        const reviews = result.reviews || result // 兼容旧格式
        const productInfo = result.productInfo || {}
        
        logger.info(`✅ Apify成功，获取 ${reviews.length} 条评论`)
        
        // ✅ 检查空数据并触发降级
        if (reviews.length === 0) {
          logger.warn('⚠️ Apify返回0条评论，触发降级策略')
          throw new Error('Apify返回空数据')
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
        logger.warn(`❌ Apify失败: ${error.message}`)
        logger.warn('🔄 准备降级到 Outscraper/RapidAPI...')
        
        // 继续尝试降级
      }
    }
    
    // 降级到 Outscraper
    if (this.outscraper.isAvailable()) {
      try {
        logger.info('🚀 使用 Outscraper 主爬虫...')
        
        const reviews = await this.outscraper.getReviews(
          asin, 
          maxReviews, 
          onProgress,
          domain
        )
        
        logger.info(`✅ Outscraper成功，获取 ${reviews.length} 条评论`)
        
        // ✅ 检查空数据并触发降级
        if (reviews.length === 0) {
          logger.warn('⚠️ Outscraper返回0条评论，触发降级策略')
          throw new Error('Outscraper返回空数据')
        }
        
        return {
          success: true,
          source: 'Outscraper',
          reviews: reviews,
          count: reviews.length,
          asin: asin
        }
        
      } catch (error) {
        logger.warn(`❌ Outscraper失败: ${error.message}`)
        logger.warn('🔄 准备降级到 RapidAPI...')
        
        // 继续尝试降级
      }
    } else {
      logger.warn('⚠️ Outscraper未配置，跳过')
    }
    
    // 降级到RapidAPI
    if (this.rapidapi.isAvailable()) {
      try {
        logger.info('🔄 使用 RapidAPI 备用爬虫...')
        
        const reviews = await this.rapidapi.getReviews(
          asin,
          maxReviews,
          onProgress
        )
        
        logger.info(`✅ RapidAPI成功，获取 ${reviews.length} 条评论`)
        
        return {
          success: true,
          source: 'RapidAPI',
          reviews: reviews,
          count: reviews.length,
          asin: asin
        }
        
      } catch (error) {
        logger.warn(`❌ RapidAPI也失败: ${error.message}`)
        
        // ✅ 检查是否启用 Puppeteer 降级
        if (!this.enablePuppeteerFallback) {
          logger.error('❌ Puppeteer 降级已禁用（环境变量 ENABLE_PUPPETEER_FALLBACK=false）')
          logger.error('💡 提示：')
          logger.error('   1. 检查 RapidAPI Key 是否正确')
          logger.error('   2. 运行诊断脚本：node diagnose-rapidapi.js')
          logger.error('   3. 查看 RapidAPI 配额：https://rapidapi.com/developer/dashboard')
          throw new Error(`RapidAPI 失败: ${error.message}`)
        }
        
        logger.warn('🔄 准备降级到 Puppeteer...')
        
        // 继续尝试终极备选
      }
    } else {
      logger.warn('⚠️ RapidAPI未配置，跳过')
    }
    
    // 终极备选：Puppeteer（总是可用，免费但慢）
    if (this.enablePuppeteerFallback && this.puppeteer.isAvailable()) {
      try {
        logger.info('🔄 使用 Puppeteer 终极备选爬虫...')
        
        const reviews = await this.puppeteer.getReviews(
          asin,
          maxReviews,
          onProgress,
          domain
        )
        
        logger.info(`✅ Puppeteer成功，获取 ${reviews.length} 条评论`)
        
        return {
          success: true,
          source: 'Puppeteer',
          reviews: reviews,
          count: reviews.length,
          asin: asin
        }
        
      } catch (error) {
        logger.error(`❌ Puppeteer也失败: ${error.message}`)
        throw new Error('所有爬虫都失败了，请稍后重试')
      }
    } else {
      throw new Error('所有爬虫都失败或未配置')
    }
  }
  
  /**
   * 获取产品信息（仅Outscraper支持）
   * 
   * @param {string} asin - Amazon ASIN
   * @param {string} marketplace - Amazon站点（默认'amazon.com'）
   * @returns {Promise<Object>} 产品信息
   */
  async getProductInfo(asin, marketplace = 'amazon.com') {
    if (!this.outscraper.isAvailable()) {
      logger.warn('⚠️ Outscraper未配置，无法获取产品信息')
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
      
      // Outscraper支持获取产品详情
      const productUrl = `https://${marketplace}/dp/${asin}`
      const result = await this.outscraper.getProductInfo(asin, marketplace)
      
      logger.info(`✅ 产品信息获取成功`)
      
      return result
      
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
      outscraper: {
        available: this.outscraper.isAvailable(),
        name: 'Outscraper',
        priority: 'primary',
        features: ['reviews', 'product_info', 'high_success_rate']
      },
      rapidapi: {
        available: this.rapidapi.isAvailable(),
        name: 'RapidAPI',
        priority: 'fallback_1',
        features: ['reviews', 'fast', 'free_tier']
      },
      puppeteer: {
        available: this.puppeteer.isAvailable(),
        name: 'Puppeteer',
        priority: 'fallback_2',
        features: ['reviews', 'free', 'always_available', 'slow']
      }
    }
  }
  
  /**
   * 获取推荐的爬虫配置建议
   */
  getRecommendations() {
    const status = this.getStatus()
    
    // Puppeteer总是可用，所以不会出现完全无爬虫的情况
    if (!status.outscraper.available && !status.rapidapi.available) {
      return {
        status: 'minimal',
        message: '⚠️ 仅Puppeteer可用（最小配置）',
        note: 'Puppeteer免费但速度慢，建议配置API爬虫',
        actions: [
          '推荐：在.env中设置 OUTSCRAPER_API_KEY',
          '或设置 RAPIDAPI_KEY 作为备用'
        ]
      }
    }
    
    if (status.outscraper.available && status.rapidapi.available) {
      return {
        status: 'excellent',
        message: '✅ 完美配置！三层爬虫都已就绪',
        config: 'Outscraper → RapidAPI → Puppeteer'
      }
    }
    
    if (status.outscraper.available) {
      return {
        status: 'good',
        message: '✅ Outscraper + Puppeteer（良好配置）',
        suggestion: '可选：配置RAPIDAPI_KEY增加中间备用层'
      }
    }
    
    if (status.rapidapi.available) {
      return {
        status: 'basic',
        message: '⚠️ RapidAPI + Puppeteer（基础方案）',
        suggestion: '推荐：配置OUTSCRAPER_API_KEY作为主爬虫'
      }
    }
  }
}

module.exports = CrawlerFacade

