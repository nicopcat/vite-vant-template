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
                <IndexList label="设备"> {{ item.deviceCode }} /{{ item.deviceName }} </IndexList>
                <IndexList label="设备标识"> {{ item.deviceMark }} </IndexList>
                <IndexList label="报修时间"> {{ item.faultReportTime }} </IndexList>
                <IndexList label="故障描述"> {{ item.faultReportDescription }} </IndexList>
                <!-- <IndexList label="提报人"> {{ item.reportUser }} </IndexList> -->
                <IndexList label="状态"> {{ getLabel(dictObj['eam_repair_status'], item.status) }} </IndexList>
                <div class="mt-4">
                  <van-button v-permission="['app:EamRepairAll:view']" size="small" @click="view(item)" class="mr-2"
                    >详 情</van-button
                  >
                </div>
              </template>
            </van-cell>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <NormalNavBar>
      <template #search>
        <svg-icon icon-class="search" class-name="nav-bar-icon" @click="showSearchSheet = true" />
      </template>
    </NormalNavBar>

    <van-action-sheet v-model:show="showSearchSheet" @select="handleSearch">
      <div class="min-h-[30vh] px-2 py-4">
        <van-form ref="queryFormRef" input-align="" :label-width="120">
          <van-field v-model="queryParams.code" name="code" label="维修工单号" placeholder="维修工单号" />
          <van-field v-model="queryParams.device" name="device" label="设备编号/名称" placeholder="设备编号/名称" />
          <DateTimePicker
            :labelWidth="120"
            v-model="queryParams.faultReportTimeFrom"
            label="故障提报开始时间"
            labelWidth="7em"
            name="faultReportTimeFrom"
            :defTime="queryParams.faultReportTimeFrom"
            @getTime="e => (queryParams.faultReportTimeFrom = e)"
          />
          <DateTimePicker
            :labelWidth="120"
            v-model="queryParams.faultReportTimeTo"
            label="故障提报结束时间"
            labelWidth="7em"
            name="faultReportTimeTo"
            :defTime="queryParams.faultReportTimeTo"
            @getTime="e => (queryParams.faultReportTimeTo = e)"
          />
          <van-field v-model="queryParams.repairUserName" name="repairUserName" label="维修人" placeholder="维修人" />
          <van-field v-model="queryParams.reportUser" name="reportUser" label="报修人" placeholder="报修人" />
          <CustomPicker
            multiple
            ref="multiplePartRef"
            label="状态"
            :dataSource="dictObj['eam_repair_status']"
            :defValue="queryParams.statusList"
            @dataEvent="e => (queryParams.statusList = e)"
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
import { getEamDeviceList } from '@/api/eam/device'
import { getEamRepairList, getAcceptDetailInfo, closeEamRepair, undoEamRepair } from '@/api/eam/repair'
import { getUserList } from '@/api/system/user'

import IndexList from '@/views/components/indexList/index'
import CustomPicker from '@/components/CustomPicker'
import DateTimePicker from '@/components/DateTimePicker'
import { NormalNavBar } from '@/layout/components'

import { getDict, getLabel } from '@/utils/dictUtils'

import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  getDicts()
  getDevices()
  getUsers()
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  dictObj['eam_repair_type'] = await getDict('eam_repair_type')
  dictObj['eam_repair_status'] = await getDict('eam_repair_status')
}

const userList = ref([])
const multiplePartRef = ref()

async function getUsers() {
  try {
    const { data } = await getUserList()
    userList.value = data.rows ?? []
  } catch (error) {}
}

// 搜索
const showSearchSheet = ref(false)
const queryFormRef = ref(null)
const initialParams = {
  pageNum: 0,
  pageSize: 10,
  code: '',
  device: '',
  reportUser: '', // id
  statusList: [], // 待维修 = WAITINGFORCOMFIRM
  repairUserName: '', // nickname模糊查询
  faultReportTimeFrom: '',
  faultReportTimeTo: '',
}
function handleSearch() {
  onRefresh()
  showSearchSheet.value = false
}
function resetSearch() {
  Object.assign(queryParams, initialParams)
  multiplePartRef.value.handleDeleteAll()

  onRefresh()
}

const deviceList = ref([])
async function getDevices() {
  try {
    const { data } = await getEamDeviceList()
    deviceList.value = data.rows ?? []
  } catch (error) {}
}

// 列表
const list = ref([])
const total = ref(0)
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const queryParams = reactive({
  pageNum: 0,
  pageSize: 10,
  code: '',
  device: '',
  reportUser: '', // id
  statusList: [], // 待维修 = WAITINGFORCOMFIRM
  repairUserName: '', // nickname模糊查询
  faultReportTimeFrom: '',
  faultReportTimeTo: '',
})

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
    const { data } = await getEamRepairList(queryParams)
    list.value = [...list.value, ...data.rows]
    total.value = data.total
    // 加载状态结束
    loading.value = false
  } catch (error) {
    finished.value = true
  } finally {
    loading.value = false
  }
}

function view(item) {
  router.push({ name: 'RepairView', state: { id: item.id } })
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

    .van-row {
      font-size: 15px;
      padding: 0.4rem 0;
    }
  }
}
</style>
