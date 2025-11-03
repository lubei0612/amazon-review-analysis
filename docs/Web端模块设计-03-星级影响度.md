# Web端模块设计 - 星级影响度

**模块名称**: 星级影响度  
**图标**: ⭐  
**版本**: v1.0  
**最后更新**: 2025-10-21

---

## 📋 模块概述

### 功能说明
分析该商品星级的影响原因，帮助你聚焦问题和机会。通过散点图可视化展示不同话题在星级和提及率两个维度的分布。

### 数据展示
- 散点图（Scatter Chart）
- X轴：平均星级（1.5星 - 5星）
- Y轴：提及占比（0% - 40%）
- 数据点大小：固定
- 颜色区分：红色（差评）、绿色（好评）

---

## 🎨 UI设计

### 整体布局

```
┌─────────────────────────────────────────────────────────────────┐
│  ⭐ 星级影响度                         翻译  [下载▼]            │
│  分析该商品星级的影响原因，帮助你聚焦问题和机会                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   37% │                                    ● Great Sound Quality│
│       │                                                         │
│       │  ● Poor Sound Quality                                  │
│   17% │       ● Uncomfortable                                  │
│       │                                                         │
│       │                              ● Good Value  ● High Quality│
│    7% │                                   ● Good Fit            │
│       │                                                         │
│    0% ├────────┼────────┼────────┼────────┼────────┼───────────│
│      1.5星   2星    2.5星   3星    4星    4.5星    5星         │
│                                   ↑                             │
│                              参考线（4星）                       │
│                                                                 │
│  图例：                                                         │
│  ● 绿色（星级≥4星）- 好评话题                                   │
│  ● 红色（星级<4星）- 差评话题                                    │
└─────────────────────────────────────────────────────────────────┘
```

**尺寸**:
- 高度：600px
- 宽度：100%（响应式）

---

## 📊 ECharts配置

### 散点图配置

```javascript
{
  title: {
    text: '',  // 标题在外部显示
    left: 'center'
  },
  
  tooltip: {
    trigger: 'item',
    formatter: function(params) {
      const data = params.data;
      return `
        <strong>${data.topic}</strong><br/>
        平均星级: ${data.star.toFixed(2)}星<br/>
        提及占比: ${(data.percentage * 100).toFixed(2)}%<br/>
        提及次数: ${data.mentions}次
      `;
    }
  },
  
  grid: {
    left: '10%',
    right: '10%',
    bottom: '15%',
    top: '10%',
    containLabel: true
  },
  
  xAxis: {
    type: 'value',
    name: '平均星级',
    nameLocation: 'middle',
    nameGap: 30,
    min: 1.5,
    max: 5,
    interval: 0.5,
    axisLabel: {
      formatter: '{value}星'
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#E5E7EB',
        type: 'dashed'
      }
    }
  },
  
  yAxis: {
    type: 'value',
    name: '提及次数占比',
    nameLocation: 'middle',
    nameGap: 50,
    min: 0,
    max: function(value) {
      return Math.ceil(value.max * 1.1 * 100) / 100;  // 动态最大值
    },
    axisLabel: {
      formatter: function(value) {
        return (value * 100).toFixed(0) + '%';
      }
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#E5E7EB',
        type: 'dashed'
      }
    }
  },
  
  // 4星参考线
  markLine: {
    silent: true,
    symbol: 'none',
    data: [
      {
        xAxis: 4,
        lineStyle: {
          color: '#9CA3AF',
          width: 2,
          type: 'solid'
        },
        label: {
          formatter: '4星分界线',
          position: 'insideEndTop',
          color: '#6B7280'
        }
      }
    ]
  },
  
  series: [
    {
      name: '好评话题',
      type: 'scatter',
      data: positiveData.map(item => ({
        value: [item.star, item.percentage],
        topic: item.topic,
        star: item.star,
        percentage: item.percentage,
        mentions: item.mentions
      })),
      symbolSize: 10,  // 固定大小
      itemStyle: {
        color: '#10B981',  // 绿色
        opacity: 0.8,
        borderColor: '#059669',
        borderWidth: 2
      },
      label: {
        show: true,
        position: 'right',
        formatter: '{@[2]}',  // 显示话题名称
        fontSize: 11,
        color: '#1F2937'
      },
      emphasis: {
        itemStyle: {
          color: '#34D399',
          borderColor: '#047857',
          borderWidth: 3
        },
        label: {
          fontSize: 12,
          fontWeight: 'bold'
        }
      }
    },
    {
      name: '差评话题',
      type: 'scatter',
      data: negativeData.map(item => ({
        value: [item.star, item.percentage],
        topic: item.topic,
        star: item.star,
        percentage: item.percentage,
        mentions: item.mentions
      })),
      symbolSize: 10,  // 固定大小
      itemStyle: {
        color: '#EF4444',  // 红色
        opacity: 0.8,
        borderColor: '#DC2626',
        borderWidth: 2
      },
      label: {
        show: true,
        position: 'right',
        formatter: '{@[2]}',
        fontSize: 11,
        color: '#1F2937'
      },
      emphasis: {
        itemStyle: {
          color: '#F87171',
          borderColor: '#B91C1C',
          borderWidth: 3
        },
        label: {
          fontSize: 12,
          fontWeight: 'bold'
        }
      }
    }
  ],
  
  legend: {
    data: ['好评话题', '差评话题'],
    bottom: 10,
    left: 'center',
    textStyle: {
      fontSize: 13
    }
  }
}
```

