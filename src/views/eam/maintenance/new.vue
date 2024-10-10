<template>
  <div>
    <div class="content">
      <van-form ref="formRef" input-align="right">
        <CustomSelect
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
          :rules="[{ required: true, message: '请选择保养类型' }]"
          label="保养类型"
          :dataSource="dictObj['eam_maintenance_type']"
          :defValue="formValue.type"
          :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
          @dataEvent="e => (formValue.type = e.dictValue)"
        />
        <DateTimePicker
          v-model="formValue.planStartTime"
          label="计划开始时间"
          labelWidth="7em"
          required
          name="planStartTime"
          :rules="[
            {
              required: true,
              message: '请选择计划开始时间',
              validator: planStartTimeValidator,
              trigger: ['onChange', 'onSubmit'],
            },
          ]"
          :defTime="formValue.planStartTime"
          @getTime="e => (formValue.planStartTime = e)"
        />
        <DateTimePicker
          v-model="formValue.planEndTime"
          label="计划结束时间"
          labelWidth="7em"
          required
          name="planEndTime"
          :rules="[
            {
              required: true,
              message: '请选择计划结束时间',
              validator: planEndTimeValidator,
              trigger: ['onChange', 'onSubmit'],
            },
          ]"
          :defTime="formValue.planEndTime"
          @getTime="e => (formValue.planEndTime = e)"
        />
        <div class="px-2">
          <van-field
            v-model="formValue.remark"
            name="remark"
            label="保养说明"
            placeholder="保养说明"
            rows="1"
            type="textarea"
            maxlength="500"
            show-word-limit
          />
        </div>
      </van-form>
    </div>
    <div class="mb-10 p-2">
      <van-button type="primary" round block @click="onSubmit">确认</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { addEamMaintenance } from '@/api/eam/maintenance'
import { getEamDeviceList } from '@/api/eam/device'
import { getDict } from '@/utils/dictUtils'
import CustomSelect from '@/components/CustomSelect'
import CustomPicker from '@/components/CustomPicker'
import { parseTime } from '@/utils/index'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
import DateTimePicker from '@/components/DateTimePicker'

const router = useRouter()

onMounted(async () => {
  await getDicts()
  await getDeviceList()
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  dictObj['eam_maintenance_type'] = await getDict('eam_maintenance_type')
  dictObj['eam_yes_no'] = await getDict('eam_yes_no')
}

const deviceList = ref([])

const formRef = ref()
const formValue = ref({
  deviceId: '',
  type: '',
  planStartTime: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
  planEndTime: parseTime(new Date().getTime() + 60000, '{y}-{m}-{d} {h}:{i}:{s}'),
  remark: '',
})

async function getDeviceList() {
  try {
    const { data } = await getEamDeviceList()
    deviceList.value = data.rows
  } catch (error) {}
}

// 时间校验
function planStartTimeValidator(e) {
  const startTime = new Date(e).getTime()
  const endTime = new Date(formValue.value.planEndTime).getTime()
  if (!endTime) return true
  if (endTime < startTime) {
    return '计划开始时间不能晚于计划结束时间!'
  }
}

function planEndTimeValidator(e) {
  const endTime = new Date(e).getTime()
  const startTime = new Date(formValue.value.planStartTime).getTime()
  if (!startTime) return true
  if (endTime < startTime) {
    return '计划结束时间不能早于计划开始时间!'
  }
}

async function onSubmit() {
  formRef.value
    .validate()
    .then(async () => {
      try {
        const { code, msg } = await addEamMaintenance(formValue.value)
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
