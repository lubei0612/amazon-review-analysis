// ========================
// 调试Amazon页面结构
// 保存截图和HTML用于分析
// ========================

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const fs = require('fs')

puppeteer.use(StealthPlugin())

async function debugAmazonPage() {
  console.log('🔍 调试Amazon页面结构\n')
  
  const asin = 'B08N5WRWNW'  // AirPods Pro
  
  let browser = null
  
  try {
    console.log('启动浏览器（Headless模式）...')
    browser = await puppeteer.launch({
      headless: true,  // ✅ 后台运行
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--window-size=1920x1080'
      ]
    })
    
    const page = await browser.newPage()
    
    await page.setViewport({ width: 1920, height: 1080 })
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    const url = `https://www.amazon.com/product-reviews/${asin}`
    console.log(`访问: ${url}\n`)
    
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    })
    
    // 等待加载
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    console.log('保存页面数据...')
    
    // 1. 保存截图
    await page.screenshot({ path: 'debug-amazon-screenshot.png', fullPage: true })
    console.log('✅ 截图已保存: debug-amazon-screenshot.png')
    
    // 2. 保存HTML
    const html = await page.content()
    fs.writeFileSync('debug-amazon-page.html', html)
    console.log('✅ HTML已保存: debug-amazon-page.html')
    
    // 3. 检测页面元素
    console.log('\n检测页面元素:')
    
    const selectors = [
      '[data-hook="review"]',
      '.review',
      '[data-hook="cr-review-item"]',
      '#cm_cr-review_list',
      '.a-section.review',
      '#reviewsMedley',
      '[data-hook="top-customer-reviews-widget"]'
    ]
    
    for (const selector of selectors) {
      const exists = await page.$(selector)
      console.log(`   ${selector}: ${exists ? '✅ 存在' : '❌ 不存在'}`)
    }
    
    // 4. 检查是否被重定向或有Captcha
    const currentUrl = page.url()
    console.log(`\n当前URL: ${currentUrl}`)
    
    const pageTitle = await page.title()
    console.log(`页面标题: ${pageTitle}`)
    
    // 检查常见的反爬虫提示
    const bodyText = await page.evaluate(() => document.body.innerText)
    
    if (bodyText.includes('Enter the characters you see below')) {
      console.log('\n⚠️ 检测到 Captcha!')
    } else if (bodyText.includes('Sorry, we just need to make sure')) {
      console.log('\n⚠️ 检测到反爬虫验证页面!')
    } else if (bodyText.includes('Sign in')) {
      console.log('\n⚠️ 可能需要登录')
    } else {
      console.log('\n✅ 没有检测到明显的反爬虫页面')
    }
    
    // 5. 提取可见的评论数量（如果有）
    const reviewCount = await page.evaluate(() => {
      const reviews = document.querySelectorAll('[data-hook="review"], .review, .a-section.review')
      return reviews.length
    })
    console.log(`\n可见评论数量: ${reviewCount}`)
    
    console.log('\n✅ 调试数据已保存，即将关闭浏览器...')
    
  } catch (error) {
    console.error('\n❌ 调试失败:', error.message)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

debugAmazonPage()
  .then(() => {
    console.log('\n调试完成')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ 出错:', error)
    process.exit(1)
  })

