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
                <IndexList label="设备编号"> {{ item.device }}</IndexList>
                <IndexList label="设备名称"> {{ item.deviceName }} </IndexList>
                <IndexList label="工单状态"> {{ getLabel(dictObj['eam_maintenance_status'], item.status) }} </IndexList>
                <IndexList label="工单类型"> {{ getLabel(dictObj['eam_maintenance_type'], item.type) }} </IndexList>
                <IndexList label="维保人"> {{ item.maintenanceUserName }} </IndexList>
                <IndexList label="计划开始时间"> {{ item.planStartTime }} </IndexList>
                <IndexList label="计划结束时间"> {{ item.planEndTime }} </IndexList>
                <IndexList label="是否停机"> {{ getLabel(dictObj['eam_yes_no'], item.isShutdown + '') }} </IndexList>
                <IndexList label="保养说明"> {{ item.remark }} </IndexList>
                <div class="mt-4">
                  <van-button
                    size="small"
                    type="primary"
                    @click="execute(item)"
                    class="mr-2"
                    v-if="item.status === 'PROGRESSING' || item.status === 'PENDING'"
                    >执 行</van-button
                  >
                  <van-button size="small" @click="detail(item)" class="mr-2">详 情</van-button>
                  <van-button
                    type="success"
                    size="small"
                    class="mr-2"
                    @click="accept(item)"
                    v-if="item.status === 'PLAN'"
                    >受 理</van-button
                  >
                  <van-button
                    type="danger"
                    size="small"
                    class="mr-2"
                    @click="skip(item)"
                    v-if="item.status === 'PROGRESSING' || item.status === 'PENDING'"
                    >跳 过</van-button
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
          <van-field v-model="queryParams.code" name="code" label="保养工单号" placeholder="保养工单号" />
          <CustomPicker
            label="工单类型"
            :dataSource="dictObj['eam_maintenance_type']"
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
import { getEamMaintenanceList, skipEamMaintenance, updatePending } from '@/api/eam/maintenance'
import { getEamDeviceList } from '@/api/eam/device'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
import IndexList from '@/views/components/indexList/index'
import { getDict, getLabel } from '@/utils/dictUtils'
import { showConfirmDialog } from 'vant'
import { NormalNavBar } from '@/layout/components'
import CustomPicker from '@/components/CustomPicker'

const router = useRouter()

onMounted(() => {
  getDicts()
  getDevices()
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  const eam_maintenance_type = await getDict('eam_maintenance_type')
  const eam_maintenance_status = await getDict('eam_maintenance_status')
  const eam_yes_no = await getDict('eam_yes_no')
  dictObj['eam_maintenance_type'] = eam_maintenance_type
  dictObj['eam_maintenance_status'] = eam_maintenance_status
  dictObj['eam_yes_no'] = eam_yes_no
}

// 控制 FloatingBubble 的位置
const h = window.innerHeight
const w = window.innerWidth
const offset = ref({ x: w - 80, y: h - 130 })

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
    const { data } = await getEamMaintenanceList(queryParams)
    list.value = [...list.value, ...data.rows]
    total.value = data.total
    // 加载状态结束
    loading.value = false
    console.log(data)
  } catch (error) {
    finished.value = true
  } finally {
    loading.value = false
  }
}

/* 执行 */
function execute(params) {
  router.push({ name: 'MaintenanceExecute', state: { id: params.id } })
}

/* 详情 */
function detail(item) {
  router.push({ name: 'MaintenanceDetail', state: { id: item.id } }) // -> /user/123
}

/* 受理 */
function accept(item) {
  showConfirmDialog({
    message: '是否确认受理工单？',
  })
    .then(async () => {
      const { code, msg } = await updatePending(item.id)
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
async function skip(item) {
  showConfirmDialog({
    message: '是否确认跳过工单？',
  })
    .then(async () => {
      const { code, msg } = await skipEamMaintenance(item.id)
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

const showClose = ref(false)
const closeFormValue = ref({
  id: '',
  status: '',
  remark: '',
})
const closeFormRef = ref()
const backType = ref(1)

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

function handleNew() {
  router.push({ name: 'MaintenanceNew' })
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
