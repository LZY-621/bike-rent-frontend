<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="40" color="#409EFF"><User /></el-icon>
            <div>
              <div class="stat-num">{{ stats.userCount }}</div>
              <div class="stat-label">用户总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="40" color="#67C23A"><Bicycle /></el-icon>
            <div>
              <div class="stat-num">{{ stats.bikeIdle }}/{{ stats.bikeTotal }}</div>
              <div class="stat-label">空闲/单车总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="40" color="#E6A23C"><List /></el-icon>
            <div>
              <div class="stat-num">{{ stats.orderTotal }}</div>
              <div class="stat-label">订单总数（进行中 {{ stats.orderActive }}）</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="40" color="#F56C6C"><Money /></el-icon>
            <div>
              <div class="stat-num">¥{{ stats.totalCost }}</div>
              <div class="stat-label">累计营收</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <!-- 饼图：单车状态分布 -->
      <el-col :span="10">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">单车状态分布</div>
          </template>
          <div ref="pieChartRef" class="chart-box"></div>
        </el-card>
      </el-col>
      <!-- 柱状图：按月订单 -->
      <el-col :span="14">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">月度订单统计</div>
          </template>
          <div ref="barChartRef" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'
import request from '@/api/request'

const stats = ref({
  userCount: 0, bikeIdle: 0, bikeRented: 0, bikeTotal: 0,
  orderTotal: 0, orderActive: 0, totalCost: '0.00',
  monthlyOrders: [], monthlyRevenue: []
})

const pieChartRef = ref(null)
const barChartRef = ref(null)
let pieChart = null
let barChart = null

async function loadStats() {
  try {
    const res = await request.get('/dashboard/stats')
    Object.assign(stats.value, res.data)
    // 等 DOM 更新后渲染图表
    renderPie()
    renderBar()
  } catch (e) {
    console.error('加载统计数据失败', e)
  }
}

function renderPie() {
  if (!pieChartRef.value) return
  pieChart = pieChart || echarts.init(pieChartRef.value)
  const opt = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: '0%' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}\n{c}辆' },
      data: [
        { value: stats.value.bikeIdle, name: '空闲', itemStyle: { color: '#67C23A' } },
        { value: stats.value.bikeRented, name: '已借出', itemStyle: { color: '#E6A23C' } }
      ]
    }]
  }
  pieChart.setOption(opt)
}

function renderBar() {
  if (!barChartRef.value) return
  barChart = barChart || echarts.init(barChartRef.value)
  const months = stats.value.monthlyOrders.map(it => it.month)
  const counts = stats.value.monthlyOrders.map(it => it.count)
  const revenues = stats.value.monthlyRevenue.map(it => Number(it.amount))

  const opt = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: { top: '0%' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: [
      { type: 'value', name: '订单数', position: 'left' },
      { type: 'value', name: '营收(元)', position: 'right' }
    ],
    series: [
      { name: '订单数', type: 'bar', data: counts, itemStyle: { color: '#409EFF' }, barWidth: '40%' },
      { name: '营收', type: 'bar', yAxisIndex: 1, data: revenues, itemStyle: { color: '#F56C6C' }, barWidth: '40%' }
    ]
  }
  barChart.setOption(opt)
}

function handleResize() {
  pieChart?.resize()
  barChart?.resize()
}

onMounted(() => {
  loadStats()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  pieChart?.dispose()
  barChart?.dispose()
})
</script>

<style scoped>
.stat-card {
  border-radius: 8px;
}
.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}
.stat-num {
  font-size: 26px;
  font-weight: bold;
  color: #303133;
}
.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}
.card-header {
  font-size: 15px;
  font-weight: bold;
}
.chart-box {
  width: 100%;
  height: 320px;
}
</style>
