<template>
  <div class="content">
    <div class="pb-14">
      <div class="px-2">
        <van-form class="" ref="queryFormRef" input-align="right">
          <van-field v-model="queryParams.device" label="设备" placeholder="请填写设备名或设备编号" />
          <!-- <CustomSelect
            label="设备编号"
            filterOn
            :dataSource="deviceList"
            :defValue="queryParams.device"
            :labelProps="[
              { header: '设备编号', keyName: 'code' },
              { header: '设备名称', keyName: 'name' },
            ]"
            idKey="id"
            @dataEvent="e => (queryParams.device = e.code)"
          /> -->
          <DateTimePicker
            v-model="queryParams.collectionTimeFrom"
            label="开始时间"
            labelWidth="7em"
            :defTime="queryParams.collectionTimeFrom"
            @getTime="e => (queryParams.collectionTimeFrom = e)"
          />
          <DateTimePicker
            v-model="queryParams.collectionTimeTo"
            label="结束时间"
            labelWidth="7em"
            :defTime="queryParams.collectionTimeTo"
            @getTime="e => (queryParams.collectionTimeTo = e)"
          />
          <div class="flex justify-between items-center">
            <van-button
              v-permission="['app:unplannedCollection:add']"
              type="primary"
              size="small"
              class="my-2"
              @click="handleNew"
            >
              新 增
            </van-button>
            <div class="flex space-x-2">
              <van-button type="primary" size="small" class="my-2" @click="handleSearch"> 查 询 </van-button>
              <van-button type="primary" plain size="small" class="my-2" @click="resetSearch"> 重 置 </van-button>
            </div>
          </div>
        </van-form>
      </div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="(item, index) in list" class="content-box" :key="index">
            <van-cell class="flex-col">
              <template #title>
                <span class="font-bold break-words">{{ item.deviceCode }} / {{ item.deviceName }} </span>
              </template>
              <template #label>
                <IndexList label="日期"> {{ parseTime(new Date(item.collectionTime), '{y}-{m}-{d}') }} </IndexList>
                <IndexList label="类型">
                  {{ getLabel(dictObj['eam_lgzy_device_unplanned_type'], item.type) }}
                </IndexList>
                <IndexList label="开始时间"> {{ item.startTime }} </IndexList>
                <IndexList label="结束时间"> {{ item.endTime }} </IndexList>
                <div class="mt-2">
                  <van-button
                    v-permission="['app:unplannedCollection:edit']"
                    type="primary"
                    size="small"
                    class="mr-2"
                    @click="handleEdit(item)"
                  >
                    编 辑
                  </van-button>
                  <van-button
                    v-permission="['app:unplannedCollection:delete']"
                    size="small"
                    type="danger"
                    @click="handleDelete(item)"
                    class="mr-2"
                    >删 除</van-button
                  >
                </div>
              </template>
            </van-cell>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <van-action-sheet v-model:show="showAddSheet" @select="handleSearch">
      <div class="min-h-[30vh] px-2 py-4">
        <van-form ref="formRef" input-align="" :label-width="95">
          <CustomSelect
            inputAlign="left"
            required
            name="deviceId"
            :rules="[{ required: true, message: '请选择设备编号' }]"
            label="设备编号"
            filterOn
            :dataSource="deviceList"
            :defValue="formValue.deviceId"
            :labelProps="[
              { header: '设备编号', keyName: 'code' },
              { header: '设备名称', keyName: 'name' },
            ]"
            idKey="id"
            @dataEvent="e => (formValue.deviceId = e.id)"
          />
          <CustomPicker
            required
            name="type"
            :rules="[{ required: true, message: '请选择类型' }]"
            label="类型"
            :dataSource="dictObj['eam_lgzy_device_unplanned_type']"
            :defValue="formValue.type"
            :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
            @dataEvent="e => (formValue.type = e.dictValue)"
          />

          <DatePicker
            v-model="formValue.collectionTime"
            label="日期"
            labelWidth="7em"
            required
            name="collectionTime"
            :rules="[{ required: true, message: '请选择日期' }]"
            :defTime="formValue.collectionTime"
            @getTime="onCollectionTimeChange"
          />
          <DateTimePicker
            :disabled="!formValue.collectionTime"
            v-model="formValue.startTime"
            label="开始时间"
            labelWidth="7em"
            required
            name="startTime"
            :rules="[{ required: true, message: '请选择开始时间' }]"
            :defTime="formValue.startTime"
            @getTime="onStartTimeChange"
            @dateChange="handleDateChange"
            :minDate="startMinDate"
            :maxDate="startMaxDate"
            :maxTime="startMaxTime"
          />
          <DateTimePicker
            :disabled="!formValue.collectionTime || !formValue.startTime"
            v-model="formValue.endTime"
            label="结束时间"
            labelWidth="7em"
            required
            name="endTime"
            :rules="[{ required: true, message: '请选择结束时间' }]"
            :defTime="formValue.endTime"
            @getTime="e => (formValue.endTime = e)"
            @dateChange="handleEndDateChange"
            :minDate="endMaxDate"
            :maxDate="startMaxDate"
            :minTime="endMinTime"
            :maxTime="endMaxTime"
          />
        </van-form>
        <div class="mt-4 p-2 flex flex-row">
          <van-button size="small" round type="primary" class="w-full mx-1" @click="confirmAdd"> 确认 </van-button>
          <van-button size="small" round type="" class="w-full mx-1" @click="cancelAdd"> 取消 </van-button>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import {
  getLgzyDeviceUnplannedList,
  addLgzyUnplannedDevice,
  editLgzyUnplannedDevice,
  deletedLgzyUnplannedDevice,
} from '@/api/eam/unplanned'
import { getEamDeviceList } from '@/api/eam/device'

