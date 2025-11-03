# Web端模块设计 - 购买动机

**模块名称**: 购买动机  
**图标**: 🛒  
**版本**: v1.0  
**最后更新**: 2025-10-21

---

## 📋 模块概述

### 功能说明
分析关于消费者购买动机的评论活动，针对性地优化您的Listing和产品优化。

### 数据展示
- 初始显示TOP 10购买动机
- 点击"加载更多"展开全部数据
- 数据占比总和=100%
- 只有正向数据（无负向分组）

---

## 🎨 UI设计

### 整体布局

```
┌─────────────────────────────────────────────────────────────────┐
│  🛒 购买动机                           翻译  [下载▼]            │
│  分析关于消费者购买动机的评论活动，针对性地优化您的Listing和   │
│  产品优化                                                        │
├─────────────────────────────────────────────────────────────────┤
│  客户购买动机        提及占比 ⓘ                  购买原因        │
├─────────────────────────────────────────────────────────────────┤
│  Good Value       54.6%(633) ▓▓▓▓▓▓▓▓▓▓▓  Customers are...     │
│  Great Sound..    22.2%(258) ▓▓▓▓▓░░░░░░  Customers apprec...  │
│  Great Wirele..    5.3%(62)  ▓░░░░░░░░░░  Customers apprec...  │
│  Comfortable       3.7%(43)  ▓░░░░░░░░░░  Customers find...    │
│  Great For Th..    3.4%(40)  ▓░░░░░░░░░░  Customers apprec...  │
│  Great Batter..    2.8%(33)  ░░░░░░░░░░░  Customers apprec...  │
│  Budget-Frien..    2.8%(32)  ░░░░░░░░░░░  Customers apprec...  │
│  Sleek Design      2.3%(27)  ░░░░░░░░░░░  Customers have...   │
│  Everyday Use      2.0%(23)  ░░░░░░░░░░░  Customers find...   │
│  Noise Cancel..    1.6%(19)  ░░░░░░░░░░░  Customers have...   │
├─────────────────────────────────────────────────────────────────┤
│                    [加载更多 ▼]                                │
└─────────────────────────────────────────────────────────────────┘
```

**尺寸**:
- 高度：动态（初始约600px，全部展开约1200px+）
- 宽度：100%（响应式）

---

## 🎨 样式配置

### CSS样式

```css
/* 模块容器 */
.purchase-motivation-module {
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
  margin: 0;
}

.header-right {
  display: flex;
  gap: 8px;
}

/* 说明文字 */
.module-description {
  padding: 8px 20px 12px;
  font-size: 13px;
  color: #6B7280;
  line-height: 1.5;
}

/* 表格列头 */
.table-header {
  display: grid;
  grid-template-columns: 15% 20% 65%;
  gap: 16px;
  padding: 12px 20px;
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  align-items: center;
}

.tooltip-icon {
  color: #9CA3AF;
  cursor: help;
  font-size: 14px;
}

/* 数据行 */
.motivation-row {
  display: grid;
  grid-template-columns: 15% 20% 65%;
  gap: 16px;
  padding: 12px 20px;
  border-bottom: 1px solid #F3F4F6;
  align-items: center;
  transition: background 0.2s;
}

.motivation-row:hover {
  background: #F9FAFB;
}

/* 描述列 */
.col-desc {
  font-weight: 600;
  color: #1F2937;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 占比列 */
.col-percentage {
  display: flex;
  align-items: center;
  gap: 8px;
}

.percentage-text {
  font-weight: 600;
  color: #1F2937;
  font-size: 14px;
  min-width: 85px;
}

.progress-bar-bg {
  flex: 1;
  max-width: 100px;
  height: 8px;
  background: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
}

/* 蓝色进度条 - 购买动机专用 */
.progress-bar-fill.motivation {
  height: 100%;
  background: linear-gradient(90deg, #3B82F6, #60A5FA);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* 原因列 */
.col-reason {
  color: #4B5563;
  font-size: 13px;
  line-height: 1.6;
}

/* 加载更多按钮 */
.load-more-container {
  display: flex;
  justify-content: center;
  padding: 16px;
}

.load-more-btn {
  padding: 10px 24px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.load-more-btn:hover {
  background: #F3F4F6;
  border-color: #9CA3AF;
}

.load-more-btn .arrow {
  transition: transform 0.3s;
}

.load-more-btn .arrow.expanded {
  transform: rotate(180deg);
}
```

---

## 📥 下载功能

### CSV导出格式

**文件名**: `购买动机-{产品名称}-{日期}.csv`

**CSV内容示例**:

