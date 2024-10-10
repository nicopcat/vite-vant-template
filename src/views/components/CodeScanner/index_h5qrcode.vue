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
    <div class="h-5/6 flex flex-col justify-center" id="reader" width="600px"></div>
    <div
      style="position: absolute; bottom: 50%; color: white; width: 100%; height: 30px; text-align: center"
      v-if="!!errorText"
    >
      {{ errorText }}！
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'

const emit = defineEmits(['scaned', 'update:videoListIndex'])
const errorText = ref('') // 错误信息

const html5QrCode = ref(null)
onMounted(() => {
  // openScan()
  const el = document.getElementById('reader')
  console.log(el)
  if (el) {
    html5QrCode.value = new Html5Qrcode('reader', false)
    // back camera

    // html5QrCode.value.start({ facingMode: 'environment' }, config, qrCodeSuccessCallback)

    html5QrCode.value
      .start(
        { facingMode: 'environment' },
        {
          fps: 10, // Optional, frame per seconds for qr code scanning
          qrbox: { width: 250, height: 250 }, // Optional, if you want bounded box UI
        },
        (decodedText, decodedResult) => {
          if (decodedText) {
            emit('scaned', decodedText)
          }
        },
        errorMessage => {
          // parse error, ignore it.
        }
      )
      .catch(err => {
        console.log(err)
        errorText.value = '请在开启相机权限后重试'
        html5QrCode.value = null
      })
  }
})

onBeforeUnmount(() => {
  if (!html5QrCode.value) return
  html5QrCode.value
    .stop()
    .then(ignore => {
      // QR Code scanning is stopped.
    })
    .catch(err => {
      // Stop failed, handle it.
    })
})

function handleBack() {
  console.log(html5QrCode.value)
  if (html5QrCode.value) {
    html5QrCode.value
      .stop()
      .then(ignore => {
        html5QrCode.value = null
        emit('scaned', '')
      })
      .catch(err => {})
  } else {
    emit('scaned', '')
  }
}

defineExpose({
  // render,
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
  z-index: 999;
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

.container {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background-color: #000;
  z-index: 9999;
  // flex-flow: column;
  // align-items: center;
  // justify-content: center;

  .nav-bar-normal {
    padding-bottom: 2.2rem;
    .van-icon,
    span {
      color: var(--yu-font-color--dark);
      margin-right: 4px;
      font-size: 16px;
    }
  }
  .camera {
    margin: 50% 0;
  }
}
</style>
