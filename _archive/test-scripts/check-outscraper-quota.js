// ========================
// 检查Outscraper账户配额
// ========================

require('dotenv').config()

const OutscraperCrawler = require('./src/crawler/OutscraperCrawler')
const logger = require('./utils/logger')

async function checkOutscraperQuota() {
  console.log('🔍 检查Outscraper账户信息...\n')
  console.log('='.repeat(50))
  
  const crawler = new OutscraperCrawler()
  
  if (!crawler.isAvailable()) {
    console.log('❌ OUTSCRAPER_API_KEY 未配置')
    return
  }
  
  console.log('✅ API Key已配置\n')
  
  try {
    console.log('📡 正在获取账户信息...\n')
    const accountInfo = await crawler.getAccountInfo()
    
    if (accountInfo) {
      console.log('📊 账户详情:')
      console.log(JSON.stringify(accountInfo, null, 2))
      console.log('\n' + '='.repeat(50))
      
      // 检查配额
      if (accountInfo.credits_left !== undefined) {
        if (accountInfo.credits_left === 0 || accountInfo.credits_left < 10) {
          console.log('\n⚠️ 配额不足！')
          console.log('   剩余配额:', accountInfo.credits_left)
          console.log('   需要充值或升级账户')
        } else {
          console.log('\n✅ 配额充足')
          console.log('   剩余配额:', accountInfo.credits_left)
        }
      }
    } else {
      console.log('⚠️ 无法获取账户信息')
      console.log('   可能原因:')
      console.log('   1. API Key无效')
      console.log('   2. 网络问题')
      console.log('   3. Outscraper服务异常')
    }
    
  } catch (error) {
    console.log('❌ 获取账户信息失败:', error.message)
    console.log('\n💡 建议:')
    console.log('   1. 访问 https://outscraper.com/profile/')
    console.log('   2. 检查API Key是否有效')
    console.log('   3. 检查订阅状态和配额')
  }
  
  console.log('\n' + '='.repeat(50))
}

checkOutscraperQuota()
  .then(() => {
    console.log('\n✅ 检查完成')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ 检查出错:', error)
    process.exit(1)
  })


