<template>
  <section class="app-main">
    <div id="subapp-container" class="subapp-container" v-show="isSubReactRoute" />
    <div v-show="!isSubReactRoute">
      <router-view v-slot="{ Component }">
        <transition name="fade-transform" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isSubReactRoute = computed(() => route.path.startsWith('/sub-react'))
console.log('\x1b[32m%s\x1b[0m', 20, isSubReactRoute.value);
</script>

<style scoped>
.app-main {
  flex: 1;
  min-height: 0;
  width: 100%;
  position: relative;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f0f2f5;
}

.subapp-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
