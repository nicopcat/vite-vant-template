<template>
  <div>
    <CodeScanner ref="scannerRef" v-if="showScan" @scaned="getScanValue"></CodeScanner>

    <div class="content" v-else>
      <div class="flex flex-row w-full px-0">
        <van-search
          input-align="left"
          v-model="scanValue"
          placeholder="点击右侧扫码或输入设备编号搜索"
          left-icon="scan"
          @click-left-icon="handleScan"
          class="w-full"
          @search="handleDeviceCodeSearch"
        >
        </van-search>
      </div>
      <van-form class="" ref="formRef" @submit="onSubmit" input-align="right">
        <CustomSelect
          required
          name="deviceId"
          :rules="[{ required: true, message: '请选择设备编号' }]"
          label="设备编号"
          filterOn
          :dataSource="deviceList"
          :defValue="editData.deviceId"
          :labelProps="[
            { header: '设备编号', keyName: 'code' },
            { header: '设备名称', keyName: 'name' },
          ]"
          idKey="id"
          @dataEvent="e => (editData.deviceId = e.id)"
        />
        <DateTimePicker
          v-model="editData.faultReportTime"
          label="故障提报时间"
          labelWidth="7em"
          required
          name="faultReportTime"
          :rules="[{ required: true, message: '请选择故障提报时间' }]"
          :defTime="editData.faultReportTime"
          @getTime="e => (editData.faultReportTime = e)"
        />

        <CustomSelect
          required
          name="reportUser"
          :rules="[{ required: true, message: '请选择提报人' }]"
          label="提报人"
          filterOn
          :dataSource="userList"
          :defValue="editData.reportUser"
          idKey="userId"
          :labelProps="[
            { header: '用户昵称', keyName: 'nickName' },
            { header: '用户名称', keyName: 'userName' },
          ]"
          @dataEvent="e => (editData.reportUser = e.userId)"
        />

        <van-field
          v-model="editData.reportUserPhone"
          name="reportUserPhone"
          label="提报人电话"
          placeholder="提报人电话"
        />

        <CustomPicker
          required
          name="faultReportType"
          :rules="[{ required: true, message: '请选择故障类型' }]"
          label="故障类型"
          :dataSource="dictObj['eam_repair_type']"
          :defValue="editData.faultReportType"
          :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
          @dataEvent="e => (editData.faultReportType = e.dictValue)"
        />
        <CustomPicker
          name="faultLevel"
          :rules="[{ required: false, message: '请选择严重程度' }]"
          label="严重程度"
          :dataSource="dictObj['eam_repair_level']"
          :defValue="editData.faultLevel"
          :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
          @dataEvent="e => (editData.faultLevel = e.dictValue)"
        />
        <CustomPicker
          required
          name="shutdown"
          :rules="[{ required: true, message: '请选择是否停机' }]"
          label="是否停机"
          :dataSource="dictObj['eam_yes_no']"
          :defValue="editData.shutdown"
          :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
          @dataEvent="e => (editData.shutdown = e.dictValue)"
        />

        <van-field
          required
          :rules="[{ required: true, message: '请输入故障描述' }]"
          v-model="editData.faultReportDescription"
          name="faultReportDescription"
          label="故障描述"
          autosize
          placeholder="故障描述"
          rows="3"
          type="textarea"
          maxlength="500"
          show-word-limit
        />
        <!-- <BasicUpload :ossId="editData?.imgOssIds" @uploadChange="e => (editData.imgOssIds = e)" /> -->

        <van-field label="附件" input-align="right" name="imgOssIds" placeholder="">
          <template #input>
            <BasicUpload :ossId="editData?.imgOssIds" @uploadChange="e => (editData.imgOssIds = e)" />
          </template>
        </van-field>
      </van-form>
    </div>
    <div class="mb-10 p-2">
      <van-button round block type="primary" @click="onSubmit"> 新增 </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { addEamRepair } from '@/api/eam/repair'
import { getEamDeviceList, getEamDeviceDetail } from '@/api/eam/device'
import { getUserList } from '@/api/system/user'
import DateTimePicker from '@/components/DateTimePicker'
import CustomSelect from '@/components/CustomSelect'
import CustomPicker from '@/components/CustomPicker'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'
import { getDict } from '@/utils/dictUtils'
import useUserStore from '@/store/modules/users'
import CodeScanner from '@/views/components/CodeScanner/index.vue'
import { parseTime } from '@/utils/index'
import BasicUpload from '@/components/BasicUpload'

const router = useRouter()

const editData = ref({
  faultReportTime: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
})
const deviceList = ref([])
const userList = ref([])

const formRef = ref()

onMounted(async () => {
  getUserInfo()
  await getDicts()
  await getDevices()
  await getUsers()
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  dictObj['eam_repair_type'] = await getDict('eam_repair_type')
  dictObj['eam_repair_level'] = await getDict('eam_repair_level')
  dictObj['eam_yes_no'] = await getDict('eam_yes_no')
}

function getUserInfo() {
  const userInfo = useUserStore().getUserInfo
  editData.value.reportUserPhone = userInfo?.user?.phonenumber
  editData.value.reportUser = userInfo?.user?.userId
}

async function getDevices() {
  try {
    const { data } = await getEamDeviceList()
    deviceList.value = data.rows ?? []
  } catch (error) {}
}

async function getUsers() {
  try {
    const { data } = await getUserList()
    userList.value = data.rows ?? []
  } catch (error) {}
}

const scanValue = ref('')
const showScan = ref(false)
const scannerRef = ref(null)

function handleScan() {
  showScan.value = true
}

async function handleDeviceCodeSearch() {
  // 接口查询id
  const { data } = await getEamDeviceList({ code: scanValue.value })
  console.log(data)
  if (data?.rows && data.rows?.length > 0) {
    editData.value.deviceId = data.rows[0].id
  } else {
    showFailToast('该编号未匹配到设备，请重新输入')
  }
}

function getScanValue(e) {
  console.log(e)
  if (!!e) {
    scanValue.value = e
    // editData.deviceId = e
  }
  showScan.value = false
}

async function onSubmit() {
  formRef.value
    .validate()
    .then(async () => {
      try {
        const { code, msg } = await addEamRepair(editData.value)
        if (code == ResultEnum.SUCCESS) {
          showSuccessToast(msg || '提交成功')
          router.back()
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
  margin: 1.5rem 0.6rem;
  padding: 0.2rem 0;
  border-radius: 4px;
  background-color: #fff;

  .van-row {
    font-size: 15px;
    padding: 0.4rem 0;
  }
}
</style>
