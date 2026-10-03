<template>
  <div class="page-container">
    <el-card>
      <div class="search-bar">
        <el-button type="primary" @click="loadData">刷新</el-button>
      </div>

      <el-table :data="tableData" border stripe v-loading="loading">
        <el-table-column prop="id" label="订单ID" width="90" />
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
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { pageOrder, returnBike } from '@/api/rentOrder'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const loading = ref(false)
const tableData = ref([])

async function loadData() {
  loading.value = true
  try {
    const res = await pageOrder({ pageNum: 1, pageSize: 50, userId: userStore.userId })
    tableData.value = res.data.records
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

onMounted(loadData)
</script>
