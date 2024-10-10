<template>
  <div class="content">
    <CodeScanner ref="scannerRef" v-if="showScan" @scaned="getScanValue"></CodeScanner>
    <div v-else>
      <div class="pb-14">
        <div class="flex flex-row mx-[.6rem]">
          <div @click="handleTodo" :class="[isActive ? 'isActive' : 'isNotActive', 'tab']">待受理</div>
          <div @click="handleAll" :class="[!isActive ? 'isActive' : 'isNotActive', 'tab']">全部</div>
        </div>
        <div class="flex flex-row mx-[.6rem]">
          <van-search
            v-model="scanValue"
            placeholder="点击右侧扫码或输入设备编号搜索"
            left-icon="photograph"
            @click-left-icon="handleScan"
            class="w-full rounded p-2"
            @search="handleDeviceCodeSearch"
          >
          </van-search>
        </div>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <div v-for="(item, index) in list" class="content-box" :key="index">
              <van-cell class="flex-col">
                <template #title>
                  <span class="font-bold break-words">{{ item.code }}</span>
                </template>
                <template #label>
                  <IndexList label="设备"> {{ item.deviceCode }} / {{ item.deviceName }} </IndexList>
                  <IndexList label="设备标识"> {{ item.deviceMark }} </IndexList>
                  <IndexList label="创建时间"> {{ item.createTime }} </IndexList>
                  <IndexList label="检验类型"> {{ getLabel(dictObj['eam_quality_plan_cycle'], item.type) }} </IndexList>
                  <IndexList label="状态">
                    {{ getLabel(dictObj['eam_spot_inspection_status'], item.status) }}
                  </IndexList>
                  <!-- <IndexList label="班次"> {{ getLabel(dictObj['eam_spot_inspection_shift'], item.shift) }} </IndexList>
                  <IndexList label="点检人"> {{ item.inspectionByName }} </IndexList>
                  <IndexList label="点检时间"> {{ item.inspectionTime }} </IndexList>
                  <IndexList label="是否合格"> {{ getLabel(dictObj['eam_yes_no'], item.result) }} </IndexList> -->
                  <div class="mt-4">
                    <van-button
                      v-permission="['app:EamSpotInspection:execute']"
                      size="small"
                      type="primary"
                      @click="execute(item)"
                      class="mr-2"
                      v-if="item.status === 'SUBMIT'"
                      >执 行</van-button
                    >
                    <van-button
                      v-permission="['app:EamSpotInspection:view']"
                      size="small"
                      @click="detail(item)"
                      class="mr-2"
                      >详 情</van-button
                    >
                    <van-button
                      v-permission="['app:EamSpotInspection:confirm']"
                      type="success"
                      size="small"
                      class="mr-2"
                      @click="confirm(item)"
                      v-if="item.status === 'DONE'"
                      >确 认</van-button
                    >
                    <van-button
                      v-permission="['app:EamSpotInspection:skip']"
                      type="danger"
                      size="small"
                      class="mr-2"
                      @click="skip(item)"
                      v-if="item.status === 'SUBMIT'"
                      >跳 过</van-button
                    >
                  </div>
                </template>
              </van-cell>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
    <van-dialog
      v-model:show="showSkipDialog"
      title="跳过"
      confirm-button-text="确认"
      show-cancel-button
      @confirm="confirmSkip"
      @cancel="cancelSkip"
      :beforeClose="beforeClose"
    >
      <div class="p-3">
        <van-form required="auto" ref="skipFormRef">
          <van-field
            name="remark"
            v-model="skipFormValue.remark"
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

    <van-floating-bubble
      axis="xy"
      v-model:offset="offset"
      icon="plus"
      @click="handleNew"
      v-if="hasPermi(['app:EamSpotInspection:add'])"
    />

    <NormalNavBar>
      <template #search>
        <svg-icon icon-class="search" class-name="nav-bar-icon" @click="showSearchSheet = true" />
      </template>
    </NormalNavBar>

    <van-action-sheet v-model:show="showSearchSheet" @select="handleSearch">
      <div class="min-h-[30vh] px-2 py-4">
        <van-form ref="queryFormRef" input-align="" :label-width="95">
          <van-field v-model="queryParams.code" name="code" label="任务编号" placeholder="请输入任务编号" />
          <van-field v-model="queryParams.device" name="device" label="设备" placeholder="请输入设备编号或设备名" />
          <CustomPicker
            label="设备标识"
            :dataSource="dictObj['eam_device_mark']"
            :defValue="queryParams.deviceMark"
            :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
            @dataEvent="e => (queryParams.deviceMark = e.dictValue)"
          />
          <CustomPicker
            label="检验类型"
            :dataSource="dictObj['eam_quality_plan_cycle']"
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
import {
  getEamSpotInspectionList,
  skipEamSpotInspection,
  confirmEamSpotInspection,
  getMaintenanceNotify,
} from '@/api/eam/spotInspection'
import { getEamDeviceList } from '@/api/eam/device'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
import IndexList from '@/views/components/indexList/index'
import { getDict, getLabel } from '@/utils/dictUtils'
import { showConfirmDialog } from 'vant'
import { NormalNavBar } from '@/layout/components'
import CustomPicker from '@/components/CustomPicker'
import CodeScanner from '@/views/components/CodeScanner/index.vue'

