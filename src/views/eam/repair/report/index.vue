<template>
  <div class="content">
    <div class="pb-14">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="(item, index) in list" class="content-box" :key="index">
            <base-card>
              <template #head> {{ item.code }}</template>
              <template #body>
                <IndexList label="设备"> {{ item.deviceCode }} /{{ item.deviceName }} </IndexList>
                <IndexList label="设备标识"> {{ item.deviceMark }} </IndexList>
                <IndexList label="报修时间"> {{ item.faultReportTime }} </IndexList>
                <IndexList label="故障描述"> {{ item.faultReportDescription }} </IndexList>
                <IndexList label="状态"> {{ getLabel(dictObj['eam_repair_status'], item.status) }} </IndexList>
              </template>
              <template #foot>
                <van-button size="small" @click="view(item)" class="mr-2" v-permission="['app:EamRepair:view']"
                  >详 情</van-button
                >
                <!-- <van-button
                  size="small"
                  type="primary"
                  @click="edit(item)"
                  class="mr-2"
                  v-if="item.status === 'COMPLETED'"
                  v-permission="['app:EamRepair:edit']"
                  >更 改</van-button
                > -->
                <van-button
                  v-permission="['app:EamRepair:close']"
                  v-if="item.status === 'COMPLETED'"
                  size="small"
                  class="mr-1"
                  @click="close(item, 1)"
                  >关 闭</van-button
                >
                <van-button
                  v-permission="['app:EamRepair:cancel']"
                  v-if="item.status === 'WAITINGFORCOMFIRM' || item.status === 'WAITINGFORREPAIR'"
                  type="danger"
                  size="small"
                  class="mr-2"
                  @click="close(item, 2)"
                  >撤 销</van-button
                >
              </template>
            </base-card>
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

    <van-floating-bubble
      v-if="hasPermi(['app:EamRepair:add'])"
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
          <van-field v-model="queryParams.code" name="code" label="维修工单号" placeholder="维修工单号" />
          <van-field v-model="queryParams.device" name="device" label="设备编号/名称" placeholder="设备编号/名称" />

          <!-- <CustomSelect
            input-align="left"
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
          /> -->
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
import useUserStore from '@/store/modules/users'
import BaseCard from '@/components/BaseCard'

const router = useRouter()

onMounted(() => {
  getDicts()
  getDevices()
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  dictObj['eam_repair_type'] = await getDict('eam_repair_type')
  dictObj['eam_repair_status'] = await getDict('eam_repair_status')
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
  device: '',
  reportUser: getUserName(), // 我的报修
}
function handleSearch() {
  onRefresh()
  showSearchSheet.value = false
}
function resetSearch() {
  Object.assign(queryParams, initialParams)
  onRefresh()
}

function getUserId() {
  const userInfo = useUserStore().getUserInfo
  return userInfo.user.userId
}

function getUserName() {
  const userInfo = useUserStore().getUserInfo
  return userInfo?.user?.nickName
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
  // reportUser: getUserName(), // 我的报修
  reportUser: getUserName(), // 我的报修
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
  router.push({ name: 'RepairView', state: { id: item.id } }) // -> /user/123
}

function edit(params) {
  router.push({ name: 'RepairEdit', state: { id: params.id } })
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
  // background-color: #f2f4f8;

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
  .tab:nth-child(4) {
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
}
</style>
