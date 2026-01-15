<!--  index.vue文件  -->
<template>
    <div class="label-container">
        <div class="card">
            <div class="toolbar">
                <el-button type="primary" @click="openAdd">新增</el-button>
                <el-button @click="refresh">刷新</el-button>
            </div>

            <el-table :data="pagedTags" border stripe class="tag-table" size="small">
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="name" label="标签名称" min-width="160" />
                <el-table-column label="颜色" min-width="220">
                    <template #default="{ row }">
                        <div class="color-cell">
                            <span class="color-dot"
                                :style="{ backgroundColor: getColorMeta(row.color)?.color || '#dcdfe6' }" />
                            <span class="color-text">
                                {{ getColorMeta(row.color)?.enName }} / {{ getColorMeta(row.color)?.zhName }}
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
                        <el-popconfirm title="确认删除该标签？" confirm-button-text="删除" cancel-button-text="取消"
                            @confirm="handleDelete(row)">
                            <template #reference>
                                <el-button type="danger" link size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination-wrapper">
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                    :page-sizes="[5, 10, 20, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                    background />
            </div>
        </div>

        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
            <el-form label-width="90px">
                <el-form-item label="标签名称">
                    <el-input v-model="form.tags_name" placeholder="请输入标签名称" />
                </el-form-item>
                <el-form-item label="标签颜色">
                    <el-select v-model="form.colour" placeholder="请选择颜色" style="width: 100%">
                        <el-option v-for="item in colorOptions" :key="item.value"
                            :label="`${item.enName} / ${item.zhName}`" :value="item.value">
                            <div class="color-option">
                                <span class="color-dot" :style="{ backgroundColor: item.color }" />
                                <span class="color-text">{{ item.enName }} / {{ item.zhName }}</span>
                            </div>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmDialog">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { listlabel, addlabel, updatelabel, deletelabel, type labelItem } from './api'

type Tag = {
    id: number
    name: string
    color: string
}

type ColorOption = {
    value: string
    enName: string
    zhName: string
    color: string
}

const colorOptions: ColorOption[] = [
    { value: 'blue', enName: 'Blue', zhName: '蓝色', color: '#409EFF' },
    { value: 'green', enName: 'Green', zhName: '绿色', color: '#67C23A' },
    { value: 'red', enName: 'Red', zhName: '红色', color: '#F56C6C' },
    { value: 'orange', enName: 'Orange', zhName: '橙色', color: '#E6A23C' },
    { value: 'purple', enName: 'Purple', zhName: '紫色', color: '#909399' },
    { value: 'yellow', enName: 'Yellow', zhName: '黄色', color: '#FADB14' },
    { value: 'cyan', enName: 'Cyan', zhName: '青色', color: '#13C2C2' },
    { value: 'teal', enName: 'Teal', zhName: '水鸭色', color: '#20C997' },
    { value: 'pink', enName: 'Pink', zhName: '粉色', color: '#EB2F96' },
    { value: 'brown', enName: 'Brown', zhName: '棕色', color: '#8B4513' },
    { value: 'black', enName: 'Black', zhName: '黑色', color: '#000000' },
    { value: 'white', enName: 'White', zhName: '白色', color: '#FFFFFF' },
    { value: 'gray', enName: 'Gray', zhName: '灰色', color: '#909399' },
    { value: 'indigo', enName: 'Indigo', zhName: '靛蓝', color: '#3F51B5' },
    { value: 'violet', enName: 'Violet', zhName: '紫罗兰', color: '#8A2BE2' },
    { value: 'lime', enName: 'Lime', zhName: '柠檬绿', color: '#A0D911' },
    { value: 'magenta', enName: 'Magenta', zhName: '洋红', color: '#C2185B' }
]

const getColorMeta = (value: string) => {
    return colorOptions.find(item => item.value === value)
}

const nameInput = ref('')
const tags = ref<Tag[]>([])
const loading = ref(false)

const currentPage = ref(1)
const pageSize = ref(10)

const total = computed(() => tags.value.length)

const pagedTags = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tags.value.slice(start, end)
})

