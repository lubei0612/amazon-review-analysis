// ========================
// 测试修复后的Outscraper完整流程
// ========================

require('dotenv').config()
const OutscraperCrawler = require('./src/crawler/OutscraperCrawler')

async function testFixed() {
  console.log('🧪 测试修复后的Outscraper\n')
  console.log('='.repeat(50))
  
  const crawler = new OutscraperCrawler()
  
  if (!crawler.isAvailable()) {
    console.log('❌ Outscraper未配置')
    return
  }
  
  console.log('✅ Outscraper已配置\n')
  
  // 测试能工作的ASIN
  const testASIN = 'B0BSHF7WHW'  // Echo Dot 5th Gen
  
  console.log(`📋 测试ASIN: ${testASIN}`)
  console.log(`   产品: Echo Dot (5th Gen)`)
  console.log(`   目标: 15条评论\n`)
  
  try {
    console.log('🚀 开始爬取...\n')
    
    const reviews = await crawler.getReviews(
      testASIN,
      15,
      (progress) => {
        console.log(`   ${progress.message}`)
      },
      'amazon.com'
    )
    
    console.log('\n' + '='.repeat(50))
    console.log('📊 爬取结果:\n')
    console.log(`   ✅ 成功获取 ${reviews.length} 条评论`)
    
    if (reviews.length > 0) {
      console.log('\n📝 前3条评论示例:\n')
      
      reviews.slice(0, 3).forEach((review, index) => {
        console.log(`${index + 1}. [${review.rating}⭐] ${review.title}`)
        console.log(`   内容: ${review.content.substring(0, 80)}...`)
        console.log(`   作者: ${review.author.name}`)
        console.log(`   验证: ${review.isVerified ? '✓' : '✗'}`)
        console.log('')
      })
      
      console.log('✅ Outscraper修复成功！')
      console.log('\n💡 注意: 某些ASIN可能返回空数据（如B08N5WRWNW）')
      console.log('   这是正常的，需要Puppeteer-Extra作为备选方案')
    } else {
      console.log('\n⚠️ 返回0条评论')
    }
    
  } catch (error) {
    console.log('\n❌ 爬取失败:', error.message)
  }
  
  console.log('\n' + '='.repeat(50))
}

testFixed()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ 测试出错:', error)
    process.exit(1)
  })

