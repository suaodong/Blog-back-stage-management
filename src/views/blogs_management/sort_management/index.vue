<!--  index.vue文件  -->
<template>
    <div class="sort-container">
        <div class="card">
            <div class="card-header">
                <div class="card-title">分类管理</div>
            </div>
            <div class="toolbar">
                <el-form :inline="true" class="toolbar-form">
                    <el-form-item label="分类名称">
                        <el-input v-model="nameInput" placeholder="请输入分类名称" clearable />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleAdd">新增</el-button>
                        <el-button @click="refresh">刷新</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table :data="pagedCategories" :loading="loading" border stripe class="category-table" size="small">
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="name" label="分类名称" min-width="160" />
                <el-table-column prop="createTime" label="创建时间" min-width="180" />
                <el-table-column label="操作" width="160" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
                        <el-popconfirm title="确认删除该分类？" confirm-button-text="删除" cancel-button-text="取消"
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

        <el-dialog v-model="dialogVisible" title="编辑分类" width="360px">
            <el-form>
                <el-form-item label="分类名称">
                    <el-input v-model="editName" placeholder="请输入分类名称" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmEdit">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { addSort, updateSort, deleteSort, listSort, type SortItem } from './api'

type Category = {
    id: number
    name: string
    createTime: string
}

const nameInput = ref('')
const categories = ref<Category[]>([])
const loading = ref(false)

const currentPage = ref(1)
const pageSize = ref(10)

const total = computed(() => categories.value.length)

const pagedCategories = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return categories.value.slice(start, end)
})

const fetchSortList = async () => {
    loading.value = true
    try {
        const res = await listSort()
        const list = res.data || []
        categories.value = list.map(item => mapSortItemToCategory(item, item.sort_name))
        currentPage.value = 1
    } catch (error) {
        ElMessage.error(error instanceof Error ? error.message : '获取分类列表失败')
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchSortList()
})

const dialogVisible = ref(false)
const editName = ref('')
const editingId = ref<number | null>(null)

const formatTime = (value: string | Date) => {
    return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}

const mapSortItemToCategory = (item: SortItem, fallbackName: string): Category => {
    const name = item.sort_name || fallbackName
    const origin = item.create_time && item.create_time.trim().length > 0 ? item.create_time : new Date()
    const createTime = formatTime(origin)
    return {
        id: item.id,
        name,
        createTime
    }
}

const resetForm = () => {
    nameInput.value = ''
}
const refresh = () => {
    fetchSortList()
};

const handleAdd = async () => {
    const name = nameInput.value.trim()
    if (!name) {
        ElMessage.warning('请输入分类名称')
        return
    }

    const exists = categories.value.some(item => item.name === name)
    if (exists) {
        ElMessage.warning('分类名称已存在')
        return
    }

    try {
        const res = await addSort(name)
        const payload = res.data
        const newCategory: Category = mapSortItemToCategory(payload, name)
        categories.value.unshift(newCategory)
        ElMessage.success('新增分类成功')
        resetForm()
        currentPage.value = 1
    } catch (error) {
        ElMessage.error(error instanceof Error ? error.message : '新增分类失败')
    }
}

const openEdit = (row: Category) => {
    editingId.value = row.id
    editName.value = row.name
    dialogVisible.value = true
}

const confirmEdit = async () => {
    if (editingId.value == null) {
        dialogVisible.value = false
        return
    }
    const name = editName.value.trim()
    if (!name) {
        ElMessage.warning('请输入分类名称')
        return
    }
    const exists = categories.value.some(item => item.name === name && item.id !== editingId.value)
    if (exists) {
        ElMessage.warning('分类名称已存在')
        return
    }
    try {
        await updateSort(editingId.value, name)
        const target = categories.value.find(item => item.id === editingId.value)
        if (target) {
            target.name = name
        }
        ElMessage.success('编辑分类成功')
        dialogVisible.value = false
    } catch (error) {
        ElMessage.error(error instanceof Error ? error.message : '编辑分类失败')
    }
}

const handleDelete = async (row: Category) => {
    try {
        await deleteSort(row.id)
        categories.value = categories.value.filter(item => item.id !== row.id)

        const maxPage = Math.max(1, Math.ceil(categories.value.length / pageSize.value) || 1)
        if (currentPage.value > maxPage) {
            currentPage.value = maxPage
        }
        ElMessage.success('删除分类成功')
    } catch (error) {
        ElMessage.error(error instanceof Error ? error.message : '删除分类失败')
    }
}
</script>

<style lang="scss" scoped>
.sort-container {
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

.category-table {
    flex: 1;
    width: 100%;
}

.pagination-wrapper {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
}

@media (max-width: 768px) {
    .sort-container {
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
