<template>
  <div class="content">
    <van-form @submit="onSubmit" input-align="right" scroll-to-error>
      <van-cell-group inset>
        <DateTimePicker
          labelWidth="140px"
          v-model="editData.faultReportTime"
          label="报修时间"
          name="faultReportTime"
          required
          :rules="[
            {
              required: true,
              message: '请输入报修时间',
              validator: reportTimeValidator,
              trigger: ['onChange', 'onSubmit'],
            },
          ]"
          :defTime="editData.faultReportTime"
          @getTime="e => (editData.faultReportTime = e)"
        />

        <van-field
          labelWidth="140px"
          v-model="editData.faultReportDescription"
          name="faultReportDescription"
          required
          :rules="[{ required: true, message: '请输入故障描述' }]"
          label="故障描述"
          placeholder="故障描述"
          rows="1"
          type="textarea"
          maxlength="500"
          show-word-limit
        />

        <DateTimePicker
          v-if="editData.shutdown === '1'"
          labelWidth="140px"
          name="shutdownStartTime"
          :required="editData.shutdown === '1'"
          :rules="[
            {
              required: editData.shutdown === '1',
              validator: shutdownStartTimeValidator,
              message: '请输入开始停机时间',
              trigger: ['onChange', 'onSubmit'],
            },
          ]"
          label="开始停机时间"
          :defTime="editData.shutdownStartTime"
          @getTime="e => (editData.shutdownStartTime = e)"
        />
        <DateTimePicker
          v-if="editData.shutdown === '1'"
          labelWidth="140px"
          name="shutdownEndTime"
          :required="editData.shutdown === '1'"
          :rules="[
            {
              required: editData.shutdown === '1',
              validator: shutdownEndTimeValidator,
              message: '请输入结束停机时间',
              trigger: ['onChange', 'onSubmit'],
            },
          ]"
          label="结束停机时间"
          :defTime="editData.shutdownEndTime"
          @getTime="e => (editData.shutdownEndTime = e)"
        />

        <van-field
          v-if="editData.shutdown === '1'"
          labelWidth="140px"
          disabled
          v-model="editData.qualityShutdown"
          name="qualityShutdown"
          :required="editData.shutdown === '1'"
          :rules="[{ required: editData.shutdown === '1', message: '请输入停机时间' }]"
          label="停机时间(min)"
        />

        <DateTimePicker
          labelWidth="140px"
          name="repairStartTime"
          required
          :rules="[
            {
              required: true,
              validator: repairStartTimeValidator,
              message: '请输入维修开始时间',
              trigger: ['onChange', 'onSubmit'],
            },
          ]"
          label="维修开始时间"
          :defTime="editData.repairStartTime"
          @getTime="e => (editData.repairStartTime = e)"
        />
        <DateTimePicker
          labelWidth="140px"
          name="repairEndTime"
          required
          :rules="[
            {
              required: true,
              validator: repairEndTimeValidator,
              message: '请输入维修结束时间',
              trigger: ['onChange', 'onSubmit'],
            },
          ]"
          label="维修结束时间"
          :defTime="editData.repairEndTime"
          @getTime="e => (editData.repairEndTime = e)"
        />

        <van-field
          disabled
          labelWidth="140px"
          v-model="editData.qualityRepair"
          name="qualityRepair"
          required
          :rules="[{ required: true, message: '请输入维修时间' }]"
          label="维修时间(min)"
        />
        <van-field
          disabled
          required
          labelWidth="140px"
          v-model="editData.qualityFault"
          name="qualityFault"
          label="故障累计时间(min)"
        />

        <!-- <DateTimePicker
          labelWidth="140px"
          name="acceptanceTime"
          required
          :rules="[{ required: true, message: '请输入受理时间' }]"
          label="受理时间"
          :defTime="editData.acceptanceTime"
          @getTime="e => (editData.acceptanceTime = e)"
        /> -->

        <van-field
          labelWidth="140px"
          v-model="editData.failureCause"
          name="failureCause"
          required
          :rules="[{ required: true, message: '请输入故障原因' }]"
          label="故障原因"
          autosize
          placeholder="故障原因"
          rows="1"
          type="textarea"
          maxlength="500"
          show-word-limit
        />

        <van-field
          labelWidth="140px"
          v-model="editData.solution"
          name="solution"
          required
          :rules="[{ required: true, message: '请输入解决方案' }]"
          label="解决方案"
          autosize
          placeholder="解决方案"
          rows="1"
          type="textarea"
          maxlength="500"
          show-word-limit
        />

        <CustomSelect
          labelWidth="140px"
          name="repairUser"
          required
          :rules="[{ required: true, message: '请选择维修人' }]"
          label="维修人"
          :dataSource="userList"
          :defValue="editData.repairUser"
          idKey="userId"
          :labelProps="[{ header: '', keyName: 'nickName' }]"
          filterOn
          @dataEvent="e => (editData.repairUser = e.userId)"
        />
      </van-cell-group>
      <div class="mt-4 p-2">
        <van-button round block type="primary" native-type="submit"> 提交 </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watchEffect } from 'vue'
