// 详细调试AI分析问题
require('dotenv').config() // ✅ 加载环境变量

const AnalysisService = require('./src/ai/AnalysisService')
const logger = require('./utils/logger')

// 验证API Key
console.log('🔑 环境变量检查:')
console.log(`   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '已配置 (' + process.env.GEMINI_API_KEY.substring(0, 10) + '...)' : '❌ 未配置'}`)
console.log(`   APIFY_API_TOKEN: ${process.env.APIFY_API_TOKEN ? '已配置' : '❌ 未配置'}`)
console.log('')

async function debugAIAnalysis() {
  console.log('🔍 开始调试AI分析...\n')
  
  // 模拟评论数据
  const mockReviews = [
    {
      rating: 5,
      title: "Great product!",
      content: "I love this projector. My son uses it every night. Perfect for his bedroom.",
      author: "John Smith",
      userName: "John Smith",
      body: "I love this projector. My son uses it every night. Perfect for his bedroom.",
      date: "2025-10-29T16:00:00.000Z",
      isVerified: true
    },
    {
      rating: 4,
      title: "Good but not perfect",
      content: "Works well for the price. Used it in the hospital and at home. Baby loves it.",
      author: "Sarah Johnson",
      userName: "Sarah Johnson",
      body: "Works well for the price. Used it in the hospital and at home. Baby loves it.",
      date: "2025-10-28T16:00:00.000Z",
      isVerified: true
    },
    {
      rating: 3,
      title: "Remote doesn't work",
      content: "The remote stopped working after one use. Disappointed.",
      author: "Mike Brown",
      userName: "Mike Brown",
      body: "The remote stopped working after one use. Disappointed.",
      date: "2025-10-27T16:00:00.000Z",
      isVerified: true
    }
  ]
  
  try {
    const analysisService = new AnalysisService()
    
    console.log('📊 测试数据: 3条评论')
    console.log('   - 5星: 1条')
    console.log('   - 4星: 1条')
    console.log('   - 3星: 1条\n')
    
    // 测试单个维度
    console.log('🧪 测试1: 消费者画像...')
    try {
      const PromptTemplates = require('./src/ai/PromptTemplates')
      const systemPrompt = PromptTemplates.getSystemPrompt()
      const result = await analysisService.analyzeConsumerProfile(mockReviews, systemPrompt)
      console.log('✅ 消费者画像成功')
      console.log('   返回数据:', JSON.stringify(result, null, 2).substring(0, 200) + '...')
    } catch (error) {
      console.error('❌ 消费者画像失败:', error.message)
      console.error('   详情:', error.stack)
    }
    
    console.log('\n🧪 测试2: 使用场景...')
    try {
      const PromptTemplates = require('./src/ai/PromptTemplates')
      const systemPrompt = PromptTemplates.getSystemPrompt()
      const result = await analysisService.analyzeUsageScenarios(mockReviews, systemPrompt)
      console.log('✅ 使用场景成功')
      console.log('   返回数据量:', Array.isArray(result) ? result.length + '条' : typeof result)
      if (Array.isArray(result) && result.length > 0) {
        console.log('   示例:', JSON.stringify(result[0], null, 2))
      }
    } catch (error) {
      console.error('❌ 使用场景失败:', error.message)
      console.error('   详情:', error.stack)
    }
    
    console.log('\n🧪 测试3: 产品优点...')
    try {
      const PromptTemplates = require('./src/ai/PromptTemplates')
      const systemPrompt = PromptTemplates.getSystemPrompt()
      const result = await analysisService.analyzeProductStrengths(mockReviews, systemPrompt)
      console.log('✅ 产品优点成功')
      console.log('   返回数据量:', Array.isArray(result) ? result.length + '条' : typeof result)
      if (Array.isArray(result) && result.length > 0) {
        console.log('   示例:', JSON.stringify(result[0], null, 2))
      }
    } catch (error) {
      console.error('❌ 产品优点失败:', error.message)
      console.error('   详情:', error.stack)
    }
    
    console.log('\n✅ 调试完成')
    
  } catch (error) {
    console.error('\n❌ 调试过程出错:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

debugAIAnalysis()

