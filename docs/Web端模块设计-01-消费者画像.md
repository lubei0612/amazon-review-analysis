# Web端模块设计 - 消费者画像

**模块名称**: 消费者画像  
**图标**: 👥  
**版本**: v1.0  
**最后更新**: 2025-10-21

---

## 📋 模块概述

### 功能说明
分析评论中提到的人群特征（son、daughter等）、使用时刻（everyday、night等）、使用地点（gym、home等）、行为（workout、listening等），帮助卖家了解目标用户群体。

### 数据展示
- 显示**所有**关键词数据（不限于TOP5）
- 数据占比总和=100%
- 采用堆叠柱状图可视化（红色差评+绿色好评）

---

## 🎨 UI设计

### 整体布局

```
┌─────────────────────────────────────────────────────────────────┐
│  👥 消费者画像                         翻译  [下载▼]            │
│  分析评论中提及的人群特征，帮助你发现潜在合作伙伴和受众         │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │人群特征  │  │使用时刻  │  │使用地点  │  │  行为    │      │
│  │ 柱状图   │  │ 柱状图   │  │ 柱状图   │  │ 柱状图   │      │
│  │          │  │          │  │          │  │          │      │
│  │  (30+条) │  │  (20+条) │  │  (15+条) │  │  (25+条) │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

**尺寸**:
- 高度：约500px
- 宽度：100%（响应式）
- 单个图表宽度：25%（一行4个）

---

## 📊 图表配置

### ECharts配置（堆叠柱状图）

```javascript
{
  title: {
    text: '人群特征',
    textStyle: { fontSize: 14, fontWeight: 600 }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    formatter: function(params) {
      const keyword = params[0].name;
      const negative = params[0].value;
      const positive = params[1].value;
      const total = negative + positive;
      return `
        ${keyword}<br/>
        总提及: ${total}次<br/>
        好评(4-5星): ${positive}次 (${(positive/total*100).toFixed(1)}%)<br/>
        差评(1-3星): ${negative}次 (${(negative/total*100).toFixed(1)}%)
      `;
    }
  },
  xAxis: {
    type: 'category',
    data: ['son', 'daughter', 'husband', 'wife', 'granddaughter', ...],
    axisLabel: {
      interval: 0,  // 显示所有标签
      rotate: 45,   // 旋转45度避免重叠
      fontSize: 11
    }
  },
  yAxis: {
    type: 'value',
    name: '提及次数',
    nameTextStyle: { fontSize: 12 }
  },
  series: [
    {
      name: '1-3星',
      type: 'bar',
      stack: 'total',
      data: [47, 55, 36, 55, 6, ...],  // 差评次数
      itemStyle: { 
        color: '#EF4444',
        borderRadius: [0, 0, 4, 4]  // 底部圆角
      }
    },
    {
      name: '4-5星',
      type: 'bar',
      stack: 'total',
      data: [264, 249, 193, 148, 88, ...],  // 好评次数
      itemStyle: { 
        color: '#10B981',
        borderRadius: [4, 4, 0, 0]  // 顶部圆角
      }
    }
  ],
  grid: {
    left: '10%',
    right: '5%',
    bottom: '15%',
    top: '15%'
  }
}
```

---

## 📥 下载功能

### 下载菜单

```html
<el-dropdown @command="handleDownload">
  <el-button size="small">
    下载 <el-icon><ArrowDown /></el-icon>
  </el-button>
  <template #dropdown>
    <el-dropdown-menu>
      <el-dropdown-item command="xlsx">📊 下载模块数据</el-dropdown-item>
      <el-dropdown-item command="png">🖼️ 下载图片</el-dropdown-item>
    </el-dropdown-menu>
  </template>
</el-dropdown>
```

### Excel导出格式

**文件名**: `消费者画像-{产品名称}-{日期}.xlsx`

**包含4个Sheet**:

#### Sheet1: 人群特征
| Keywords | Total mentions | 4~5 stars | 1~3 stars |
|----------|----------------|-----------|-----------|
| son | 311 | 264 | 47 |
| daughter | 304 | 249 | 55 |
| husband | 229 | 193 | 36 |
| ... | ... | ... | ... |

#### Sheet2: 使用时刻
| Keywords | Total mentions | 4~5 stars | 1~3 stars |
|----------|----------------|-----------|-----------|
| everyday | 329 | 300 | 29 |
| dinnertime | 100 | 88 | 12 |
| ... | ... | ... | ... |

#### Sheet3: 使用地点
| Keywords | Total mentions | 4~5 stars | 1~3 stars |
|----------|----------------|-----------|-----------|
| gym | 176 | 156 | 20 |
| pocket | 50 | 45 | 5 |
| ... | ... | ... | ... |

#### Sheet4: 行为
| Keywords | Total mentions | 4~5 stars | 1~3 stars |
|----------|----------------|-----------|-----------|
| workout | 329 | 300 | 29 |
| gift-give | 200 | 180 | 20 |
| ... | ... | ... | ... |

### 图片导出

- 格式：PNG
- 尺寸：1920x600px
- 内容：4个图表合成截图
- 使用ECharts的`getDataURL()`方法

---

## 🔄 翻译功能

### 翻译逻辑

```javascript
const [isTranslated, setIsTranslated] = useState(false);

