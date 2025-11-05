// 测试新的Gemini API Key和完整分析流程
// Node 24+ 已内置 fetch
require('dotenv').config() // ✅ 加载环境变量

async function testFullAnalysis() {
  console.log('🚀 开始测试完整分析流程...\n');
  
  try {
    // 1. 创建分析任务
    console.log('📝 步骤1: 创建分析任务...');
    const createResponse = await fetch('http://localhost:3001/api/tasks/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        asin: 'B09FL6YR9L',
        productUrl: 'https://www.amazon.com/dp/B09FL6YR9L',
        reviewCount: 100,
        source: 'test-script',
        analysisOptions: {
          enableConsumerProfile: true,
          enableUsageScenarios: true,
          enableStarRating: true,
          enableProductExperience: true,
          enablePurchaseMotivation: true,
          enableUnmetNeeds: true
        }
      })
    });
    
    const createData = await createResponse.json();
    
    if (!createData.success) {
      throw new Error('创建任务失败: ' + createData.message);
    }
    
    const taskId = createData.data.taskId;
    console.log('✅ 任务创建成功！');
    console.log('📋 Task ID:', taskId);
    console.log('');
    
    // 2. 轮询任务状态
    console.log('⏳ 步骤2: 等待任务完成...\n');
    
    let attempts = 0;
    const maxAttempts = 120; // 最多等待4分钟
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const statusResponse = await fetch(`http://localhost:3001/api/tasks/${taskId}/status`);
      const statusData = await statusResponse.json();
      
      if (!statusData.success) {
        throw new Error('查询任务状态失败');
      }
      
      const { status, progress, error } = statusData.data;
      
      const statusEmoji = {
        'pending': '⏸️',
        'scraping': '🕷️',
        'analyzing': '🤖',
        'completed': '✅',
        'failed': '❌'
      };
      
      console.log(`${statusEmoji[status] || '⏳'} 状态: ${status} | 进度: ${progress}%`);
      
      if (status === 'completed') {
        console.log('\n✅ 任务完成！开始分析结果...\n');
        
        // 3. 获取完整结果
        const result = statusData.data.result;
        
        if (!result || !result.analysis) {
          throw new Error('分析结果为空');
        }
        
        // 4. 分析各维度的数据量
        console.log('📊 ============ 分析结果统计 ============\n');
        
        const analysis = result.analysis;
        
        // 消费者画像
        if (analysis.consumerProfile) {
          const cp = analysis.consumerProfile;
          console.log('👤 消费者画像:');
          console.log(`   - 人群特征: ${cp.demographics?.length || 0} 条`);
          console.log(`   - 使用时刻: ${cp.usageTiming?.length || 0} 条`);
          console.log(`   - 使用地点: ${cp.usageLocation?.length || 0} 条`);
          console.log(`   - 行为特征: ${cp.behaviors?.length || 0} 条`);
          console.log('');
        }
        
        // 使用场景
        if (analysis.usageScenarios) {
          const scenarios = analysis.usageScenarios.scenarios || [];
          console.log(`🎯 使用场景: ${scenarios.length} 条`);
          if (scenarios.length > 0) {
            console.log('   示例:');
            scenarios.slice(0, 3).forEach((s, i) => {
              console.log(`   ${i+1}. ${s.scenario} (${s.percentage})`);
            });
          }
          console.log('');
        }
        
        // 星级影响度
        if (analysis.starRatingImpact) {
          const positive = analysis.starRatingImpact.positiveAspects || [];
          const negative = analysis.starRatingImpact.negativeAspects || [];
          console.log(`⭐ 星级影响度:`);
          console.log(`   - 正向观点: ${positive.length} 条`);
          console.log(`   - 负向观点: ${negative.length} 条`);
          console.log('');
        }
        
        // 产品体验
        if (analysis.productExperience) {
          const positive = analysis.productExperience.positive || [];
          const negative = analysis.productExperience.negative || [];
          console.log(`👍 产品体验:`);
          console.log(`   - 正向体验: ${positive.length} 条`);
          console.log(`   - 负向体验: ${negative.length} 条`);
          console.log('');
        }
        
        // 购买动机
        if (analysis.purchaseMotivation) {
          const motivations = analysis.purchaseMotivation.motivations || [];
          console.log(`🛒 购买动机: ${motivations.length} 条`);
          if (motivations.length > 0) {
            console.log('   示例:');
            motivations.slice(0, 3).forEach((m, i) => {
              console.log(`   ${i+1}. ${m.motivation} (${m.percentage})`);
            });
          }
          console.log('');
        }
        
        // 未被满足的需求
        if (analysis.unmetNeeds) {
          const needs = analysis.unmetNeeds.needs || [];
          console.log(`📋 未被满足的需求: ${needs.length} 条`);
          if (needs.length > 0) {
            console.log('   示例:');
            needs.slice(0, 3).forEach((n, i) => {
              console.log(`   ${i+1}. ${n.need} (${n.percentage})`);
            });
          }
          console.log('');
        }
        
        console.log('📝 评论数据:');
        console.log(`   - 原始评论: ${result.reviews?.length || 0} 条`);
        console.log('');
        
        console.log('✅ 测试完成！所有数据已成功获取。\n');
        
        // 保存完整结果到文件
        const fs = require('fs');
        fs.writeFileSync('test-result-full.json', JSON.stringify(result, null, 2), 'utf8');
        console.log('💾 完整结果已保存到: test-result-full.json');
        
        return;
        
      } else if (status === 'failed') {
        console.log('\n❌ 任务失败！');
        console.log('错误信息:', error);
        throw new Error('任务分析失败: ' + error);
      }
      
      attempts++;
    }
    
    if (attempts >= maxAttempts) {
      throw new Error('任务超时（超过4分钟）');
    }
    
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    process.exit(1);
  }
}

// 运行测试
testFullAnalysis();

