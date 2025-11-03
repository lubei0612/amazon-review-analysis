// ========================
// 项目健康检查脚本
// ========================
// 
// 用途：全面检查项目的健康状态
// 运行：node scripts/health-check.js

require('dotenv').config()
const fs = require('fs')
const path = require('path')

console.log('='.repeat(80))
console.log('🏥 项目健康检查')
console.log('='.repeat(80))
console.log()

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  details: []
}

// ==================== 检查1: Node.js版本 ====================
console.log('📋 检查1: Node.js版本')
console.log('-'.repeat(80))

try {
  const nodeVersion = process.version
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])
  
  if (majorVersion >= 18) {
    console.log(`✅ Node.js版本: ${nodeVersion} (满足要求 >=18.0.0)`)
    results.passed++
    results.details.push({ check: 'Node.js版本', status: 'PASS', value: nodeVersion })
  } else {
    console.log(`❌ Node.js版本: ${nodeVersion} (不满足要求 >=18.0.0)`)
    results.failed++
    results.details.push({ check: 'Node.js版本', status: 'FAIL', value: nodeVersion })
  }
} catch (error) {
  console.log(`❌ 检查失败: ${error.message}`)
  results.failed++
}
results.total++
console.log()

// ==================== 检查2: 依赖安装 ====================
console.log('📋 检查2: 项目依赖')
console.log('-'.repeat(80))

try {
  const packageJson = require('../package.json')
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }
  const missingDeps = []
  
  for (const dep of Object.keys(dependencies)) {
    try {
      require.resolve(dep)
    } catch {
      missingDeps.push(dep)
    }
  }
  
  if (missingDeps.length === 0) {
    console.log(`✅ 所有依赖已安装 (共${Object.keys(dependencies).length}个)`)
    results.passed++
    results.details.push({ check: '依赖安装', status: 'PASS', value: `${Object.keys(dependencies).length}个` })
  } else {
    console.log(`❌ 缺失依赖: ${missingDeps.join(', ')}`)
    console.log(`   请运行: npm install`)
    results.failed++
    results.details.push({ check: '依赖安装', status: 'FAIL', missing: missingDeps })
  }
} catch (error) {
  console.log(`❌ 检查失败: ${error.message}`)
  results.failed++
}
results.total++
console.log()

// ==================== 检查3: 环境变量配置 ====================
console.log('📋 检查3: 环境变量配置')
console.log('-'.repeat(80))

const envFile = path.join(__dirname, '../.env')
if (fs.existsSync(envFile)) {
  console.log('✅ .env文件存在')
  
  // 检查关键配置
  const requiredVars = ['RAPIDAPI_KEY', 'RAPIDAPI_HOST']
  const optionalVars = ['GEMINI_API_KEY', 'OUTSCRAPER_API_KEY']
  
  let allRequired = true
  for (const varName of requiredVars) {
    if (process.env[varName]) {
      console.log(`  ✅ ${varName}: 已配置`)
    } else {
      console.log(`  ❌ ${varName}: 未配置`)
      allRequired = false
    }
  }
  
  for (const varName of optionalVars) {
    if (process.env[varName]) {
      console.log(`  ✅ ${varName}: 已配置 (可选)`)
    } else {
      console.log(`  ⚠️  ${varName}: 未配置 (可选)`)
    }
  }
  
  if (allRequired) {
    results.passed++
    results.details.push({ check: '环境变量', status: 'PASS' })
  } else {
    results.failed++
    results.details.push({ check: '环境变量', status: 'FAIL' })
  }
} else {
  console.log('❌ .env文件不存在')
  console.log('   请复制: copy env.example .env')
  results.failed++
  results.details.push({ check: '环境变量', status: 'FAIL', error: '.env文件不存在' })
}
results.total++
console.log()

// ==================== 检查4: 核心文件存在 ====================
console.log('📋 检查4: 核心文件检查')
console.log('-'.repeat(80))

const coreFiles = [
  'server.js',
  'package.json',
  'src/crawler/RapidAPICrawler.js',
  'src/ai/AnalysisService.js',
  'web/index.html'
]

