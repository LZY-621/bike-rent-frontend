<template>
  <div class="page-container">
    <el-card>
      <div class="search-bar">
        <el-input v-model="query.userId" placeholder="用户ID" clearable style="width: 120px" @keyup.enter="loadData" />
        <el-input v-model="query.bikeId" placeholder="自行车ID" clearable style="width: 120px" @keyup.enter="loadData" />
        <el-select v-model="query.status" placeholder="订单状态" clearable style="width: 140px">
          <el-option label="租赁中" :value="1" />
          <el-option label="已归还" :value="2" />
        </el-select>
        <el-button type="primary" @click="loadData">查询</el-button>
      </div>

      <el-table :data="tableData" border stripe v-loading="loading">
        <el-table-column prop="id" label="订单ID" width="90" />
        <el-table-column prop="userId" label="用户ID" width="90" />
        <el-table-column prop="bikeId" label="自行车ID" width="100" />
        <el-table-column prop="rentTime" label="租车时间" width="180" />
        <el-table-column prop="returnTime" label="还车时间" width="180" />
        <el-table-column label="费用" width="100">
          <template #default="{ row }">¥{{ Number(row.cost || 0).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'warning' : 'success'">
              {{ row.status === 1 ? '租赁中' : '已归还' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 1" size="small" type="success" @click="handleReturn(row)">还车</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-bar">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="total"
          :current-page="query.pageNum"
          :page-size="query.pageSize"
          @current-change="p => { query.pageNum = p; loadData() }" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { pageOrder, returnBike, deleteOrder } from '@/api/rentOrder'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const query = reactive({ pageNum: 1, pageSize: 10, userId: '', bikeId: '', status: '' })

async function loadData() {
  loading.value = true
  try {
    const params = { pageNum: query.pageNum, pageSize: query.pageSize }
    if (query.userId) params.userId = query.userId
    if (query.bikeId) params.bikeId = query.bikeId
    if (query.status !== '' && query.status != null) params.status = query.status
    const res = await pageOrder(params)
    tableData.value = res.data.records
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

async function handleReturn(row) {
  await ElMessageBox.confirm(`确定归还该自行车吗？将自动结算费用。`, '提示', { type: 'info' })
  const res = await returnBike(row.id)
  ElMessage.success(`还车成功，费用 ¥${res.data.cost}`)
  loadData()
}

async function handleDelete(row) {
  await ElMessageBox.confirm(`确定删除订单 #${row.id} 吗？`, '提示', { type: 'warning' })
  await deleteOrder(row.id)
  ElMessage.success('删除成功')
  loadData()
}

onMounted(loadData)
</script>
