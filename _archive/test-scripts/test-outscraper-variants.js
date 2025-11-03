// ========================
// Outscraper不同参数组合测试
// ========================

require('dotenv').config()
const axios = require('axios')

const testConfigs = [
  {
    name: '测试1: 直接ASIN',
    params: {
      query: 'B08N5WRWNW',
      limit: 5,
      domain: 'amazon.com',
      async: false
    }
  },
  {
    name: '测试2: 完整URL',
    params: {
      query: 'https://www.amazon.com/dp/B08N5WRWNW',
      limit: 5,
      async: false
    }
  },
  {
    name: '测试3: 产品评论URL',
    params: {
      query: 'https://www.amazon.com/product-reviews/B08N5WRWNW',
      limit: 5,
      async: false
    }
  },
  {
    name: '测试4: 不同ASIN (Kindle)',
    params: {
      query: 'B0BSHF7WHW',
      limit: 5,
      domain: 'amazon.com',
      async: false
    }
  },
  {
    name: '测试5: 增加过滤参数',
    params: {
      query: 'B08N5WRWNW',
      limit: 10,
      domain: 'amazon.com',
      filterByReviewer: 'all_reviews',
      filterByStar: 'all_stars',
      async: false
    }
  }
]

async function testVariant(config) {
  console.log(`\n📋 ${config.name}`)
  console.log(`   参数: ${JSON.stringify(config.params, null, 2).substring(0, 200)}`)
  
  try {
    const response = await axios.get(
      'https://api.app.outscraper.com/amazon/reviews',
      {
        params: config.params,
        headers: {
          'X-API-KEY': process.env.OUTSCRAPER_API_KEY
        },
        timeout: 120000
      }
    )
    
    const hasData = response.data.data && 
                   response.data.data.length > 0 && 
                   response.data.data[0] &&
                   (Array.isArray(response.data.data[0]) ? 
                     response.data.data[0].length > 0 : 
                     Object.keys(response.data.data[0]).length > 0)
    
    if (hasData) {
      console.log(`   ✅ 成功获取数据!`)
      console.log(`   数据结构: ${JSON.stringify(response.data.data[0], null, 2).substring(0, 300)}`)
      return { success: true, config, data: response.data }
    } else {
      console.log(`   ⚠️ 返回空数据`)
      return { success: false, config }
    }
    
  } catch (error) {
    console.log(`   ❌ 失败: ${error.message}`)
    return { success: false, config, error: error.message }
  }
}

async function runAllTests() {
  console.log('🧪 Outscraper参数组合测试\n')
  console.log('='.repeat(50))
  
  const results = []
  
  for (const config of testConfigs) {
    const result = await testVariant(config)
    results.push(result)
    
    // 如果成功，停止测试
    if (result.success) {
      console.log('\n🎉 找到有效配置!')
      break
    }
    
    // 每次测试间隔1秒
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('📊 测试总结:')
  console.log(`   成功: ${results.filter(r => r.success).length}/${results.length}`)
  
  const successful = results.find(r => r.success)
  if (successful) {
    console.log('\n✅ 推荐配置:')
    console.log(JSON.stringify(successful.config.params, null, 2))
  } else {
    console.log('\n⚠️ 所有配置都返回空数据')
    console.log('💡 建议:')
    console.log('   1. 检查API配额是否充足')
    console.log('   2. 访问 https://outscraper.com/profile/ 查看账户状态')
    console.log('   3. 联系Outscraper客服')
    console.log('   4. 使用Puppeteer-Extra作为备选')
  }
}

runAllTests()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ 执行出错:', error)
    process.exit(1)
  })