```csv
客户购买动机,占比,数量,购买原因
Good Value,0.546,633,"Customers are satisfied with these headphones, finding them good as gifts, a good product for the price, a great simple product, a good deal, and affordable, providing a cost-effective and budget-friendly product."
Great Sound Quality,0.222,258,"Customers appreciate the great sound for music, great headphones for music, and superb sound quality, providing an immersive and enjoyable listening experience."
Great Wireless Headphones,0.053,62,"Customers appreciate the alternative to AirPods, over-the-head headphones, decent set of Bluetooth headphones for the price, best wireless headset for the price, and great wireless headphones for budget, providing a cost-effective and versatile product for wireless listening."
Comfortable,0.037,43,"Customers find these headphones super comfy for ASMR, among the most comfortable, and comfortable for laying down, providing a comfortable and enjoyable listening experience."
Great For The Gym,0.034,40,"Customers appreciate the great sound for gym use, great for the gym, good for the price, and exercise-friendly, providing a durable and reliable product for active use."
Great Battery Life,0.028,33,"Customers appreciate the good quality, excellent battery duration, great battery life, and fantastic battery life, providing extended use without the need for frequent charging."
Budget-Friendly,0.028,32,"Customers appreciate the affordable price of these headphones, bought on sale and affordable, providing a cost-effective and budget-friendly product."
Sleek Design,0.023,27,"Customers have been pleased with the appearance and stylishness of these headphones, especially considering their affordable price."
Everyday Use,0.020,23,"Customers find these headphones great for listening to books or music, good for listening to audiobooks, and recommended for office or PC use, providing a versatile and functional product for everyday use."
Noise Cancelling,0.016,19,"Customers have found these headphones to do a great job at blocking out noise, with excellent noise cancelling capabilities that are especially useful in small offices or for amateur radio use."
```

**字段说明**:
- `客户购买动机`: 动机描述（英文原文，翻译后显示中文）
- `占比`: 0-1之间的小数（如0.546表示54.6%）
- `数量`: 该动机在评论中被提及的次数
- `购买原因`: 详细解释客户为什么因为这个原因购买产品

**导出实现**:

```javascript
function exportToCSV() {
  const headers = ['客户购买动机', '占比', '数量', '购买原因'];
  
  const rows = [
    headers,
    ...motivationData.map(item => [
      isTranslated ? item.descCn : item.desc,
      item.percentage,
      item.count,
      isTranslated ? item.reasonCn : item.reason
    ])
  ];
  
  const csvContent = rows.map(row => 
    row.map(cell => {
      // 处理包含逗号和引号的字段
      const str = String(cell);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(',')
  ).join('\n');
  
  const blob = new Blob(['\uFEFF' + csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `购买动机-${productName}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
}
```

### PNG导出功能

```javascript
import html2canvas from 'html2canvas';