const mapLabelItemToTag = (item: labelItem): Tag => {
  return {
    id: item.id,
    name: item.label_name,
    color: item.color
  }
}

const fetchLabelList = async () => {
  loading.value = true
  try {
    const res = await listlabel()
    const list = res.data || []
    tags.value = list.map(mapLabelItemToTag)
    currentPage.value = 1
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取标签列表失败')
  } finally {
    loading.value = false
  }
}

const refresh = () => {
    fetchLabelList()
};

onMounted(() => {
  fetchLabelList()
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const dialogTitle = computed(() => (dialogMode.value === 'add' ? '新增标签' : '编辑标签'))

const form = ref({
    id: null as number | null,
    tags_name: '',
    colour: ''
})

const resetForm = () => {
    form.value = {
        id: null,
        tags_name: '',
        colour: ''
    }
}

const openAdd = () => {
    dialogMode.value = 'add'
    resetForm()
    if (nameInput.value.trim()) {
        form.value.tags_name = nameInput.value.trim()
    }
    dialogVisible.value = true
}

const openEdit = (row: Tag) => {
    dialogMode.value = 'edit'
    form.value.id = row.id
    form.value.tags_name = row.name
    form.value.colour = row.color
    dialogVisible.value = true
}

const confirmDialog = () => {
  const name = form.value.tags_name.trim()
  const color = form.value.colour

  if (!name) {
        ElMessage.warning('请输入标签名称')
        return
    }
    if (!color) {
        ElMessage.warning('请选择颜色')
        return
    }

  if (dialogMode.value === 'add') {
    const exists = tags.value.some(item => item.name === name)
    if (exists) {
      ElMessage.warning('标签名称已存在')
      return
    }
    addlabel(name, color)
      .then(res => {
        const saved = res.data
        const newTag = mapLabelItemToTag(saved)
        tags.value.unshift(newTag)
        ElMessage.success('新增标签成功')
        dialogVisible.value = false
      })
      .catch(error => {
        ElMessage.error(error instanceof Error ? error.message : '新增标签失败')
      })
    return
  }

  if (form.value.id == null) {
    dialogVisible.value = false
    return
  }

  const exists = tags.value.some(item => item.name === name && item.id !== form.value.id)
  if (exists) {
    ElMessage.warning('标签名称已存在')
    return
  }
  updatelabel(form.value.id, name, color)
    .then(() => {
      const target = tags.value.find(item => item.id === form.value.id)
      if (target) {
        target.name = name
        target.color = color
      }
      ElMessage.success('编辑标签成功')
      dialogVisible.value = false
    })
    .catch(error => {
      ElMessage.error(error instanceof Error ? error.message : '编辑标签失败')
    })

    dialogVisible.value = false
}

const handleDelete = (row: Tag) => {
  deletelabel(row.id)
    .then(() => {
      tags.value = tags.value.filter(item => item.id !== row.id)
      const maxPage = Math.max(1, Math.ceil(tags.value.length / pageSize.value) || 1)
      if (currentPage.value > maxPage) {
        currentPage.value = maxPage
      }
      ElMessage.success('删除标签成功')
    })
    .catch(error => {
      ElMessage.error(error instanceof Error ? error.message : '删除标签失败')
    })
}
</script>

<style lang="scss" scoped>
.label-container {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    overflow: auto;
}

.card {
    height: 100%;
    width: 100%;
    background: #ffffff;
    border-radius: 8px;
    padding: 16px 16px 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}

.card-title {
    font-size: 16px;
    font-weight: 600;
}

.toolbar {
    margin-bottom: 12px;
}

.toolbar-form {
    display: flex;
    flex-wrap: wrap;
    row-gap: 8px;
}

.tag-table {
    flex: 1;
    width: 100%;
}

.pagination-wrapper {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
}

.color-cell {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.color-option {
    display: flex;
    align-items: center;
    gap: 8px;
}

.color-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid #e4e7ed;
    box-sizing: border-box;
}

.color-text {
    font-size: 13px;
}

@media (max-width: 768px) {
    .label-container {
        padding: 12px;
    }

    .card {
        padding: 12px;
    }

    .toolbar-form {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
