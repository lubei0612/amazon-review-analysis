// Laptop Backpack Demo 数据
export default {
  asin: 'demo-laptop-backpack',
  productName: 'Travel Laptop Backpack Water Resistant Anti-Theft Bag with USB Charging Port',
  productNameCn: '旅行笔记本电脑背包 防水防盗 带USB充电端口',
  
  // 消费者画像
  consumerProfile: {
    persona: [
      {
        keyword: 'Son',
        keywordCn: '儿子',
        positiveCount: 52,
        negativeCount: 4
      },
      {
        keyword: 'Husband',
        keywordCn: '丈夫',
        positiveCount: 45,
        negativeCount: 3
      },
      {
        keyword: 'Student',
        keywordCn: '学生',
        positiveCount: 68,
        negativeCount: 5
      },
      {
        keyword: 'Professional',
        keywordCn: '职场人士',
        positiveCount: 58,
        negativeCount: 6
      },
      {
        keyword: 'Teenager',
        keywordCn: '青少年',
        positiveCount: 38,
        negativeCount: 2
      }
    ],
    usageTime: [
      {
        keyword: 'Daily Commute',
        keywordCn: '每日通勤',
        positiveCount: 85,
        negativeCount: 8
      },
      {
        keyword: 'Travel',
        keywordCn: '旅行',
        positiveCount: 72,
        negativeCount: 6
      },
      {
        keyword: 'School Days',
        keywordCn: '上学日',
        positiveCount: 65,
        negativeCount: 5
      },
      {
        keyword: 'Business Trips',
        keywordCn: '商务出差',
        positiveCount: 48,
        negativeCount: 4
      }
    ],
    usageLocation: [
      {
        keyword: 'Office',
        keywordCn: '办公室',
        positiveCount: 75,
        negativeCount: 7
      },
      {
        keyword: 'School',
        keywordCn: '学校',
        positiveCount: 68,
        negativeCount: 5
      },
      {
        keyword: 'Airport',
        keywordCn: '机场',
        positiveCount: 52,
        negativeCount: 4
      },
      {
        keyword: 'City',
        keywordCn: '城市',
        positiveCount: 45,
        negativeCount: 3
      },
      {
        keyword: 'Gym',
        keywordCn: '健身房',
        positiveCount: 32,
        negativeCount: 2
      }
    ],
    behavior: [
      {
        keyword: 'Carrying Laptop',
        keywordCn: '携带笔记本电脑',
        positiveCount: 165,
        negativeCount: 15
      },
      {
        keyword: 'Organizing Items',
        keywordCn: '整理物品',
        positiveCount: 98,
        negativeCount: 9
      },
      {
        keyword: 'Charging Devices',
        keywordCn: '充电设备',
        positiveCount: 82,
        negativeCount: 7
      },
      {
        keyword: 'Traveling',
        keywordCn: '旅行',
        positiveCount: 75,
        negativeCount: 6
      }
    ]
  },
  
  // 使用场景
  usageScenarios: [
    {
      desc: 'Work & Office',
      descCn: '工作办公',
      percentage: 0.32,
      count: 2540,
      reason: '客户主要使用这个背包通勤上班，携带笔记本电脑和工作文件。',
      reasonCn: '客户主要使用这个背包通勤上班，携带笔记本电脑和工作文件。'
    },
    {
      desc: 'School & Study',
      descCn: '上学学习',
      percentage: 0.25,
      count: 1985,
      reason: '学生使用这个背包上学，携带课本、笔记本电脑和学习用品。',
      reasonCn: '学生使用这个背包上学，携带课本、笔记本电脑和学习用品。'
    },
    {
      desc: 'Travel & Vacation',
      descCn: '旅行度假',
      percentage: 0.18,
      count: 1430,
      reason: '用户在旅行和度假时使用这个背包，方便携带随身物品和电子设备。',
      reasonCn: '用户在旅行和度假时使用这个背包，方便携带随身物品和电子设备。'
    },
    {
      desc: 'Business Trips',
      descCn: '商务出差',
      percentage: 0.12,
      count: 952,
      reason: '商务人士在出差时使用，可以携带笔记本、文件和商务用品。',
      reasonCn: '商务人士在出差时使用，可以携带笔记本、文件和商务用品。'
    },
    {
      desc: 'Daily Errands',
      descCn: '日常外出',
      percentage: 0.08,
      count: 635,
      reason: '用户在日常外出办事时使用，方便携带必需品。',
      reasonCn: '用户在日常外出办事时使用，方便携带必需品。'
    },
    {
      desc: 'Gym & Fitness',
      descCn: '健身运动',
      percentage: 0.05,
      count: 397,
      reason: '一些用户将其用作健身包，携带运动装备和电子设备。',
      reasonCn: '一些用户将其用作健身包，携带运动装备和电子设备。'
    }
  ],
  
  // 星级影响度
  starRatingImpact: [
    {
      topic: 'Poor Quality Zippers',
      topicCn: '拉链质量差',
      avgRating: 2.3,
      percentage: 0.142,
      count: 1128
    },
    {
      topic: 'Uncomfortable Straps',
      topicCn: '肩带不舒适',
      avgRating: 2.6,
      percentage: 0.095,
      count: 754
    },
    {
      topic: 'Water Not Resistant',
      topicCn: '不防水',
      avgRating: 2.1,
      percentage: 0.078,
      count: 619
    },
    {
      topic: 'Spacious & Organized',
      topicCn: '空间大且有序',
      avgRating: 4.6,
      percentage: 0.285,
      count: 2263
    },
    {
      topic: 'Comfortable',
      topicCn: '舒适',
      avgRating: 4.5,
      percentage: 0.198,
      count: 1572
    },
    {
      topic: 'Good Quality',
      topicCn: '质量好',
      avgRating: 4.4,
      percentage: 0.165,
      count: 1310
    },
    {
      topic: 'USB Port Useful',
      topicCn: 'USB端口实用',
      avgRating: 4.7,
      percentage: 0.125,
      count: 992
    }
  ],
  
  // 产品体验
  productExperience: {
    negative: [
      {
        desc: 'Poor Quality Zippers',
        descCn: '拉链质量差',
        percentage: 0.285,
        count: 1128,
        reason: '客户反馈拉链容易损坏，使用一段时间后就出现问题。',
        reasonCn: '客户反馈拉链容易损坏，使用一段时间后就出现问题。'
      },
      {
        desc: 'Uncomfortable Straps',
        descCn: '肩带不舒适',
        percentage: 0.190,
        count: 754,
        reason: '用户报告肩带在背负重物时不够舒适，缺乏足够的缓冲。',
        reasonCn: '用户报告肩带在背负重物时不够舒适，缺乏足够的缓冲。'
      },
      {
        desc: 'Not Water Resistant',
        descCn: '不防水',
        percentage: 0.156,
        count: 619,
        reason: '客户发现产品的防水性能不如宣传的那样好。',
        reasonCn: '客户发现产品的防水性能不如宣传的那样好。'
      },
      {
        desc: 'Poor Durability',
        descCn: '耐用性差',
        percentage: 0.128,
        count: 508,
        reason: '用户反馈产品在使用几个月后就出现磨损和损坏。',
        reasonCn: '用户反馈产品在使用几个月后就出现磨损和损坏。'
      }
    ],
    positive: [
      {
        desc: 'Spacious & Organized',
        descCn: '空间大且有序',
        percentage: 0.358,
        count: 2263,
        reason: '客户喜欢背包的多个隔层设计，能够有序地存放各种物品。',
        reasonCn: '客户喜欢背包的多个隔层设计，能够有序地存放各种物品。'
      },
      {
        desc: 'Comfortable',
        descCn: '舒适',
        percentage: 0.249,
        count: 1572,
        reason: '用户认为背包背起来很舒适，即使长时间背负也不会感到疲劳。',
        reasonCn: '用户认为背包背起来很舒适，即使长时间背负也不会感到疲劳。'
      },
      {
        desc: 'Good Quality',
        descCn: '质量好',
        percentage: 0.207,
        count: 1310,
        reason: '客户对背包的整体质量表示满意，认为做工精良。',
        reasonCn: '客户对背包的整体质量表示满意，认为做工精良。'
      },
      {
        desc: 'USB Port Convenient',
        descCn: 'USB端口方便',
        percentage: 0.157,
        count: 992,
        reason: '用户喜欢USB充电端口设计，方便在外出时给设备充电。',
        reasonCn: '用户喜欢USB充电端口设计，方便在外出时给设备充电。'
      }
    ]
  },
  
  // 购买动机
  purchaseMotivation: [
    {
      desc: 'Laptop Protection',
      descCn: '保护笔记本',
      percentage: 0.385,
      count: 1245,
      reason: '客户购买是为了安全地携带和保护他们的笔记本电脑。',
      reasonCn: '客户购买是为了安全地携带和保护他们的笔记本电脑。'
    },
    {
      desc: 'Multiple Compartments',
      descCn: '多隔层设计',
      percentage: 0.265,
      count: 857,
      reason: '用户看重背包的多隔层设计，能够整理存放不同物品。',
      reasonCn: '用户看重背包的多隔层设计，能够整理存放不同物品。'
    },
    {
      desc: 'USB Charging Port',
      descCn: 'USB充电功能',
      percentage: 0.182,
      count: 588,
      reason: '客户被USB充电端口功能吸引，方便在旅途中充电。',
      reasonCn: '客户被USB充电端口功能吸引，方便在旅途中充电。'
    },
    {
      desc: 'Good Value',
      descCn: '性价比高',
      percentage: 0.168,
      count: 543,
      reason: '用户认为这个背包性价比高，功能齐全且价格合理。',
      reasonCn: '用户认为这个背包性价比高，功能齐全且价格合理。'
    }
  ],
  
  // 未被满足的需求
  unmetNeeds: [
    {
      desc: 'Better Zippers',
      descCn: '更好的拉链',
      percentage: 0.318,
      count: 856,
      reason: '客户希望使用更高质量的拉链，提高耐用性。',
      reasonCn: '客户希望使用更高质量的拉链，提高耐用性。'
    },
    {
      desc: 'Improved Padding',
      descCn: '改进缓冲',
      percentage: 0.235,
      count: 632,
      reason: '用户希望肩带和背部有更好的缓冲设计，提高舒适度。',
      reasonCn: '用户希望肩带和背部有更好的缓冲设计，提高舒适度。'
    },
    {
      desc: 'Better Water Resistance',
      descCn: '更好的防水性',
      percentage: 0.195,
      count: 525,
      reason: '客户希望产品有真正的防水功能，能够在雨天保护物品。',
      reasonCn: '客户希望产品有真正的防水功能，能够在雨天保护物品。'
    },
    {
      desc: 'More Color Options',
      descCn: '更多颜色选择',
      percentage: 0.125,
      count: 336,
      reason: '用户希望有更多颜色和款式可供选择。',
      reasonCn: '用户希望有更多颜色和款式可供选择。'
    },
    {
      desc: 'Stronger Material',
      descCn: '更坚固的材料',
      percentage: 0.127,
      count: 342,
      reason: '客户建议使用更耐用的材料，提高产品的使用寿命。',
      reasonCn: '客户建议使用更耐用的材料，提高产品的使用寿命。'
    }
  ]
}