const router = useRouter()

onMounted(() => {
  queryParams.statusList = ['SUBMIT']
  getDicts()
  getDevices()
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  dictObj['eam_spot_inspection_status'] = await getDict('eam_spot_inspection_status')
  dictObj['eam_quality_plan_cycle'] = await getDict('eam_quality_plan_cycle')
  dictObj['eam_spot_inspection_shift'] = await getDict('eam_spot_inspection_shift')
  dictObj['eam_yes_no'] = await getDict('eam_yes_no')
  dictObj['eam_device_mark'] = await getDict('eam_device_mark')
}

// 控制 FloatingBubble 的位置
const h = window.innerHeight
const w = window.innerWidth
const offset = ref({ x: w - 80, y: h - 130 })

const isActive = ref(true)
const list = ref([])
const total = ref(0)
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const queryParams = reactive({
  pageNum: 0,
  pageSize: 10,
})

// 搜索
const showSearchSheet = ref(false)
const queryFormRef = ref(null)
const initialParams = {
  pageNum: 0,
  pageSize: 10,
  code: '',
  device: '',
  deviceMark: '',
  type: '',
  statusList: [],
}
const scanValue = ref('')
const showScan = ref(false)
const scannerRef = ref(null)

function handleScan() {
  showScan.value = true
}

function handleDeviceCodeSearch() {
  queryParams.device = scanValue.value
  onRefresh()
}

function getScanValue(e) {
  console.log(e)
  if (!!e) {
    scanValue.value = e
    queryParams.device = e
    onRefresh()
  }
  showScan.value = false
}

function handleSearch() {
  onRefresh()
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
    const { data } = await getEamSpotInspectionList(queryParams)
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

function handleTodo() {
  isActive.value = !isActive.value
  queryParams.statusList = ['SUBMIT']
  onRefresh()
}

function handleAll() {
  isActive.value = !isActive.value
  queryParams.statusList = null

  onRefresh()
}

/* 新增 */
function handleNew() {
  router.push({ name: 'SpotInspectionNew' })
}

/* 详情 */
function detail(item) {
  router.push({ name: 'SpotInspectionDetail', state: { id: item.id } })
}

/* 执行 */
function execute(params) {
  router.push({ name: 'SpotInspectionExecute', state: { id: params.id } })
}

/* 受理 */
function confirm(item) {
  showConfirmDialog({
    message: '是否确认点检任务？',
  })
    .then(async () => {
      const { code, msg } = await confirmEamSpotInspection(item.id)
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

/* 跳过 */
const skipFormRef = ref()
const showSkipDialog = ref(false)
const skipFormValue = ref({
  id: '',
  remark: '',
})

async function skip(item) {
  skipFormValue.value.id = item.id
  showSkipDialog.value = true
}

function cancelSkip() {
  skipFormValue.value.id = ''
  skipFormValue.value.remark = ''
  showSkipDialog.value = false
}

const beforeClose = () => {
  return false
}

function confirmSkip(e) {
  skipFormRef.value
    .validate(['remark'])
    .then(async () => {
      console.log(skipFormValue.value)
      try {
        const { code, msg } = await skipEamSpotInspection(skipFormValue.value.id, skipFormValue.value.remark)
        if (code == ResultEnum.SUCCESS) {
          skipFormValue.value.id = ''
          skipFormValue.value.remark = ''
          showSuccessToast(msg || '提交成功')
          showSkipDialog.value = false

          onRefresh()
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
  margin-bottom: 4rem;
  background-color: #f2f4f8;
  &-box {
    padding: 0.2rem 0;
    border-radius: 4px;
    background-color: #fff;
    margin: 0.6rem;
  }
}
.tab {
  width: 100%;
  text-align: center;
  height: 32px;
  line-height: 32px;
  border: 1px solid var(--van-tabs-default-color);
}
.tab:nth-child(1) {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.tab:nth-child(2) {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
.isActive {
  background-color: var(--van-button-primary-background);
  color: white;
}
.isNotActive {
  background-color: white;
  color: var(--van-tabs-default-color);
}
</style>
