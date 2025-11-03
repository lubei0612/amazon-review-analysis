// ========================
// 评论数据清洗工具
// ========================

class DataCleaner {
  /**
   * 清洗评论数据
   * @param {Array} reviews - 原始评论数组
   * @returns {Array} 清洗后的评论数组
   */
  static cleanReviews(reviews) {
    return reviews
      .map(review => this.cleanSingleReview(review))
      .filter(review => this.isValidReview(review))
  }
  
  /**
   * 清洗单条评论
   */
  static cleanSingleReview(review) {
    return {
      reviewId: this.cleanString(review.reviewId),
      asin: this.cleanString(review.asin),
      rating: this.normalizeRating(review.rating),
      title: this.cleanText(review.title),
      content: this.cleanText(review.content),
      author: this.cleanText(review.author),
      date: this.parseDate(review.date),
      isVerified: Boolean(review.isVerified),
      helpfulVotes: Math.max(0, parseInt(review.helpfulVotes) || 0),
      variant: this.cleanText(review.variant),
      crawledAt: new Date()
    }
  }
  
  /**
   * 清理字符串
   */
  static cleanString(str) {
    if (!str) return ''
    return String(str).trim()
  }
  
  /**
   * 清理文本（去除多余空格、换行）
   */
  static cleanText(text) {
    if (!text) return ''
    
    return String(text)
      .trim()
      // 去除多余换行
      .replace(/\n\s*\n/g, '\n')
      // 去除行首行尾空格
      .replace(/^\s+|\s+$/gm, '')
      // 合并多个空格
      .replace(/\s{2,}/g, ' ')
      // 去除特殊Unicode字符
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
  }
  
  /**
   * 标准化评分（1-5）
   */
  static normalizeRating(rating) {
    const normalized = parseFloat(rating) || 0
    return Math.max(1, Math.min(5, normalized))
  }
  
  /**
   * 解析日期
   */
  static parseDate(dateStr) {
    if (!dateStr) return null
    
    try {
      // Amazon日期格式: "December 15, 2023"
      const date = new Date(dateStr)
      return isNaN(date.getTime()) ? null : date
    } catch (error) {
      return null
    }
  }
  
  /**
   * 验证评论有效性（极度放宽标准以保留最多数据）
   */
  static isValidReview(review) {
    // ✅ 必须有内容或标题（至少有一个）
    if (!review.content && !review.title) {
      return false
    }
    
    // ✅ 评分必须在1-5之间
    if (review.rating < 1 || review.rating > 5) {
      return false
    }
    
    // ✅ 完全移除内容长度限制！
    // 即使是 "Good"、"Bad"、"Nice" 这样的短评论也有分析价值
    // 因为AI可以从中提取情感倾向和简单评价
    
    // ✅ 只要有标题或内容（任意长度），都保留
    if (review.content || review.title) {
      return true
    }
    
    return false
  }
  
  /**
   * 去重（基于reviewId）
   */
  static deduplicate(reviews) {
    const seen = new Set()
    return reviews.filter(review => {
      if (seen.has(review.reviewId)) {
        return false
      }
      seen.add(review.reviewId)
      return true
    })
  }
  
  /**
   * 按日期排序
   */
  static sortByDate(reviews, order = 'desc') {
    return reviews.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0
      const dateB = b.date ? new Date(b.date).getTime() : 0
      return order === 'desc' ? dateB - dateA : dateA - dateB
    })
  }
  
  /**
   * 统计信息
   */
  static getStatistics(reviews) {
    const total = reviews.length
    
    if (total === 0) {
      return {
        total: 0,
        avgRating: 0,
        verifiedCount: 0,
        ratingDistribution: {},
        avgContentLength: 0
      }
    }
    
    const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0)
    const verifiedCount = reviews.filter(r => r.isVerified).length
    const contentLengths = reviews.map(r => r.content.length)
    const avgContentLength = contentLengths.reduce((sum, len) => sum + len, 0) / total
    
    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    }
    
    return {
      total,
      avgRating: (ratingSum / total).toFixed(2),
      verifiedCount,
      verifiedRate: ((verifiedCount / total) * 100).toFixed(2) + '%',
      ratingDistribution,
      avgContentLength: Math.round(avgContentLength)
    }
  }
}

module.exports = DataCleaner
















































