import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { pinia } from './stores'
import './router/permission'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import initQianKun from './utils/initQianKun'
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import Prism from 'prismjs'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

VMdEditor.use(githubTheme, {
  Prism
})

app.use(router)
app.use(pinia)
app.use(ElementPlus, { locale: zhCn })
app.use(VMdEditor)

app.config.errorHandler = (err) => {
  const message = err instanceof Error ? err.message : String(err)
  // 忽略 v-md-editor 的 tooltip 隐藏错误
  if (message.includes("Cannot read properties of null (reading 'hide')")) {
    console.warn('Suppressing v-md-editor tooltip error')
    return
  }
  console.error(err)
}

if (import.meta.env.DEV) {
  import('./mock')
}

app.mount('#app')

// 注册qiankun微应用
initQianKun(router)