---

## 🎨 样式配置

### CSS样式

```css
/* 模块容器 */
.star-impact-module {
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  background: white;
  margin-bottom: 24px;
}

/* 标题栏 */
.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #E5E7EB;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.module-icon {
  font-size: 20px;
}

.module-title {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
}

.header-right {
  display: flex;
  gap: 12px;
}

/* 说明文字 */
.module-description {
  padding: 8px 20px 12px;
  font-size: 13px;
  color: #6B7280;
  line-height: 1.5;
}

/* 图表容器 */
.chart-container {
  padding: 20px;
  height: 600px;
}

/* 图例说明 */
.chart-legend {
  display: flex;
  justify-content: center;
  gap: 32px;
  padding: 12px 20px;
  border-top: 1px solid #F3F4F6;
  font-size: 13px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot.positive {
  background: #10B981;
  border: 2px solid #059669;
}

.legend-dot.negative {
  background: #EF4444;
  border: 2px solid #DC2626;
}

.legend-text {
  color: #4B5563;
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
      <el-dropdown-item command="csv">📊 下载模块数据</el-dropdown-item>
      <el-dropdown-item command="png">🖼️ 下载图片</el-dropdown-item>
    </el-dropdown-menu>
  </template>
</el-dropdown>
```

### CSV导出格式

**文件名**: `星级影响度-{产品名称}-{日期}.csv`

**CSV结构**:
```csv
Topic,Star,Percentage,Mentions
Great Sound Quality,4.4567,0.298294998,3709
Comfortable,4.4213,0.119108895,1481
Long Battery Life,4.4563,0.114363841,1422
Ease Of Use,4.4614,0.076162136,947
High Quality,4.6855,0.07085411,881
Good Value,4.1105,0.050908798,633
Poor Sound Quality,2.4546,0.166639858,2072
Uncomfortable,2.8661,0.117741676,1464
Short Battery Life,2.3556,0.091362393,1136
```

**导出实现**:
```javascript
function exportToCSV() {
  const csvContent = [
    ['Topic', 'Star', 'Percentage', 'Mentions'],
    ...allData.map(item => [
      item.topic,
      item.star,
      item.percentage,
      item.mentions
    ])
  ].map(row => row.join(',')).join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `星级影响度-${productName}-${date}.csv`;
  link.click();
}
```

### 图片导出

```javascript
function exportToPNG() {
  const chartInstance = echarts.getInstanceByDom(chartRef.value);
  const base64 = chartInstance.getDataURL({
    type: 'png',
    pixelRatio: 2,  // 高清截图
    backgroundColor: '#ffffff'
  });
  
  const link = document.createElement('a');
  link.href = base64;
  link.download = `星级影响度-${productName}-${date}.png`;
  link.click();
}
```

---

## 🔄 交互功能

### 1. 翻译功能

```javascript
const [isTranslated, setIsTranslated] = useState(false);

const handleTranslate = () => {
  const chartInstance = echarts.getInstanceByDom(chartRef.value);
  
  if (!isTranslated) {
    // 翻译话题名称
    const translatedData = data.map(item => ({
      ...item,
      displayTopic: topicTranslations[item.topic] || item.topic
    }));
    
    // 更新图表
    chartInstance.setOption({
      series: updateSeriesWithTranslation(translatedData)
    });
  } else {
    // 恢复原文
    chartInstance.setOption({
      series: updateSeriesWithOriginal(data)
    });
  }
  
  setIsTranslated(!isTranslated);
};

// 翻译映射
const topicTranslations = {
  'Great Sound Quality': '音质出色',
  'Comfortable': '佩戴舒适',
  'Long Battery Life': '续航时间长',
  'Poor Sound Quality': '音质差',
  'Uncomfortable': '不舒适',
  'Short Battery Life': '续航短',
  'Good Value': '性价比高',
  'High Quality': '高质量',
  'Ease Of Use': '易于使用',
  // ...
};
```

### 2. 鼠标交互

- **悬停**: 高亮数据点，显示详细信息tooltip
- **点击**: 可跳转到该话题的评论详情（可选）

### 3. 缩放功能

