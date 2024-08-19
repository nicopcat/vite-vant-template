<template>
  <div class="content">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div v-for="(item, index) in list" class="content-box" :key="index">
          <van-cell-group inset>
            <van-cell class="flex-col">
              <template #title>
                <span class="font-bold break-words">{{ item.code }}</span>
              </template>
              <template #label>
                <IndexList>
                  <template #left> 设备 </template>
                  <template #right> {{ item.device }} </template>
                </IndexList>
                <IndexList>
                  <template #left> 保养方案 </template>
                  <template #right> {{ item.qualityPlan }} </template>
                </IndexList>
                <IndexList>
                  <template #left> 保养类型 </template>
                  <template #right>{{ getLabel(dictObj['eam_maintenance_type'], item.subtype) }} </template>
                </IndexList>
                <div class="mt-4">
                  <van-button size="small" type="primary" @click="edit(item)" class="mr-2">编 辑</van-button>
                  <van-button type="danger" size="small" class="mr-2" @click="handleDelete(item)">删 除</van-button>
                </div>
              </template>
            </van-cell>
          </van-cell-group>
        </div>
      </van-list>
    </van-pull-refresh>

    <van-floating-bubble axis="xy" v-model:offset="offset" icon="plus" @click="handleNew" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getEamDeviceSpotInspectionList, deletedEamDeviceSpotInspection } from '@/api/eam/deviceSpotInspection'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
import IndexList from '@/views/components/indexList/index'
import { getDict, getLabel } from '@/utils/dictUtils'
import { showConfirmDialog } from 'vant'

const router = useRouter()

onMounted(() => {
  getDicts()
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  const eam_maintenance_type = await getDict('eam_maintenance_type')
  dictObj['eam_maintenance_type'] = eam_maintenance_type
}

const list = ref([])

const h = window.innerHeight
const w = window.innerWidth
const offset = ref({ x: w - 80, y: h - 130 }) // 控制 FloatingBubble 的位置

const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const queryParams = reactive({
  pageNum: 0,
  pageSize: 10,
})

const total = ref(0)

// 上拉加载
const onLoad = () => {
  loading.value = true
  queryParams.pageNum++
  getList()
}

// 下拉刷新
const onRefresh = () => {
  list.value = []
  queryParams.pageNum = 0
  // 清空列表数据
  finished.value = false

  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true
  onLoad()
}

async function getList() {
  if (list.value.length >= total.value && queryParams.pageNum > 1) {
    finished.value = true
    return
  }
  if (refreshing.value) {
    list.value = []
    refreshing.value = false
  }

  loading.value = true
  try {
    const { data } = await getEamDeviceSpotInspectionList(queryParams)
    list.value = [...list.value, ...data.rows]
    total.value = data.total
    // 加载状态结束
    loading.value = false
    console.log(data)
  } catch (error) {}
}


/* 编辑 */
function edit(params) {
  router.push({ name: 'SpotInspectionEdit', state: { id: params.id } })
}

/* 删除 */
function handleDelete(item) {
  showConfirmDialog({
    message: '是否确认删除当前数据？',
  })
    .then(async () => {
      const { code, msg } = await deletedEamDeviceSpotInspection(item.id)
      if (code == ResultEnum.SUCCESS) {
        showSuccessToast(msg || '提交成功')
        onRefresh()
      } else {
        showFailToast('操作失败，请稍后再试...')
      }
    })
    .catch(() => {
      // on cancel
    })
}

function handleNew() {
  router.push({ name: 'SpotInspectionNew' })
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  margin: 1rem 0;
  margin-bottom: 4rem;
  background-color: #f2f4f8;

  &-box {
    padding: 0.2rem 0;
    border-radius: 4px;
    background-color: #fff;
    margin: 0.6rem;

    .custom-title {
      font-size: 13px;
      font-family: 'Helvetica', sans-serif;
      font-weight: bold;
    }

    .van-row {
      font-size: 15px;
      padding: 0.4rem 0;
    }

    .text {
      padding: 0.4rem 0;

      &-title {
      }

      &-res {
        color: #333;
      }
    }
  }
}

.van-cell {
  padding: 0.4rem;
}
</style>
