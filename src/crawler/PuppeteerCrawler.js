// ========================
// Puppeteer-Extra爬虫 - 带Stealth插件
// 用于绕过Amazon反爬虫检测
// ========================

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const logger = require('../../utils/logger')

// 使用 stealth 插件（自动绕过反爬虫检测）
puppeteer.use(StealthPlugin())

class PuppeteerCrawler {
  constructor() {
    this.name = 'Puppeteer-Extra'
    logger.info('✅ Puppeteer-Extra爬虫已初始化（带Stealth插件）')
    logger.info('💡 优势: 免费、无需API Key、Stealth反爬')
    logger.info('⚠️  限制: 速度较慢（但稳定）')
  }
  
  /**
   * 检查Puppeteer是否可用
   */
  isAvailable() {
    return true // Puppeteer总是可用（只要安装了依赖）
  }
  
  /**
   * 获取产品评论
   * @param {string} asin - Amazon ASIN
   * @param {number} maxReviews - 最大评论数（默认20）
   * @param {function} onProgress - 进度回调
   * @param {string} domain - Amazon站点（默认'amazon.com'）
   */
  async getReviews(asin, maxReviews = 20, onProgress = null, domain = 'amazon.com') {
    logger.info(`🚀 开始使用Puppeteer-Extra爬取 ASIN: ${asin}`)
    logger.info(`   目标: ${maxReviews}条评论`)
    logger.info(`   反爬措施: Stealth Plugin ✅`)
    
    let browser = null
    
    try {
      // Step 1: 启动浏览器（Stealth模式）
      if (onProgress) {
        onProgress({
          current: 0,
          total: maxReviews,
          progress: 10,
          message: '正在启动浏览器（Stealth模式）...'
        })
      }
      
      logger.info('🔐 启动Stealth浏览器...')
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--disable-blink-features=AutomationControlled',  // ✅ 隐藏自动化特征
          '--window-size=1920x1080',
          '--user-agent=' + this.getRandomUserAgent()
        ]
      })
      
      const page = await browser.newPage()
      
      // ✅ 设置更真实的浏览器特征
      await page.setViewport({
        width: 1920 + Math.floor(Math.random() * 100),
        height: 1080 + Math.floor(Math.random() * 100)
      })
      
      await page.setUserAgent(this.getRandomUserAgent())
      
      // ✅ 设置额外HTTP头（模拟真实浏览器）
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      })
      
      // Step 2: 访问评论页面
      const reviewsUrl = `https://www.${domain}/product-reviews/${asin}`
      logger.info(`📡 访问评论页: ${reviewsUrl}`)
      
      if (onProgress) {
        onProgress({
          current: 0,
          total: maxReviews,
          progress: 20,
          message: '正在访问Amazon评论页...'
        })
      }
      
      await page.goto(reviewsUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 90000  // 增加超时时间
      })
      
      // ✅ 随机延迟（模拟人类行为）
      await this.randomDelay(2000, 4000)
      
      // ✅ 滚动页面（触发懒加载，模拟真实浏览）
      logger.info('🖱️ 模拟页面滚动...')
      await page.evaluate(() => {
        window.scrollBy(0, 500)
      })
      await this.randomDelay(500, 1000)
      
      await page.evaluate(() => {
        window.scrollBy(0, 500)
      })
      await this.randomDelay(500, 1000)
      
      // 尝试多个可能的选择器（Amazon经常变化）
      const possibleSelectors = [
        '[data-hook="review"]',
        '.review',
        '[data-hook="cr-review-item"]',
        '#cm_cr-review_list [data-hook="review"]',
        '.a-section.review'
      ]
      
      let reviewSelector = null
      for (const selector of possibleSelectors) {
        const exists = await page.$(selector)
        if (exists) {
          reviewSelector = selector
          logger.info(`✅ 找到评论选择器: ${selector}`)
          break
        }
      }
      
      if (!reviewSelector) {
        // 保存截图帮助调试
        const screenshot = await page.screenshot()
        logger.error('❌ 未找到评论元素')
        logger.error('💡 可能原因: 1) Amazon反爬虫成功 2) 页面结构变化 3) 需要登录')
        throw new Error('未找到评论元素，Amazon可能升级了反爬虫')
      }
      
      // Step 3: 爬取评论
      if (onProgress) {
        onProgress({
          current: 0,
          total: maxReviews,
          progress: 40,
          message: '正在提取评论数据...'
        })
      }
      
      logger.info('📝 开始提取评论数据...')
      const reviews = await page.evaluate((selector) => {
        const reviewElements = document.querySelectorAll(selector)
        const results = []
        
        reviewElements.forEach((review, index) => {
          try {
            // 评分
            const ratingEl = review.querySelector('[data-hook="review-star-rating"], .review-rating, .a-icon-star')
            const ratingText = ratingEl ? ratingEl.textContent : ''
            const ratingMatch = ratingText.match(/(\d+\.?\d*)/)
            const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0
            
            // 标题
            const titleEl = review.querySelector('[data-hook="review-title"], .review-title, .a-text-bold')
            let title = titleEl ? titleEl.textContent.trim() : ''
            // 移除评分前缀
            title = title.replace(/^\d+\.?\d*\s*out of \d+ stars\s*/i, '').trim()
            
            // 内容
            const contentEl = review.querySelector('[data-hook="review-body"], .review-text, .review-text-content span')
            const content = contentEl ? contentEl.textContent.trim() : ''
            
            // 作者
            const authorEl = review.querySelector('[data-hook="genome-widget"] .a-profile-name, .a-profile-name, .author')
            const author = authorEl ? authorEl.textContent.trim() : 'Anonymous'
            
            // 日期
            const dateEl = review.querySelector('[data-hook="review-date"], .review-date')
            let dateText = dateEl ? dateEl.textContent.trim() : ''
            // 移除前缀
            dateText = dateText.replace(/^.*\s+on\s+/i, '').trim()
            
            // 已验证
            const verifiedEl = review.querySelector('[data-hook="avp-badge"], .a-color-success')
            const isVerified = !!verifiedEl
            
            // 有用投票
            const helpfulEl = review.querySelector('[data-hook="helpful-vote-statement"], .helpful-votes')
            const helpfulText = helpfulEl ? helpfulEl.textContent : ''
            const helpfulMatch = helpfulText.match(/(\d+)/)
            const helpfulVotes = helpfulMatch ? parseInt(helpfulMatch[1]) : 0
            
            // 只添加有内容的评论
            if (content || title) {
              results.push({
                reviewId: `review_${Date.now()}_${index}`,
                asin: '',  // 由外层填充
                rating: rating,
                title: title,
                content: content,
                author: {
                  name: author,
                  url: ''
                },
                date: dateText,
                isVerified: isVerified,
                helpfulVotes: helpfulVotes,
                images: [],
                location: '',
                variant: '',
                hasVideo: false
              })
            }
          } catch (error) {
            console.error('解析单条评论失败:', error)
          }
        })
        
        return results
      }, reviewSelector)
      
      // 填充ASIN
      reviews.forEach(review => {
        review.asin = asin
      })
      
      logger.info(`✅ Puppeteer-Extra爬取完成，共获取 ${reviews.length} 条评论`)
      
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
      logger.error('Puppeteer-Extra爬取失败:', error.message)
      throw new Error(`Puppeteer-Extra爬取失败: ${error.message}`)
    } finally {
      // 关闭浏览器
      if (browser) {
        try {
          await browser.close()
        } catch (e) {
          // 忽略关闭错误
        }
      }
    }
  }
  
  /**
   * 随机延迟（模拟人类操作）
   */
  async randomDelay(min, max) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min
    return new Promise(resolve => setTimeout(resolve, delay))
  }
  
  /**
   * 获取随机User-Agent
   */
  getRandomUserAgent() {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
    ]
    return userAgents[Math.floor(Math.random() * userAgents.length)]
  }
}

module.exports = PuppeteerCrawler