```javascript
{
  toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      restore: {},
      saveAsImage: {
        pixelRatio: 2
      }
    },
    right: 20,
    top: 20
  },
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: 0,
      filterMode: 'none'
    },
    {
      type: 'inside',
      yAxisIndex: 0,
      filterMode: 'none'
    }
  ]
}
```

---

## 📊 数据结构

### API响应格式

```json
{
  "starImpact": [
    {
      "topic": "Great Sound Quality",
      "topicCn": "音质出色",
      "star": 4.4567,
      "percentage": 0.298294998,
      "mentions": 3709
    },
    {
      "topic": "Poor Sound Quality",
      "topicCn": "音质差",
      "star": 2.4546,
      "percentage": 0.166639858,
      "mentions": 2072
    }
  ]
}
```

### 数据处理逻辑

```javascript
// 按星级分为好评和差评
function processData(data) {
  const positiveData = data.filter(item => item.star >= 4);
  const negativeData = data.filter(item => item.star < 4);
  
  return { positiveData, negativeData };
}

// 按提及占比排序（用于显示标签）
function sortByPercentage(data) {
  return [...data].sort((a, b) => b.percentage - a.percentage);
}
```

---

## 💻 Vue组件实现

```vue
<template>
  <div class="star-impact-module">
    <!-- 标题栏 -->
    <div class="module-header">
      <div class="header-left">
        <span class="module-icon">⭐</span>
        <h3 class="module-title">星级影响度</h3>
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
              <el-dropdown-item command="csv">📊 下载模块数据</el-dropdown-item>
              <el-dropdown-item command="png">🖼️ 下载图片</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 说明文字 -->
    <div class="module-description">
      分析该商品星级的影响原因，帮助你聚焦问题和机会
    </div>

    <!-- 图表容器 -->
    <div ref="chartRef" class="chart-container"></div>

    <!-- 图例说明 -->
    <div class="chart-legend">
      <div class="legend-item">
        <div class="legend-dot positive"></div>
        <span class="legend-text">绿色（星级≥4星）- 好评话题</span>
      </div>
      <div class="legend-item">
        <div class="legend-dot negative"></div>
        <span class="legend-text">红色（星级&lt;4星）- 差评话题</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { ArrowDown } from '@element-plus/icons-vue';

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});

const chartRef = ref(null);
const isTranslated = ref(false);
let chartInstance = null;

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  chartInstance?.dispose();
  window.removeEventListener('resize', handleResize);
});

function initChart() {
  chartInstance = echarts.init(chartRef.value);
  
  const { positiveData, negativeData } = processData(props.data);
  
  const option = {
    // ... ECharts配置（见上方）
  };
  
  chartInstance.setOption(option);
}

function processData(data) {
  const positiveData = data.filter(item => item.star >= 4);
  const negativeData = data.filter(item => item.star < 4);
  return { positiveData, negativeData };
}

function handleResize() {
  chartInstance?.resize();
}

function handleTranslate() {
  isTranslated.value = !isTranslated.value;
  // 更新图表标签
  updateChartLabels();
}

function handleDownload(command) {
  if (command === 'csv') {
    exportToCSV();
  } else {
    exportToPNG();
  }
}

function exportToCSV() {
  // CSV导出逻辑
}

function exportToPNG() {
  // PNG导出逻辑
}
</script>

<style scoped>
/* CSS样式见上方 */
</style>
```

---

## 🎯 数据分析指导

### 四象限分析

根据散点图位置，可以分为4个象限：

```
        高提及率
           ↑
    需改进  │  核心卖点
    (左上)  │  (右上)
           │
───────────┼──────────→ 高星级
           │
    次要问题│  潜在亮点
    (左下)  │  (右下)
           │
        低提及率
```

**策略建议**:
1. **右上角（核心卖点）**: 继续强化，作为主要营销点
2. **左上角（需改进）**: 优先解决，影响大量用户
3. **右下角（潜在亮点）**: 考虑加大宣传
4. **左下角（次要问题）**: 低优先级

---

## 📱 响应式设计

```css
@media (max-width: 1200px) {
  .chart-container {
    height: 500px;
  }
}

@media (max-width: 768px) {
  .chart-container {
    height: 400px;
  }
  
  .chart-legend {
    flex-direction: column;
    gap: 12px;
  }
}
```

---

## 🎯 性能优化

1. **数据点过多时**（>50个）:
```javascript
// 只显示前30个重要话题
const topTopics = data
  .sort((a, b) => b.percentage - a.percentage)
  .slice(0, 30);
```

2. **标签防重叠**:
```javascript
{
  label: {
    show: true,
    position: 'right',
    overflow: 'truncate',
    width: 100
  }
}
```

---

**文档维护人**: 即贸技术团队  
**组件路径**: `src/components/StarImpact.vue`

