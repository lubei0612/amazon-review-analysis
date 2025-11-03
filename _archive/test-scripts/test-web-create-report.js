// ========================================
// Web端创建报告功能测试
// ========================================

const axios = require('axios')

async function testWebCreateReport() {
  console.log('🧪 测试Web端创建报告功能\n')
  console.log('='.repeat(60))
  
  const testASIN = 'B08S7NJLMG'
  
  try {
    console.log(`\n📋 测试1: 创建分析任务`)
    console.log(`   ASIN: ${testASIN}`)
    console.log(`   来源: web-frontend\n`)
    
    // 1. 创建任务
    console.log('🚀 发送POST请求到 /api/tasks/create...')
    const createResponse = await axios.post('http://localhost:3001/api/tasks/create', {
      asin: testASIN,
      productUrl: `https://www.amazon.com/dp/${testASIN}`,
      reviewCount: 500,
      source: 'web-frontend',
      analysisOptions: {
        enableConsumerProfile: true,
        enableUsageScenarios: true,
        enableStarRating: true,
        enableProductExperience: true,
        enablePurchaseMotivation: true,
        enableUnmetNeeds: true
      }
    })
    
    console.log('✅ 任务创建响应:', JSON.stringify(createResponse.data, null, 2))
    
    if (!createResponse.data.success) {
      throw new Error('任务创建失败：' + createResponse.data.message)
    }
    
    const taskId = createResponse.data.data.taskId
    console.log(`\n✅ 任务创建成功！`)
    console.log(`   TaskId: ${taskId}`)
    console.log(`   Web页面URL: http://localhost:3002/report/${taskId}`)
    
    // 2. 轮询任务状态
    console.log(`\n📋 测试2: 轮询任务状态`)
    console.log('   模拟Web端轮询逻辑（每2秒检查一次）\n')
    
    let attempts = 0
    const maxAttempts = 60
    let completed = false
    
    while (attempts < maxAttempts && !completed) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      attempts++
      
      const statusResponse = await axios.get(`http://localhost:3001/api/tasks/${taskId}/status`)
      const statusData = statusResponse.data.data
      
      console.log(`   [${attempts}] 状态: ${statusData.status}, 进度: ${statusData.progress || 0}%`)
      
      if (statusData.status === 'completed') {
        completed = true
        console.log('\n✅ 任务完成！')
        console.log(`   评论数: ${statusData.result?.reviewCount || 0}`)
        console.log(`   分析模块数: ${statusData.result?.meta?.totalModules || 0}`)
        
        // 显示分析结果摘要
        if (statusData.result?.analysis) {
          console.log('\n📊 分析结果摘要:')
          const analysis = statusData.result.analysis
          
          if (analysis.consumerProfile) {
            console.log(`   ✓ 消费者画像: ${analysis.consumerProfile.demographics?.length || 0}个维度`)
          }
          if (analysis.usageScenarios) {
            console.log(`   ✓ 使用场景: ${analysis.usageScenarios.length || 0}个场景`)
          }
          if (analysis.productExperience) {
            const exp = analysis.productExperience
            console.log(`   ✓ 产品体验: ${exp.strengths?.length || 0}个优点, ${exp.weaknesses?.length || 0}个缺点`)
          }
          if (analysis.purchaseMotivation) {
            console.log(`   ✓ 购买动机: ${analysis.purchaseMotivation.length || 0}个动机`)
          }
          if (analysis.unmetNeeds) {
            console.log(`   ✓ 未满足需求: ${analysis.unmetNeeds.length || 0}个需求`)
          }
        }
        
      } else if (statusData.status === 'failed') {
        throw new Error('任务失败：' + statusData.error)
      }
    }
    
    if (!completed) {
      throw new Error('任务超时（超过2分钟）')
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('🎉 测试完成！')
    console.log('\n✅ Web端创建报告功能正常工作！')
    console.log(`\n💡 现在可以访问: http://localhost:3002/report/${taskId}`)
    console.log('   应该看到完整的分析报告')
    
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 提示: 后端服务未启动，请先运行 npm start')
    }
    
    process.exit(1)
  }
}

// 运行测试
console.log('📍 提示: 请确保后端服务已启动 (npm start)')
console.log('📍 提示: Web前端服务需要启动 (cd web && npm run dev)\n')

setTimeout(() => {
  testWebCreateReport()
    .then(() => {
      console.log('\n✅ 所有测试通过')
      process.exit(0)
    })
    .catch(error => {
      console.error('\n❌ 测试出错:', error)
      process.exit(1)
    })
}, 1000)

