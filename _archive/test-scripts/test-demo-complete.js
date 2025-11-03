// ================================
// 完整 Demo 测试脚本
// ================================

require('dotenv').config()
const axios = require('axios')

const ASIN = 'B0C4G36RNS'
const BASE_URL = 'http://localhost:3001'

async function testCompleteDemo() {
  console.log('========================================')
  console.log('🎬 完整 Demo 测试')
  console.log('========================================\n')

  try {
    // 1. 测试服务器健康
    console.log('1️⃣ 测试服务器健康...')
    const healthResp = await axios.get(`${BASE_URL}/api/health`)
    console.log('✅ 服务器运行正常:', healthResp.data.message)
    console.log()

    // 2. 创建分析任务
    console.log('2️⃣ 创建分析任务...')
    console.log(`   ASIN: ${ASIN}`)
    const createResp = await axios.post(`${BASE_URL}/api/tasks/create`, {
      asin: ASIN,
      reviewCount: 13  // 使用 13 条评论进行 Demo
    })
    const taskId = createResp.data.taskId
    console.log(`✅ 任务已创建: ${taskId}`)
    console.log()

    // 3. 轮询任务状态
    console.log('3️⃣ 等待任务完成...')
    let attempts = 0
    const maxAttempts = 120  // 最多等待 10 分钟

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000))  // 每 5 秒检查一次
      
      const statusResp = await axios.get(`${BASE_URL}/api/tasks/${taskId}/status`)
      const { status, progress } = statusResp.data

      console.log(`   [${attempts + 1}/${maxAttempts}] 状态: ${status} | 进度: ${progress}%`)

      if (status === 'completed') {
        console.log('✅ 任务完成！')
        console.log()
        
        // 4. 获取结果
        console.log('4️⃣ 获取分析结果...')
        const resultResp = await axios.get(`${BASE_URL}/api/tasks/${taskId}/result`)
        const { reviews, analysis } = resultResp.data

        console.log(`\n📊 Demo 数据概览:`)
        console.log(`   - 评论数量: ${reviews.length} 条`)
        console.log(`   - 平均评分: ${(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}`)
        console.log(`   - AI 分析维度: ${Object.keys(analysis).length} 个`)
        console.log()

        console.log('📋 AI 分析结果预览:')
        if (analysis.consumerProfile) {
          console.log('   ✓ 消费者画像')
        }
        if (analysis.usageScenarios) {
          console.log('   ✓ 使用场景')
        }
        if (analysis.starRatingImpact) {
          console.log('   ✓ 星级影响度')
        }
        if (analysis.productExperience) {
          console.log('   ✓ 产品体验（优缺点）')
        }
        if (analysis.purchaseMotivation) {
          console.log('   ✓ 购买动机')
        }
        if (analysis.unmetNeeds) {
          console.log('   ✓ 未被满足的需求')
        }
        console.log()

        console.log('========================================')
        console.log('✅ Demo 测试完成！')
        console.log('========================================')
        console.log('\n💡 下一步:')
        console.log('   1. 在浏览器中打开: http://localhost:3001')
        console.log('   2. 或打开 demo/amazon-review-analysis-demo.html')
        console.log('   3. 输入 ASIN: B0C4G36RNS 查看完整报告')
        console.log()
        
        break
      }

      if (status === 'failed') {
        console.error('❌ 任务失败:', statusResp.data.error)
        break
      }

      attempts++
    }

    if (attempts >= maxAttempts) {
      console.error('❌ 任务超时')
    }

  } catch (error) {
    console.error('\n❌ 测试失败:', error.message)
    if (error.response) {
      console.error('   状态码:', error.response.status)
      console.error('   错误详情:', error.response.data)
    }
  }
}

testCompleteDemo()



