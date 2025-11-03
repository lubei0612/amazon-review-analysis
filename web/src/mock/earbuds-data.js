// Earbud Headphones Demo 数据
export default {
  asin: 'demo-earbuds',
  productName: 'Wireless Bluetooth Earbuds',
  productNameCn: '无线蓝牙耳机',
  
  // 消费者画像
  consumerProfile: {
    persona: [
      {
        keyword: 'Grandson/Granddaughter',
        keywordCn: '孙子/孙女',
        positiveCount: 45,
        negativeCount: 3
      },
      {
        keyword: 'Daughter',
        keywordCn: '女儿',
        positiveCount: 38,
        negativeCount: 2
      },
      {
        keyword: 'Husband',
        keywordCn: '丈夫',
        positiveCount: 32,
        negativeCount: 5
      },
      {
        keyword: 'Son',
        keywordCn: '儿子',
        positiveCount: 28,
        negativeCount: 4
      },
      {
        keyword: 'Wife',
        keywordCn: '妻子',
        positiveCount: 25,
        negativeCount: 2
      }
    ],
    usageTime: [
      {
        keyword: 'Daily Use',
        keywordCn: '每日使用',
        positiveCount: 52,
        negativeCount: 8
      },
      {
        keyword: 'Snack Time',
        keywordCn: '零食时间',
        positiveCount: 35,
        negativeCount: 3
      },
      {
        keyword: 'Regular Use',
        keywordCn: '定期使用',
        positiveCount: 28,
        negativeCount: 4
      },
      {
        keyword: 'Workout Time',
        keywordCn: '锻炼时间',
        positiveCount: 22,
        negativeCount: 6
      }
    ],
    usageLocation: [
      {
        keyword: 'Apartment',
        keywordCn: '公寓',
        positiveCount: 42,
        negativeCount: 5
      },
      {
        keyword: 'RV',
        keywordCn: '房车',
        positiveCount: 30,
        negativeCount: 2
      },
      {
        keyword: 'Home',
        keywordCn: '家庭',
        positiveCount: 38,
        negativeCount: 3
      },
      {
        keyword: 'Gym',
        keywordCn: '健身房',
        positiveCount: 25,
        negativeCount: 8
      },
      {
        keyword: 'Office',
        keywordCn: '办公室',
        positiveCount: 20,
        negativeCount: 4
      }
    ],
    behavior: [
      {
        keyword: 'Listening to Music',
        keywordCn: '听音乐',
        positiveCount: 145,
        negativeCount: 22
      },
      {
        keyword: 'Making Phone Calls',
        keywordCn: '打电话',
        positiveCount: 78,
        negativeCount: 15
      },
      {
        keyword: 'Watching Videos',
        keywordCn: '看视频',
        positiveCount: 62,
        negativeCount: 8
      },
      {
        keyword: 'Gaming',
        keywordCn: '玩游戏',
        positiveCount: 45,
        negativeCount: 12
      },
      {
        keyword: 'Working Out',
        keywordCn: '健身',
        positiveCount: 38,
        negativeCount: 18
      }
    ]
  },
  
  // 使用场景
  usageScenarios: [
    {
      desc: 'Music Listening',
      descCn: '音乐聆听',
      percentage: 0.285,
      count: 1850,
      reason: 'Customers primarily use these headphones for listening to music while commuting, exercising, or relaxing at home.',
      reasonCn: '客户主要在通勤、锻炼或在家放松时使用这些耳机听音乐。'
    },
    {
      desc: 'Phone Calls',
      descCn: '电话通话',
      percentage: 0.182,
      count: 1180,
      reason: 'Users appreciate the clear mic quality for making hands-free calls during work or while driving.',
      reasonCn: '用户欣赏清晰的麦克风质量，可在工作或驾驶时免提通话。'
    },
    {
      desc: 'Workout & Exercise',
      descCn: '健身锻炼',
      percentage: 0.145,
      count: 940,
      reason: 'The wireless design and sweat-resistant features make them ideal for gym sessions and outdoor runs.',
      reasonCn: '无线设计和防汗功能使其成为健身房和户外跑步的理想选择。'
    },
    {
      desc: 'Video Watching',
      descCn: '观看视频',
      percentage: 0.128,
      count: 830,
      reason: 'Customers enjoy watching movies and videos on their devices with good audio quality.',
      reasonCn: '客户喜欢在设备上观看电影和视频，享受良好的音质。'
    },
    {
      desc: 'Gaming',
      descCn: '游戏娱乐',
      percentage: 0.095,
      count: 620,
      reason: 'Gamers use these for mobile gaming with low latency and immersive sound.',
      reasonCn: '游戏玩家使用这些耳机进行移动游戏，具有低延迟和沉浸式声音。'
    },
    {
      desc: 'Commuting',
      descCn: '通勤路上',
      percentage: 0.078,
      count: 510,
      reason: 'Perfect for listening to podcasts and music during daily commutes on public transport.',
      reasonCn: '非常适合在日常通勤时听播客和音乐。'
    },
    {
      desc: 'Studying & Reading',
      descCn: '学习阅读',
      percentage: 0.052,
      count: 340,
      reason: 'Students use them to focus while studying with background music or audiobooks.',
      reasonCn: '学生在学习时使用它们来集中注意力，播放背景音乐或有声读物。'
    },
    {
      desc: 'Sleep & Relaxation',
      descCn: '睡眠放松',
      percentage: 0.035,
      count: 230,
      reason: 'Some users find them comfortable enough to wear while falling asleep to calming sounds.',
      reasonCn: '一些用户发现它们足够舒适，可以在入睡时佩戴，听舒缓的声音。'
    }
  ],
  
  // 星级影响度
  starRatingImpact: [
    {
      topic: 'Poor Sound Quality',
      topicCn: '音质差',
      avgRating: 2.1,
      percentage: 0.185,
      count: 2072
    },
    {
      topic: 'Uncomfortable',
      topicCn: '不舒适',
      avgRating: 2.8,
      percentage: 0.131,
      count: 1464
    },
    {
      topic: 'Short Battery Life',
      topicCn: '电池续航短',
      avgRating: 2.5,
      percentage: 0.102,
      count: 1136
    },
    {
      topic: 'Connection Problems',
      topicCn: '连接问题',
      avgRating: 1.9,
      percentage: 0.082,
      count: 914
    },
    {
      topic: 'Great Sound Quality',
      topicCn: '音质出色',
      avgRating: 4.7,
      percentage: 0.317,
      count: 3545
    },
    {
      topic: 'Long Battery Life',
      topicCn: '电池续航长',
      avgRating: 4.5,
      percentage: 0.120,
      count: 1344
    },
    {
      topic: 'Comfortable',
      topicCn: '舒适',
      avgRating: 4.6,
      percentage: 0.120,
      count: 1341
    },
    {
      topic: 'Good Value',
      topicCn: '性价比高',
      avgRating: 4.4,
      percentage: 0.050,
      count: 554
    }
  ],
  
  // 产品体验
  productExperience: {
    negative: [
      {
        desc: 'Poor Sound Quality',
        descCn: '音质差',
        percentage: 0.331,
        count: 2072,
        reason: 'Customers have reported inconsistent volume, mediocre sound quality, and suppressed midrange in the headphones.',
        reasonCn: '客户反馈音量不稳定、音质一般且中音被压制。'
      },
      {
        desc: 'Uncomfortable',
        descCn: '不舒适',
        percentage: 0.234,
        count: 1464,
        reason: 'The headphones have been reported to be uncomfortable for users with sensitive ears, too tight, and uncomfortable for extended use.',
        reasonCn: '耳机被反馈对敏感耳朵的用户不舒适、过紧且长时间佩戴不舒服。'
      },
      {
        desc: 'Short Battery Life',
        descCn: '电池续航短',
        percentage: 0.181,
        count: 1136,
        reason: 'Users have reported battery failure, short battery life, and inconsistent battery life.',
        reasonCn: '用户反馈电池故障、续航时间短且不稳定。'
      },
      {
        desc: 'Stopped Working',
        descCn: '停止工作',
        percentage: 0.174,
        count: 1091,
        reason: 'Customers have reported that one side of the headphones stopped working or received a defective product.',
        reasonCn: '客户反馈耳机一侧停止工作或收到有缺陷的产品。'
      },
      {
        desc: 'Connection Problems',
        descCn: '连接问题',
        percentage: 0.146,
        count: 914,
        reason: 'Customers have experienced unreliable connections, sound synchronization issues, and disconnections.',
        reasonCn: '客户遇到连接不稳定、声音同步问题和断开连接。'
      }
    ],
    positive: [
      {
        desc: 'Great Sound Quality',
        descCn: '音质出色',
        percentage: 0.497,
        count: 3545,
        reason: 'Customers have found the sound quality to be good for their needs, consistent with high-quality sound and volume.',
        reasonCn: '客户发现音质满足其需求，具有高质量的声音和音量。'
      },
      {
        desc: 'Long Battery Life',
        descCn: '电池续航长',
        percentage: 0.188,
        count: 1344,
        reason: 'Customers appreciate the long battery life, with a long-lasting battery and impressive battery life.',
        reasonCn: '客户欣赏长电池续航时间，电池持久且令人印象深刻。'
      },
      {
        desc: 'Comfortable',
        descCn: '舒适',
        percentage: 0.188,
        count: 1341,
        reason: 'The headphones have been reported to be comfortable, have a snug fit, and are surprisingly comfortable.',
        reasonCn: '耳机被报告舒适、贴合且令人惊讶地舒适。'
      },
      {
        desc: 'Ease Of Use',
        descCn: '易于使用',
        percentage: 0.124,
        count: 886,
        reason: 'Customers have reported that the headphones are easy to pair, easy to connect and clean.',
        reasonCn: '客户反馈耳机易于配对、连接和清洁。'
      }
    ]
  },
  
  // 购买动机
  purchaseMotivation: [
    {
      desc: 'Good Value',
      descCn: '性价比高',
      percentage: 0.546,
      count: 633,
      reason: 'Customers are satisfied with these headphones, finding them good as gifts, a good product for the price, affordable.',
      reasonCn: '客户对这些耳机很满意，认为它们是很好的礼物，性价比高的产品。'
    },
    {
      desc: 'Great Sound Quality',
      descCn: '音质出色',
      percentage: 0.222,
      count: 258,
      reason: 'Customers appreciate the great sound for music and superb sound quality.',
      reasonCn: '客户欣赏这些耳机的音乐音质出色，音质超群。'
    },
    {
      desc: 'Great Wireless Headphones',
      descCn: '优秀的无线耳机',
      percentage: 0.053,
      count: 62,
      reason: 'Customers appreciate the alternative to AirPods, best wireless headset for the price.',
      reasonCn: '客户欣赏这款AirPods的替代品、性价比最高的无线耳机。'
    },
    {
      desc: 'Comfortable',
      descCn: '舒适',
      percentage: 0.037,
      count: 43,
      reason: 'Customers find these headphones super comfy and comfortable for laying down.',
      reasonCn: '客户发现这些耳机非常舒适，适合躺下时佩戴。'
    },
    {
      desc: 'Great Battery Life',
      descCn: '电池续航出色',
      percentage: 0.028,
      count: 33,
      reason: 'Customers appreciate the excellent battery duration and fantastic battery life.',
      reasonCn: '客户欣赏出色的电池续航时间和出色的电池寿命。'
    },
    {
      desc: 'Budget-Friendly',
      descCn: '价格实惠',
      percentage: 0.028,
      count: 32,
      reason: 'Customers appreciate the affordable price of these headphones.',
      reasonCn: '客户欣赏这些耳机的实惠价格。'
    },
    {
      desc: 'Sleek Design',
      descCn: '时尚设计',
      percentage: 0.023,
      count: 27,
      reason: 'Customers have been pleased with the appearance and stylishness of these headphones.',
      reasonCn: '客户对这些耳机的外观和时尚感到满意。'
    },
    {
      desc: 'Everyday Use',
      descCn: '日常使用',
      percentage: 0.020,
      count: 23,
      reason: 'Customers find these headphones great for listening to books or music.',
      reasonCn: '客户发现这些耳机非常适合听书或音乐。'
    },
    {
      desc: 'Noise Cancelling',
      descCn: '降噪',
      percentage: 0.016,
      count: 19,
      reason: 'Customers have found these headphones to do a great job at blocking out noise.',
      reasonCn: '客户发现这些耳机在阻挡噪音方面做得很好。'
    },
    {
      desc: 'Gift Option',
      descCn: '礼物选择',
      percentage: 0.027,
      count: 31,
      reason: 'Many customers purchase these as gifts for family members and friends.',
      reasonCn: '许多客户购买这些作为家人和朋友的礼物。'
    }
  ],
  
  // 未被满足的需求
  unmetNeeds: [
    {
      desc: 'Battery Life',
      descCn: '电池续航',
      percentage: 0.242,
      count: 195,
      reason: 'Customers have appreciated the longer charging cord and wireless option, as well as the longer battery life.',
      reasonCn: '客户欣赏更长的充电线和无线选项，以及更长的电池续航时间。'
    },
    {
      desc: 'Durability',
      descCn: '耐用性',
      percentage: 0.213,
      count: 172,
      reason: 'Customers have suggested improving the product durability and providing cleaning instructions.',
      reasonCn: '客户建议提高产品耐用性并提供清洁说明。'
    },
    {
      desc: 'Comfort',
      descCn: '舒适度',
      percentage: 0.127,
      count: 102,
      reason: 'Customers have suggested adding more padding to the earcups for improved comfort over time.',
      reasonCn: '客户建议在耳罩上增加更多填充物以提高长时间佩戴的舒适度。'
    },
    {
      desc: 'Sound Quality',
      descCn: '音质',
      percentage: 0.123,
      count: 99,
      reason: 'Customers have noted higher quality sound compared to other headphones, but some have suggested improvements.',
      reasonCn: '客户注意到相比其他耳机有更高质量的声音，但有些建议改进。'
    },
    {
      desc: 'Ease Of Use',
      descCn: '易用性',
      percentage: 0.091,
      count: 73,
      reason: 'Customers have appreciated the auto shut off feature and wish for no annoying beep.',
      reasonCn: '客户欣赏自动关闭功能并希望没有烦人的蜂鸣声。'
    },
    {
      desc: 'Noise Cancellation',
      descCn: '降噪',
      percentage: 0.067,
      count: 54,
      reason: 'Customers have appreciated the noise cancelling feature and wish for less noise leakage.',
      reasonCn: '客户欣赏降噪功能并希望减少噪音泄漏。'
    },
    {
      desc: 'Volume',
      descCn: '音量',
      percentage: 0.066,
      count: 53,
      reason: 'Customers have appreciated the integrated volume control and wish for louder volume capability.',
      reasonCn: '客户欣赏集成的音量控制并希望更大的音量能力。'
    },
    {
      desc: 'Bluetooth Connectivity',
      descCn: '蓝牙连接',
      percentage: 0.037,
      count: 30,
      reason: 'Some customers have suggested adding a dedicated pairing button and improving the Bluetooth functionality.',
      reasonCn: '一些客户建议添加专用配对按钮并改进蓝牙功能。'
    },
    {
      desc: 'Price',
      descCn: '价格',
      percentage: 0.032,
      count: 26,
      reason: 'Customers have noted that these headphones offer better quality and value for the price.',
      reasonCn: '客户注意到这些耳机提供更好的质量和性价比。'
    }
  ]
}

