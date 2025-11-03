// ========================
// RapidAPI 独立测试脚本
// ========================
// 
// 用途：仅测试RapidAPI爬虫，不使用其他爬虫
// 运行：node test-rapid-api-only.js

require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const RapidAPICrawler = require('../src/crawler/RapidAPICrawler')
const logger = require('../utils/logger')

// 测试用的ASIN（热门产品）
const TEST_CASES = [
  {
    asin: 'B0BSHF7WHW', // Apple AirPods Pro (第2代)
    description: 'Apple AirPods Pro (第2代)',
    maxReviews: 20
  },
  {
    asin: 'B08N5WRWNW', // Apple AirTag
    description: 'Apple AirTag',
    maxReviews: 20
  }
]

async function testRapidAPIOnly() {
  console.log('='.repeat(80))
  console.log('🧪 RapidAPI 独立测试（仅测试RapidAPI爬虫）')
  console.log('='.repeat(80))
  console.log()
  
  // =====================================
  // 步骤1: 检查环境变量配置
  // =====================================
  console.log('📋 步骤1: 检查配置')
  console.log('-'.repeat(80))
  
  if (!process.env.RAPIDAPI_KEY) {
    console.error('❌ 错误: RAPIDAPI_KEY 未配置')
    console.log()
    console.log('📝 请按以下步骤配置：')
    console.log('   1. 复制环境变量模板：copy env.example .env')
    console.log('   2. 编辑 .env 文件')
    console.log('   3. 设置 RAPIDAPI_KEY=9ab6674e42msha179d337fbe2863p19ddd0jsn69cc9a221da8')
    console.log('   4. 设置 RAPIDAPI_HOST=real-time-amazon-data.p.rapidapi.com')
    console.log()
    process.exit(1)
  }
  
  console.log('✅ RAPIDAPI_KEY:', process.env.RAPIDAPI_KEY.substring(0, 20) + '...')
  console.log('✅ RAPIDAPI_HOST:', process.env.RAPIDAPI_HOST || 'real-time-amazon-data.p.rapidapi.com')
  console.log()
  
  // =====================================
  // 步骤2: 初始化RapidAPI爬虫
  // =====================================
  console.log('📋 步骤2: 初始化RapidAPI爬虫')
  console.log('-'.repeat(80))
  
  const crawler = new RapidAPICrawler()
  
  if (!crawler.isAvailable()) {
    console.error('❌ RapidAPI爬虫初始化失败')
    console.log('   请检查环境变量配置是否正确')
    process.exit(1)
  }
  
  console.log('✅ RapidAPI爬虫初始化成功')
  console.log(`   默认站点: ${crawler.currentDomain}`)
  console.log(`   可用站点: ${crawler.availableDomains.join(', ')}`)
  console.log()
  
  // =====================================
  // 步骤3: 测试API连接
  // =====================================
  console.log('📋 步骤3: 测试API连接')
  console.log('-'.repeat(80))
  
  try {
    console.log('🔌 正在测试RapidAPI连接...')
    const testResponse = await crawler.fetchReviewsPage('B0BSHF7WHW', 1)
    
    console.log('✅ API连接成功！')
    console.log('📊 响应结构:', Object.keys(testResponse || {}).join(', '))
    
    if (testResponse && testResponse.data) {
      console.log('✅ 响应包含data字段')
      
      if (Array.isArray(testResponse.data)) {
        console.log(`   data类型: Array (长度: ${testResponse.data.length})`)
      } else if (testResponse.data.reviews) {
        console.log(`   data类型: Object with reviews (${testResponse.data.reviews.length}条评论)`)
      } else {
        console.log('   data类型: Object (keys:', Object.keys(testResponse.data).join(', ') + ')')
      }
    } else {
      console.log('⚠️  响应格式异常，请查看完整响应：')
      console.log(JSON.stringify(testResponse, null, 2).substring(0, 500))
    }
    console.log()
    
  } catch (error) {
    console.error('❌ API连接测试失败')
    console.error('   错误信息:', error.message)
    
    if (error.response) {
      console.error('   HTTP状态:', error.response.status)
      console.error('   响应数据:', JSON.stringify(error.response.data).substring(0, 300))
    }
    
    console.log()
    console.log('💡 可能的原因：')
    console.log('   1. API密钥错误或已过期')
    console.log('   2. 未订阅"Product Reviews"端点（注意不是Product Details）')
    console.log('   3. API配额已用完')
    console.log('   4. 网络连接问题')
    console.log()
    console.log('🔍 请前往 RapidAPI 控制台检查：')
    console.log('   https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-amazon-data')
    console.log()
    process.exit(1)
  }
  
  // =====================================
  // 步骤4: 运行完整测试用例
  // =====================================
  const results = {
    total: TEST_CASES.length,
    passed: 0,
    failed: 0,
    details: []
  }
  
  for (let i = 0; i < TEST_CASES.length; i++) {
    const testCase = TEST_CASES[i]
    
    console.log(`📋 步骤${4 + i}: 测试用例 #${i + 1}`)
    console.log('-'.repeat(80))
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
        console.log(`   ⚡ 速度: ${(reviews.length / duration).toFixed(1)} 条/秒`)
        console.log()
        
        // 显示样例评论
        console.log('   📝 样例评论 (前2条):')
        reviews.slice(0, 2).forEach((review, idx) => {
          console.log(`   ${'-'.repeat(40)}`)
          console.log(`   #${idx + 1}:`)
          console.log(`     评分: ${review.rating} 星`)
          console.log(`     标题: ${review.title || '(无标题)'}`)
          console.log(`     内容: ${(review.content || '').substring(0, 80)}...`)
          console.log(`     作者: ${review.author?.name || 'Anonymous'}`)
          console.log(`     日期: ${new Date(review.date).toLocaleDateString('zh-CN')}`)
          console.log(`     认证购买: ${review.isVerified ? '是' : '否'}`)
        })
        console.log(`   ${'-'.repeat(40)}`)
        
        // 数据质量检查
        console.log()
        console.log('   🔍 数据质量检查:')
        const withContent = reviews.filter(r => r.content && r.content.length > 0).length
        const withTitle = reviews.filter(r => r.title && r.title.length > 0).length
        const withValidRating = reviews.filter(r => r.rating >= 1 && r.rating <= 5).length
        
        console.log(`     有内容: ${withContent}/${reviews.length} (${(withContent/reviews.length*100).toFixed(1)}%)`)
        console.log(`     有标题: ${withTitle}/${reviews.length} (${(withTitle/reviews.length*100).toFixed(1)}%)`)
        console.log(`     有效评分: ${withValidRating}/${reviews.length} (${(withValidRating/reviews.length*100).toFixed(1)}%)`)
        
        results.passed++
        results.details.push({
          testCase: testCase.description,
          status: 'PASS',
          count: reviews.length,
          duration: duration,
          qualityScore: (withValidRating / reviews.length * 100).toFixed(1)
        })
        
      } else {
        console.log(`   ❌ 测试失败：返回0条评论`)
        console.log(`   ⏱️  耗时: ${duration}秒`)
        console.log()
        console.log('   💡 可能的原因：')
        console.log('      - 该ASIN在CA站点无评论（尝试换其他ASIN）')
        console.log('      - API配额用完')
        console.log('      - 响应格式与预期不符')
        
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
  
  // =====================================
  // 测试总结
  // =====================================
  console.log('='.repeat(80))
  console.log('📊 测试总结')
  console.log('='.repeat(80))
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
      console.log(`   获取: ${detail.count} 条评论，耗时: ${detail.duration}秒，质量分: ${detail.qualityScore}%`)
    } else {
      console.log(`   错误: ${detail.error}`)
      if (detail.duration) {
        console.log(`   耗时: ${detail.duration}秒`)
      }
    }
  })
  
  console.log()
  console.log('='.repeat(80))
  
  if (results.passed === results.total) {
    console.log('🎉 所有测试通过！RapidAPI工作正常')
    console.log()
    console.log('✅ 下一步建议：')
    console.log('   1. 集成到完整系统：npm start')
    console.log('   2. 测试完整流程（爬取 + AI分析）')
    console.log('   3. 如需启用其他爬虫，在.env中配置相应的API密钥')
    console.log('='.repeat(80))
    return true
  } else if (results.passed > 0) {
    console.log('⚠️  部分测试通过，RapidAPI基本可用但可能存在问题')
    console.log()
    console.log('💡 建议：')
    console.log('   1. 检查失败的测试用例，可能是ASIN在CA站点无评论')
    console.log('   2. 尝试更换其他ASIN测试')
    console.log('   3. 查看RapidAPI控制台的配额使用情况')
    console.log('='.repeat(80))
    return false
  } else {
    console.log('❌ 所有测试失败，请检查配置')
    console.log()
    console.log('🔍 排查步骤：')
    console.log('   1. 验证RAPIDAPI_KEY是否正确')
    console.log('   2. 确认已订阅"Product Reviews"端点（不是Product Details）')
    console.log('   3. 检查API配额是否用完')
    console.log('   4. 查看上方的详细错误信息')
    console.log()
    console.log('📞 如需帮助，请访问：')
    console.log('   https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-amazon-data')
    console.log('='.repeat(80))
    return false
  }
}

// 运行测试
testRapidAPIOnly()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 测试脚本执行失败:', error)
    console.error(error.stack)
    process.exit(1)
  })

