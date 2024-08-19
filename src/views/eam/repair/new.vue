<template>
  <div class="content">
    <van-form ref="formRef" @submit="onSubmit" input-align="right" validate-first scroll-to-error>
      <van-cell-group inset>
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
          :labelProps="[{ header: '', keyName: 'nickName' }]"
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
          required
          name="faultLevel"
          :rules="[{ required: true, message: '请选择严重程度' }]"
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
      </van-cell-group>
      <div class="mt-4 p-2">
        <van-button round block type="primary" native-type="submit"> 新增 </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { addEamRepair } from '@/api/eam/repair'
import { getEamDeviceList } from '@/api/eam/device'
import { getUserList } from '@/api/system/user'
import DateTimePicker from '@/components/DateTimePicker'
import CustomSelect from '@/components/CustomSelect'
import CustomPicker from '@/components/CustomPicker'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'
import { getDict } from '@/utils/dictUtils'

const router = useRouter()

const editData = ref({})
const deviceList = ref([])
const userList = ref([])

const formRef = ref()

onMounted(async () => {
  await getDicts()
  await getDevices()
  await getUsers()
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  const eam_repair_type_dict = await getDict('eam_repair_type')
  const eam_repair_level_dict = await getDict('eam_repair_level')
  const eam_yes_no_dict = await getDict('eam_yes_no')

  dictObj['eam_repair_type'] = eam_repair_type_dict
  dictObj['eam_repair_level'] = eam_repair_level_dict
  dictObj['eam_yes_no'] = eam_yes_no_dict
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
  width: 100%;
  margin: 1.2rem 0;
  padding-bottom: 4rem;
  // background-color: #f2f4f8;
}
</style>
