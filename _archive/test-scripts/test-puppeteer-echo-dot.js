// ========================
// 测试Puppeteer能否爬取Echo Dot
// （这个产品Outscraper能成功）
// ========================

require('dotenv').config()
const PuppeteerCrawler = require('./src/crawler/PuppeteerCrawler')

async function testEchoDot() {
  console.log('🧪 测试Puppeteer爬取Echo Dot\n')
  console.log('='.repeat(50))
  
  const crawler = new PuppeteerCrawler()
  
  // 测试Outscraper能成功的ASIN
  const testASIN = 'B0BSHF7WHW'  // Echo Dot 5th Gen
  
  console.log(`\n📋 测试ASIN: ${testASIN}`)
  console.log(`   产品: Echo Dot (5th Gen)`)
  console.log(`   Outscraper: ✅ 能成功爬取`)
  console.log(`   Puppeteer: ❓ 待测试\n`)
  
  try {
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
        console.log('')
      })
      
      console.log('✅ Puppeteer能爬取Echo Dot!')
      console.log('💡 结论: 某些产品两个爬虫都能用')
    } else {
      console.log('\n⚠️ 返回0条评论')
    }
    
  } catch (error) {
    console.log('\n❌ 爬取失败:', error.message)
  }
  
  console.log('\n' + '='.repeat(50))
}

testEchoDot()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ 测试出错:', error)
    process.exit(1)
  })

