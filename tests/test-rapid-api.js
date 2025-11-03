// ========================
// RapidAPI 修复验证测试
// ========================
// 
// 用途：验证RapidAPI是否已经修复并可以正常工作
// 运行：node test-rapid-api.js

require('dotenv').config()
const RapidAPICrawler = require('./src/crawler/RapidAPICrawler')
const logger = require('./utils/logger')

// 测试用的ASIN（热门产品）
const TEST_CASES = [
  {
    asin: 'B0BSHF7WHW', // Apple AirPods Pro (第2代) - 通常有大量评论
    description: 'Apple AirPods Pro (第2代)',
    maxReviews: 20
  },
  {
    asin: 'B08N5WRWNW', // Apple AirTag - 另一个热门产品
    description: 'Apple AirTag',
    maxReviews: 20
  }
]

async function testRapidAPI() {
  console.log('='.repeat(60))
  console.log('🧪 RapidAPI 修复验证测试')
  console.log('='.repeat(60))
  console.log()
  
  // 1. 检查环境变量
  console.log('📋 步骤1: 检查配置')
  console.log('-'.repeat(60))
  
  if (!process.env.RAPIDAPI_KEY) {
    console.error('❌ 错误: RAPIDAPI_KEY 未配置')
    console.log('   请在 .env 文件中设置: RAPIDAPI_KEY=your_key_here')
    process.exit(1)
  }
  
  console.log('✅ RAPIDAPI_KEY: ', process.env.RAPIDAPI_KEY.substring(0, 10) + '...')
  console.log('✅ RAPIDAPI_HOST:', process.env.RAPIDAPI_HOST || 'real-time-amazon-data.p.rapidapi.com')
  console.log()
  
  // 2. 初始化爬虫
  console.log('📋 步骤2: 初始化RapidAPI爬虫')
  console.log('-'.repeat(60))
  
  const crawler = new RapidAPICrawler()
  
  if (!crawler.isAvailable()) {
    console.error('❌ RapidAPI爬虫初始化失败')
    process.exit(1)
  }
  
  console.log('✅ RapidAPI爬虫初始化成功')
  console.log(`   默认站点: ${crawler.currentDomain}`)
  console.log(`   可用站点: ${crawler.availableDomains.join(', ')}`)
  console.log()
  
  // 3. 运行测试用例
  const results = {
    total: TEST_CASES.length,
    passed: 0,
    failed: 0,
    details: []
  }
  
  for (let i = 0; i < TEST_CASES.length; i++) {
    const testCase = TEST_CASES[i]
    
    console.log(`📋 步骤${3 + i}: 测试用例 #${i + 1}`)
    console.log('-'.repeat(60))
    console.log(`   产品: ${testCase.description}`)
    console.log(`   ASIN: ${testCase.asin}`)
    console.log(`   目标评论数: ${testCase.maxReviews}`)
    console.log()
    
    try {
      const startTime = Date.now()
      
      // 进度回调
      const progressCallback = (data) => {
        console.log(`   📊 进度: ${data.progress}% (${data.current}/${data.total}) - ${data.message}`)
      }
      
      // 执行爬取
      console.log('   🚀 开始爬取...')
      const reviews = await crawler.getReviews(
        testCase.asin,
        testCase.maxReviews,
        progressCallback
      )
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(2)
      
      // 验证结果
      if (reviews && reviews.length > 0) {
        console.log()
        console.log(`   ✅ 测试通过！`)
        console.log(`   📊 获取评论数: ${reviews.length}`)
        console.log(`   ⏱️  耗时: ${duration}秒`)
        console.log()
        
        // 显示样例评论
        console.log('   📝 样例评论 (前2条):')
        reviews.slice(0, 2).forEach((review, idx) => {
          console.log(`   ---`)
          console.log(`   #${idx + 1}:`)
          console.log(`     评分: ${review.rating} 星`)
          console.log(`     标题: ${review.title}`)
          console.log(`     内容: ${(review.content || '').substring(0, 80)}...`)
          console.log(`     作者: ${review.author?.name || 'Anonymous'}`)
          console.log(`     日期: ${review.date}`)
          console.log(`     认证购买: ${review.isVerified ? '是' : '否'}`)
        })
        
        results.passed++
        results.details.push({
          testCase: testCase.description,
          status: 'PASS',
          count: reviews.length,
          duration: duration
        })
        
      } else {
        console.log(`   ❌ 测试失败：返回0条评论`)
        console.log(`   ⏱️  耗时: ${duration}秒`)
        
        results.failed++
        results.details.push({
          testCase: testCase.description,
          status: 'FAIL',
          error: '返回0条评论',
          duration: duration
        })
      }
      
    } catch (error) {
      console.log()
      console.log(`   ❌ 测试失败`)
      console.log(`   错误: ${error.message}`)
      
      if (error.response) {
        console.log(`   HTTP状态: ${error.response.status}`)
        console.log(`   响应数据:`, JSON.stringify(error.response.data).substring(0, 200))
      }
      
      results.failed++
      results.details.push({
        testCase: testCase.description,
        status: 'FAIL',
        error: error.message
      })
    }
    
    console.log()
    
    // 避免API速率限制
    if (i < TEST_CASES.length - 1) {
      console.log('   ⏳ 等待2秒后继续下一个测试...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log()
    }
  }
  
  // 4. 测试总结
  console.log('='.repeat(60))
  console.log('📊 测试总结')
  console.log('='.repeat(60))
  console.log()
  console.log(`总测试数: ${results.total}`)
  console.log(`✅ 通过: ${results.passed}`)
  console.log(`❌ 失败: ${results.failed}`)
  console.log(`成功率: ${((results.passed / results.total) * 100).toFixed(1)}%`)
  console.log()
  
  console.log('详细结果:')
  results.details.forEach((detail, idx) => {
    const status = detail.status === 'PASS' ? '✅' : '❌'
    console.log(`${status} 测试 #${idx + 1}: ${detail.testCase}`)
    if (detail.status === 'PASS') {
      console.log(`   获取: ${detail.count} 条评论，耗时: ${detail.duration}秒`)
    } else {
      console.log(`   错误: ${detail.error}`)
    }
  })
  
  console.log()
  console.log('='.repeat(60))
  
  if (results.passed === results.total) {
    console.log('🎉 所有测试通过！RapidAPI工作正常')
    console.log('='.repeat(60))
    return true
  } else {
    console.log('⚠️  部分测试失败，请检查以下内容：')
    console.log('   1. RAPIDAPI_KEY 是否正确')
    console.log('   2. RapidAPI订阅是否有效')
    console.log('   3. API配额是否用完')
    console.log('   4. 测试的ASIN是否在所选站点(CA)有评论')
    console.log('='.repeat(60))
    return false
  }
}

// 运行测试
testRapidAPI()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 测试脚本执行失败:', error)
    process.exit(1)
  })


