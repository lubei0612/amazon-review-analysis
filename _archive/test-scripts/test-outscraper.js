// ====================================
// Outscraper 爬虫测试脚本
// ====================================

require('dotenv').config()

const OutscraperCrawler = require('./src/crawler/OutscraperCrawler')

async function test() {
  console.log('========================================')
  console.log('🧪 测试 Outscraper 爬虫')
  console.log('========================================\n')
  
  const crawler = new OutscraperCrawler()
  
  // 1. 检查配置
  if (!crawler.isAvailable()) {
    console.log('❌ Outscraper未配置')
    console.log('请在 .env 文件中设置 OUTSCRAPER_API_KEY\n')
    process.exit(1)
  }
  
  console.log('✅ Outscraper已配置\n')
  
  // 2. 获取账户信息
  console.log('📊 获取账户信息...')
  await crawler.getAccountInfo()
  console.log('')
  
  // 3. 测试爬取（测试模式：只爬10条）
  const testAsin = 'B0C4G36RNS'  // 女鞋产品
  console.log(`🚀 开始爬取ASIN: ${testAsin}（测试模式：10条）\n`)
  
  try {
    const reviews = await crawler.getReviews(testAsin, 10)
    
    console.log(`✅ 爬取完成！共 ${reviews.length} 条评论\n`)
    
    // 4. 显示样例评论
    if (reviews.length > 0) {
      console.log('📋 样例评论:')
      console.log(JSON.stringify(reviews[0], null, 2))
      console.log('')
      
      // 5. 统计信息
      console.log('📊 数据统计:')
      console.log(`   - 总评论数: ${reviews.length}`)
      console.log(`   - 平均评分: ${(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}`)
      console.log(`   - 有标题: ${reviews.filter(r => r.title).length}`)
      console.log(`   - 有内容: ${reviews.filter(r => r.content).length}`)
      console.log(`   - 验证购买: ${reviews.filter(r => r.isVerified).length}`)
      console.log('')
    }
    
    console.log('========================================')
    console.log('✅ 测试完成')
    console.log('========================================\n')
    
  } catch (error) {
    console.log(`\n❌ 测试失败: ${error.message}\n`)
    console.log('========================================')
    console.log('✅ 测试完成')
    console.log('========================================\n')
    process.exit(1)
  }
}

test()



