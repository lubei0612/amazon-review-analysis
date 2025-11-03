// ========================
// 测试Puppeteer-Extra爬虫
// ========================

require('dotenv').config()
const PuppeteerCrawler = require('./src/crawler/PuppeteerCrawler')

async function testPuppeteerExtra() {
  console.log('🧪 测试Puppeteer-Extra爬虫（带Stealth插件）\n')
  console.log('='.repeat(50))
  
  const crawler = new PuppeteerCrawler()
  
  // 测试ASIN（之前Outscraper失败的）
  const testASIN = 'B08N5WRWNW'  // AirPods Pro
  
  console.log(`\n📋 测试ASIN: ${testASIN}`)
  console.log(`   产品: Apple AirPods Pro`)
  console.log(`   目标: 15条评论\n`)
  
  try {
    console.log('🚀 开始爬取...\n')
    
    const reviews = await crawler.getReviews(
      testASIN,
      15,
      (progress) => {
        console.log(`   [${progress.progress}%] ${progress.message}`)
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
        console.log(`   内容: ${review.content.substring(0, 80)}${review.content.length > 80 ? '...' : ''}`)
        console.log(`   作者: ${review.author.name}`)
        console.log(`   验证: ${review.isVerified ? '✓' : '✗'}`)
        console.log('')
      })
      
      console.log('✅ Puppeteer-Extra测试成功！')
    } else {
      console.log('\n⚠️ 返回0条评论，可能需要进一步调试')
    }
    
  } catch (error) {
    console.log('\n❌ 爬取失败:', error.message)
    console.log('\n💡 可能原因:')
    console.log('   1. Amazon升级了反爬虫措施')
    console.log('   2. 页面结构发生变化')
    console.log('   3. 需要更多的反爬虫绕过措施')
  }
  
  console.log('\n' + '='.repeat(50))
}

testPuppeteerExtra()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ 测试出错:', error)
    process.exit(1)
  })

