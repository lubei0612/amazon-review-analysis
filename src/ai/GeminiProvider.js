// ========================
// Gemini 2.5 Pro AI Provider - 通过AIHubMix调用
// ========================

const axios = require('axios')
const logger = require('../../utils/logger')

class GeminiProvider {
  constructor(apiKey = null) {
    // 优先使用传入的apiKey，否则使用环境变量
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || process.env.AIHUBMIX_API_KEY
    this.baseURL = process.env.GEMINI_BASE_URL || 'https://aihubmix.com/v1'
    this.model = process.env.GEMINI_MODEL || 'gemini-2.5-pro'
    this.temperature = parseFloat(process.env.GEMINI_TEMPERATURE || '0.3')
    this.maxTokens = parseInt(process.env.GEMINI_MAX_TOKENS || '8000')
    
    if (!this.apiKey) {
      logger.warn('⚠️ GEMINI_API_KEY 未配置')
    } else {
      logger.info(`✅ Gemini Provider 已初始化 (模型: ${this.model})`)
    }
  }
  
  /**
   * 调用Gemini AI进行分析
   * @param {string} systemPrompt - 系统提示词
   * @param {string} userPrompt - 用户提示词
   * @returns {Promise<Object>} 分析结果
   */
  async analyze(systemPrompt, userPrompt) {
    if (!this.apiKey) {
      throw new Error('Gemini API Key 未配置')
    }
    
    const startTime = Date.now()
    
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          temperature: this.temperature,
          max_tokens: this.maxTokens * 2, // 🔧 动态翻倍，避免JSON截断
          response_format: { type: 'json_object' } // 强制JSON输出
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          timeout: 180000  // 增加到180秒（3分钟）
        }
      )
      
      const endTime = Date.now()
      const duration = ((endTime - startTime) / 1000).toFixed(2)
      
      // 解析响应
      logger.info('📋 Gemini完整响应（前500字符）:', JSON.stringify(response.data).substring(0, 500))
      
      const content = response.data.choices?.[0]?.message?.content
      const usage = response.data.usage || {}
      
      logger.info(`Gemini AI分析完成！耗时: ${duration}s, Tokens: ${usage.total_tokens || 'N/A'}`)
      
      // ✅ 新增：检查content是否存在
      if (!content || content.trim() === '') {
        logger.error('❌ Gemini返回空内容！')
        logger.error('完整响应:', JSON.stringify(response.data))
        throw new Error('Gemini AI未返回有效内容')
      }
      
      // 🔍 记录原始响应的前1000字符用于调试
      logger.info('🔍 原始AI响应（前1000字符）:', content.substring(0, 1000))
      
      // 解析JSON
      let result = this.parseJSON(content)
      
      // ✅ 检查解析结果是否为空
      if (!result) {
        logger.error('❌ JSON解析结果为null或undefined')
        logger.error('原始content:', content)
        throw new Error('JSON解析失败，结果为空')
      }
      
      if (Array.isArray(result) && result.length === 0) {
        logger.warn('⚠️ 解析结果是空数组！')
        logger.warn('完整content:', content.substring(0, 2000))
      }
      
      // ✅ 特殊处理：如果返回 {scenarios: [...]}，提取数组
      if (result && result.scenarios && Array.isArray(result.scenarios)) {
        logger.info('检测到scenarios包装，自动提取数组')
        result = result.scenarios
      }
      
      return {
        success: true,
        data: result,
        duration: parseFloat(duration),
        tokens: usage.total_tokens || 0
      }
      
    } catch (error) {
      logger.error('Gemini AI调用失败:', error.message)
      
      // 详细错误信息
      if (error.response) {
        logger.error('响应状态:', error.response.status)
        logger.error('响应数据:', JSON.stringify(error.response.data, null, 2))
      }
      
      throw new Error(`Gemini AI分析失败: ${error.message}`)
    }
  }
  
  /**
   * 解析JSON响应（增强容错）
   */
  parseJSON(content) {
    let cleaned = ''  // 在外部声明，避免作用域问题
    
    try {
      // ✅ 新增：检查content是否为空或undefined
      if (!content || typeof content !== 'string') {
        logger.error('AI返回内容为空或类型错误:', typeof content)
        throw new Error('AI返回内容为空')
      }
      
      // 去除markdown代码块标记
      cleaned = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
      
      // 提取纯JSON（去除AI可能添加的说明文字，支持对象和数组）
      const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/)
      if (jsonMatch) {
        cleaned = jsonMatch[0]
      }
      
      // 修复常见JSON错误
      cleaned = cleaned
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')  // 去除控制字符
        .replace(/,(\s*[}\]])/g, '$1')  // 去除尾随逗号
        .replace(/,\s*,+/g, ',')  // 去除多余逗号
        .replace(/}\s*{/g, '},{')  // 修复缺少逗号的对象
        .replace(/]\s*\[/g, '],[')  // 修复缺少逗号的数组
      
      return JSON.parse(cleaned)
      
    } catch (error) {
      logger.error('JSON解析失败:', error.message)
      logger.error('错误位置:', error.message.match(/position (\d+)/)?.[1] || '未知')
      
      // 尝试修复截断的JSON
      try {
        const lastCloseBrace = cleaned.lastIndexOf('}')
        const lastCloseBracket = cleaned.lastIndexOf(']')
        const lastClose = Math.max(lastCloseBrace, lastCloseBracket)
        
        if (lastClose > 0) {
          let truncated = cleaned.substring(0, lastClose + 1)
          
          // 补全括号
          const openBraces = (truncated.match(/\{/g) || []).length
          const closeBraces = (truncated.match(/\}/g) || []).length
          const openBrackets = (truncated.match(/\[/g) || []).length
          const closeBrackets = (truncated.match(/\]/g) || []).length
          
          if (openBrackets > closeBrackets) {
            truncated += ']'.repeat(openBrackets - closeBrackets)
          }
          if (openBraces > closeBraces) {
            truncated += '}'.repeat(openBraces - closeBraces)
          }
          
          logger.info('尝试修复截断的JSON...')
          return JSON.parse(truncated)
        }
      } catch (retryError) {
        logger.error('JSON修复失败:', retryError.message)
      }
      
      logger.error('清理后的内容（前500字符）:', cleaned.substring(0, 500))
      logger.error('清理后的内容（后500字符）:', cleaned.substring(Math.max(0, cleaned.length - 500)))
      throw new Error('AI返回的JSON格式无效')
    }
  }
  
  /**
   * 批量分析（用于大量评论）
   */
  async batchAnalyze(prompts, onProgress = null) {
    const results = []
    const total = prompts.length
    
    for (let i = 0; i < total; i++) {
      const { systemPrompt, userPrompt } = prompts[i]
      
      try {
        const result = await this.analyze(systemPrompt, userPrompt)
        results.push(result)
        
        if (onProgress) {
          onProgress({
            current: i + 1,
            total,
            progress: Math.round(((i + 1) / total) * 100)
          })
        }
        
        // 避免速率限制
        if (i < total - 1) {
          await this.delay(1000)
        }
        
      } catch (error) {
        logger.error(`批量分析第 ${i + 1} 项失败:`, error.message)
        results.push({
          success: false,
          error: error.message
        })
      }
    }
    
    return results
  }
  
  /**
   * 延迟函数
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

module.exports = GeminiProvider







































