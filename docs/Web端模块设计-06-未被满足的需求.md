# Web端模块设计 - 未被满足的需求

**模块名称**: 未被满足的需求  
**图标**: 📋  
**版本**: v1.0  
**最后更新**: 2025-10-21

---

## 📋 模块概述

### 功能说明
归类统计消费者购买后仍然未被满足的内容。

### 数据展示
- 初始显示TOP 10未满足需求
- 点击"加载更多"展开全部数据
- 数据占比总和=100%
- 只有一组数据（无正向/负向分组）

---

## 🎨 UI设计

### 整体布局

```
┌─────────────────────────────────────────────────────────────────┐
│  📋 未被满足的需求                      翻译  [下载▼]            │
│  归类统计消费者购买后仍然未被满足的内容                         │
├─────────────────────────────────────────────────────────────────┤
│  用户期望            提及占比 ⓘ                  期望原因        │
├─────────────────────────────────────────────────────────────────┤
│  Battery Life     24.2%(195) ▓▓▓▓▓▓▓▓░░  Customers have...     │
│  Durability       21.3%(172) ▓▓▓▓▓▓▓░░░  Customers have...     │
│  Comfort          12.7%(102) ▓▓▓▓░░░░░░  Customers have...     │
│  Sound Quality    12.3%(99)  ▓▓▓▓░░░░░░  Customers have...     │
│  Ease Of Use       9.1%(73)  ▓▓▓░░░░░░░  Customers have...     │
│  Noise Cancel..    6.7%(54)  ▓▓░░░░░░░░  Customers have...     │
│  Volume            6.6%(53)  ▓▓░░░░░░░░  Customers have...     │
│  Bluetooth Co..    3.7%(30)  ▓░░░░░░░░░  Some customers...     │
│  Price             3.2%(26)  ▓░░░░░░░░░  Customers have...     │
│  Design            3.2%(26)  ▓░░░░░░░░░  Customers have...     │
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
.unmet-needs-module {
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
.needs-row {
  display: grid;
  grid-template-columns: 15% 20% 65%;
  gap: 16px;
  padding: 12px 20px;
  border-bottom: 1px solid #F3F4F6;
  align-items: center;
  transition: background 0.2s;
}

.needs-row:hover {
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

/* 蓝色进度条 - 未满足需求专用 */
.progress-bar-fill.needs {
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

**文件名**: `未被满足的需求-{产品名称}-{日期}.csv`

**CSV内容示例**:

```csv
用户期望,占比,数量,期望原因
Battery Life,0.242,195,"Customers have appreciated the longer charging cord and wireless option, as well as the longer battery life compared to other headphones."
Durability,0.213,172,"Customers have suggested improving the product durability and providing cleaning instructions. Some are unsure if the manufacturing has improved."
Comfort,0.127,102,"Customers have suggested making the controller slightly smaller and adding more padding to the earcups for improved comfort over time. Some have also suggested larger ear cups for a better fit."
Sound Quality,0.123,99,"Customers have noted higher quality sound compared to other headphones, but some have suggested that the FM sound quality could be better."
Ease Of Use,0.091,73,"Customers have appreciated the auto shut off feature and wish for no annoying beep. Some have also noted that the headphones could be easier to use."
Noise Cancellation,0.067,54,"Customers have appreciated the noise cancelling feature and wish for less noise leakage and sound bleed."
Volume,0.066,53,"Customers have appreciated the integrated volume control and wish for volume control improvement and louder volume capability."
Bluetooth Connectivity,0.037,30,"Some customers have suggested adding a dedicated pairing button and improving the Bluetooth functionality, while others have appreciated the plug-in option for non-Bluetooth devices."
Price,0.032,26,"Customers have noted that these headphones offer better quality and value for the price, with some noting that they are studio quality headphones."
Design,0.032,26,"Customers have appreciated the lack of chemical odor and the wish for more ergonomic controls. Some have also noted that the control could be less bulky."
```

**字段说明**:
- `用户期望`: 期望描述（英文原文，翻译后显示中文）
- `占比`: 0-1之间的小数（如0.242表示24.2%）
- `数量`: 该需求在评论中被提及的次数
- `期望原因`: 详细解释用户希望改进的内容

**导出实现**:

```javascript
function exportToCSV() {
  const headers = ['用户期望', '占比', '数量', '期望原因'];
  
  const rows = [
    headers,
    ...needsData.map(item => [
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
  link.download = `未被满足的需求-${productName}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
}
```

### PNG导出功能

```javascript
import html2canvas from 'html2canvas';

async function exportToPNG() {
  const moduleElement = document.querySelector('.unmet-needs-module');
  
  const canvas = await html2canvas(moduleElement, {
    backgroundColor: '#ffffff',
    scale: 2, // 高清输出
    logging: false
  });
  
  canvas.toBlob((blob) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `未被满足的需求-${productName}-${new Date().toISOString().slice(0, 10)}.png`;
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
    ? needsData.value 
    : needsData.value.slice(0, 10);
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
  content="该需求在所有未满足需求中被提及的占比" 
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
  "unmetNeeds": [
    {
      "desc": "Battery Life",
      "descCn": "电池续航",
      "percentage": 0.242,
      "count": 195,
      "reason": "Customers have appreciated the longer charging cord and wireless option, as well as the longer battery life compared to other headphones.",
      "reasonCn": "客户欣赏更长的充电线和无线选项，以及相比其他耳机更长的电池续航时间。"
    },
    {
      "desc": "Durability",
      "descCn": "耐用性",
      "percentage": 0.213,
      "count": 172,
      "reason": "Customers have suggested improving the product durability and providing cleaning instructions. Some are unsure if the manufacturing has improved.",
      "reasonCn": "客户建议提高产品耐用性并提供清洁说明。有些客户不确定制造工艺是否已改进。"
    },
    {
      "desc": "Comfort",
      "descCn": "舒适度",
      "percentage": 0.127,
      "count": 102,
      "reason": "Customers have suggested making the controller slightly smaller and adding more padding to the earcups for improved comfort over time. Some have also suggested larger ear cups for a better fit.",
      "reasonCn": "客户建议将控制器做得稍微小一点，并在耳罩上增加更多填充物以提高长时间佩戴的舒适度。有些客户还建议使用更大的耳罩以获得更好的贴合感。"
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
  <div class="unmet-needs-module">
    <!-- 标题栏 -->
    <div class="module-header">
      <div class="header-left">
        <span class="module-icon">📋</span>
        <h3 class="module-title">未被满足的需求</h3>
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
      归类统计消费者购买后仍然未被满足的内容
    </div>

    <!-- 表格列头 -->
    <div class="table-header">
      <div class="col-desc">用户期望</div>
      <div class="col-percentage">
        提及占比
        <el-tooltip 
          content="该需求在所有未满足需求中被提及的占比" 
          placement="top"
        >
          <el-icon class="tooltip-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <div class="col-reason">期望原因</div>
    </div>

    <!-- 数据行 -->
    <div class="needs-rows">
      <div 
        v-for="item in displayData" 
        :key="item.desc"
        class="needs-row"
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
              class="progress-bar-fill needs" 
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
    <div v-if="needsData.length > 10" class="load-more-container">
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
  needsData: {
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
    ? props.needsData 
    : props.needsData.slice(0, 10);
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
  const headers = ['用户期望', '占比', '数量', '期望原因'];
  
  const rows = [
    headers,
    ...props.needsData.map(item => [
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
  link.download = `未被满足的需求-${props.productName}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
}

async function exportToPNG() {
  const html2canvas = (await import('html2canvas')).default;
  const moduleElement = document.querySelector('.unmet-needs-module');
  
  const canvas = await html2canvas(moduleElement, {
    backgroundColor: '#ffffff',
    scale: 2,
    logging: false
  });
  
  canvas.toBlob((blob) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `未被满足的需求-${props.productName}-${new Date().toISOString().slice(0, 10)}.png`;
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
  .needs-row {
    grid-template-columns: 20% 25% 55%;
  }
}

@media (max-width: 768px) {
  .table-header,
  .needs-row {
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

### 产品改进
- 识别产品的主要缺陷和改进点
- 优先级排序：根据提及占比确定优先改进的方向
- 制定产品迭代路线图

### 竞品差异化
- 对比竞品的未满足需求
- 找到市场空白点
- 开发具有竞争优势的新功能

### 营销策略
- 在广告中强调已解决的痛点
- 针对性地回应客户关注的问题
- 提升品牌信任度和产品满意度

### Listing优化
- 在产品描述中主动说明改进措施
- 通过Q&A解答常见疑虑
- 在A+内容中展示产品升级

---

## 💡 数据解读建议

### 高占比需求（>15%）
- **紧急优先级**：需要立即关注和改进
- **影响范围大**：可能影响大量客户的满意度
- **建议行动**：快速迭代，发布新版本

### 中等占比需求（5-15%）
- **重要但不紧急**：可纳入中期产品规划
- **细分市场需求**：可能针对特定用户群体
- **建议行动**：深入调研，评估改进成本

### 低占比需求（<5%）
- **个性化需求**：小众或特定场景
- **长期规划**：可作为差异化功能储备
- **建议行动**：持续监测，评估市场潜力

---

**文档维护人**: 即贸技术团队  
**组件路径**: `src/components/UnmetNeeds.vue`

