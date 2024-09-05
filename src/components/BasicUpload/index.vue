<template>
  <div class="van-cell-custom">
    <van-uploader v-model="fileList" :max-count="maxCount" :accept="fileType" multiple :after-read="afterRead" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { localStorageHandle } from '@/utils/storage'
import { ACCESS_TOKEN } from '@/config/constant'

const url = import.meta.env.VITE_GLOB_UPLOAD_URL
const props = defineProps({
  maxCount: {
    type: [Number],
    default: 5,
  },
  fileType: {
    // 文件类型
    type: String,
    default: 'image/*',
  },
  ossList: {
    //已上传的文件列表ossId
    type: Array,
    default: () => {
      return []
    },
  },
})

const emits = defineEmits(['update:fileList','uploadChange'])
onMounted(() => {})

const fileList = ref([])
const fullFileList = ref([])

// 新增附件
async function afterRead(file) {
  console.log(file)
  file.status = 'uploading'
  file.message = '上传中...'

  const res = await handleUpload(file)
  console.log(res)
  fileList.value.push(res.url)
  fullFileList.value.push({
    ossId: res.ossId,
    fileName: res.fileName,
    url: res.url,
  })
  // ossList.value.push(res.data.ossId)
  emits('uploadChange',  fullFileList.value)
  console.log(fileList.value);
}

function handleUpload(file) {
  let params = new FormData()
  params.append('file', file.file)
  let config = {
    headers: {
      //添加请求头
      timestamp: new Date().getTime(),
      Authorization: 'Bearer ' + localStorageHandle.getItem(ACCESS_TOKEN, ''),
      Clientid: import.meta.env.VITE_APP_CLIENT_ID,
      'Content-Type': 'multipart/form-data',
    },
  }
  return new Promise((resolve, reject) => {
    axios
      .post(url, params, config)
      .then(res => {
        if (res && res.data && res.data.code === 200) {
          file.status = 'success'
          file.message = '上传成功'
          resolve(res.data.data)
        } else {
          file.status = 'fail'
          file.message = res.data.msg || '上传失败'
          reject(res.data)
        }
      })
      .catch(err => {
        Toast.fail('系统异常')
        reject(err)
      })
  })
}
</script>

<style lang="scss" scoped>
.van-cell-custom {
  border-bottom: 1px solid var(--van-cell-border-color);
}
</style>
