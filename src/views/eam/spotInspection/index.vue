<template>
  <div class="content">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div v-for="(item, index) in list" class="content-box" :key="index">
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
        </div>
      </van-list>
    </van-pull-refresh>

    <van-floating-bubble axis="xy" v-model:offset="offset" icon="plus" @click="handleNew" />

    <NormalNavBar>
      <template #search>
        <svg-icon icon-class="search" class-name="nav-bar-icon" @click="showSearchSheet = true" s />
      </template>
    </NormalNavBar>

    <van-action-sheet v-model:show="showSearchSheet" @select="handleSearch">
      <div class="min-h-[30vh] px-2 py-4 ">
        <van-form ref="queryFormRef" input-align="" :label-width="95">
          <CustomSelect
            label="设备编号"
            filterOn
            :dataSource="deviceList"
            :defValue="queryParams.deviceId"
            :labelProps="[
              { header: '设备编号', keyName: 'code' },
              { header: '设备名称', keyName: 'name' },
            ]"
            idKey="id"
            @dataEvent="e => (queryParams.deviceId = e.id)"
          />

          <CustomSelect
            label="保养方案"
            filterOn
            :dataSource="planList"
            :defValue="queryParams.qualityPlanId"
            :labelProps="[
              { header: '方案号', keyName: 'code' },
              { header: '方案名称', keyName: 'name' },
            ]"
            @dataEvent="e => (queryParams.qualityPlanId = e.id)"
          />

          <CustomPicker
            label="保养类型"
            :dataSource="dictObj['eam_maintenance_type']"
            :defValue="queryParams.subtype"
            :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
            @dataEvent="e => (queryParams.subtype = e.dictValue)"
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
import { getEamDeviceSpotInspectionList, deletedEamDeviceSpotInspection } from '@/api/eam/deviceSpotInspection'
import { getQualityPlanList } from '@/api/eam/qualityPlan'
import { getEamDeviceList } from '@/api/eam/device'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
import IndexList from '@/views/components/indexList/index'
import { getDict, getLabel } from '@/utils/dictUtils'
import { showConfirmDialog } from 'vant'
import { NormalNavBar } from '@/layout/components'
import CustomPicker from '@/components/CustomPicker'
import CustomSelect from '@/components/CustomSelect'

const router = useRouter()

onMounted(() => {
  getDicts()
  getDevices()
  getQualityPlans()
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  const eam_maintenance_type = await getDict('eam_maintenance_type')
  dictObj['eam_maintenance_type'] = eam_maintenance_type
}

const h = window.innerHeight
const w = window.innerWidth
const offset = ref({ x: w - 80, y: h - 130 }) // 控制 FloatingBubble 的位置

const list = ref([])
const loading = ref(false)
const total = ref(0)
const finished = ref(false)
const refreshing = ref(false)
const queryParams = reactive({
  pageNum: 0,
  pageSize: 10,
  type: 2,
})

// 搜索
const showSearchSheet = ref(false)
const queryFormRef = ref(null)
const initialParams = {
  pageNum: 0,
  pageSize: 10,
  deviceId: '',
  subtype: '',
  qualityPlanId: '',
  type: 2,
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

const deviceList = ref([])
async function getDevices() {
  try {
    const { data } = await getEamDeviceList()
    deviceList.value = data.rows ?? []
  } catch (error) {}
}
const planList = ref([])
async function getQualityPlans() {
  try {
    const { data } = await getQualityPlanList()
    planList.value = data.rows ?? []
  } catch (error) {}
}

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
  }
}

</style>
