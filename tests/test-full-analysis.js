// ========================
// 全量评论分析测试
// ========================

require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const CrawlerFacade = require('../src/crawler/CrawlerFacade')
const AnalysisService = require('../src/ai/AnalysisService')
const logger = require('../utils/logger')

console.log('='.repeat(80))
console.log('🧪 全量评论分析测试')
console.log('='.repeat(80))
console.log()

// 测试ASIN（可以改为你想测试的产品）
const TEST_ASIN = 'B07ZPKN6YR' // iPhone 11示例

async function runTest() {
  try {
    console.log(`📦 测试产品 ASIN: ${TEST_ASIN}`)
    console.log()
    
    // 第1步：全量爬取评论
    console.log('=' .repeat(60))
    console.log('📥 步骤1: 全量爬取评论')
    console.log('='.repeat(60))
    
    const crawler = new CrawlerFacade()
    
    const reviews = await crawler.scrapeReviews(TEST_ASIN, {
      maxReviews: Infinity, // 全量爬取
      onProgress: (progress) => {
        console.log(`   进度: ${progress.message}`)
      }
    })
    
    console.log()
    console.log(`✅ 爬取完成！共获取 ${reviews.length} 条评论`)
    console.log()
    
    // 数据质量检查
    console.log('📊 数据质量检查：')
    const verifiedCount = reviews.filter(r => r.isVerified).length
    const avgLength = reviews.reduce((sum, r) => sum + (r.content?.length || 0), 0) / reviews.length
    console.log(`   - 已验证购买: ${verifiedCount} (${(verifiedCount/reviews.length*100).toFixed(1)}%)`)
    console.log(`   - 平均评论长度: ${avgLength.toFixed(0)} 字符`)
    console.log()
    
    // 第2步：深度AI分析
    console.log('='.repeat(60))
    console.log('🤖 步骤2: 深度AI分析')
    console.log('='.repeat(60))
    console.log()
    
    const analysisService = new AnalysisService()
    
    console.log('开始并发AI分析（7个维度）...')
    const startTime = Date.now()
    
    const analysisResult = await analysisService.analyzeAll(reviews)
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    
    console.log()
    console.log(`✅ AI分析完成！耗时: ${duration}秒`)
    console.log()
    
    // 第3步：展示分析结果
    console.log('='.repeat(60))
    console.log('📊 步骤3: 分析结果展示')
    console.log('='.repeat(60))
    console.log()
    
    // 消费者画像
    if (analysisResult.consumerProfile) {
      console.log('👥 消费者画像：')
      console.log()
      
      // 性别比例（新增）
      if (analysisResult.consumerProfile.genderRatio) {
        const {male, female, unknown} = analysisResult.consumerProfile.genderRatio
        console.log('   性别比例：')
        console.log(`      男性: ${male}%`)
        console.log(`      女性: ${female}%`)
        console.log(`      未知: ${unknown}%`)
        console.log()
      }
      
      // 人群特征
      if (analysisResult.consumerProfile.demographics) {
        console.log('   人群特征（TOP 3）：')
        analysisResult.consumerProfile.demographics.slice(0, 3).forEach((item, idx) => {
          console.log(`      ${idx+1}. ${item.persona}: ${item.percentage}%`)
          console.log(`         ${item.reason}`)
        })
        console.log()
      }
      
      // 使用时刻
      if (analysisResult.consumerProfile.usageTime) {
        console.log('   使用时刻（TOP 3）：')
        analysisResult.consumerProfile.usageTime.slice(0, 3).forEach((item, idx) => {
          console.log(`      ${idx+1}. ${item.occasion}: ${item.percentage}%`)
        })
        console.log()
      }
      
      // 使用地点
      if (analysisResult.consumerProfile.usageLocation) {
        console.log('   使用地点（TOP 3）：')
        analysisResult.consumerProfile.usageLocation.slice(0, 3).forEach((item, idx) => {
          console.log(`      ${idx+1}. ${item.place}: ${item.percentage}%`)
        })
        console.log()
      }
      
      // 行为特征
      if (analysisResult.consumerProfile.behaviors) {
        console.log('   行为特征（TOP 3）：')
        analysisResult.consumerProfile.behaviors.slice(0, 3).forEach((item, idx) => {
          console.log(`      ${idx+1}. ${item.behavior}: ${item.percentage}%`)
        })
        console.log()
      }
    }
    
    // 使用场景
    if (analysisResult.usageScenarios) {
      console.log('🎯 使用场景（TOP 5）：')
      analysisResult.usageScenarios.slice(0, 5).forEach((item, idx) => {
        console.log(`   ${idx+1}. ${item.name}: ${item.percentage}%`)
        console.log(`      ${item.description}`)
      })
      console.log()
    }
    
    // 好评分析
    if (analysisResult.productExperience && analysisResult.productExperience.strengths) {
      console.log('👍 产品优点（TOP 5）：')
      analysisResult.productExperience.strengths.slice(0, 5).forEach((item, idx) => {
        console.log(`   ${idx+1}. ${item.aspect}: ${item.percentage}%`)
      })
      console.log()
    }
    
    // 差评分析
    if (analysisResult.productExperience && analysisResult.productExperience.weaknesses) {
      console.log('👎 产品缺点（TOP 5）：')
      analysisResult.productExperience.weaknesses.slice(0, 5).forEach((item, idx) => {
        console.log(`   ${idx+1}. ${item.aspect}: ${item.percentage}%`)
      })
      console.log()
    }
    
    // 未满足需求
    if (analysisResult.unmetNeeds) {
      console.log('🔍 未被满足的需求（TOP 5）：')
      analysisResult.unmetNeeds.slice(0, 5).forEach((item, idx) => {
        console.log(`   ${idx+1}. ${item.need}: ${item.percentage}% (严重程度: ${item.severity})`)
        if (item.suggestions && item.suggestions.length > 0) {
          console.log(`      改进建议: ${item.suggestions[0]}`)
        }
      })
      console.log()
    }
    
    // 购买动机
    if (analysisResult.purchaseMotivation) {
      console.log('💰 购买动机（TOP 5）：')
      analysisResult.purchaseMotivation.slice(0, 5).forEach((item, idx) => {
        console.log(`   ${idx+1}. ${item.type}: ${item.percentage}%`)
      })
      console.log()
    }
    
    // 统计信息
    console.log('='.repeat(60))
    console.log('📈 统计信息')
    console.log('='.repeat(60))
    console.log(`总评论数: ${reviews.length}`)
    console.log(`分析耗时: ${duration}秒`)
    console.log(`AI调用成功: ${analysisResult.successCount || '7'}/7`)
    console.log()
    
    console.log('='.repeat(80))
    console.log('✅ 测试完成！')
    console.log('='.repeat(80))
    
  } catch (error) {
    console.error()
    console.error('❌ 测试失败:', error.message)
    console.error()
    console.error('错误堆栈:')
    console.error(error.stack)
    process.exit(1)
  }
}

// 运行测试
runTest()

