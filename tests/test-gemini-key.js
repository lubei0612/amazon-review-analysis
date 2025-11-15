// 测试指定的Gemini API Key
const axios = require('axios');

const apiKey = 'sk-38uw2rUlFvqNr4XUDcF32643AcB844Aa9097Ab40E7823f5d';
const baseUrl = 'https://aihubmix.com/v1';

async function testGeminiKey() {
  console.log('========================================');
  console.log('🤖 测试 Gemini API Key');
  console.log('========================================');
  console.log(`API Key: ${apiKey.substring(0, 20)}...`);
  console.log(`Base URL: ${baseUrl}`);
  
  try {
    const response = await axios.post(
      `${baseUrl}/chat/completions`,
      {
        model: 'gemini-2.5-pro',
        messages: [
          {
            role: 'user',
            content: '你好，请回复"API测试成功"'
          }
        ],
        max_tokens: 50,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('\n✅ API Key 有效！');
    console.log(`🤖 AI回复: ${response.data.choices[0].message.content}`);
    console.log(`📊 使用tokens: ${response.data.usage?.total_tokens || 'N/A'}`);
    
    // 如果成功，检查余额
    console.log('\n正在检查账户余额...');
    
  } catch (error) {
    console.log('\n❌ API Key 测试失败');
    if (error.response) {
      console.log(`状态码: ${error.response.status}`);
      console.log(`错误信息:`, JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.log('\n可能原因:');
        console.log('1. API Key无效或已过期');
        console.log('2. API Key未激活');
      } else if (error.response.status === 429) {
        console.log('\n可能原因:');
        console.log('1. 账户余额不足');
        console.log('2. 达到请求限制');
      }
    } else {
      console.log(`错误: ${error.message}`);
    }
  }
}

testGeminiKey();