async function exportToPNG() {
  const moduleElement = document.querySelector('.purchase-motivation-module');
  
  const canvas = await html2canvas(moduleElement, {
    backgroundColor: '#ffffff',
    scale: 2, // 高清输出
    logging: false
  });
  
  canvas.toBlob((blob) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `购买动机-${productName}-${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
  });
}
```

---

## 🔄 交互功能

### 1. 加载更多/收起

```javascript
const [isExpanded, setIsExpanded] = useState(false);

const displayData = computed(() => {
  return isExpanded.value 
    ? motivationData.value 
    : motivationData.value.slice(0, 10);
});

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}
```

### 2. 翻译功能

```javascript
const [isTranslated, setIsTranslated] = useState(false);

function handleTranslate() {
  setIsTranslated(!isTranslated);
}

// 显示时根据isTranslated决定显示原文还是译文
const displayDesc = isTranslated ? item.descCn : item.desc;
const displayReason = isTranslated ? item.reasonCn : item.reason;
```

### 3. 提及占比Tooltip

```html
<el-tooltip 
  content="该动机在所有购买动机中被提及的占比" 
  placement="top"
>
  <el-icon class="tooltip-icon"><QuestionFilled /></el-icon>
</el-tooltip>
```

---

## 📊 数据结构

### API响应格式

```json
{
  "purchaseMotivation": [
    {
      "desc": "Good Value",
      "descCn": "性价比高",
      "percentage": 0.546,
      "count": 633,
      "reason": "Customers are satisfied with these headphones, finding them good as gifts, a good product for the price, a great simple product, a good deal, and affordable, providing a cost-effective and budget-friendly product.",
      "reasonCn": "客户对这些耳机很满意，认为它们是很好的礼物，性价比高的产品，简单实用的产品，划算且实惠，提供了具有成本效益和预算友好的产品。"
    },
    {
      "desc": "Great Sound Quality",
      "descCn": "音质出色",
      "percentage": 0.222,
      "count": 258,
      "reason": "Customers appreciate the great sound for music, great headphones for music, and superb sound quality, providing an immersive and enjoyable listening experience.",
      "reasonCn": "客户欣赏这些耳机的音乐音质出色，是很棒的音乐耳机，音质超群，提供了沉浸式和愉悦的聆听体验。"
    },
    {
      "desc": "Great Wireless Headphones",
      "descCn": "优秀的无线耳机",
      "percentage": 0.053,
      "count": 62,
      "reason": "Customers appreciate the alternative to AirPods, over-the-head headphones, decent set of Bluetooth headphones for the price, best wireless headset for the price, and great wireless headphones for budget, providing a cost-effective and versatile product for wireless listening.",
      "reasonCn": "客户欣赏这款AirPods的替代品、头戴式耳机、性价比不错的蓝牙耳机、性价比最高的无线耳机、预算友好的优秀无线耳机，提供了具有成本效益且多功能的无线聆听产品。"
    }
  ]
}
```

**数据验证**:
- 所有`percentage`之和应该接近1.0（允许±0.01的误差）
- `count`应为正整数
- `desc`和`reason`不能为空

---

## 💻 Vue组件实现

```vue
<template>
  <div class="purchase-motivation-module">
    <!-- 标题栏 -->
    <div class="module-header">
      <div class="header-left">
        <span class="module-icon">🛒</span>
        <h3 class="module-title">购买动机</h3>
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
      分析关于消费者购买动机的评论活动，针对性地优化您的Listing和产品优化
    </div>

    <!-- 表格列头 -->
    <div class="table-header">
      <div class="col-desc">客户购买动机</div>
      <div class="col-percentage">
        提及占比
        <el-tooltip 
          content="该动机在所有购买动机中被提及的占比" 
          placement="top"
        >
          <el-icon class="tooltip-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <div class="col-reason">购买原因</div>
    </div>

    <!-- 数据行 -->
    <div class="motivation-rows">
      <div 
        v-for="item in displayData" 
        :key="item.desc"
        class="motivation-row"
      >
        <div class="col-desc">
          {{ isTranslated ? item.descCn : item.desc }}
        </div>
        <div class="col-percentage">
          <span class="percentage-text">
            {{ (item.percentage * 100).toFixed(1) }}%({{ item.count }})
          </span>
          <div class="progress-bar-bg">
            <div 
              class="progress-bar-fill motivation" 
              :style="{ width: (item.percentage * 100) + '%' }"
            ></div>
          </div>
        </div>
        <div class="col-reason">
          {{ isTranslated ? item.reasonCn : item.reason }}
        </div>
      </div>
    </div>

    <!-- 加载更多按钮 -->
    <div v-if="motivationData.length > 10" class="load-more-container">
      <button class="load-more-btn" @click="toggleExpand">
        <span>{{ isExpanded ? '收起' : '加载更多' }}</span>
        <span class="arrow" :class="{ expanded: isExpanded }">▼</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { QuestionFilled, ArrowDown } from '@element-plus/icons-vue';

const props = defineProps({
  motivationData: {
    type: Array,
    required: true
  },
  productName: {
    type: String,
    default: 'Product'
  }
});

const isTranslated = ref(false);
const isExpanded = ref(false);

const displayData = computed(() => {
  return isExpanded.value 
    ? props.motivationData 
    : props.motivationData.slice(0, 10);
});

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}

function handleTranslate() {
  isTranslated.value = !isTranslated.value;
}

function handleDownload(command) {
  if (command === 'csv') {
    exportToCSV();
  } else {
    exportToPNG();
  }
}

function exportToCSV() {
  const headers = ['客户购买动机', '占比', '数量', '购买原因'];
  
  const rows = [
    headers,
    ...props.motivationData.map(item => [
      isTranslated.value ? item.descCn : item.desc,
      item.percentage,
      item.count,
      isTranslated.value ? item.reasonCn : item.reason
    ])
  ];
  
  const csvContent = rows.map(row => 
    row.map(cell => {
      const str = String(cell);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(',')
  ).join('\n');
  
  const blob = new Blob(['\uFEFF' + csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `购买动机-${props.productName}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
}

async function exportToPNG() {
  const html2canvas = (await import('html2canvas')).default;
  const moduleElement = document.querySelector('.purchase-motivation-module');
  
  const canvas = await html2canvas(moduleElement, {
    backgroundColor: '#ffffff',
    scale: 2,
    logging: false
  });
  
  canvas.toBlob((blob) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `购买动机-${props.productName}-${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
  });
}
</script>
```

---

## 📱 响应式设计

```css
@media (max-width: 1200px) {
  .table-header,
  .motivation-row {
    grid-template-columns: 20% 25% 55%;
  }
}

@media (max-width: 768px) {
  .table-header,
  .motivation-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .col-percentage {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .progress-bar-bg {
    width: 100%;
    max-width: 200px;
  }
}
```

---

## 🎯 使用场景

### 产品优化
- 了解客户购买产品的核心原因
- 强化产品最受欢迎的特性
- 在Listing中突出客户最关心的卖点

### Listing优化
- 在标题和五点描述中强调TOP购买动机
- 用客户语言描述产品优势
- 针对性地创建A+内容

### 营销策略
- 制定精准的广告文案
- 选择合适的推广关键词
- 设计有针对性的促销活动

---

**文档维护人**: 即贸技术团队  
**组件路径**: `src/components/PurchaseMotivation.vue`

