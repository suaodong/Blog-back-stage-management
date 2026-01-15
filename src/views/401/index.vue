<template>
  <div class="page">
    <div class="box">
      <div class="code">401</div>
      <div class="title">无权限访问</div>
      <div class="desc">当前账号没有访问该页面的权限。</div>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => router.push('/dashboard')
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f5f7fa;
}

.box {
  width: 520px;
  max-width: calc(100vw - 40px);
  padding: 32px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  text-align: center;
}

.code {
  font-size: 56px;
  font-weight: 800;
  color: #111827;
}

.title {
  margin-top: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.desc {
  margin: 10px 0 18px;
  font-size: 14px;
  color: #6b7280;
}
</style>

