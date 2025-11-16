// 测试Apify API Token是否有效
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', 'server.env') });

const token = process.env.APIFY_API_TOKEN;

if (!token) {
  console.error('❌ 未检测到 APIFY_API_TOKEN 环境变量，请在 server.env 中配置');
  process.exit(1);
}

async function testApifyToken() {
  console.log('========================================');
  console.log('🕷️  测试 Apify API Token');
  console.log('========================================');
  console.log(`Token: ${token.substring(0, 20)}...`);
  
  try {
    // 测试1: 获取用户信息
    console.log('\n[测试1] 获取账户信息...');
    const userResponse = await axios.get('https://api.apify.com/v2/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const user = userResponse.data.data;
    console.log('✅ Token有效');
    console.log(`👤 用户: ${user.username || user.email}`);
    console.log(`💰 账户余额: $${user.credit || 0}`);
    console.log(`📅 创建时间: ${new Date(user.createdAt).toLocaleDateString('zh-CN')}`);
    
    // 测试2: 列出Actors
    console.log('\n[测试2] 检查Actor访问权限...');
    const actorsResponse = await axios.get('https://api.apify.com/v2/acts', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        limit: 1
      }
    });
    
    console.log('✅ 可以访问Actors');
    
    // 测试3: 尝试启动一个简单的Actor（不实际运行）
    const actorId = 'compass/crawler-google-places';
    console.log(`\n[测试3] 测试启动Actor权限 (${actorId})...`);
    
    try {
      const runResponse = await axios.post(
        `https://api.apify.com/v2/acts/${actorId}/runs`,
        {
          // 空输入，只测试权限
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          validateStatus: function (status) {
            // 接受所有状态码，我们只是测试
            return true;
          }
        }
      );
      
      if (runResponse.status === 201) {
        console.log('✅ 可以启动Actor');
        console.log('⚠️  测试Actor已启动，请手动到Apify控制台停止');
      } else if (runResponse.status === 402) {
        console.log('❌ 账户余额不足（状态码: 402）');
        console.log('需要充值或获取新的API Token');
      } else if (runResponse.status === 403) {
        console.log('❌ 权限不足或月度配额超限（状态码: 403）');
        console.log('错误详情:', runResponse.data);
      } else {
        console.log(`⚠️  状态码: ${runResponse.status}`);
        console.log('响应:', runResponse.data);
      }
    } catch (error) {
      if (error.response) {
        console.log(`❌ 错误: ${error.response.status}`);
        console.log('详情:', error.response.data);
      } else {
        console.log('❌ 网络错误:', error.message);
      }
    }
    
  } catch (error) {
    console.log('\n❌ Token测试失败');
    if (error.response) {
      console.log(`状态码: ${error.response.status}`);
      console.log(`错误信息:`, error.response.data);
      
      if (error.response.status === 401) {
        console.log('\n原因: Token无效或已过期');
      } else if (error.response.status === 403) {
        console.log('\n原因: 账户配额超限或权限不足');
      }
    } else {
      console.log(`错误: ${error.message}`);
    }
  }
}

testApifyToken();
