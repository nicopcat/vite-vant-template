<template>
  <login-layout>
    <template #body>
      <van-form label-width="0" @submit="onSubmit">
        <van-cell-group inset>
          <van-field v-model="selectCompany" is-link readonly label="" placeholder="站点" @click="showPicker = true" />
          <van-popup v-model:show="showPicker" round position="bottom">
            <van-picker
              :columns="siteList"
              :columns-field-names="customFieldName"
              @cancel="showPicker = false"
              @confirm="onConfirm"
            />
          </van-popup>
          <!-- <van-field
            v-model="formState.siteId"
            :rules="rules.siteId"
            name="siteId"
            label=""
            placeholder="站点"
            clearable
          /> -->
          <van-field
            v-model="formState.username"
            :rules="rules.username"
            name="username"
            label=""
            placeholder="用户名"
            clearable
          />
          <van-field
            v-model="formState.password"
            type="password"
            name="password"
            label=""
            placeholder="密码"
            clearable
            :rules="rules.password"
          />
          <view class="code">
            <van-field
              v-model="formState.code"
              name="code"
              label=""
              placeholder="验证码"
              clearable
              :rules="rules.code"
            />
            <view class="verify-code-img">
              <van-image v-if="codeResult.img" @click="requestCode" :src="`data:image/gif;base64,${codeResult.img}`" />
            </view>
          </view>
        </van-cell-group>
        <div class="form-btn">
          <van-button round block type="primary" native-type="submit" class="btn-item h50"> 提交 </van-button>
        </div>
      </van-form>
    </template>

    <template #foot>
      <div>
        <div class="handle">
          <!-- <van-button plain class="txt-btn no-border yellow-btn" @click="router.push('/forgot')">忘记密码</van-button> -->

          <!-- <span class="split-line"></span>
          <van-button plain class="txt-btn no-border yellow-btn" @click="router.push('/register')">注册账号</van-button> -->
        </div>

        <!-- <div class="third">
          <van-divider class="line">其他登录方式</van-divider>
          <svg-icon icon-class="wechat" class-name="third-icon wechat" />
          <svg-icon icon-class="weibo" class-name="third-icon weibo" />
        </div> -->
        <div class="footer flex flex-row items-center justify-center fix bottom-0 mt-4">
          <div class="h-5 bg-blue-300 px-2 mx-2">
            <img :src="manaslogo" alt="Logo" class="h-full" />
          </div>
          <div class="mr-2 text-xs text-slate-400">广西七识数字科技有限公司 © 版权所有</div>
        </div>
      </div>
    </template>
  </login-layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
//import { validPhone } from '@/utils/validate'
import { LoginLayout } from '@/components/YuLayout'
import { useRouter } from 'vue-router'
import { showFailToast, showSuccessToast } from 'vant'
import { getSiteList, getCode } from '@/api/system/user'
import { ResultEnum } from '@/config/constant'

import { useUserStore } from '@/store'
import manaslogo from '@/assets/imgs/manaslogo.png'

const userStore = useUserStore()

const router = useRouter()

const trigger = 'onBlur' //onChange
// const formState = reactive({
//   username: '',
//   password: '',
//   siteId: '',
//   code: '',
//   uuid: '',
// })
// const formState = reactive({
//   username: 'nic',
//   password: 'admin123',
//   siteId: '',
//   code: '',
//   uuid: '',
// })

const formState = reactive({
  username: 'test001',
  password: '123123',
  siteId: '',
  code: '',
  uuid: '',
})
const selectCompany = ref('')
const siteList = reactive([])
onMounted(() => {
  getSite()
  requestCode()
})

const getSite = async () => {
  try {
    const { data } = await getSiteList()
    const list = data.voList ?? []
    siteList.splice(0, siteList.length, ...list)
    if (siteList.length > 0) {
      formState.siteId = siteList[1].siteId
      selectCompany.value = siteList[1].companyName
    }
  } catch (error) {
    console.log(`get site list error: ${error}`)
  }
}

const codeResult = reactive({
  img: null,
  codeResult: null,
})

const requestCode = async () => {
  const { data } = await getCode()
  codeResult.img = data.img
  codeResult.uuid = data.uuid
  formState.uuid = data.uuid
}

const showPicker = ref(false)
const customFieldName = {
  text: 'companyName',
  value: 'siteId',
}
function onConfirm({ selectedValues, selectedOptions }) {
  formState.siteId = selectedValues[0]
  selectCompany.value = selectedOptions[0].companyName
  showPicker.value = false
}

//const checkUserName = (value, rule) => {
//if (!value) return '请填写手机号码！'
//if (!validPhone(value)) return '手机号格式不正确！'
//return true
//}

const rules = {
  username: [{ required: true, message: '请填写用户名', trigger }],
  password: [{ required: true, message: '密码不能为空', trigger }],
  code: [{ required: true, message: '请输入验证码', trigger }],
}

const onSubmit = async () => {
  const params = {
    ...formState,
    clientId: import.meta.env.VITE_APP_CLIENT_ID,
    grantType: 'password',
  }

  try {
    const { code: c, msg } = await userStore.login(params)

    if (c == ResultEnum.SUCCESS) {
      await userStore.GET_ASYNCMENU() // 加载menu

      showSuccessToast(msg || '登录成功！')
      router.push('/')
    }
  } catch (error) {
    console.log(error)
    requestCode()
  }
}
</script>

<style lang="less" scoped>
@import './index.scss';
.handle {
  text-align: center;
  .txt-btn {
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
  }
  .split-line {
    vertical-align: middle;
    display: inline-block;
    width: 2px;
    height: 12px;
    background: var(--yu-yellow-color);
  }
}

.third {
  text-align: center;
  .line {
    width: 200px;
    margin: 80px auto 20px;
  }

  .third-icon {
    cursor: pointer;
    width: 40px;
    height: 40px;

    display: inline-block;
    color: var(--yu-red-color);
    margin: 0 20px;
    &.wechat {
      color: var(--yu-green-color);
    }
  }
}
.code {
  height: 56px;
  display: flex;
  flex-direction: row;
  align-items: center;
  .verify-code {
    width: 100%;
    display: flex;
    &-img {
      height: 40px;
      margin-left: 10px;
      img {
        height: 100%;
        object-fit: contain;
      }
    }
  }
}

@media (min-aspect-ratio: 13/20) {
  .footer {
    display: none;
  }
}
</style>
