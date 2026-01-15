<template>
  <div class="tags-view-container">
    <div class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :to="{ path: tag.path, query: tag.query }"
        class="tags-view-item"
        :class="{ active: isActive(tag) }"
        @click.middle="closeSelectedTag(tag)"
      >
        {{ tag.title }}
        <span
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <el-icon><Close /></el-icon>
        </span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter, type RouteLocationNormalizedLoaded, type RouteMeta } from 'vue-router'

type TagView = {
  fullPath: string
  path: string
  query?: RouteLocationNormalizedLoaded['query']
  name?: RouteLocationNormalizedLoaded['name']
  meta: RouteMeta
  title: string
}

const visitedViews = ref<TagView[]>([])
const route = useRoute()
const router = useRouter()

const isActive = (tag: TagView) => {
  return tag.path === route.path
}

const isAffix = (tag: TagView) => {
  return Boolean(tag.meta?.affix)
}

const addTag = (r: RouteLocationNormalizedLoaded) => {
  const title = r.meta?.title ? String(r.meta.title) : ''
  if (!title) return

  const existing = visitedViews.value.find(v => v.path === r.path)
  const nextTag: TagView = {
    fullPath: r.fullPath,
    path: r.path,
    query: r.query,
    name: r.name,
    meta: r.meta,
    title
  }

  if (existing) {
    existing.fullPath = nextTag.fullPath
    existing.query = nextTag.query
    existing.meta = nextTag.meta
    existing.title = nextTag.title
    return
  }

  visitedViews.value.push(nextTag)
}

const initAffixTags = () => {
  const affixRoutes = router.getRoutes().filter(r => Boolean(r.meta?.affix) && Boolean(r.meta?.title))
  affixRoutes.forEach(r => {
    const tag: TagView = {
      fullPath: r.path,
      path: r.path,
      meta: r.meta,
      name: r.name,
      title: String(r.meta.title)
    }
    if (!visitedViews.value.some(v => v.path === tag.path)) {
      visitedViews.value.push(tag)
    }
  })
}

const closeSelectedTag = (view: TagView) => {
  if (isAffix(view)) return
  const index = visitedViews.value.findIndex(v => v.path === view.path)
  if (index > -1) {
    visitedViews.value.splice(index, 1)
  }
  if (isActive(view)) {
    toLastView(visitedViews.value)
  }
}

const toLastView = (visitedViews: TagView[]) => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push({ path: latestView.path, query: latestView.query })
  } else {
    router.push('/dashboard')
  }
}

watch(() => route.path, () => {
  addTag(route)
})

onMounted(() => {
  initAffixTags()
  addTag(route)
})
</script>

<style scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
}

.tags-view-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
  overflow-x: auto;
  padding: 4px 10px;
  box-sizing: border-box;
}

.tags-view-item {
  display: inline-flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  height: 24px;
  line-height: 24px;
  border: 1px solid #d8dce5;
  color: #495060;
  background: #fff;
  padding: 0 8px;
  font-size: 12px;
  margin-left: 5px;
  text-decoration: none;
}

.tags-view-item:first-of-type {
  margin-left: 0;
}

.tags-view-item.active {
  background-color: #42b983;
  color: #fff;
  border-color: #42b983;
}

.tags-view-item.active::before {
  content: '';
  background: #fff;
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: relative;
  margin-right: 2px;
}

.el-icon-close {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transform-origin: 100% 50%;
  margin-left: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-icon-close:hover {
  background-color: #b4bccc;
  color: #fff;
}
</style>
