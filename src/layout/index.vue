<template>
  <div class="app-wrapper">
    <Sidebar :is-collapse="isCollapse" />
    <div class="main-container">
      <div class="top-container">
        <Header :is-collapse="isCollapse" @toggle-click="toggleSideBar" />
        <TagsView />
      </div>
      <AppMain />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import TagsView from './components/TagsView/index.vue'
import AppMain from './components/AppMain.vue'

const isCollapse = ref(false)

const toggleSideBar = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style scoped>
.app-wrapper {
  display: flex;
  width: 100%;
  height: 100vh;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
  min-height: 0;
}

.top-container {
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  width: 100%;
}
</style>
