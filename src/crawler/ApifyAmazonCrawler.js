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
   * @returns {Object} { reviews, productInfo } - 评论数组和产品信息（包括图片）
   */
  async getReviews(asin, maxReviews = Infinity, onProgress = null) {
    if (!this.isAvailable()) {
      throw new Error('Apify未配置，请在.env中设置APIFY_API_TOKEN')
    }
    
    // ✅ 大规模爬取策略：支持2000+条评论
    // 每页约10条评论，计算需要的页数
    let pagesPerSort = 10  // 默认值
    
    if (maxReviews === Infinity) {
      // 全量模式：每种排序爬取50页（约500条）
      pagesPerSort = 50
    } else if (maxReviews > 500) {
      // 大规模模式：每种排序方式爬取足够多的页数
      pagesPerSort = Math.min(Math.ceil(maxReviews / 40), 100)  // 最多100页/排序
    } else {
      // 常规模式
      pagesPerSort = Math.min(Math.ceil(maxReviews / 20), 20)
    }
    
    logger.info(`🚀 开始使用Apify爬取 ASIN: ${asin}（大规模混合策略）`)
    logger.info(`📄 目标评论数: ${maxReviews === Infinity ? '尽可能多' : maxReviews + '条'}`)
    logger.info(`📄 将使用2种排序方式，各爬取 ${pagesPerSort} 页（预计每种获取${pagesPerSort * 10}条）`)
    
    try {
      const allReviews = []
      const reviewIds = new Set()  // 用于去重
      
      // 1️⃣ 第一轮：爬取 'recent' 排序（获取最新评论，包括新的差评）
      logger.info('📡 第1轮：爬取最新评论（recent）')
      const recentRunId = await this.startActorRun(asin, pagesPerSort, 'recent')
      const recentData = await this.waitForResults(recentRunId, onProgress)
      const recentReviews = this.parseReviews(recentData)
      
      // 添加到总评论列表（去重）
      for (const review of recentReviews) {
        const reviewId = review.reviewId || `${review.author?.id}-${review.date}`
        if (!reviewIds.has(reviewId)) {
          reviewIds.add(reviewId)
          allReviews.push(review)
        }
      }
      logger.info(`✓ 第1轮完成：获取 ${recentReviews.length} 条，去重后累计 ${allReviews.length} 条`)
      
      // 2️⃣ 第二轮：爬取 'helpful' 排序（获取有价值的评论，包括详细的差评）
      logger.info('📡 第2轮：爬取最有帮助评论（helpful）')
      const helpfulRunId = await this.startActorRun(asin, pagesPerSort, 'helpful')
      const helpfulData = await this.waitForResults(helpfulRunId, onProgress)
      const helpfulReviews = this.parseReviews(helpfulData)
      
      // 添加到总评论列表（去重）
      for (const review of helpfulReviews) {
        const reviewId = review.reviewId || `${review.author?.id}-${review.date}`
        if (!reviewIds.has(reviewId)) {
          reviewIds.add(reviewId)
          allReviews.push(review)
        }
      }
      logger.info(`✓ 第2轮完成：获取 ${helpfulReviews.length} 条，去重后累计 ${allReviews.length} 条`)
      
      // ✅ 3️⃣ 第三轮（可选）：如果目标数量较大且当前数量不足，再爬取'critical'排序
      if (maxReviews > 300 && allReviews.length < maxReviews * 0.8) {
        logger.info('📡 第3轮：爬取评价最多的评论（top）以补充数据')
        const topRunId = await this.startActorRun(asin, Math.min(pagesPerSort, 30), 'top')
        const topData = await this.waitForResults(topRunId, onProgress)
        const topReviews = this.parseReviews(topData)
        
        for (const review of topReviews) {
          const reviewId = review.reviewId || `${review.author?.id}-${review.date}`
          if (!reviewIds.has(reviewId)) {
            reviewIds.add(reviewId)
            allReviews.push(review)
          }
        }
        logger.info(`✓ 第3轮完成：获取 ${topReviews.length} 条，去重后累计 ${allReviews.length} 条`)
      }
      
      // 🌍 4️⃣ 多站点补充（新功能）：从全球Amazon站点并发爬取
      const multiSiteEnabled = true  // 开关：启用多站点爬取
      const forceMultiSite = true    // 强制启用：无论评论数量都启动多站点
      const targetReviewCount = maxReviews === Infinity ? 2000 : maxReviews  // 提高目标到2000条
      
      if (multiSiteEnabled && (forceMultiSite || allReviews.length < targetReviewCount * 0.6)) {
        logger.info('🌍 ============ 全球多站点爬取模式（智能预检测）============')
        logger.info(`📊 当前评论数: ${allReviews.length}，目标: ${targetReviewCount}，启动全球多站点补充`)
        
        // 定义要爬取的其他站点（按优先级排序，覆盖全球11个Amazon站点）
        const allMarkets = [
          // 北美市场
          { code: 'ca', name: '加拿大站', flag: '🇨🇦', pages: Math.min(pagesPerSort, 20) },
          { code: 'com.mx', name: '墨西哥站', flag: '🇲🇽', pages: Math.min(pagesPerSort, 15) },
          
          // 欧洲市场（主要）
          { code: 'co.uk', name: '英国站', flag: '🇬🇧', pages: Math.min(pagesPerSort, 25) },
          { code: 'de', name: '德国站', flag: '🇩🇪', pages: Math.min(pagesPerSort, 20) },
          { code: 'fr', name: '法国站', flag: '🇫🇷', pages: Math.min(pagesPerSort, 18) },
          { code: 'it', name: '意大利站', flag: '🇮🇹', pages: Math.min(pagesPerSort, 15) },
          { code: 'es', name: '西班牙站', flag: '🇪🇸', pages: Math.min(pagesPerSort, 15) },
          
          // 亚太市场
          { code: 'co.jp', name: '日本站', flag: '🇯🇵', pages: Math.min(pagesPerSort, 20) },
          { code: 'in', name: '印度站', flag: '🇮🇳', pages: Math.min(pagesPerSort, 18) },
          { code: 'com.au', name: '澳大利亚站', flag: '🇦🇺', pages: Math.min(pagesPerSort, 15) },
          
          // 中国市场（跨境电商）
          { code: 'cn', name: '中国站', flag: '🇨🇳', pages: Math.min(pagesPerSort, 12) }
        ]
        
        // 🔍 步骤1：预检测阶段 - 快速并发检测所有站点是否有评论
        logger.info(`🔍 ============ 步骤1: 智能预检测（${allMarkets.length}个站点）============`)
        logger.info(`⚡ 并发检测所有站点，每站点仅爬取1页以快速判断是否有评论...`)
        
        const detectionPromises = allMarkets.map(async (market) => {
          try {
            logger.info(`🔍 ${market.flag} 检测${market.name}（${market.code}）...`)
            const testRunId = await this.startActorRun(asin, 1, 'recent', market.code)  // 仅1页
            const testData = await this.waitForResults(testRunId, null)  // 不显示进度
            const testReviews = this.parseReviews(testData)
            
            // 过滤掉无效评论（rating=0表示404或错误）
            const validReviews = testReviews.filter(r => r.rating > 0 && r.content && r.content.length > 10)
            
            if (validReviews.length > 0) {
              logger.info(`✅ ${market.flag} ${market.name}：有效（${validReviews.length}条样本评论）`)
              return { ...market, available: true, sampleCount: validReviews.length }
            } else {
              logger.info(`❌ ${market.flag} ${market.name}：无评论或不可用`)
              return { ...market, available: false, sampleCount: 0 }
            }
          } catch (error) {
            logger.warn(`⚠️ ${market.flag} ${market.name}检测失败: ${error.message}`)
            return { ...market, available: false, sampleCount: 0 }
          }
        })
        
        // 等待所有预检测完成
        const detectionResults = await Promise.allSettled(detectionPromises)
        
        // 筛选出有效站点
        const additionalMarkets = detectionResults
          .filter(r => r.status === 'fulfilled' && r.value.available)
          .map(r => r.value)
        
        logger.info(`\n✅ 预检测完成！发现 ${additionalMarkets.length} 个有效站点：`)
        additionalMarkets.forEach(m => {
          logger.info(`   ${m.flag} ${m.name}（${m.code}）- ${m.sampleCount}条样本`)
        })
        
        if (additionalMarkets.length === 0) {
          logger.warn('⚠️ 未发现任何有效的国际站点，跳过多站点爬取')
          logger.info(`🌍 多站点爬取完成，总计 ${allReviews.length} 条评论（仅美国站）`)
        } else {
          logger.info(`\n🚀 ============ 步骤2: 完整爬取（${additionalMarkets.length}个有效站点）============`)
          
          // 🚀 并发爬取策略：将站点分批，每批并发执行（避免Apify API限流）
          const batchSize = 4  // 每批并发4个站点
          const batches = []
          
          for (let i = 0; i < additionalMarkets.length; i += batchSize) {
            batches.push(additionalMarkets.slice(i, i + batchSize))
          }
        
          logger.info(`🚀 使用并发爬取策略：${batches.length}批，每批${batchSize}个站点同时进行`)
          
          for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
            const batch = batches[batchIndex]
            
            // 检查是否已达到目标
            if (allReviews.length >= targetReviewCount * 0.95) {
              logger.info(`✓ 已达到目标评论数（${allReviews.length}条），停止多站点爬取`)
              break
            }
            
            logger.info(`📦 开始第${batchIndex + 1}批并发爬取（${batch.map(m => m.flag + m.name).join(', ')}）`)
          
            // 并发启动所有站点的Actor
            const batchPromises = batch.map(async (market) => {
              try {
                logger.info(`📡 ${market.flag} 启动${market.name}（${market.code}）- recent排序`)
                const marketRunId = await this.startActorRun(asin, market.pages, 'recent', market.code)
                return { market, runId: marketRunId, success: true }
              } catch (error) {
                logger.warn(`⚠️ ${market.flag} ${market.name}启动失败: ${error.message}`)
                return { market, runId: null, success: false, error }
              }
            })
            
            // 等待所有Actor启动完成
            const startResults = await Promise.allSettled(batchPromises)
            
            // 并发等待所有Actor运行结果
            const resultPromises = startResults.map(async (result) => {
              if (result.status === 'rejected' || !result.value.success || !result.value.runId) {
                return { market: result.value?.market, success: false, reviews: [] }
              }
              
              const { market, runId } = result.value
              
              try {
                logger.info(`⏳ ${market.flag} 等待${market.name}爬取结果...`)
                const marketData = await this.waitForResults(runId, onProgress)
                const marketReviews = this.parseReviews(marketData)
                
                return { market, success: true, reviews: marketReviews }
              } catch (error) {
                logger.warn(`⚠️ ${market.flag} ${market.name}爬取失败: ${error.message}`)
                return { market, success: false, reviews: [] }
              }
            })
            
            // 等待所有结果
            const results = await Promise.allSettled(resultPromises)
            
            // 处理所有结果：去重并添加到总列表
            for (const result of results) {
              if (result.status === 'rejected') continue
              
              const { market, success, reviews } = result.value
              
              if (!success || !reviews || reviews.length === 0) continue
              
              // 添加站点标识和去重
              let addedCount = 0
              for (const review of reviews) {
                const reviewId = review.reviewId || `${review.author?.id}-${review.date}-${market.code}`
                if (!reviewIds.has(reviewId)) {
                  reviewIds.add(reviewId)
                  // 标注评论来源
                  review.marketplace = market.code
                  review.marketplaceName = market.name
                  allReviews.push(review)
                  addedCount++
                }
              }
              logger.info(`✓ ${market.flag} ${market.name}完成：获取 ${reviews.length} 条，新增 ${addedCount} 条，累计 ${allReviews.length} 条`)
            }
            
            logger.info(`✅ 第${batchIndex + 1}批并发爬取完成，当前累计 ${allReviews.length} 条评论`)
          }
          
          logger.info(`🌍 多站点爬取完成，总计 ${allReviews.length} 条评论`)
        }
      }
      
      // 4. 提取产品信息（从第一批数据中）
      const productInfo = this.extractProductInfo(recentData.length > 0 ? recentData : helpfulData)
      
      // 5. 统计星级分布和多站点数据
      const starDistribution = this.calculateStarDistribution(allReviews)
      const negativeReviews = starDistribution[1] + starDistribution[2] + starDistribution[3]
      const negativePercentage = allReviews.length > 0 ? (negativeReviews / allReviews.length * 100).toFixed(1) : 0
      
      // 统计各站点评论数量
      const marketplaceStats = {}
      allReviews.forEach(review => {
        const market = review.marketplace || 'com'
        const marketName = review.marketplaceName || '美国站'
        marketplaceStats[market] = marketplaceStats[market] || { name: marketName, count: 0 }
        marketplaceStats[market].count++
      })
      
      logger.info(`📊 星级分布: 5星${starDistribution[5]}条, 4星${starDistribution[4]}条, 3星${starDistribution[3]}条, 2星${starDistribution[2]}条, 1星${starDistribution[1]}条`)
      logger.info(`📊 负面评论（1-3星）: ${negativeReviews}条 (${negativePercentage}%)`)
      
      // 显示多站点统计
      if (Object.keys(marketplaceStats).length > 1) {
        logger.info(`🌍 全球多站点数据分布:`)
        const marketFlags = {
          'com': '🇺🇸',
          'ca': '🇨🇦',
          'com.mx': '🇲🇽',
          'co.uk': '🇬🇧',
          'de': '🇩🇪',
          'fr': '🇫🇷',
          'it': '🇮🇹',
          'es': '🇪🇸',
          'co.jp': '🇯🇵',
          'in': '🇮🇳',
          'com.au': '🇦🇺',
          'cn': '🇨🇳'
        }
        Object.entries(marketplaceStats).forEach(([code, stats]) => {
          const flag = marketFlags[code] || '🌍'
          logger.info(`   ${flag} ${stats.name}: ${stats.count}条 (${(stats.count / allReviews.length * 100).toFixed(1)}%)`)
        })
      }
      
      logger.info(`✅ 大规模混合爬取完成，共获取 ${allReviews.length} 条去重评论`)
      
      if (productInfo.image) {
        logger.info(`🖼️ 产品图片: ${productInfo.image}`)
      }
      
      // 限制返回数量
      const finalReviews = maxReviews !== Infinity && allReviews.length > maxReviews
        ? allReviews.slice(0, maxReviews)
        : allReviews
      
      return {
        reviews: finalReviews,
        productInfo: productInfo
      }
      
    } catch (error) {
      logger.error(`❌ Apify爬取失败: ${error.message}`)
      throw error
    }
  }
  
  /**
   * 计算星级分布
   */
  calculateStarDistribution(reviews) {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    for (const review of reviews) {
      const star = Math.round(review.rating)
      if (star >= 1 && star <= 5) {
        distribution[star]++
      }
    }
    return distribution
  }
  
  /**
   * 从Apify数据中提取产品信息
   */
  extractProductInfo(apifyData) {
    if (!apifyData || apifyData.length === 0) {
      return {}
    }
    
    // 从第一条评论中提取产品通用信息
    const firstItem = apifyData[0]
    
    return {
      asin: firstItem.asin || '',
      productTitle: firstItem.productTitle || '',
      image: firstItem.productImage || firstItem.image || '',
      rating: firstItem.productRating || '',
      totalReviews: firstItem.totalReviews || apifyData.length,
      locale: firstItem.locale || 'en_US'
    }
  }
  
  /**
   * 启动 Actor 运行
   */
  async startActorRun(asin, maxPages, sortBy = 'recent', domainCode = 'com') {
    const input = {
      input: [{
        asin: asin,
        domainCode: domainCode,  // ✅ 支持多站点
        sortBy: sortBy,  // ✅ 支持动态排序方式
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
    // ✅ 添加调试日志
    logger.info(`🔍 Apify原始数据示例（前1条）:`)
    if (apifyData && apifyData.length > 0) {
      logger.info(JSON.stringify(apifyData[0], null, 2))
    }
    
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
    
    // ✅ 调试转换后的数据
    logger.info(`🔍 转换后数据示例（前1条）:`)
    if (reviews.length > 0) {
      logger.info(JSON.stringify(reviews[0], null, 2))
    }
    
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

