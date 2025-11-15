// 测试新的Apify API密钥
require('dotenv').config()
const ApifyAmazonCrawler = require('./src/crawler/ApifyAmazonCrawler')
const logger = require('./utils/logger')

console.log('='.repeat(80))
console.log('🧪 测试新的Apify API密钥')
console.log('='.repeat(80))
console.log()

// 检查API密钥
const apiToken = process.env.APIFY_API_TOKEN
if (!apiToken) {
  console.error('❌ 错误: APIFY_API_TOKEN 未设置在.env文件中')
  process.exit(1)
}

// 显示密钥（隐藏中间部分）
const maskedToken = apiToken.slice(0, 15) + '***' + apiToken.slice(-15)
console.log(`✅ API Token已加载: ${maskedToken}`)
console.log()

async function testNewAPI() {
  try {
    console.log('📡 初始化Apify爬虫...')
    const crawler = new ApifyAmazonCrawler()
    
    if (!crawler.isAvailable()) {
      throw new Error('Apify爬虫初始化失败')
    }
    
    console.log('✅ Apify爬虫初始化成功')
    console.log()
    
    // 测试爬取少量评论
    console.log('🚀 开始测试爬取...')
    console.log('   测试产品: B0CHWRXH8B (AirPods Pro 2)')
    console.log('   爬取数量: 20条评论（快速测试）')
    console.log()
    
    let progressCount = 0
    const result = await crawler.getReviews('B0CHWRXH8B', 20, (progress) => {
      progressCount++
      if (progressCount % 5 === 0) {
        console.log(`   进度: ${progress.message || '处理中...'}`)
      }
    })
    
    console.log()
    console.log('✅ 爬取测试成功！')
    console.log()
    
    // 显示结果
    const reviews = result.reviews || result
    console.log('📊 爬取结果:')
    console.log(`   - 总评论数: ${reviews.length} 条`)
    
    if (reviews.length > 0) {
      // 统计评分分布
      const ratingDist = {}
      reviews.forEach(r => {
        const rating = r.rating || r.stars || 0
        ratingDist[rating] = (ratingDist[rating] || 0) + 1
      })
      
      console.log(`   - 评分分布:`)
      Object.keys(ratingDist).sort((a, b) => b - a).forEach(rating => {
        console.log(`     ${rating}⭐: ${ratingDist[rating]}条`)
      })
      
      // 显示第一条评论
      console.log()
      console.log('📝 第一条评论示例:')
      const first = reviews[0]
      console.log(`   评分: ${first.rating || first.stars}⭐`)
      console.log(`   标题: ${first.title || '无标题'}`)
      console.log(`   内容: ${(first.content || first.text || '').substring(0, 100)}...`)
      console.log(`   作者: ${first.author?.name || first.reviewer || '匿名'}`)
      console.log(`   日期: ${first.date || '未知'}`)
    }
    
    // 检查产品信息
    if (result.productInfo) {
      console.log()
      console.log('📦 产品信息:')
      console.log(`   - 名称: ${result.productInfo.title || '未知'}`)
      console.log(`   - 评分: ${result.productInfo.rating || '未知'}`)
      console.log(`   - 评论数: ${result.productInfo.reviewCount || '未知'}`)
      if (result.productInfo.images && result.productInfo.images.length > 0) {
        console.log(`   - 图片数: ${result.productInfo.images.length}`)
      }
    }
    
    console.log()
    console.log('='.repeat(80))
    console.log('🎉 所有测试通过！新的Apify API密钥工作正常。')
    console.log('='.repeat(80))
    console.log()
    console.log('✅ 可以正常使用该API密钥进行评论分析')
    console.log()
    
  } catch (error) {
    console.error()
    console.error('='.repeat(80))
    console.error('❌ 测试失败')
    console.error('='.repeat(80))
    console.error()
    console.error(`错误信息: ${error.message}`)
    
    if (error.response) {
      console.error(`HTTP状态码: ${error.response.status}`)
      console.error(`响应数据:`, error.response.data)
    }
    
    console.error()
    
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      console.error('⚠️  可能的原因:')
      console.error('   1. API密钥无效或已过期')
      console.error('   2. API密钥格式不正确')
      console.error('   3. 请检查 https://console.apify.com/account/integrations')
    } else if (error.message.includes('402') || error.message.includes('Payment')) {
      console.error('⚠️  账户余额不足')
      console.error('   请充值: https://console.apify.com/billing')
    } else if (error.message.includes('timeout')) {
      console.error('⚠️  请求超时')
      console.error('   1. 检查网络连接')
      console.error('   2. 稍后重试')
    }
    
    console.error()
    process.exit(1)
  }
}

// 运行测试
testNewAPI()
