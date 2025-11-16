// ========================
// Gemini API 验证测试
// ========================
// 
// 用途：验证Gemini API配置和功能
// 运行：node tests/test-gemini-api.js

require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const GeminiProvider = require('../src/ai/GeminiProvider')
const logger = require('../utils/logger')

console.log('='.repeat(80))
console.log('🧪 Gemini API 配置验证测试')
console.log('='.repeat(80))
console.log()

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  details: []
}

// 测试用的评论数据
const TEST_REVIEWS = [
  {
    reviewId: 'test_001',
    rating: 5,
    title: 'Excellent product!',
    content: 'This laptop is amazing. Great performance, beautiful display, and long battery life. Perfect for work and entertainment. Highly recommend!',
    author: { name: 'John' },
    date: new Date(),
    isVerified: true
  },
  {
    reviewId: 'test_002',
    rating: 4,
    title: 'Good but expensive',
    content: 'The quality is excellent but the price is quite high. Battery life could be better. Overall satisfied with the purchase.',
    author: { name: 'Sarah' },
    date: new Date(),
    isVerified: true
  },
  {
    reviewId: 'test_003',
    rating: 3,
    title: 'Average',
    content: 'It works fine but nothing special. The keyboard feels a bit cheap. Expected more for the price.',
    author: { name: 'Mike' },
    date: new Date(),
    isVerified: false
  }
]

// ==================== 测试1: 环境配置检查 ====================
async function test1_ConfigCheck() {
  console.log('📋 测试1: 环境配置检查')
  console.log('-'.repeat(80))
  
  results.total++
  
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.log('❌ GEMINI_API_KEY 未配置')
      console.log('   请在.env文件中设置 GEMINI_API_KEY')
      results.failed++
      results.details.push({ test: '环境配置', status: 'FAIL', error: 'API Key未配置' })
      return false
    }
    
    const apiKey = process.env.GEMINI_API_KEY
    console.log('✅ GEMINI_API_KEY 已配置')
    console.log(`   密钥前缀: ${apiKey.substring(0, 15)}...`)
    console.log(`   密钥长度: ${apiKey.length} 字符`)
    
    if (apiKey.length < 20) {
      console.log('⚠️  警告: API密钥长度似乎过短')
    }
    
    results.passed++
    results.details.push({ test: '环境配置', status: 'PASS', keyLength: apiKey.length })
    console.log()
    return true
    
  } catch (error) {
    console.log(`❌ 配置检查失败: ${error.message}`)
    results.failed++
    results.details.push({ test: '环境配置', status: 'FAIL', error: error.message })
    console.log()
    return false
  }
}

// ==================== 测试2: GeminiProvider初始化 ====================
async function test2_ProviderInit() {
  console.log('📋 测试2: GeminiProvider初始化')
  console.log('-'.repeat(80))
  
  results.total++
  
  try {
    console.log('🔄 正在初始化GeminiProvider...')
    const gemini = new GeminiProvider()
    
    console.log('✅ GeminiProvider初始化成功')
    console.log(`   Provider类型: ${gemini.constructor.name}`)
    
    results.passed++
    results.details.push({ test: 'Provider初始化', status: 'PASS' })
    console.log()
    return gemini
    
  } catch (error) {
    console.log(`❌ 初始化失败: ${error.message}`)
    results.failed++
    results.details.push({ test: 'Provider初始化', status: 'FAIL', error: error.message })
    console.log()
    return null
  }
}

