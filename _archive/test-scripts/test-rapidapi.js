// ========================
// 测试RapidAPI爬虫
// ========================

require('dotenv').config()

const RapidAPICrawler = require('./src/crawler/RapidAPICrawler')
const logger = require('./utils/logger')

async function testRapidAPI() {
  console.log('🧪 测试RapidAPI爬虫...\n')
  console.log('='.repeat(50))
  
  const crawler = new RapidAPICrawler()
  
  // ✅ 检查API Key
  if (!crawler.isAvailable()) {
    console.log('❌ RAPIDAPI_KEY 未配置\n')
    console.log('📋 配置步骤:')
    console.log('1. 访问 https://rapidapi.com/')
    console.log('2. 搜索 "Amazon Reviews" API')
    console.log('3. Subscribe到免费计划')
    console.log('4. 复制API Key到.env文件:')
    console.log('   RAPIDAPI_KEY=your_key_here\n')
    console.log('📖 详细指南: 查看 RAPIDAPI-SETUP-GUIDE.md')
    return
  }
  
  console.log('✅ RapidAPI Key已配置\n')
  
  // ✅ 测试ASIN
  const testASIN = 'B08N5WRWNW'  // AirPods Pro
  const limit = 10
  
  console.log(`📋 测试ASIN: ${testASIN}`)
  console.log(`   产品: Apple AirPods Pro (2nd Generation)`)
  console.log(`   爬取数量: ${limit}条\n`)
  
  try {
    console.log('📡 开始爬取...\n')
    
    const reviews = await crawler.getReviews(
      testASIN,
      limit,
      (progress) => {
        console.log(`   进度: ${progress.progress}% - ${progress.message}`)
      },
      'amazon.com'
    )
    
    console.log('\n' + '='.repeat(50))
    console.log('📊 爬取结果:\n')
    console.log(`   ✅ 成功获取 ${reviews.length} 条评论`)
    
    if (reviews.length > 0) {
      console.log('\n📝 第一条评论示例:')
      console.log(`   评分: ${reviews[0].rating} ⭐`)
      console.log(`   标题: ${reviews[0].title}`)
      console.log(`   内容: ${reviews[0].content.substring(0, 100)}...`)
      console.log(`   作者: ${reviews[0].author.name}`)
      console.log(`   日期: ${reviews[0].date}`)
      console.log(`   已验证: ${reviews[0].isVerified ? '是' : '否'}`)
      
      console.log('\n✅ RapidAPI爬虫工作正常！')
      console.log('\n💡 建议:')
      console.log('   - RapidAPI已配置为备用爬虫')
      console.log('   - 当Outscraper失败时会自动切换')
      console.log('   - 可以在.env中注释OUTSCRAPER_API_KEY强制使用RapidAPI')
      
    } else {
      console.log('\n⚠️ 爬取成功但返回0条评论')
      console.log('   可能原因:')
      console.log('   1. API配额不足')
      console.log('   2. API endpoint配置错误')
      console.log('   3. 产品ASIN不正确')
      console.log('\n💡 排查建议:')
      console.log('   - 查看 src/crawler/RapidAPICrawler.js')
      console.log('   - 确认baseURL和apiHost配置正确')
      console.log('   - 参考你选择的RapidAPI的Code Snippets')
    }
    
  } catch (error) {
    console.log('\n❌ 爬取失败:', error.message)
    console.log('\n💡 排查建议:')
    console.log('   1. 检查API Key是否有效')
    console.log('   2. 检查API配额是否充足')
    console.log('   3. 确认API endpoint配置正确')
    console.log('   4. 查看 RAPIDAPI-SETUP-GUIDE.md 配置指南')
    
    if (error.response) {
      console.log('\n📋 错误详情:')
      console.log('   状态码:', error.response.status)
      console.log('   错误信息:', JSON.stringify(error.response.data, null, 2))
    }
  }
  
  console.log('\n' + '='.repeat(50))
}

testRapidAPI()
  .then(() => {
    console.log('\n✅ 测试完成')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ 测试出错:', error)
    process.exit(1)
  })


