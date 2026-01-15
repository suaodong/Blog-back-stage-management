<template>
  <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar-container">
    <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      :collapse="isCollapse"
      :collapse-transition="false"
      router
    >
      <sidebar-item
        v-for="route in routes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </el-aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SidebarItem from './SidebarItem.vue'

defineProps<{
  isCollapse: boolean
}>()

const route = useRoute()
const router = useRouter()

const routes = computed(() => router.options.routes)
const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})
</script>

<style scoped>
.sidebar-container {
  height: 100%;
  background-color: #304156;
  overflow: hidden;
  transition: width 0.3s;
  flex-shrink: 0;
}

.el-menu-vertical {
  border-right: none;
}

:deep(.el-menu) {
  border-right: none;
  height: 100%;
}

:deep(.el-menu--collapse .el-menu-item span),
:deep(.el-menu--collapse .el-sub-menu__title span) {
  display: none;
}
</style>
