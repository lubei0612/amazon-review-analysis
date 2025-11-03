// ========================
// 端到端测试 - 完整流程
// 测试: 创建任务 -> 爬取评论 -> AI分析 -> 返回结果
// ========================

require('dotenv').config()
const axios = require('axios')

const API_BASE = 'http://localhost:3001/api'

async function testEndToEnd() {
  console.log('🧪 端到端测试\n')
  console.log('='.repeat(60))
  
  // 测试产品（Outscraper能成功的）
  const asin = 'B0BSHF7WHW'  // Echo Dot 5th Gen
  const productUrl = `https://www.amazon.com/dp/${asin}`
  
  console.log(`📋 测试产品:`)
  console.log(`   ASIN: ${asin}`)
  console.log(`   产品: Echo Dot (5th Gen)`)
  console.log(`   URL: ${productUrl}\n`)
  
  try {
    // Step 1: 创建任务
    console.log('🔄 Step 1/4: 创建分析任务...')
    const createResponse = await axios.post(`${API_BASE}/tasks/create`, {
      asin: asin,
      productUrl: productUrl,
      reviewCount: 500,
      source: 'test',
      analysisOptions: {
        enableConsumerProfile: true,
        enableUsageScenarios: true,
        enableStarRating: true,
        enableProductExperience: true,
        enablePurchaseMotivation: true,
        enableUnmetNeeds: true
      }
    })
    
    const taskId = createResponse.data.data.taskId  // ✅ 修复：data.data.taskId
    console.log(`✅ 任务已创建: ${taskId}\n`)
    
    // Step 2: 轮询任务状态
    console.log('🔄 Step 2/4: 等待任务完成...')
    let status = 'pending'
    let attempts = 0
    const maxAttempts = 120  // 最多等待4分钟
    
    while (status === 'pending' || status === 'processing' || status === 'scraping' || status === 'analyzing') {
      attempts++
      
      if (attempts > maxAttempts) {
        throw new Error('任务超时（4分钟）')
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000))  // 每2秒检查一次
      
      const statusResponse = await axios.get(`${API_BASE}/tasks/${taskId}/status`)
      const taskData = statusResponse.data.data  // ✅ 修复：data.data
      
      status = taskData.status
      
      if (attempts % 5 === 0) {  // 每10秒打印一次
        console.log(`   [${attempts * 2}s] 状态: ${status} | 进度: ${taskData.progress || 0}%`)
      }
      
      // 如果完成或失败，退出循环
      if (status === 'completed' || status === 'failed') {
        break
      }
    }
    
    console.log(`\n✅ 任务完成！状态: ${status}\n`)
    
    // Step 3: 获取结果
    if (status === 'completed') {
      console.log('🔄 Step 3/4: 获取分析结果...')
      
      const resultResponse = await axios.get(`${API_BASE}/tasks/${taskId}/status`)
      const result = resultResponse.data.data  // ✅ 修复：data.data
      
      console.log(`✅ 结果已获取\n`)
      
      // Step 4: 验证结果
      console.log('🔄 Step 4/4: 验证结果...\n')
      console.log('='.repeat(60))
      
      // 评论数量
      const reviewCount = result.result?.reviewCount || 0
      console.log(`📊 评论数量: ${reviewCount}`)
      
      // AI分析模块
      const analysisResult = result.result?.analysisResult || {}
      const modules = [
        { key: 'consumerProfile', name: '消费者画像' },
        { key: 'usageScenarios', name: '使用场景' },
        { key: 'starRating', name: '星级影响度' },
        { key: 'productExperience', name: '产品体验' },
        { key: 'purchaseMotivation', name: '购买动机' },
        { key: 'unmetNeeds', name: '未被满足的需求' }
      ]
      
      console.log(`\n📈 AI分析模块:`)
      
      let allSuccess = true
      
      modules.forEach(module => {
        const moduleData = analysisResult[module.key]
        if (!moduleData) {
          console.log(`   ❌ ${module.name}: 缺失`)
          allSuccess = false
        } else {
          const dataCount = Array.isArray(moduleData) ? 
            moduleData.length : 
            (moduleData.positive?.length || 0) + (moduleData.negative?.length || 0)
          
          console.log(`   ✅ ${module.name}: ${dataCount} 条数据`)
          
          // 显示前3条
          if (module.key === 'consumerProfile' && moduleData.length > 0) {
            console.log(`      示例: ${moduleData[0].dimension} - ${moduleData[0].desc}`)
          } else if (module.key === 'productExperience') {
            if (moduleData.positive && moduleData.positive.length > 0) {
              console.log(`      正向示例: ${moduleData.positive[0].aspect}`)
            }
          } else if (Array.isArray(moduleData) && moduleData.length > 0) {
            console.log(`      示例: ${moduleData[0].type || moduleData[0].name || moduleData[0].need}`)
          }
        }
      })
      
      console.log('\n' + '='.repeat(60))
      
      if (allSuccess && reviewCount > 0) {
        console.log('\n🎉 端到端测试成功！')
        console.log(`   ✅ 爬取评论: ${reviewCount}条`)
        console.log(`   ✅ AI分析: 6个模块全部完成`)
        console.log(`   ✅ 数据格式: 正确`)
      } else {
        console.log('\n⚠️ 测试部分成功，但有以下问题:')
        if (reviewCount === 0) console.log('   - 评论数量为0')
        if (!allSuccess) console.log('   - 部分AI模块缺失数据')
      }
      
    } else if (status === 'failed') {
      console.log('❌ 任务失败')
      
      const statusResponse = await axios.get(`${API_BASE}/tasks/${taskId}/status`)
      console.log(`   错误信息: ${statusResponse.data.data.error || '未知错误'}`)
    }
    
  } catch (error) {
    console.log('\n❌ 测试失败:', error.message)
    if (error.response) {
      console.log('   API响应:', error.response.data)
    }
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('测试完成\n')
}

// 运行测试
testEndToEnd()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ 出错:', error)
    process.exit(1)
  })

