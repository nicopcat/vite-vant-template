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
                  <template #left> 故障提报时间 </template>
                  <template #right> {{ item.faultReportTime }} </template>
                </IndexList>
                <IndexList>
                  <template #left> 提报人 </template>
                  <template #right> {{ item.reportUser }} </template>
                </IndexList>
                <IndexList>
                  <template #left> 状态 </template>
                  <template #right>{{ getLabel(dictObj['eam_repair_status'], item.status) }} </template>
                </IndexList>
                <div class="mt-4">
                  <van-button size="small" @click="view(item)" class="mr-2">查 看</van-button>
                  <van-button
                    size="small"
                    type="primary"
                    @click="edit(item)"
                    class="mr-2"
                    v-if="item.status === 'CLOSED' || item.status === 'COMPLETED'"
                    >编 辑</van-button
                  >
                  <van-button
                    v-if="item.status === 'WAITINGFORCOMFIRM'"
                    type="success"
                    size="small"
                    class="mr-2"
                    @click="accept(item)"
                    >受 理</van-button
                  >
                  <van-button
                    v-if="item.status === 'WAITINGFORREPAIR' || item.status === 'ONGOING'"
                    type="success"
                    size="small"
                    class="mr-2"
                    @click="complete(item)"
                    >完 成</van-button
                  >
                  <van-button v-if="item.status === 'COMPLETED'" size="small" class="mr-1" @click="close(item, 1)"
                    >关 闭</van-button
                  >
                  <van-button
                    v-if="item.status === 'WAITINGFORCOMFIRM' || item.status === 'WAITINGFORREPAIR'"
                    type="danger"
                    size="small"
                    class="mr-2"
                    @click="close(item, 2)"
                    >撤 销</van-button
                  >
                </div>
              </template>
            </van-cell>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <van-dialog
      v-model:show="showClose"
      :title="backType === 1 ? '维修工单关闭' : '维修工单撤销'"
      :confirm-button-text="backType === 1 ? '确认关闭' : '确认撤销'"
      show-cancel-button
      :before-close="beforeCloseDialogClose"
      @confirm="confirmClose"
      @cancel="showClose = false"
    >
      <div class="p-3">
        <van-form required="auto" ref="closeFormRef">
          <van-field
            name="remark"
            v-model="closeFormValue.remark"
            label="备注"
            placeholder="备注"
            rows="2"
            type="textarea"
            maxlength="500"
            show-word-limit
            :rules="[{ required: true, message: '请填写备注' }]"
          />
        </van-form>
      </div>
    </van-dialog>

    <van-floating-bubble axis="xy" v-model:offset="offset" icon="plus" @click="handleNew" />
    <NormalNavBar>
      <template #search>
        <svg-icon icon-class="search" class-name="nav-bar-icon" @click="showSearchSheet = true" />
      </template>
    </NormalNavBar>

    <van-action-sheet v-model:show="showSearchSheet" @select="handleSearch">
      <div class="min-h-[30vh] px-2 py-4">
        <van-form ref="queryFormRef" input-align="" :label-width="95">
          <van-field v-model="queryParams.code" name="code" label="维修工单号" placeholder="维修工单号" />
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
import { getEamRepairList, getAcceptDetailInfo, closeEamRepair, undoEamRepair } from '@/api/eam/repair'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
import IndexList from '@/views/components/indexList/index'
import { getDict, getLabel } from '@/utils/dictUtils'
import { getEamDeviceList } from '@/api/eam/device'
import { NormalNavBar } from '@/layout/components'
import CustomSelect from '@/components/CustomSelect'

const router = useRouter()

onMounted(() => {
  getDicts()
  getDevices()
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  const eam_repair_type_dict = await getDict('eam_repair_type')
  const eam_repair_status_dict = await getDict('eam_repair_status')
  dictObj['eam_repair_type'] = eam_repair_type_dict
  dictObj['eam_repair_status'] = eam_repair_status_dict
}

const h = window.innerHeight
const w = window.innerWidth
const offset = ref({ x: w - 80, y: h - 130 })

// 搜索
const showSearchSheet = ref(false)
const queryFormRef = ref(null)
const initialParams = {
  pageNum: 0,
  pageSize: 10,
  code: '',
  deviceId: '',
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

// 列表
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
  } catch (error) {}
}

function view(params) {
  // router.push({ name: 'CodeScanner' })

  router.push({ name: 'RepairView', state: { id: params.id } }) //
}

function edit(params) {
  router.push({ name: 'RepairEdit', state: { id: params.id } })
}

function accept(params) {
  router.push({ name: 'RepairAccept', state: { id: params.id } })
}

function complete(params) {
  router.push({ name: 'RepairComplete', state: { id: params.id } })
}

function handleNew() {
  router.push({ name: 'RepairNew' })
}

// 关闭/撤销
const showClose = ref(false)
const closeFormValue = ref({
  id: '',
  status: '',
  remark: '',
})
const closeFormRef = ref()
const backType = ref(1)
async function close(params, type) {
  backType.value = type
  const { data: info } = await getAcceptDetailInfo(Number(params.id))
  Object.assign(closeFormValue.value, info)
  showClose.value = true
}

const beforeCloseDialogClose = () => {
  return false
}
function confirmClose(e) {
  closeFormRef.value
    .validate(['remark'])
    .then(async () => {
      try {
        const request = backType.value === 1 ? closeEamRepair : undoEamRepair

        const { code, msg } = await request({
          id: closeFormValue.value.id,
          remark: closeFormValue.value.remark,
        })
        if (code == ResultEnum.SUCCESS) {
          showSuccessToast(msg || '提交成功')
          onRefresh()
          closeFormValue.value.id = ''
          closeFormValue.value.remark = ''
          setTimeout(() => {
            showClose.value = false
          }, 300)
        } else {
          showFailToast('操作失败，请稍后再试...')
        }
      } catch (error) {}
    })
    .catch(error => {})
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