import { getEamRepairDetail, editEamRepair } from '@/api/eam/repair'
import { getUserList } from '@/api/system/user'
import DateTimePicker from '@/components/DateTimePicker'
import CustomSelect from '@/components/CustomSelect'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'

const router = useRouter()

const editData = ref({})
const userList = ref([])
onMounted(() => {
  getDetail()
  getUsers()
})

async function getDetail() {
  if (history.state?.id) {
    try {
      const { data } = await getEamRepairDetail(history.state?.id)
      editData.value = data
    } catch (error) {}
  }
}

async function getUsers() {
  try {
    const { data } = await getUserList()
    userList.value = data.rows ?? []
  } catch (error) {}
}

async function onSubmit() {
  try {
    const { code, msg } = await editEamRepair(editData.value)
    if (code == ResultEnum.SUCCESS) {
      showSuccessToast(msg || '提交成功')
      setTimeout(() => {
        router.back()
      }, 500)
    } else {
      showFailToast('操作失败，请稍后再试...')
    }
  } catch (error) {}
}

// 时间校验
function reportTimeValidator(e) {
  const faultReportTime = new Date(e).getTime()

  if (editData.value.shutdown === '1') {
    // 不能早于停机时间
    const startTime = new Date(editData.value.shutdownStartTime).getTime()
    if (!startTime) return true
    if (faultReportTime > startTime) {
      return '报修时间不能晚于停机开始时间!'
    }
  }

  // 也不能早于维修时间
  const repairStartTime = new Date(editData.value.repairStartTime).getTime()
  if (!repairStartTime) return true
  if (faultReportTime > repairStartTime) {
    return '报修时间不能晚于维修开始时间!'
  }
}

function shutdownStartTimeValidator(e) {
  const startTime = new Date(e).getTime()
  const endTime = new Date(editData.value.shutdownEndTime).getTime()
  const faultReportTime = new Date(editData.value.faultReportTime).getTime()
  if (!endTime) return true
  if (startTime > endTime) {
    return '开始时间不能晚于结束时间!'
  }

  if (startTime < faultReportTime) {
    return '开始时间不能早于报修时间!'
  }
}

function shutdownEndTimeValidator(e) {
  const endTime = new Date(e).getTime()
  const startTime = new Date(editData.value.shutdownStartTime).getTime()
  if (!startTime) return true
  if (startTime > endTime) {
    return '结束时间不能早于开始时间!'
  }
}

function repairStartTimeValidator(e) {
  const startTime = new Date(e).getTime()
  const endTime = new Date(editData.value.repairEndTime).getTime()
  if (!endTime) return true
  if (startTime > endTime) {
    return '开始时间不能晚于结束时间!'
  }
}

function repairEndTimeValidator(e) {
  const endTime = new Date(e).getTime()
  const startTime = new Date(editData.value.repairStartTime).getTime()
  if (!startTime) return true
  if (startTime > endTime) {
    return '结束时间早于开始时间!'
  }
}

// 计算停机时间
watchEffect(() => {
  // 停机时间=停机结束时间-停机开始时间，字段为空时为0
  if (
    editData.value.shutdownEndTime &&
    editData.value.shutdownStartTime &&
    editData.value.shutdownEndTime > editData.value.shutdownStartTime
  ) {
    const endTime = new Date(editData.value.shutdownEndTime).getTime()
    const startTime = new Date(editData.value.shutdownStartTime).getTime()
    editData.value.qualityShutdown = ((endTime - startTime) / 60000).toFixed(2)
  } else {
    editData.value.qualityShutdown = 0
  }
  // 维修时间=维修结束时间-维修开始时间
  if (
    editData.value.repairEndTime &&
    editData.value.repairStartTime &&
    editData.value.repairEndTime > editData.value.repairStartTime
  ) {
    const endTime = new Date(editData.value.repairEndTime).getTime()
    const startTime = new Date(editData.value.repairStartTime).getTime()
    editData.value.qualityRepair = ((endTime - startTime) / 60000).toFixed(2)
  } else {
    editData.value.qualityRepair = 0
  }

  // 故障累计时间=维修结束时间-报修时间
  if (
    editData.value.repairEndTime &&
    editData.value.faultReportTime &&
    editData.value.repairEndTime > editData.value.faultReportTime
  ) {
    const endTime = new Date(editData.value.repairEndTime).getTime()
    const startTime = new Date(editData.value.faultReportTime).getTime()
    editData.value.qualityFault = ((endTime - startTime) / 60000).toFixed(2)
  } else {
    editData.value.qualityFault = 0
  }
})
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  margin: 1.2rem 0;
  padding-bottom: 4rem;
}
</style>
