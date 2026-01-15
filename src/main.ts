import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { pinia } from './stores'
import './router/permission'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import initQianKun from './utils/initQianKun'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(pinia)
app.use(ElementPlus)

if (import.meta.env.DEV) {
  import('./mock')
}

app.mount('#app')

// 注册qiankun微应用
initQianKun(router)

// router.isReady().then(async () => {
//   console.log('\x1b[32m%s\x1b[0m', 29, `start qiankun`);
//   await nextTick()
//   registerMicroApps([
//     {
//       name: 'react-sub',
//       entry: '//localhost:5174',
//       container: '#subapp-container',
//       activeRule: '/sub-react',
//       props: {
//         routerBase: '/sub-react'
//       }
//     }
//   ])

//   start({
//     prefetch: true,
//     sandbox: {
//       experimentalStyleIsolation: true
//     }
//   })
// })
