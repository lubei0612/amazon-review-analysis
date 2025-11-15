// ========================================
// API密钥测试脚本
// ========================================
// 用途：测试Apify和Gemini API是否可用

require('dotenv').config();
const axios = require('axios');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// ========================================
// 测试 Apify API
// ========================================
async function testApifyAPI() {
  log('\n========================================', 'cyan');
  log('🕷️  测试 Apify API', 'cyan');
  log('========================================', 'cyan');
  
  const token = process.env.APIFY_API_TOKEN;
  
  if (!token) {
    log('❌ 错误: APIFY_API_TOKEN 未配置', 'red');
    return false;
  }
  
  log(`📝 API Token: ${token.substring(0, 20)}...`, 'blue');
  
  try {
    // 测试获取用户信息
    const response = await axios.get('https://api.apify.com/v2/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 200) {
      const user = response.data.data;
      log('\n✅ Apify API 连接成功！', 'green');
      log(`👤 用户: ${user.username || user.email}`, 'blue');
      log(`💰 账户余额: $${user.credit || 0}`, 'blue');
      log(`📅 创建时间: ${new Date(user.createdAt).toLocaleDateString('zh-CN')}`, 'blue');
      return true;
    }
  } catch (error) {
    log('\n❌ Apify API 测试失败', 'red');
    if (error.response) {
      log(`状态码: ${error.response.status}`, 'red');
      log(`错误信息: ${error.response.data.error?.message || error.message}`, 'red');
    } else {
      log(`错误: ${error.message}`, 'red');
    }
    return false;
  }
}

// ========================================
// 测试 Gemini API
// ========================================
async function testGeminiAPI() {
  log('\n========================================', 'cyan');
  log('🤖 测试 Gemini API', 'cyan');
  log('========================================', 'cyan');
  
  const apiKey = process.env.GEMINI_API_KEY;
  const baseUrl = process.env.GEMINI_BASE_URL || 'https://aihubmix.com/v1';
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-pro';
  
  if (!apiKey) {
    log('❌ 错误: GEMINI_API_KEY 未配置', 'red');
    return false;
  }
  
  log(`📝 API Key: ${apiKey.substring(0, 20)}...`, 'blue');
  log(`🔗 Base URL: ${baseUrl}`, 'blue');
  log(`🤖 Model: ${model}`, 'blue');
  
  try {
    // 发送简单的测试请求
    const response = await axios.post(
      `${baseUrl}/chat/completions`,
      {
        model: model,
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
    
    if (response.status === 200 && response.data.choices) {
      const reply = response.data.choices[0].message.content;
      log('\n✅ Gemini API 连接成功！', 'green');
      log(`🤖 AI 回复: ${reply}`, 'blue');
      log(`📊 使用tokens: ${response.data.usage?.total_tokens || 'N/A'}`, 'blue');
      return true;
    }
  } catch (error) {
    log('\n❌ Gemini API 测试失败', 'red');
    if (error.response) {
      log(`状态码: ${error.response.status}`, 'red');
      log(`错误信息: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
    } else {
      log(`错误: ${error.message}`, 'red');
    }
    return false;
  }
}

// ========================================
// 主测试函数
// ========================================
async function runTests() {
  log('\n╔════════════════════════════════════════╗', 'cyan');
  log('║    Amazon评论分析系统 - API测试       ║', 'cyan');
  log('╚════════════════════════════════════════╝', 'cyan');
  
  const results = {
    apify: false,
    gemini: false
  };
  
  // 测试 Apify
  results.apify = await testApifyAPI();
  
  // 等待1秒
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 测试 Gemini
  results.gemini = await testGeminiAPI();
  
  // 总结
  log('\n========================================', 'cyan');
  log('📊 测试结果汇总', 'cyan');
  log('========================================', 'cyan');
  log(`Apify API:  ${results.apify ? '✅ 通过' : '❌ 失败'}`, results.apify ? 'green' : 'red');
  log(`Gemini API: ${results.gemini ? '✅ 通过' : '❌ 失败'}`, results.gemini ? 'green' : 'red');
  
  const allPassed = results.apify && results.gemini;
  
  if (allPassed) {
    log('\n🎉 恭喜！所有API测试通过，系统可以正常使用！', 'green');
  } else {
    log('\n⚠️  部分API测试失败，请检查配置', 'yellow');
  }
  
  log('\n', 'reset');
  
  return allPassed;
}

// 运行测试
runTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    log(`\n❌ 测试过程中发生错误: ${error.message}`, 'red');
    process.exit(1);
  });