const handleTranslate = () => {
  setIsTranslated(!isTranslated);
  // 图表X轴标签切换
  updateChartLabels(isTranslated ? translatedLabels : originalLabels);
};
```

**翻译映射**:
```javascript
const translations = {
  'son': '儿子',
  'daughter': '女儿',
  'husband': '丈夫',
  'wife': '妻子',
  'everyday': '每日使用',
  'gym': '健身房',
  'workout': '锻炼',
  // ...
};
```

---

## 📊 数据结构

### API响应格式

```json
{
  "consumerProfile": {
    "persona": [
      {
        "keyword": "son",
        "keywordCn": "儿子",
        "totalMentions": 311,
        "positiveCount": 264,
        "negativeCount": 47,
        "percentage": 0.0311
      },
      {
        "keyword": "daughter",
        "keywordCn": "女儿",
        "totalMentions": 304,
        "positiveCount": 249,
        "negativeCount": 55,
        "percentage": 0.0304
      }
    ],
    "usageTime": [...],
    "usageLocation": [...],
    "behavior": [...]
  }
}
```

---

## 💻 组件实现

### Vue组件结构

```vue
<template>
  <div class="consumer-profile-module">
    <!-- 标题栏 -->
    <div class="module-header">
      <div class="header-left">
        <span class="module-icon">👥</span>
        <h3>消费者画像</h3>
      </div>
      <div class="header-right">
        <el-button size="small" @click="handleTranslate">
          {{ isTranslated ? '还原' : '翻译' }}
        </el-button>
        <el-dropdown @command="handleDownload">
          <el-button size="small">
            下载 <el-icon><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="xlsx">📊 下载模块数据</el-dropdown-item>
              <el-dropdown-item command="png">🖼️ 下载图片</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 说明文字 -->
    <div class="module-description">
      分析评论中提及的人群特征，帮助你发现潜在合作伙伴和受众
    </div>

    <!-- 4个图表 -->
    <div class="charts-container">
      <div class="chart-item" ref="personaChart"></div>
      <div class="chart-item" ref="usageTimeChart"></div>
      <div class="chart-item" ref="usageLocationChart"></div>
      <div class="chart-item" ref="behaviorChart"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import * as XLSX from 'xlsx';

const isTranslated = ref(false);
const personaChart = ref(null);
// ... 其他refs

onMounted(() => {
  initCharts();
});

function initCharts() {
  // 初始化4个ECharts实例
  const personaInstance = echarts.init(personaChart.value);
  personaInstance.setOption(getChartOption('persona', data.persona));
  // ...
}

function handleDownload(command) {
  if (command === 'xlsx') {
    exportToExcel();
  } else {
    exportToPNG();
  }
}

function exportToExcel() {
  const workbook = XLSX.utils.book_new();
  
  // Sheet1: 人群特征
  const personaData = data.persona.map(item => ({
    'Keywords': item.keyword,
    'Total mentions': item.totalMentions,
    '4~5 stars': item.positiveCount,
    '1~3 stars': item.negativeCount
  }));
  const sheet1 = XLSX.utils.json_to_sheet(personaData);
  XLSX.utils.book_append_sheet(workbook, sheet1, '人群特征');
  
  // ... 添加其他3个Sheet
  
  XLSX.writeFile(workbook, `消费者画像-${productName}-${date}.xlsx`);
}
</script>

<style scoped>
.charts-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 20px;
}

.chart-item {
  width: 100%;
  height: 400px;
}
</style>
```

---

## 🎯 交互细节

1. **鼠标悬停**: 显示详细数据tooltip
2. **图表缩放**: 自适应容器宽度
3. **翻译切换**: 平滑过渡动画
4. **下载进度**: 显示loading状态

---

## 📱 响应式设计

```css
@media (max-width: 1400px) {
  .charts-container {
    grid-template-columns: repeat(2, 1fr);
  }
  .chart-item {
    height: 350px;
  }
}

@media (max-width: 768px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
  .chart-item {
    height: 300px;
  }
}
```

---

**文档维护人**: 即贸技术团队  
**组件路径**: `src/components/ConsumerProfile.vue`

