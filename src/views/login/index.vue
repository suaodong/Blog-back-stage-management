<template>
  <div class="login">
    <div class="bg" />
    <div class="content">
      <div class="brand">
        <div class="logo">A</div>
        <div class="title">Admin System</div>
        <div class="subtitle">Sign in to continue</div>
      </div>

      <div class="card">
        <div class="card-title">登录</div>
        <el-form ref="formRef" :model="form" :rules="rules" class="form" @keyup.enter="onSubmit">
          <el-form-item prop="username">
            <el-input v-model="form.username" size="large" placeholder="用户名" clearable />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              size="large"
              type="password"
              placeholder="密码"
              show-password
              clearable
            />
          </el-form-item>
          <el-button class="submit" type="primary" size="large" :loading="loading" @click="onSubmit">
            登录
          </el-button>
          <div class="tip">默认密码：123456（任意用户名）</div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  username: 'admin',
  password: '123456'
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const onSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async valid => {
    if (!valid) return
    loading.value = true
    try {
      await userStore.login(form.username, form.password)
      await userStore.fetchUserInfo()
      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
      router.replace(redirect)
      ElMessage.success('登录成功')
    } catch (e) {
      ElMessage.error(e instanceof Error ? e.message : '登录失败')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.login {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(1200px 600px at 10% 10%, rgba(64, 158, 255, 0.35), transparent 60%),
    radial-gradient(900px 500px at 90% 30%, rgba(66, 185, 131, 0.28), transparent 55%),
    linear-gradient(180deg, #0b1220 0%, #0a1020 100%);
}

.content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 440px;
  gap: 48px;
  align-items: center;
  padding: 64px 80px;
  box-sizing: border-box;
}

.brand {
  color: rgba(255, 255, 255, 0.92);
}

.logo {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: grid;
  place-items: center;
  font-size: 22px;
  font-weight: 700;
}

.title {
  margin-top: 18px;
  font-size: 44px;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.subtitle {
  margin-top: 12px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
}

.card {
  border-radius: 18px;
  padding: 28px 28px 22px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #101828;
  margin-bottom: 18px;
}

.form {
  width: 100%;
}

.submit {
  width: 100%;
  margin-top: 6px;
}

.tip {
  margin-top: 12px;
  font-size: 12px;
  color: #667085;
  text-align: center;
}

@media (max-width: 960px) {
  .content {
    grid-template-columns: 1fr;
    padding: 40px 20px;
  }
  .brand {
    display: none;
  }
}
</style>
