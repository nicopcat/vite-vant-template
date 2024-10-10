<template>
  <div class="container">
    <div class="nav-bar-normal">
      <van-nav-bar fixed title="扫一扫">
        <template #left>
          <span @click="handleBack">
            <van-icon name="arrow-left" />
            <span>返回</span>
          </span>
        </template>
      </van-nav-bar>
    </div>
    <!-- 主体 -->
    <div class="h-5/6 flex flex-col justify-center">
      <div class="relative">
        <video
          id="qrcode-scanner"
          muted="true"
          playsinline
          class="w-[100%] border border-gray-300 rounded-md p-8"
        ></video>
        <div class="absolute bg-white w-10 h-1 top-6 left-6"></div>
        <div class="absolute bg-white w-1 h-10 top-6 left-6"></div>

        <div class="absolute bg-white w-10 h-1 top-6 right-6"></div>
        <div class="absolute bg-white w-1 h-10 top-6 right-6"></div>

        <div class="absolute bg-white w-10 h-1 bottom-6 left-6"></div>
        <div class="absolute bg-white w-1 h-10 bottom-6 left-6"></div>

        <div class="absolute bg-white w-10 h-1 bottom-6 right-6"></div>
        <div class="absolute bg-white w-1 h-10 bottom-6 right-6"></div>

        <div
          v-if="!loading && !errorText && !qrcodeText"
          class="scanning absolute w-full h-1/3 bg-gradient-to-b from-transparent to-blue-400 animate-move"
        ></div>
      </div>

      <div class="text-center">
        <div v-if="loading" class="p-4 text-center text-white">加载中...</div>
        <div v-if="errorText" class="p-4 text-center text-white">{{ errorText }}</div>
        <button type="button" class="button" @click="changeVideoInputDevice" v-if="videoInputDeviceList.length > 1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-repeat"
            viewBox="0 0 16 16"
          >
            <path
              d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"
            ></path>
            <path
              fill-rule="evenodd"
              d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { BrowserMultiFormatReader } from '@zxing/library'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits(['scaned', 'update:cameraType'])

const render = new BrowserMultiFormatReader()
const loading = ref(false) // Loading
const errorText = ref('') // 错误信息
const qrcodeText = ref('') // 扫描到的内容
const deviceId = ref('') // 使用的设备ID
const videoInputDeviceList = ref([]) // 设备列表
const cameraType = ref(0)
onMounted(() => {
  openScan()
})

onBeforeUnmount(() => {
  render.reset()
})

function openScan() {
  loading.value = true
  // 初始化
  render
    .listVideoInputDevices()
    .then(videoInputDevices => {
      if (videoInputDevices.length) {
        videoInputDeviceList.value = videoInputDevices
        // 0 前置摄像头  1 后置摄像头

        deviceId.value = videoInputDevices[cameraType.value]?.deviceId
        if (videoInputDevices.value.length >= 1) {
          deviceId.value = videoInputDevices[1].deviceId
        }
        decodeFromInputVideo()
      } else {
        // 未检测到摄像头
        loading.value = false
        errorText.value = '未检测到摄像头'
      }
    })
    .catch(err => {
      handleError(err)
    })
}

function decodeFromInputVideo() {
  render
    .decodeFromVideoDevice(deviceId.value, 'qrcode-scanner', result => {
      if (result) {
        const resultText = result.getText()
        render.stopContinuousDecode()
        qrcodeText.value = resultText
        render.reset()
        emit('scaned', qrcodeText.value)
      }
      if (loading.value) loading.value = false
    })
    .catch(err => {
      handleError(err)
    })
}

function handleError(err) {
  loading.value = false
  if (err.message === 'Permission denied') {
    errorText.value = '授权失败，请确认已开启相机权限'
  } else {
    errorText.value = '初始化异常，请确认已开启相机权限'
  }
}

// 切换摄像头
const changeVideoInputDevice = () => {
  cameraType.value = cameraType.value == 1 ? 0 : 1

  // 初始化
  openScan()
}

function handleBack() {
  render.reset()
  emit('scaned', '')
}

defineExpose({
  render,
})
</script>

<style lang="less" scoped>
.container {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background-color: #000;
  z-index: 9999;
}

.scan-box {
  box-shadow: rgba(0, 0, 0, 0.863) 0px 0px 0px 5000px;
}

.scanning {
  background: linear-gradient(rgba(255, 255, 255, 0), 80%, rgba(96, 165, 250, 0.8));
  z-index: 999;
}

@keyframes move {
  0% {
    transform: translateY(-480%);
  }
  100% {
    transform: translateY(0%);
  }
}

.animate-move {
  animation: move 2s linear infinite;
}

.button {
  position: fixed;
  right: 16px;
  bottom: 16px;
  color: white;
  background-color: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  border: none;
}

.button:hover {
  background-color: transparent;
}

.button svg {
  display: inline;
  width: 1.3rem;
  height: 1.3rem;
  margin: 1rem;
  color: white;
}

.button:focus svg {
  animation: rotate 0.5s forwards;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.nav-bar-normal {
  padding-bottom: 2.2rem;
  .van-icon,
  span {
    color: var(--yu-font-color--dark);
    margin-right: 4px;
    font-size: 16px;
  }
}
</style>
