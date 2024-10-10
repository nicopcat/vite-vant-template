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
                <IndexList label="物料编码"> {{ item.itemCode }} </IndexList>
                <IndexList label="物料名称"> {{ item.itemName }} </IndexList>
                <IndexList label="物料类型"> {{ getLabel(dictObj['qms_item_type'], item.itemType) }} </IndexList>
                <IndexList label="异常编码"> {{ item.exceptionTypeCode }} </IndexList>
                <IndexList label="异常编码描述"> {{ item.exceptionTypeName }} </IndexList>
                <IndexList label="异常数量"> {{ item.quantity }} </IndexList>
                <div class="mt-4">
                  <van-button v-permission="['app:QmsException:view']" size="small" @click="view(item)" class="mr-2"
                    >详 情</van-button
                  >
                  <van-button
                    v-permission="['app:QmsException:handle']"
                    size="small"
                    type="primary"
                    @click="handle(item)"
                    class="mr-2"
                    v-if="item.status === 'NEW'"
                    >处 理</van-button
                  >
                  <van-button
                    v-permission="['app:QmsException:close']"
                    v-if="item.status === 'PROCESSED'"
                    size="small"
                    class="mr-1"
                    @click="close(item)"
                    >关 闭</van-button
                  >
                  <van-button
                    v-permission="['app:QmsException:recheck']"
                    v-if="item.status === 'RECHECK'"
                    type="success"
                    size="small"
                    class="mr-2"
                    @click="recheck(item)"
                    >复 检</van-button
                  >

                  <van-button
                    v-permission="['app:QmsException:shutdown']"
                    v-if="item.status === 'NEW'"
                    size="small"
                    class="mr-1"
                    @click="forceClose(item)"
                    >强制关闭</van-button
                  >
                </div>
              </template>
            </van-cell>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <van-dialog
      v-model:show="showForceClose"
      title="强制关闭"
      confirm-button-text="确认"
      show-cancel-button
      :before-close="beforeForceCloseDialogClose"
      @confirm="confirmForceClose"
      @cancel="showForceClose = false"
      @closed="onClosed"
    >
      <div class="p-3">
        <van-form required="auto" ref="forceCloseFormRef">
          <van-field
            name="remark"
            v-model="forceCloseFormValue.remark"
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
      v-if="hasPermi(['app:QmsException:add'])"
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
        <van-form ref="queryFormRef" input-align="left" :label-width="95">
          <van-field v-model="queryParams.code" name="code" label="工单号" placeholder="工单号" />

          <CustomSelect
            input-align="left"
            label="物料编号"
            filterOn
            :dataSource="itemList"
            :defValue="queryParams.itemId"
            :labelProps="[
              { header: '物料编号', keyName: 'code' },
              { header: '物料名称', keyName: 'name' },
            ]"
            idKey="id"
            @dataEvent="e => (queryParams.itemId = e.id)"
          />
          <!-- <van-field v-model="queryParams.item" name="item" label="物料" placeholder="物料" />
          <van-field v-model="queryParams.workCenterId" name="workCenterId" label="工作中心" placeholder="工作中心" />
          <van-field v-model="queryParams.workStationId" name="workStationId" label="工位" placeholder="工位" /> -->

          <DateTimePicker
            v-model="queryParams.createTimeStart"
            label="发现开始时间"
            :defTime="queryParams.createTimeStart"
            @getTime="e => (queryParams.createTimeStart = e)"
          />
          <DateTimePicker
            v-model="queryParams.createTimeEnd"
            label="发现结束时间"
            :defTime="queryParams.createTimeEnd"
            @getTime="e => (queryParams.createTimeEnd = e)"
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
import { getExceptionList, shutdownException, closeException } from '@/api/qms/exception'
import { getEamDeviceList } from '@/api/eam/device'
import { getItemList, getWorkStationList } from '@/api/base/index'

import { useRouter } from 'vue-router'
import { parseTime } from '@/utils/index'
import { getDict, getLabel } from '@/utils/dictUtils'
import { showFailToast, showSuccessToast } from 'vant'
import { ResultEnum } from '@/config/constant'

import { NormalNavBar } from '@/layout/components'
import IndexList from '@/views/components/indexList/index'
import CustomSelect from '@/components/CustomSelect'
import DateTimePicker from '@/components/DateTimePicker'
const router = useRouter()

onMounted(() => {
  getDicts()
  getDevices()
  getItems()

  // 默认查询之前三天的数据
  const thirdDay = new Date(new Date().setDate(new Date().getDate() - 3))
  const thirdDayTime = parseTime(thirdDay, `{y}/{m}/{d}` + ' 00:00:00')

  queryParams.createTimeEnd = parseTime(new Date(), '{y}/{m}/{d} {h}:{i}:{s}')
  queryParams.createTimeStart = thirdDayTime
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  dictObj['qms_item_type'] = await getDict('qms_item_type')
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
  itemId: '',
  workCenterId: '',
  workStationId: '',
}
function handleSearch() {
  onRefresh()
  showSearchSheet.value = false
}
function resetSearch() {
  Object.assign(queryParams, initialParams)
  onRefresh()
}

const deviceList = ref([])
const itemList = ref([])
async function getDevices() {
  try {
    const { data } = await getEamDeviceList()
    deviceList.value = data.rows ?? []
  } catch (error) {}
}
async function getItems() {
  try {
    const { data } = await getItemList()
    itemList.value = data.rows ?? []
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
  itemId: '',
  workCenterId: '',
  workStationId: '',
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
    const { data } = await getExceptionList(queryParams)
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

function handleNew() {
  router.push({ name: 'ExceptionNew' })
}

function view(params) {
  router.push({ name: 'ExceptionView', state: { id: params.id } })
}

function handle(params) {
  router.push({ name: 'ExceptionHandle', state: { id: params.id } })
}

function close(params) {
  router.push({ name: 'ExceptionClose', state: { id: params.id } })
}
function recheck(params) {
  router.push({ name: 'ExceptionRecheck', state: { id: params.id, defectDecision: params.defectDecision } })
}
function forceClose(params) {
  forceCloseFormValue.value.id = params.id
  showForceClose.value = true
}

//强制关闭
const showForceClose = ref(false)
const forceCloseFormRef = ref()
const forceCloseFormValue = ref({
  id: '',
  remark: '',
})
const beforeForceCloseDialogClose = () => {
  return false
}
function confirmForceClose() {
  forceCloseFormRef.value
    .validate(['remark'])
    .then(async () => {
      try {
        const { code, msg } = await shutdownException(forceCloseFormValue.value)
        if (code == ResultEnum.SUCCESS) {
          showSuccessToast(msg || '提交成功')
          onRefresh()
          onClosed()
          setTimeout(() => {
            showForceClose.value = false
          }, 300)
        } else {
          showFailToast('操作失败，请稍后再试...')
        }
      } catch (error) {}
    })
    .catch(error => {})
}

function onClosed() {
  forceCloseFormValue.value.id = ''
  forceCloseFormValue.value.remark = ''
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
