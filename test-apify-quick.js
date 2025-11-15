// 快速测试新的Apify API密钥
require('dotenv').config()
const ApifyClient = require('apify-client')

console.log('='.repeat(60))
console.log('🧪 测试新的Apify API密钥')
console.log('='.repeat(60))
console.log()

const apiToken = process.env.APIFY_API_TOKEN

if (!apiToken) {
  console.error('❌ 错误: APIFY_API_TOKEN 未设置')
  process.exit(1)
}

// 显示密钥的前后部分（隐藏中间）
const maskedToken = apiToken.slice(0, 10) + '***' + apiToken.slice(-10)
console.log(`✅ API Token已加载: ${maskedToken}`)
console.log()

async function testApifyAPI() {
  try {
    console.log('📡 正在连接Apify...')
    const client = new ApifyClient({ token: apiToken })
    
    console.log('🔍 获取账户信息...')
    const user = await client.user().get()
    
    console.log()
    console.log('✅ API密钥验证成功！')
    console.log()
    console.log('账户信息:')
    console.log(`  - 用户名: ${user.username}`)
    console.log(`  - Email: ${user.email || '未设置'}`)
    console.log(`  - 余额: $${user.usageStats?.balance || 0}`)
    console.log()
    
    // 测试运行一个小任务
    console.log('🚀 测试运行Actor...')
    console.log('   测试产品: B0CHWRXH8B (AirPods Pro 2)')
    console.log('   爬取数量: 10条评论（快速测试）')
    console.log()
    
    const run = await client.actor('junglee/amazon-reviews-scraper').call({
      asinList: ['B0CHWRXH8B'],
      maxReviews: 10,
      domain: 'amazon.com'
    })
    
    console.log('⏳ 等待任务完成...')
    const { items } = await client.dataset(run.defaultDatasetId).listItems()
    
    console.log()
    console.log('✅ 爬取测试成功！')
    console.log(`   获取到 ${items.length} 条评论`)
    
    if (items.length > 0) {
      console.log()
      console.log('📝 第一条评论示例:')
      const first = items[0]
      console.log(`   评分: ${first.stars} ⭐`)
      console.log(`   标题: ${first.title || '无标题'}`)
      console.log(`   内容: ${(first.text || '').substring(0, 100)}...`)
    }
    
    console.log()
    console.log('🎉 所有测试通过！新API密钥工作正常。')
    console.log()
    
  } catch (error) {
    console.error()
    console.error('❌ 测试失败:')
    console.error(`   错误: ${error.message}`)
    
    if (error.statusCode === 401) {
      console.error()
      console.error('⚠️  可能的原因:')
      console.error('   1. API密钥无效或已过期')
      console.error('   2. API密钥格式不正确')
      console.error('   3. 请检查 https://console.apify.com/account/integrations')
    } else if (error.statusCode === 402) {
      console.error()
      console.error('⚠️  账户余额不足')
      console.error('   请充值: https://console.apify.com/billing')
    }
    
    console.error()
    process.exit(1)
  }
}

testApifyAPI()
