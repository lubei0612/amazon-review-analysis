// ================================
// Outscraper Support Test Script
// This script demonstrates the issue where API returns only 13 reviews
// ================================

require('dotenv').config()
const axios = require('axios')

const API_KEY = process.env.OUTSCRAPER_API_KEY || 'M2UyNTc2NDYyMjQxNDVmNjhiMDY2YzZlMDE4MDQ5MTJ8MjYyNTMwY2RhOA'
const BASE_URL = 'https://api.app.outscraper.com'
const TEST_ASIN = 'B0C4G36RNS'  // Product with 167 total reviews
const REQUESTED_LIMIT = 50      // We want 50 reviews

console.log('========================================')
console.log('🔬 Outscraper Issue Reproduction Test')
console.log('========================================\n')
console.log(`API Key: ${API_KEY.substring(0, 15)}...`)
console.log(`Product ASIN: ${TEST_ASIN}`)
console.log(`Requested Reviews: ${REQUESTED_LIMIT}`)
console.log(`\nStarting test...\n`)

async function testOutscraperLimit() {
  try {
    // Step 1: Create async task
    console.log('📡 Step 1: Creating async task...')
    const createResponse = await axios.get(`${BASE_URL}/amazon/reviews`, {
      params: {
        query: `https://www.amazon.com/dp/${TEST_ASIN}`,
        limit: REQUESTED_LIMIT,  // Requesting 50 reviews
        async: true
      },
      headers: { 'X-API-KEY': API_KEY }
    })
    
    const taskId = createResponse.data.id
    console.log(`✅ Task created: ${taskId}\n`)
    
    // Step 2: Poll for results
    console.log('⏳ Step 2: Waiting for task to complete...')
    let attempts = 0
    let result = null
    
    while (attempts < 30) {
      await delay(2000)
      attempts++
      
      try {
        const statusResponse = await axios.get(`${BASE_URL}/requests/${taskId}`, {
          headers: { 'X-API-KEY': API_KEY }
        })
        
        if (statusResponse.data.status === 'Success') {
          result = statusResponse.data
          console.log(`✅ Task completed after ${attempts * 2} seconds\n`)
          break
        }
      } catch (err) {
        // Retry on network errors
      }
    }
    
    if (!result) {
      console.log('❌ Task timeout\n')
      return
    }
    
    // Step 3: Analyze results
    console.log('📊 Step 3: Analyzing results...\n')
    console.log('========================================')
    console.log('RESULTS')
    console.log('========================================')
    
    const reviews = result.data?.[0]
    const actualCount = Array.isArray(reviews) ? reviews.length : 0
    
    console.log(`✅ Task ID: ${taskId}`)
    console.log(`📝 Requested: ${REQUESTED_LIMIT} reviews`)
    console.log(`📦 Actual Received: ${actualCount} reviews`)
    console.log(`⚠️  Status: ${actualCount >= REQUESTED_LIMIT ? 'SUCCESS' : 'INCOMPLETE'}`)
    
    if (reviews && reviews.length > 0) {
      console.log(`\n📋 First review sample:`)
      console.log(`   - Title: ${reviews[0].title}`)
      console.log(`   - Rating: ${reviews[0].rating}`)
      console.log(`   - Total reviews on product: ${reviews[0].total_reviews}`)
    }
    
    console.log('\n========================================')
    console.log('ISSUE SUMMARY')
    console.log('========================================')
    console.log(`🔴 PROBLEM: Only ${actualCount} reviews returned`)
    console.log(`✅ EXPECTED: ${REQUESTED_LIMIT} reviews`)
    console.log(`📊 GAP: ${REQUESTED_LIMIT - actualCount} reviews missing`)
    console.log(`\n💡 Question: Is there a plan limitation?`)
    console.log(`   Account has $10 USD balance`)
    console.log(`   Using parameter: limit=${REQUESTED_LIMIT}`)
    console.log(`   API endpoint: /amazon/reviews`)
    
  } catch (error) {
    console.log('\n❌ Error:', error.message)
    if (error.response) {
      console.log('   Status:', error.response.status)
      console.log('   Data:', JSON.stringify(error.response.data, null, 2))
    }
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Run test
testOutscraperLimit()



