<template>
  <div class="content">
    <div class="pb-14">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="(item, index) in list" class="content-box" :key="index">
            <van-cell class="flex-col">
              <template #title>
                <span class="font-bold break-words">{{ item.code }}</span>
              </template>
              <template #label>
                <IndexList>
                  <template #left> 检验类型 </template>
                  <template #right> {{ getLabel(dictObj['qms_lot_type'], item.type) }} </template>
                </IndexList>
                <IndexList>
                  <template #left> 检验结果 </template>
                  <template #right> {{ getLabel(dictObj['qms_lot_result'], item.result) }} </template>
                </IndexList>
                <IndexList>
                  <template #left> 检验状态 </template>
                  <template #right> {{ getLabel(dictObj['qms_lot_status'], item.status) }} </template>
                </IndexList>
                <div class="mt-4">
                  <van-button
                    :disabled="item.status === 'FINISH'"
                    type="success"
                    size="small"
                    @click="execute(item)"
                    class="mr-2"
                    >执 行</van-button
                  >
                  <van-button
                    :disabled="item.status === 'FINISH'"
                    type="primary"
                    size="small"
                    @click="close(item)"
                    class="mr-2"
                    >关 闭</van-button
                  >
                  <van-button plain type="primary" size="small" @click="detail(item)" class="mr-2">详 情</van-button>
                </div>
              </template>
            </van-cell>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <NormalNavBar>
      <template #search>
        <svg-icon icon-class="search" class="nav-bar-icon" @click="showSearchSheet = true" />
      </template>
    </NormalNavBar>

    <van-action-sheet v-model:show="showSearchSheet" @select="handleSearch">
      <div class="px-2 py-4 mb-4 flex flex-col justify-between">
        <van-form ref="queryFormRef" input-align="" :label-width="95">
          <van-field v-model="queryParams.code" name="code" label="检验批号" placeholder="检验批号" />
          <CustomPicker
            label="检验类型"
            :dataSource="dictObj['qms_lot_type']"
            :defValue="queryParams.type"
            :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
            @dataEvent="e => (queryParams.type = e.dictValue)"
          />
        </van-form>
        <div class="mt-4 p-2 flex flex-row">
          <van-button size="small" round type="primary" class="w-full mx-1" @click="handleSearch"> 查 询 </van-button>
          <van-button size="small" round type="" class="w-full mx-1" @click="resetSearch"> 重置条件 </van-button>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getQualityLotList, closeQualityLot } from '@/api/qms/qualityLot'
import { showConfirmDialog } from 'vant'
import IndexList from '@/views/components/indexList/index'
import { getDict, getLabel } from '@/utils/dictUtils'
import { NormalNavBar } from '@/layout/components'
import CustomPicker from '@/components/CustomPicker'

const router = useRouter()

onMounted(() => {
  getDicts()
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  const qms_lot_status_dict = await getDict('qms_lot_status')
  const qms_lot_result_dict = await getDict('qms_lot_result')
  const qms_lot_type_dict = await getDict('qms_lot_type')

  dictObj['qms_lot_status'] = qms_lot_status_dict
  dictObj['qms_lot_result'] = qms_lot_result_dict
  dictObj['qms_lot_type'] = qms_lot_type_dict
}

// 搜索
const showSearchSheet = ref(false)
const queryFormRef = ref(null)
const initialParams = {
  pageNum: 0,
  pageSize: 10,
  code: '',
  type: '',
}
function handleSearch() {
  list.value = []
  queryParams.pageNum = 0
  getList()
  showSearchSheet.value = false
}
function resetSearch() {
  Object.assign(queryParams, initialParams)
}

const list = ref([])
const total = ref(0)
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

const queryParams = reactive({
  pageNum: 0,
  pageSize: 10,
})

// 上拉加载
const onLoad = () => {
  loading.value = true
  queryParams.pageNum++
  getList()
}

// 下拉刷新
const onRefresh = () => {
  Object.assign(queryParams, initialParams)
  list.value = []
  queryParams.pageNum = 0
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
    const { data } = await getQualityLotList(queryParams)
    list.value = [...list.value, ...data.rows]
    total.value = data.total
    // 加载状态结束
    loading.value = false
  } catch (error) {}
}

function execute(params) {
  router.push({ name: 'QualityLotExecute', state: { id: params.id } })
}

function detail(params) {
  router.push({ name: 'QualityLotDetail', state: { id: params.id } })
}

function close(params) {
  showConfirmDialog({
    title: '确认',
    message: '确认关闭后，将无法执行操作',
  })
    .then(async () => {
      const res = await closeQualityLot(params)
      console.log(res)
    })
    .catch(() => {
      // on cancel
    })
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  margin: 1rem 0;
  background-color: #f2f4f8;

  &-box {
    padding: 0.2rem 0;
    border-radius: 4px;
    background-color: #fff;
    margin: 0.6rem;
  }
}
</style>
