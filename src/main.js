import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { registerStore } from '@/store'
import { useSvgIcon } from './icons'
import './permission'
import './utils/rem'
import { setupVant } from '@/plugins/setupVant'
import 'vant/lib/index.css'

import { hasBtnPermission } from '@/utils/hasPermi'
//导入公共样式
import './styles/index.scss'
//第三方自定义字体文件
import './assets/fonts/index.css'

//导入字体图标
import './assets/iconfont/iconfont.css'
//全局事件总成
import globalEmitter from '@/utils/mitt'
//自定义指令
import registerDirective from '@/directive'
//国际化
import { setupI18n } from '@/locale'
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const app = createApp(App)
app.config.globalProperties.hasPermi = hasBtnPermission // 权限

document.addEventListener('plusready', function () {
  plus.key.addEventListener(
    'backbutton',
    function () {
      window.history.go(-1)
    },
    false
  )
})

const initApp = async () => {
  app.use(router)
  app.use(VueVirtualScroller)
  useSvgIcon(app)
  registerStore(app)
  registerDirective(app)
  await router.isReady()

  setupI18n(app)
  setupVant(app)

  app.use(globalEmitter)
  //app.use( ElementPlus )
  app.mount('#app')
}
initApp()
