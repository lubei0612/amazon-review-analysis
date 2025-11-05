// ========================
// 模拟 Gemini Provider - 用于演示
// ========================

const logger = require('../../utils/logger')

class MockGeminiProvider {
  constructor() {
    logger.info('✅ 使用模拟 Gemini Provider（演示模式）')
    logger.warn('⚠️  这是演示模式，使用的是模拟数据！')
  }
  
  async analyze(systemPrompt, userPrompt) {
    logger.info('🎭 使用模拟数据（演示模式）')
    
    // 模拟延迟（让它看起来像真的在分析）
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400))
    
    // 返回模拟数据
    return {
      success: true,
      data: this.generateMockData(systemPrompt),
      duration: 1.0,
      tokens: 0
    }
  }
  
  generateMockData(systemPrompt) {
    // 根据 systemPrompt 返回不同的模拟数据
    
    // 消费者画像
    if (systemPrompt.includes('消费者画像') || systemPrompt.includes('Consumer Profile')) {
      return {
        genderRatio: { 
          male: 45, 
          female: 40, 
          unknown: 15 
        },
        dimensions: {
          personas: [
            { persona: '年轻科技爱好者', percent: 35, reason: '评论中频繁提到科技感、创新设计和智能控制功能，显示出对新科技产品的热情' },
            { persona: '家庭用户', percent: 30, reason: '多次提到家庭使用场景，如孩子、伴侣共同使用，重视家庭氛围营造' },
            { persona: '专业人士', percent: 25, reason: '关注产品的专业性能指标，如亮度、色彩准确度、控制精度等' },
            { persona: '送礼者', percent: 10, reason: '部分用户明确表示是作为礼物购买，注重包装和展示效果' }
          ],
          moments: [
            { occasion: '睡前放松', percent: 40, reason: '最常见的使用时刻，用户表示星空效果帮助放松心情、改善睡眠质量' },
            { occasion: '聚会派对', percent: 30, reason: '用于营造派对气氛，配合音乐创造沉浸式体验' },
            { occasion: '冥想瑜伽', percent: 20, reason: '在冥想和瑜伽时使用，舒缓的灯光有助于专注和放松' },
            { occasion: '浪漫时刻', percent: 10, reason: '情侣约会、求婚等特殊时刻使用，营造浪漫氛围' }
          ],
          locations: [
            { place: '卧室', percent: 50, reason: '最常见使用场所，主要用于睡前助眠和氛围营造' },
            { place: '客厅', percent: 30, reason: '家庭娱乐区域，聚会时营造氛围' },
            { place: '儿童房', percent: 15, reason: '家长为孩子创造梦幻空间，助眠或玩耍' },
            { place: '工作室', percent: 5, reason: '创意工作空间，用于灵感激发和放松' }
          ],
          behaviors: [
            { behavior: '拍照分享', percent: 35, reason: '视觉效果出众，用户喜欢拍照分享到社交媒体' },
            { behavior: '助眠放松', percent: 30, reason: '睡前使用，配合定时功能帮助入睡' },
            { behavior: '氛围营造', percent: 25, reason: '聚会、约会等场合营造特定氛围' },
            { behavior: '儿童陪伴', percent: 10, reason: '作为夜灯或玩具陪伴儿童' }
          ]
        }
      }
    }
    
    // 使用场景
    if (systemPrompt.includes('使用场景') || systemPrompt.includes('Usage Scenarios')) {
      return {
        items: [
          { name: '睡前助眠', percent: 40, reason: '用户反馈星空投影效果舒缓放松，配合定时功能完美实现睡前助眠场景，多人提到改善了睡眠质量' },
          { name: '派对聚会', percent: 25, reason: '灯光效果震撼，配合音乐节奏变化，能够瞬间提升聚会氛围，适合生日派对、节日庆祝等场合' },
          { name: '冥想瑜伽', percent: 20, reason: '柔和的星空灯光营造宁静环境，帮助用户进入冥想状态，多位瑜伽爱好者推荐使用' },
          { name: '浪漫约会', percent: 10, reason: '情侣约会时营造浪漫氛围，有用户分享成功求婚案例' },
          { name: '儿童哄睡', percent: 5, reason: '梦幻的星空效果深受儿童喜爱，作为夜灯使用效果很好' }
        ]
      }
    }
    
    // 未被满足的需求
    if (systemPrompt.includes('未被满足') || systemPrompt.includes('Unmet Needs')) {
      return {
        items: [
          { need: '更多颜色和模式', percent: 30, reason: '用户希望增加更多颜色选择和星空图案，目前的模式虽然不错但还不够丰富' },
          { need: '音乐同步功能', percent: 25, reason: '希望灯光能够随音乐节奏自动变化，增强派对和娱乐场景的沉浸感' },
          { need: '更强的亮度', percent: 20, reason: '部分用户反馈在较大房间使用时亮度不够，希望有更高亮度档位' },
          { need: '降低噪音', percent: 15, reason: '电机旋转时有轻微噪音，影响助眠使用，希望改进' },
          { need: '防水设计', percent: 10, reason: '希望产品具备防水功能，可在浴室等潮湿环境使用' }
        ]
      }
    }
    
    // 好评（产品优势）
    if (systemPrompt.includes('好评') || systemPrompt.includes('strengths') || systemPrompt.includes('Positive')) {
      return {
        items: [
          { aspect: '视觉效果震撼', percent: 45, reason: '星空投影效果逼真生动，色彩饱和度高，用户一致认为视觉效果超出预期，物超所值' },
          { aspect: 'App控制便捷', percent: 35, reason: '通过Govee App可以轻松控制灯光颜色、亮度、模式，支持定时和场景设置，操作简单直观' },
          { aspect: '安装简单', percent: 25, reason: '开箱即用，无需复杂安装步骤，老年人也能轻松上手' },
          { aspect: '静音效果好', percent: 20, reason: '大部分用户反馈工作噪音很小，不影响睡眠和休息' },
          { aspect: '做工精致', percent: 15, reason: '产品质感好，材质扎实，细节处理到位，适合作为礼物' }
        ]
      }
    }
    
    // 差评（产品缺陷）
    if (systemPrompt.includes('差评') || systemPrompt.includes('weaknesses') || systemPrompt.includes('Negative')) {
      return {
        items: [
          { aspect: '亮度不够', percent: 25, reason: '在较大房间或白天使用时，部分用户反馈亮度不足，覆盖范围有限' },
          { aspect: '轻微噪音', percent: 20, reason: '电机旋转时有轻微噪音，虽然不大但敏感人群可能会受影响' },
          { aspect: '连接不稳定', percent: 18, reason: '偶尔出现Wi-Fi连接断开或App控制延迟的情况' },
          { aspect: '模式较少', percent: 15, reason: '预设的星空模式和颜色选择相对有限，希望有更多自定义选项' },
          { aspect: '价格偏高', percent: 12, reason: '相比同类产品价格稍高，性价比一般' },
          { aspect: '发热问题', percent: 10, reason: '长时间使用后机身会发热，担心安全性' }
        ]
      }
    }
    
    // 购买动机
    if (systemPrompt.includes('购买动机') || systemPrompt.includes('Purchase Motivation')) {
      return {
        items: [
          { type: '个人使用', percent: 40, reason: '为自己购买用于改善睡眠质量、营造家居氛围，追求生活品质提升' },
          { type: '礼物赠送', percent: 35, reason: '作为生日礼物、节日礼物送给家人朋友，颜值高实用性强' },
          { type: '儿童需求', percent: 15, reason: '孩子喜欢星空主题，购买用于儿童房装饰和哄睡' },
          { type: '品牌信任', percent: 10, reason: '信任Govee品牌，之前购买过其他产品体验良好，继续选择该品牌' }
        ]
      }
    }
    
    // 星级影响度（如果有的话）
    if (systemPrompt.includes('星级') || systemPrompt.includes('Star Rating')) {
      return {
        distribution: {
          '5星': 60,
          '4星': 25,
          '3星': 10,
          '2星': 3,
          '1星': 2
        },
        reasons: {
          '5星': '视觉效果出色，App控制方便，物超所值',
          '4星': '整体不错，但亮度可以更强，价格略高',
          '3星': '基本满足需求，但有一些小问题',
          '2星': '质量一般，性价比不高',
          '1星': '产品故障或严重不符合预期'
        }
      }
    }
    
    // 默认返回空数据
    return { items: [] }
  }
}

module.exports = MockGeminiProvider