import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
import { showConfirmDialog } from 'vant'

import CustomPicker from '@/components/CustomPicker'
import CustomSelect from '@/components/CustomSelect'
import DateTimePicker from '@/components/DateTimePicker'
import DatePicker from '@/components/DatePicker'
import IndexList from '@/views/components/indexList/index'

import { getDict, getLabel } from '@/utils/dictUtils'
import { parseTime } from '@/utils/index'

onMounted(() => {
  getDicts()
  getDevices()
  resetSearch()
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  dictObj['eam_lgzy_device_unplanned_type'] = await getDict('eam_lgzy_device_unplanned_type')
}

const list = ref([])
const total = ref(0)
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const queryParams = reactive({
  pageNum: 0,
  pageSize: 10,
  type: '',
  device: '',
  collectionTimeFrom: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
  collectionTimeTo: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
})

// 搜索
const showAddSheet = ref(false)
const queryFormRef = ref(null)
const formRef = ref()
const initialParams = {
  pageNum: 0,
  pageSize: 10,
  type: '',
  device: '',
  collectionTimeFrom: '',
  collectionTimeTo: '',
}

const formValue = ref({
  deviceId: '',
  type: '',
  collectionTime: parseTime(new Date(), '{y}-{m}-{d}'),
  startTime: '',
  endTime: '',
  typeDescription: '',
})
function resetForm() {
  formValue.value.deviceId = ''
  formValue.value.type = ''
  formValue.value.collectionTime = parseTime(new Date(), '{y}-{m}-{d}')
  formValue.value.startTime = ''
  formValue.value.endTime = ''
  formValue.value.typeDescription = ''
}

function handleSearch() {
  onRefresh()
}
function resetSearch() {
  Object.assign(queryParams, initialParams)
  onRefresh()
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
    const { data } = await getLgzyDeviceUnplannedList(queryParams)
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

/** 打开新增弹层 */
function handleNew() {
  resetForm()
  showAddSheet.value = true
}

/** 确认新增或编辑 */
function confirmAdd() {
  formRef.value
    ?.validate()
    .then(async () => {
      const typeDictLabel = dictObj['eam_lgzy_device_unplanned_type'].find(x => x.dictValue == formValue.value.type)
      formValue.value.typeDescription = typeDictLabel?.dictLabel ?? ''
      formValue.value.collectionTime += ' 00:00:00'

      if (formValue.value?.id) {
        await editLgzyUnplannedDevice(formValue.value)
        showSuccessToast('修改成功')
        resetForm()
        onRefresh()
        showAddSheet.value = false
      } else {
        await addLgzyUnplannedDevice(formValue.value)
        showSuccessToast('新增成功')
        resetForm()
        onRefresh()
        showAddSheet.value = false
      }
    })
    .catch(error => {
      console.log(error)
    })
}

/** 编辑 */
function handleEdit(item) {
  showAddSheet.value = true

  setTimeout(() => {
    Object.assign(formValue.value, item)
    formValue.value.collectionTime = parseTime(item.collectionTime, '{y}-{m}-{d}')
    selectedStartDate.value = new Date(item.startTime).getDate()
    selectedEndDate.value = new Date(item.endTime).getDate()
  }, 100)
}

/** 取消新增 */
function cancelAdd() {
  resetForm()
  showAddSheet.value = false
}

/** 删除 */
function handleDelete(item) {
  showConfirmDialog({
    message: '是否确认删除？',
  })
    .then(async () => {
      const { code, msg } = await deletedLgzyUnplannedDevice(item.id)
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

/** 时间控制 */

// 选择的开始时间日期
const selectedStartDate = ref() // 当前选择开始时间的日期
function handleDateChange(e) {
  selectedStartDate.value = e
}

// 选择的结束时间日期
const selectedEndDate = ref() // 当前选择结束时间的日期
function handleEndDateChange(e) {
  selectedEndDate.value = e
}

// 最小开始日期
const startMinDate = computed(() => {
  const collectionTime = formValue.value.collectionTime
  if (collectionTime) {
    return new Date(collectionTime)
  }
  return null
})

// 最大开始日期
const startMaxDate = computed(() => {
  if (formValue.value.collectionTime) {
    const date = new Date(formValue.value.collectionTime)
    // 增加一天
    date.setDate(date.getDate() + 1)
    return date
  }
  return null
})

// 最大开始时间
const startMaxTime = computed(() => {
  const today = new Date(formValue.value.collectionTime)
  const nextDay = new Date(today)
  nextDay.setDate(today.getDate() + 1)

  if (selectedStartDate.value && selectedStartDate.value == nextDay.getDate()) {
    return '08:00:00'
  } else {
    return null
  }
})

// 最大结束日期
const endMaxDate = computed(() => {
  if (formValue.value.startTime) {
    return new Date(formValue.value.startTime)
  } else {
    return null
  }
})

// 最大结束时间
const endMaxTime = computed(() => {
  const today = new Date(formValue.value.collectionTime)
  const nextDay = new Date(today)
  nextDay.setDate(today.getDate() + 1)

  if (selectedStartDate.value && selectedStartDate.value == nextDay.getDate()) {
    selectedEndDate.value = selectedStartDate.value
    return '08:00:00'
  } else {
    if (selectedEndDate.value && selectedEndDate.value == nextDay.getDate()) {
      return '08:00:00'
    } else {
      return null
    }
  }
})

function getNextSecond(strA) {
  if (strA === '08:00:00') return '08:00:00'
  const [hours, minutes, seconds] = strA.split(':').map(Number)
  const date = new Date(0, 0, 0, hours, minutes, seconds)
  // 增加一秒
  date.setSeconds(date.getSeconds() + 1)
  // 格式化为 'HH:MM:SS' 形式
  const strB = [
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
    String(date.getSeconds()).padStart(2, '0'),
  ].join(':')

  return strB
}

// 最早结束时间
const endMinTime = computed(() => {
  const today = new Date(formValue.value.collectionTime)
  const nextDay = new Date(today)
  nextDay.setDate(today.getDate() + 1)

  // 1. sd在第一天，ed没有值（默认第一天）或ed第一天，控制
  // 2. sd第一天，ed第二天，null
  // 3. sd第二天，ed没有值（默认第二天），控制

  if (!formValue.value.startTime) return null
  if (selectedStartDate.value == today.getDate()) {
    if (selectedEndDate.value == nextDay.getDate()) {
      return null
    }
    const endTime = formValue.value.startTime.split(' ')[1]
    return getNextSecond(endTime)
  } else {
    const endTime = formValue.value.startTime.split(' ')[1]
    return getNextSecond(endTime)
  }
})

// 日期更改
function onCollectionTimeChange(e) {
  formValue.value.collectionTime = e
  // 重置
  selectedStartDate.value = formValue.value.startTime = null
  selectedEndDate.value = formValue.value.endTime = null
}

// 开始时间更改
function onStartTimeChange(e) {
  selectedStartDate.value = new Date(e).getDate()
  formValue.value.startTime = e
  // 重置
  if (!formValue.value.endTime || formValue.value.endTime < formValue.value.startTime) {
    formValue.value.endTime = e
    selectedEndDate.value = new Date(e).getDate()
  }
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
