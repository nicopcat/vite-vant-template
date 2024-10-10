<template>
  <div class="">
    <van-uploader
      v-model="fileList"
      :max-count="maxCount"
      :accept="fileType"
      :deletable="props.deletable"
      :after-read="afterRead"
      :before-delete="beforeDel"
      @delete="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { localStorageHandle } from '@/utils/storage'
import { ACCESS_TOKEN } from '@/config/constant'
import { listByIds } from '@/api/system/oss'
import { showFailToast, showSuccessToast, showConfirmDialog } from 'vant'

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
    // 其他格式用逗号分隔 .doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  },
  ossId: {
    //已上传的文件列表ossId
    type: [Array, String],
    default: () => {
      return []
    },
  },
  deletable: {
    type: Boolean,
    default: true,
  },
  isResultArray: {
    type: Boolean,
    default: true,
  },
})

const emits = defineEmits(['uploadChange'])
onMounted(() => {})

const fileList = ref([])
const fullFileList = ref([])

//赋值默认图片显示
watch(
  () => props.ossId,
  () => {
    getImgUrlData()
  },
  {
    immediate: true,
    deep: true,
  }
)

async function getImgUrlData() {
  if (props.ossId?.length > 0) {
    const { data } = await listByIds(props.ossId)
    fullFileList.value = data
    fileList.value = []
    data.forEach(item => {
      fileList.value.push(item)
    })
  }
  if (props.value?.length > 0) {
    const { data } = await listByIds(props.value)
    fullFileList.value = data
    fileList.value = []
    data.forEach(item => {
      fileList.value.push(item)
    })
  }
}

// 新增附件
async function afterRead(file) {
  file.status = 'uploading'
  file.message = '上传中...'

  const res = await handleUpload(file)
  fileList.value.push({
    ossId: res.ossId,
    fileName: res.fileName,
    url: res.url,
    content: res.url,
    status: 'success',
  })

  fileList.value = fileList.value.filter(x => x.ossId) // 去除组件自动带入的file信息
  fullFileList.value = fileList.value.map(x => Number(x.ossId))
  if (props.isResultArray) {
    emits('uploadChange', fullFileList.value)
  } else {
    emits('uploadChange', fullFileList.value.join(','))
    console.log(fullFileList.value.join(','))
  }
  console.log(fullFileList.value)
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
        console.log(err)
        showFailToast(`系统异常(url: ${url})`)
        reject(err)
      })
  })
}

function beforeDel(e) {
  showConfirmDialog({
    title: '提示',
    message: '确定删除该图片吗？',
  })
    .then(() => {
      handleDelete(e)
    })
    .catch(() => {})
}

function handleDelete(e) {
  fileList.value = fileList.value.filter(x => x.ossId !== e.ossId)
  fullFileList.value = fileList.value.map(x => Number(x.ossId))
  if (props.isResultArray) {
    emits('uploadChange', fullFileList.value)
  } else {
    emits('uploadChange', fullFileList.value.join(','))
  }
  console.log(fullFileList.value)

  showSuccessToast('删除成功')
}
</script>

<style lang="scss" scoped>
// .van-cell-custom {
//   border-bottom: 1px solid var(--van-cell-border-color);
// }
</style>
