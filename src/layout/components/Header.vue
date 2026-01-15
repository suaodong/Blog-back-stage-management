<template>
  <div class="header-container">
    <div class="left">
      <el-icon class="trigger" @click="emit('toggle-click')">
        <component :is="isCollapse ? 'Expand' : 'Fold'" />
      </el-icon>
      <h3>Admin System</h3>
    </div>
    <div class="right">
      <el-avatar :size="28" :src="avatarUrl" class="avatar" />
      <el-dropdown>
        <span class="user-entry">
          <span class="user-name">{{ displayName }}</span>
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { ElMessage } from 'element-plus'

defineProps<{
  isCollapse: boolean
}>()

const emit = defineEmits(['toggle-click'])

const router = useRouter()
const userStore = useUserStore()

const avatarUrl = computed(() => userStore.avatar)
const displayName = computed(() => userStore.name || 'Admin')

const handleLogout = async () => {
  await userStore.logout()
  router.replace('/login')
  ElMessage.success('已退出登录')
}
</script>

<style scoped>
.header-container {
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  box-sizing: border-box;
}

.left {
  display: flex;
  align-items: center;
  min-width: 0;
}

.right {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
}

.avatar {
  margin-right: 10px;
}

.trigger {
  font-size: 20px;
  cursor: pointer;
  margin-right: 15px;
}

.left h3 {
  margin: 0;
  white-space: nowrap;
}

.user-entry {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 10px;
  border-radius: 10px;
  color: #111827;
  transition: background-color 0.15s ease;
  user-select: none;
}

.user-entry:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.user-name {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
