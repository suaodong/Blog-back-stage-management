<!--  index.vue文件  -->
<template>
  <div class="article-container">
    <div class="card">
      <!-- 顶部工具栏 -->
      <div class="toolbar">
        <div class="toolbar-left">
          <el-select
            v-model="searchQuery.categoryId"
            placeholder="请选择分类筛选"
            clearable
            style="width: 200px"
            @change="handleSearch"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="toolbar-right">
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增文章</el-button>
        </div>
      </div>

      <!-- 文章列表表格 -->
      <el-table :data="articleList" style="width: 100%" v-loading="loading" >
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="categoryName" label="分类" width="120" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.categoryName">{{ row.categoryName }}</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" align="center">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="最近更新" width="180" align="center">
          <template #default="{ row }">
            {{ formatTime(row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确认删除该文章吗？" @confirm="handleDelete(row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 新增/编辑文章弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑文章' : '新增文章'"
      fullscreen
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="90px"
        class="article-form"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入文章标题" clearable />
        </el-form-item>

        <div class="form-row">
          <el-form-item label="首页封面">
            <el-upload
              class="cover-uploader"
              accept="image/*"
              :auto-upload="false"
              :show-file-list="false"
              :before-upload="beforeCoverUpload"
              :on-change="handleCoverChange"
              :on-remove="handleCoverRemove"
            >
              <img v-if="form.coverUrl" :src="form.coverUrl" class="cover-image" />
              <div v-else class="cover-placeholder">
                <el-icon class="icon">
                  <Plus />
                </el-icon>
                <span class="text">上传封面</span>
              </div>
            </el-upload>
          </el-form-item>
        </div>

        <el-form-item label="描述">
          <v-md-editor
            v-model="form.description"
            class="editor"
            height="300px"
            :disabled-menus="[]"
            @upload-image="handleEditorUploadImage"
          />
        </el-form-item>

        <el-form-item label="正文" prop="content">
          <v-md-editor
            v-model="form.content"
            class="editor"
            height="400px"
            :disabled-menus="[]"
            @upload-image="handleEditorUploadImage"
          />
        </el-form-item>

        <div class="form-row">
          <el-form-item label="分类" prop="categoryId" class="half">
            <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%">
              <el-option
                v-for="item in categoryOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="标签" prop="labelIds" class="half">
            <el-select
              v-model="form.labelIds"
              placeholder="请选择标签"
              style="width: 100%"
              multiple
              clearable
              collapse-tags
              collapse-tags-tooltip
            >
              <el-option
                v-for="item in labelOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
                <div class="label-option">
                  <span class="label-color" :style="{ backgroundColor: item.color }" />
                  <span class="label-text">{{ item.name }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules, type UploadFile, type UploadProps } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { 
  getArticleCategoryAndTag, 
  addArticle, 
  updateArticle, 
  getArticleList, 
  deleteArticle,
  type ArticleCategoryAndTag,
  type Article
} from './api'
import dayjs from 'dayjs'

type CategoryOption = {
  id: number
  name: string
}

type LabelOption = {
  id: number
  name: string
  color?: string
}

type ArticleForm = {
  id?: number
  title: string
  coverUrl: string
  description: string
  content: string
  categoryId: number | null
  labelIds: number[]
}

const formRef = ref<FormInstance>()
const coverFile = ref<File | null>(null)
const submitting = ref(false)
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)

// 列表数据
const articleList = ref<Article[]>([])
const totalCount = ref(0)
const searchQuery = ref({
  categoryId: undefined as number | undefined
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

const form = ref<ArticleForm>({
  title: '',
  coverUrl: '',
  description: '',
  content: '',
  categoryId: null,
  labelIds: []
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入正文内容', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  labelIds: [{ required: true, message: '请选择标签', trigger: 'change', type: 'array' }]
}

const categoryOptions = ref<CategoryOption[]>([])
const labelOptions = ref<LabelOption[]>([])

// 格式化时间
const formatTime = (time: string) => {
  if (!time) return '-'
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const handleSearch = () => {
  currentPage.value = 1
  fetchList()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  fetchList()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchList()
}

const handleCoverChange = (file: UploadFile) => {
  if (file.raw) {
    coverFile.value = file.raw
    // 如果是本地上传，生成 blob url
    if (form.value.coverUrl && form.value.coverUrl.startsWith('blob:')) {
      URL.revokeObjectURL(form.value.coverUrl)
    }
    form.value.coverUrl = URL.createObjectURL(file.raw)
  }
}

const handleCoverRemove = () => {
  form.value.coverUrl = ''
  coverFile.value = null
}

const beforeCoverUpload: UploadProps['beforeUpload'] = rawFile => {
  const isImage = rawFile.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
  }
  return isImage
}

const handleEditorUploadImage = (
  _: Event,
  insertImage: (info: { url: string; desc?: string }) => void,
  files: File[]
) => {
  const file = files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    ElMessage.error('只能插入图片文件')
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    const base64 = String(reader.result || '')
    if (!base64) return
    insertImage({
      url: base64,
      desc: file.name
    })
  }
  reader.readAsDataURL(file)
}

const resetForm = () => {
  if (form.value.coverUrl && form.value.coverUrl.startsWith('blob:')) {
    URL.revokeObjectURL(form.value.coverUrl)
  }
  coverFile.value = null
  if (formRef.value) {
    formRef.value.resetFields()
  }
  // 手动重置所有字段，因为 resetFields 可能只重置 prop 绑定的
  form.value = {
    title: '',
    coverUrl: '',
    description: '',
    content: '',
    categoryId: null,
    labelIds: []
  }
}

const fetchCategoryAndTag = async () => {
  try {
    const res = await getArticleCategoryAndTag()
    const data = (res.data || {}) as ArticleCategoryAndTag
    const categories = data.categories || []
    const tags = data.tags || []

    categoryOptions.value = categories.map(item => ({
      id: item.id,
      name: item.name
    }))

    labelOptions.value = tags.map(item => ({
      id: item.id,
      name: item.name,
      color: item.color
    }))
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取分类和标签失败')
  }
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getArticleList({
      page: currentPage.value,
      pageSize: pageSize.value,
      categoryId: searchQuery.value.categoryId
    })
    const payload = (res as any)?.data ?? (res as any) ?? {}
    const list = Array.isArray(payload.list) ? payload.list : []
    const total = Number(payload.total) || 0
    const page = Number(payload.page) || currentPage.value
    const size = Number(payload.pageSize) || pageSize.value

    articleList.value = list
    totalCount.value = total
    currentPage.value = page
    pageSize.value = size
  } catch (error) {
    ElMessage.error('获取文章列表失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row: Article) => {
  isEdit.value = true
  resetForm()
  
  // 回显数据
  form.value = {
    id: row.id,
    title: row.title,
    coverUrl: row.cover, // 后端返回的图片地址
    description: row.description,
    content: row.content,
    categoryId: row.categoryId,
    labelIds: row.labelIds || [] // 假设后端返回了 labelIds，如果没有可能需要处理
  }
  
  dialogVisible.value = true
}

const handleDelete = async (row: Article) => {
  try {
    await deleteArticle(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (!valid) return
    
    submitting.value = true
    try {
      const formData = new FormData()
      // 如果是编辑模式，添加 ID
      if (isEdit.value && form.value.id) {
        formData.append('id', String(form.value.id))
      }
      
      formData.append('title', form.value.title)
      formData.append('description', form.value.description)
      formData.append('content', form.value.content)
      if (form.value.categoryId) {
        formData.append('categoryId', String(form.value.categoryId))
      }
      
      form.value.labelIds.forEach(id => {
        formData.append('labelIds', String(id))
      })
      
      if (coverFile.value) {
        formData.append('cover', coverFile.value)
      } else if (isEdit.value && form.value.coverUrl) {
         // 编辑模式下，如果没修改封面，可能不需要传 cover 字段，或者传原 URL（视后端接口而定）
         // 通常 multipart/form-data 这里的 cover 期望是文件。如果不传，后端应保持原图。
      }

      const api = isEdit.value ? updateArticle : addArticle
      const res = await api(formData)
      
      if (res.code === 200) {
        ElMessage.success(isEdit.value ? '修改成功' : '保存成功')
        dialogVisible.value = false
        fetchList() // 刷新列表
      } else {
        ElMessage.error(res.message)
      }
    } catch (error) {
      ElMessage.error(error instanceof Error ? error.message : '保存失败')
    } finally {
      submitting.value = false
    }
  })
}

onMounted(() => {
  fetchCategoryAndTag()
  fetchList()
})
</script>

<style lang="scss" scoped>
.article-container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card {
  flex: 1;
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.pagination-wrapper {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.article-form {
  display: flex;
  flex-direction: column;
  padding: 0 20px;
}

.form-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.form-row .half {
  flex: 1;
}

.cover-uploader {
  width: 200px;
  height: 120px;
  display: block;
}

.cover-image {
  width: 200px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
}

.cover-placeholder {
  width: 200px;
  height: 120px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
}

.cover-placeholder .icon {
  margin-bottom: 4px;
}

.editor {
  width: 100%;
}

.label-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #e4e7ed;
}

.label-text {
  font-size: 13px;
}

:deep(.el-table) {
  flex: 1;
  overflow: auto;
}

@media (max-width: 768px) {
  .article-container {
    padding: 12px;
  }
  
  .form-row {
    flex-direction: column;
  }
  
  .toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
