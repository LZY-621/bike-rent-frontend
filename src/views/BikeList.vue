<template>
  <div class="page-container">
    <el-card>
      <div class="search-bar">
        <el-input v-model="keyword" placeholder="搜索编号/位置" clearable style="width: 240px" @keyup.enter="loadData" />
        <el-button type="primary" @click="loadData">查询</el-button>
        <el-button type="success" @click="openAdd">新增自行车</el-button>
      </div>

      <el-table :data="tableData" border stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="bikeNo" label="自行车编号" />
        <el-table-column prop="location" label="所在位置" />
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '可用' : '已租出' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 1" size="small" type="success" @click="handleRent(row)">租车</el-button>
            <el-button size="small" type="primary" @click="openEdit(row)">编辑</el-button>
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑自行车' : '新增自行车'" width="480px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="自行车编号" prop="bikeNo">
          <el-input v-model="form.bikeNo" />
        </el-form-item>
        <el-form-item label="所在位置" prop="location">
          <el-input v-model="form.location" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="可用" :value="1" />
            <el-option label="不可用" :value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { pageBike, addBike, updateBike, deleteBike } from '@/api/bike'
import { rentBike } from '@/api/rentOrder'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const keyword = ref('')
const query = reactive({ pageNum: 1, pageSize: 10 })

async function loadData() {
  loading.value = true
  try {
    const res = await pageBike({ ...query, keyword: keyword.value })
    tableData.value = res.data.records
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()
const form = reactive({ id: null, bikeNo: '', location: '', status: 1 })
const rules = {
  bikeNo: [{ required: true, message: '请输入编号', trigger: 'blur' }]
}

function openAdd() {
  isEdit.value = false
  Object.assign(form, { id: null, bikeNo: '', location: '', status: 1 })
  dialogVisible.value = true
}
function openEdit(row) {
  isEdit.value = true
  Object.assign(form, row)
  dialogVisible.value = true
}
async function submitForm() {
  await formRef.value.validate()
  if (isEdit.value) {
    await updateBike(form.id, form)
    ElMessage.success('修改成功')
  } else {
    await addBike(form)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  loadData()
}

async function handleDelete(row) {
  await ElMessageBox.confirm(`确定删除自行车「${row.bikeNo}」吗？`, '提示', { type: 'warning' })
  await deleteBike(row.id)
  ElMessage.success('删除成功')
  loadData()
}

async function handleRent(row) {
  await ElMessageBox.confirm(`确定租赁自行车「${row.bikeNo}」吗？`, '租车确认', { type: 'info' })
  const res = await rentBike({ userId: Number(userStore.userId), bikeId: row.id })
  ElMessage.success(`租车成功！订单 #${res.data.id}`)
  loadData()
}

onMounted(loadData)
</script>