let allFilesExist = true
for (const file of coreFiles) {
  const filePath = path.join(__dirname, '..', file)
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`)
  } else {
    console.log(`  ❌ ${file} (文件缺失)`)
    allFilesExist = false
  }
}

if (allFilesExist) {
  results.passed++
  results.details.push({ check: '核心文件', status: 'PASS' })
} else {
  results.failed++
  results.details.push({ check: '核心文件', status: 'FAIL' })
}
results.total++
console.log()

// ==================== 检查5: 爬虫可用性 ====================
console.log('📋 检查5: 爬虫模块可用性')
console.log('-'.repeat(80))

try {
  const RapidAPICrawler = require('../src/crawler/RapidAPICrawler')
  const OutscraperCrawler = require('../src/crawler/OutscraperCrawler')
  const PuppeteerCrawler = require('../src/crawler/PuppeteerCrawler')
  
  const rapid = new RapidAPICrawler()
  const outscraper = new OutscraperCrawler()
  const puppeteer = new PuppeteerCrawler()
  
  const crawlerStatus = {
    rapid: rapid.isAvailable(),
    outscraper: outscraper.isAvailable(),
    puppeteer: puppeteer.isAvailable()
  }
  
  console.log(`  ${crawlerStatus.rapid ? '✅' : '❌'} RapidAPI: ${crawlerStatus.rapid ? '可用' : '未配置'}`)
  console.log(`  ${crawlerStatus.outscraper ? '✅' : '⚠️ '} Outscraper: ${crawlerStatus.outscraper ? '可用' : '未配置 (可选)'}`)
  console.log(`  ${crawlerStatus.puppeteer ? '✅' : '❌'} Puppeteer: ${crawlerStatus.puppeteer ? '可用' : '未配置'}`)
  
  if (crawlerStatus.rapid || crawlerStatus.outscraper || crawlerStatus.puppeteer) {
    results.passed++
    results.details.push({ check: '爬虫模块', status: 'PASS', available: crawlerStatus })
  } else {
    results.failed++
    results.details.push({ check: '爬虫模块', status: 'FAIL', error: '所有爬虫都不可用' })
  }
} catch (error) {
  console.log(`  ❌ 爬虫模块加载失败: ${error.message}`)
  results.failed++
  results.details.push({ check: '爬虫模块', status: 'FAIL', error: error.message })
}
results.total++
console.log()

// ==================== 检查6: Git状态 ====================
console.log('📋 检查6: Git版本控制')
console.log('-'.repeat(80))

const gitDir = path.join(__dirname, '../.git')
if (fs.existsSync(gitDir)) {
  console.log('✅ Git仓库已初始化')
  
  // 检查.gitignore
  const gitignoreFile = path.join(__dirname, '../.gitignore')
  if (fs.existsSync(gitignoreFile)) {
    console.log('  ✅ .gitignore存在')
    const gitignoreContent = fs.readFileSync(gitignoreFile, 'utf-8')
    const criticalIgnores = ['node_modules', '.env']
    const missing = criticalIgnores.filter(item => !gitignoreContent.includes(item))
    
    if (missing.length === 0) {
      console.log('  ✅ 关键文件已添加到.gitignore')
    } else {
      console.log(`  ⚠️  .gitignore缺少: ${missing.join(', ')}`)
      results.warnings++
    }
  } else {
    console.log('  ⚠️  .gitignore不存在')
    results.warnings++
  }
  
  results.passed++
  results.details.push({ check: 'Git版本控制', status: 'PASS' })
} else {
  console.log('⚠️  Git仓库未初始化')
  console.log('   建议运行: git init')
  results.warnings++
  results.details.push({ check: 'Git版本控制', status: 'WARNING', note: '未初始化' })
}
results.total++
console.log()

// ==================== 总结报告 ====================
console.log('='.repeat(80))
console.log('📊 健康检查总结')
console.log('='.repeat(80))
console.log()
console.log(`总检查项: ${results.total}`)
console.log(`✅ 通过: ${results.passed}`)
console.log(`❌ 失败: ${results.failed}`)
console.log(`⚠️  警告: ${results.warnings}`)
console.log()

const score = Math.round((results.passed / results.total) * 100)
console.log(`🏆 健康分数: ${score}/100`)
console.log()

if (score >= 80) {
  console.log('🎉 项目健康状态良好！')
} else if (score >= 60) {
  console.log('⚠️  项目基本可用，但有一些问题需要解决')
} else {
  console.log('❌ 项目存在严重问题，需要立即修复')
}

console.log()
console.log('详细结果:')
results.details.forEach((detail, idx) => {
  const icon = detail.status === 'PASS' ? '✅' : detail.status === 'FAIL' ? '❌' : '⚠️ '
  console.log(`${icon} ${idx + 1}. ${detail.check}: ${detail.status}`)
})

console.log()
console.log('='.repeat(80))

// 退出码
process.exit(results.failed > 0 ? 1 : 0)