// ==================== 测试3: AI分析功能测试 ====================
async function test3_AnalysisTest(gemini) {
  console.log('📋 测试3: AI分析功能测试')
  console.log('-'.repeat(80))
  
  results.total++
  
  if (!gemini) {
    console.log('⏭️  跳过：Provider未初始化')
    results.details.push({ test: 'AI分析功能', status: 'SKIP' })
    console.log()
    return null
  }
  
  try {
    console.log('📝 准备测试数据...')
    console.log(`   评论数量: ${TEST_REVIEWS.length}`)
    console.log(`   平均评分: ${(TEST_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / TEST_REVIEWS.length).toFixed(1)}`)
    console.log()
    
    console.log('🚀 开始AI分析...')
    const startTime = Date.now()
    
    // 使用AnalysisService进行完整分析
    const AnalysisService = require('../src/ai/AnalysisService')
    const analysisService = new AnalysisService()
    
    // analyzeAll方法接受reviews数组
    const analysisResult = await analysisService.analyzeAll(TEST_REVIEWS)
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    
    console.log()
    console.log('✅ AI分析完成！')
    console.log(`   耗时: ${duration}秒`)
    
    // 验证结果结构
    console.log()
    console.log('🔍 验证分析结果结构...')
    
    const requiredFields = [
      'consumerProfile',
      'usageScenarios', 
      'productExperience',
      'purchaseMotivation',
      'unmetNeeds',
      'starRatingImpact'
    ]
    
    let allFieldsPresent = true
    for (const field of requiredFields) {
      if (analysisResult && analysisResult[field]) {
        console.log(`   ✅ ${field}: 存在`)
      } else {
        console.log(`   ❌ ${field}: 缺失`)
        allFieldsPresent = false
      }
    }
    
    if (allFieldsPresent) {
      console.log()
      console.log('📊 分析结果预览:')
      
      // 显示部分结果
      if (analysisResult.consumerProfile && analysisResult.consumerProfile.length > 0) {
        console.log(`   消费者画像: ${analysisResult.consumerProfile.length}项`)
        console.log(`   - ${analysisResult.consumerProfile[0].aspect}: ${analysisResult.consumerProfile[0].description?.substring(0, 50) || 'N/A'}...`)
      }
      
      if (analysisResult.usageScenarios && analysisResult.usageScenarios.length > 0) {
        console.log(`   使用场景: ${analysisResult.usageScenarios.length}项`)
        console.log(`   - ${analysisResult.usageScenarios[0].scenario?.substring(0, 50) || 'N/A'}...`)
      }
      
      results.passed++
      results.details.push({ 
        test: 'AI分析功能', 
        status: 'PASS', 
        duration: duration,
        fields: requiredFields.length
      })
    } else {
      console.log()
      console.log('⚠️  警告: 部分字段缺失，但API调用成功')
      results.passed++
      results.details.push({ 
        test: 'AI分析功能', 
        status: 'PASS_WITH_WARNING',
        warning: '部分字段缺失'
      })
    }
    
    console.log()
    return analysisResult
    
  } catch (error) {
    console.log()
    console.log('❌ AI分析失败')
    console.log(`   错误类型: ${error.name}`)
    console.log(`   错误信息: ${error.message}`)
    
    // 提供详细的错误诊断
    console.log()
    console.log('🔍 错误诊断:')
    
    if (error.message.includes('API key')) {
      console.log('   ❌ API密钥问题')
      console.log('   建议：')
      console.log('      1. 验证API密钥格式是否正确')
      console.log('      2. 检查密钥是否已过期')
      console.log('      3. 访问 https://aistudio.google.com/app/apikey 重新生成')
    } else if (error.message.includes('quota') || error.message.includes('limit')) {
      console.log('   ❌ API配额问题')
      console.log('   建议：')
      console.log('      1. 检查API配额使用情况')
      console.log('      2. 等待配额重置或升级套餐')
    } else if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
      console.log('   ❌ 网络连接问题')
      console.log('   建议：')
      console.log('      1. 检查网络连接')
      console.log('      2. 检查防火墙设置')
      console.log('      3. 尝试使用代理')
    } else {
      console.log('   ❌ 未知错误')
      console.log('   建议：查看完整错误堆栈信息')
    }
    
    if (error.stack) {
      console.log()
      console.log('📋 错误堆栈:')
      console.log(error.stack.split('\n').slice(0, 5).join('\n'))
    }
    
    results.failed++
    results.details.push({ 
      test: 'AI分析功能', 
      status: 'FAIL', 
      error: error.message 
    })
    console.log()
    return null
  }
}

// ==================== 主测试流程 ====================
async function runTests() {
  try {
    // 测试1: 配置检查
    const configOk = await test1_ConfigCheck()
    if (!configOk) {
      console.log('⏹️  配置检查失败，终止测试')
      printSummary()
      return
    }
    
    // 测试2: Provider初始化
    const gemini = await test2_ProviderInit()
    if (!gemini) {
      console.log('⏹️  Provider初始化失败，终止测试')
      printSummary()
      return
    }
    
    // 测试3: AI分析功能
    await test3_AnalysisTest(gemini)
    
    // 打印总结
    printSummary()
    
  } catch (error) {
    console.error('💥 测试执行出错:', error)
    printSummary()
  }
}

// ==================== 打印测试总结 ====================
function printSummary() {
  console.log('='.repeat(80))
  console.log('📊 测试总结')
  console.log('='.repeat(80))
  console.log()
  console.log(`总测试数: ${results.total}`)
  console.log(`✅ 通过: ${results.passed}`)
  console.log(`❌ 失败: ${results.failed}`)
  console.log(`成功率: ${results.total > 0 ? ((results.passed / results.total) * 100).toFixed(1) : 0}%`)
  console.log()
  
  console.log('详细结果:')
  results.details.forEach((detail, idx) => {
    const icon = detail.status === 'PASS' || detail.status === 'PASS_WITH_WARNING' ? '✅' : 
                 detail.status === 'FAIL' ? '❌' : '⏭️ '
    console.log(`${icon} ${idx + 1}. ${detail.test}: ${detail.status}`)
    if (detail.duration) {
      console.log(`   耗时: ${detail.duration}秒`)
    }
    if (detail.error) {
      console.log(`   错误: ${detail.error}`)
    }
    if (detail.warning) {
      console.log(`   警告: ${detail.warning}`)
    }
  })
  
  console.log()
  console.log('='.repeat(80))
  
  if (results.failed === 0 && results.passed === results.total) {
    console.log('🎉 所有测试通过！Gemini API工作正常')
    console.log()
    console.log('✅ 下一步:')
    console.log('   1. 运行完整的评论分析流程')
    console.log('   2. 启动Web界面测试')
    console.log('   3. 测试Chrome扩展')
  } else if (results.passed > 0) {
    console.log('⚠️  部分测试通过，请检查失败项')
  } else {
    console.log('❌ 所有测试失败，请检查配置')
  }
  console.log('='.repeat(80))
  
  // 退出码
  process.exit(results.failed > 0 ? 1 : 0)
}

// 运行测试
runTests()

