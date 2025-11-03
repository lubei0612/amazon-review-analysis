// ========================
// 测试Puppeteer爬虫
// ========================

require('dotenv').config()

const PuppeteerCrawler = require('./src/crawler/PuppeteerCrawler')
const logger = require('./utils/logger')

async function testPuppeteer() {
  console.log('🧪 测试Puppeteer爬虫...\n')
  console.log('='.repeat(50))
  
  const crawler = new PuppeteerCrawler()
  
  console.log('✅ Puppeteer总是可用（免费、无需API Key）\n')
  
  // ✅ 测试ASIN
  const testASIN = 'B08N5WRWNW'  // AirPods Pro
  const limit = 15  // 尝试爬取15条
  
  console.log(`📋 测试ASIN: ${testASIN}`)
  console.log(`   产品: Apple AirPods Pro (2nd Generation)`)
  console.log(`   目标: ${limit}条评论`)
  console.log(`   特点: 免费、慢速、实际可能爬10-15条\n`)
  
  try {
    console.log('📡 开始爬取（预计需要20-30秒）...\n')
    
    const reviews = await crawler.getReviews(
      testASIN,
      limit,
      (progress) => {
        console.log(`   ${progress.message}`)
      },
      'amazon.com'
    )
    
    console.log('\n' + '='.repeat(50))
    console.log('📊 爬取结果:\n')
    console.log(`   ✅ 成功获取 ${reviews.length} 条评论`)
    
    if (reviews.length > 0) {
      console.log('\n📝 前3条评论示例:')
      
      reviews.slice(0, 3).forEach((review, index) => {
        console.log(`\n${index + 1}. 评分: ${review.rating} ⭐`)
        console.log(`   标题: ${review.title}`)
        console.log(`   内容: ${review.content.substring(0, 80)}...`)
        console.log(`   作者: ${review.author.name}`)
        console.log(`   已验证: ${review.isVerified ? '是' : '否'}`)
      })
      
      console.log('\n✅ Puppeteer爬虫工作正常！')
      console.log('\n💡 说明:')
      console.log('   - Puppeteer免费、无需API Key')
      console.log('   - 速度较慢但可靠')
      console.log('   - 已自动集成为终极备选方案')
      console.log('   - 降级策略: Outscraper → RapidAPI → Puppeteer')
      
    } else {
      console.log('\n⚠️ 爬取成功但返回0条评论')
      console.log('   可能原因:')
      console.log('   1. Amazon页面结构变化')
      console.log('   2. 被Amazon临时限制')
      console.log('   3. 网络问题')
    }
    
  } catch (error) {
    console.log('\n❌ 爬取失败:', error.message)
    console.log('\n💡 排查建议:')
    console.log('   1. 检查网络连接')
    console.log('   2. 确认Puppeteer已正确安装')
    console.log('   3. 尝试重新运行测试')
    console.log('   4. 检查Amazon是否可访问')
  }
  
  console.log('\n' + '='.repeat(50))
}

testPuppeteer()
  .then(() => {
    console.log('\n✅ 测试完成')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ 测试出错:', error)
    process.exit(1)
  })


