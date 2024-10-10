<template>
  <div class="content">
    <div class="pb-14">
      <van-cell center title="仅显示本人待保养" class="w-auto mx-3">
        <template #right-icon>
          <van-switch v-model="isOnlyCurrentUser" @change="handleUserChange" />
        </template>
      </van-cell>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="(item, index) in list" class="content-box" :key="index">
            <van-cell class="flex-col">
              <template #title>
                <span class="font-bold break-words">{{ item.code }}</span>
              </template>
              <template #label>
                <IndexList label="设备"> {{ item.device }}/{{ item.deviceName }}</IndexList>
                <IndexList label="设备标识">
                  {{ getLabel(dictObj['eam_device_mark'], item.deviceMark) }}
                </IndexList>
                <IndexList label="计划开始时间"> {{ item.planStartTime }} </IndexList>
                <IndexList label="计划结束时间"> {{ item.planEndTime }} </IndexList>
                <IndexList label="保养类型">
                  {{ getLabel(dictObj['eam_maintenance_type'], item.type) }}
                </IndexList>
                <IndexList label="状态">
                  {{ getLabel(dictObj['eam_maintenance_status'], item.status) }}
                </IndexList>
                <!-- <IndexList label="工作中心">{{ item.workCenterName }}</IndexList>
                <IndexList label="预计保养时间"> {{ item.expectMaintenanceTime }} </IndexList>
                <IndexList label="维保人"> {{ item.maintenanceUserName }} </IndexList>
                <IndexList label="辅助人"> {{ item.helpByName }} </IndexList>
                <IndexList label="受理时间"> {{ item.handleTime }} </IndexList>
                <IndexList label="实际开始时间"> {{ item.startTime }} </IndexList>
                <IndexList label="实际结束时间"> {{ item.endTime }} </IndexList>
                <IndexList label="是否合格"> {{ getLabel(dictObj['eam_yes_no'], item.result) }} </IndexList> -->
                <div class="mt-4">
                  <van-button
                    v-permission="['app:EamMaintenance:execute']"
                    size="small"
                    type="primary"
                    @click="execute(item)"
                    class="mr-2"
                    v-if="item.status === 'PROGRESSING' || item.status === 'PENDING'"
                    >执 行</van-button
                  >
                  <van-button v-permission="['app:EamMaintenance:view']" size="small" @click="detail(item)" class="mr-2"
                    >详 情</van-button
                  >
                  <van-button
                    v-permission="['app:EamMaintenance:accept']"
                    type="success"
                    size="small"
                    class="mr-2"
                    @click="accept(item)"
                    v-if="item.status === 'PLAN'"
                    >受 理</van-button
                  >
                  <van-button
                    v-permission="['app:EamMaintenance:confirm']"
                    type="success"
                    size="small"
                    class="mr-2"
                    @click="confirm(item)"
                    v-if="item.status === 'DONE'"
                    >确 认</van-button
                  >
                  <van-button
                    v-permission="['app:EamMaintenance:skip']"
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
      v-model:show="showSkip"
      title="跳过工单"
      confirm-button-text="确认"
      show-cancel-button
      :before-close="beforeCloseDialogClose"
      @confirm="confirmSkip"
      @cancel="cancelSkip"
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
      v-if="hasPermi(['app:EamMaintenance:add'])"
      axis="xy"
      v-model:offset="offset"
      icon="plus"
      @click="handleNew"
    />

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
import { getEamMaintenanceList, skipEamMaintenance, updatePending, confirmEamMaintenance } from '@/api/eam/maintenance'
import { getEamDeviceList } from '@/api/eam/device'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
import IndexList from '@/views/components/indexList/index'
import { getDict, getLabel, getDetailLabel } from '@/utils/dictUtils'
import { showConfirmDialog } from 'vant'
import { NormalNavBar } from '@/layout/components'
import CustomPicker from '@/components/CustomPicker'
import useUserStore from '@/store/modules/users'

const router = useRouter()

onMounted(() => {
  getDicts()
  getDevices()
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  dictObj['eam_maintenance_type'] = await getDict('eam_maintenance_type')
  dictObj['eam_maintenance_status'] = await getDict('eam_maintenance_status')
  dictObj['eam_yes_no'] = await getDict('eam_yes_no')
  dictObj['eam_device_mark'] = await getDict('eam_device_mark')
}

function getUserId() {
  const userInfo = useUserStore().getUserInfo
  return userInfo.user.userId
}
function getUserName() {
  const userInfo = useUserStore().getUserInfo
  return userInfo?.user?.userName
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

const isOnlyCurrentUser = ref(false)
function handleUserChange(e) {
  queryParams.maintenanceUserName = e ? getUserName() : ''
  onRefresh()
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
    const { data } = await getEamMaintenanceList(queryParams)
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

/* 执行 */
function execute(params) {
  router.push({ name: 'MaintenanceExecute', state: { id: params.id } })
}

/* 详情 */
function detail(item) {
  router.push({ name: 'MaintenanceDetail', state: { id: item.id } })
}

/* 受理 */
function accept(item) {
  router.push({ name: 'MaintenanceAccept', state: { id: item.id, deviceId: item.deviceId } })
}

/* 确认 */
function confirm(item) {
  console.log(item)
  showConfirmDialog({
    message: '是否确认工单？',
  })
    .then(async () => {
      const { code, msg } = await confirmEamMaintenance(item.id)
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
  skipFormValue.value.id = item.id
  showSkip.value = true
}

const showSkip = ref(false)
const skipFormValue = ref({
  id: '',
  remark: '',
})
const skipFormRef = ref()
function cancelSkip() {
  skipFormValue.value.id = ''
  skipFormValue.value.remark = ''
  showSkip.value = false
}

const beforeCloseDialogClose = () => {
  return false
}

function confirmSkip(e) {
  skipFormRef.value
    .validate(['remark'])
    .then(async () => {
      try {
        const { code, msg } = await skipEamMaintenance(skipFormValue.value.id, skipFormValue.value.remark)
        if (code == ResultEnum.SUCCESS) {
          showSuccessToast(msg || '提交成功')
          onRefresh()
          skipFormValue.value.id = ''
          skipFormValue.value.remark = ''
          setTimeout(() => {
            showSkip.value = false
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
