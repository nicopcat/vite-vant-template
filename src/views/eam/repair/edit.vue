<template>
  <div class="content">
    <van-form @submit="onSubmit" input-align="right" validate-first scroll-to-error>
      <van-cell-group inset>
        <DateTimePicker
          v-model="editData.faultReportTime"
          label="报修时间"
          name="faultReportTime"
          :defTime="editData.faultReportTime"
          @getTime="e => (editData.faultReportTime = e)"
        />

        <van-field
          v-model="editData.faultReportDescription"
          name="faultReportDescription"
          label="故障描述"
          placeholder="故障描述"
          rows="1"
          type="textarea"
          maxlength="500"
          show-word-limit
        />

        <DateTimePicker
          name="shutdownStartTime"
          label="开始停机时间"
          :defTime="editData.shutdownStartTime"
          @getTime="e => (editData.shutdownStartTime = e)"
        />
        <DateTimePicker
          name="shutdownEndTime"
          label="结束停机时间"
          :defTime="editData.shutdownEndTime"
          @getTime="e => (editData.shutdownEndTime = e)"
        />

        <DateTimePicker
          name="repairStartTime"
          label="维修开始时间"
          :defTime="editData.repairStartTime"
          @getTime="e => (editData.repairStartTime = e)"
        />
        <DateTimePicker
          name="repairEndTime"
          label="维修结束时间"
          :defTime="editData.repairEndTime"
          @getTime="e => (editData.repairEndTime = e)"
        />

        <DateTimePicker
          name="acceptanceTime"
          label="受理时间"
          :defTime="editData.acceptanceTime"
          @getTime="e => (editData.acceptanceTime = e)"
        />

        <van-field
          v-model="editData.failureCause"
          name="failureCause"
          label="故障原因"
          autosize
          placeholder="故障原因"
          rows="1"
          type="textarea"
          maxlength="500"
          show-word-limit
        />

        <van-field
          v-model="editData.solution"
          name="solution"
          label="解决方案"
          autosize
          placeholder="解决方案"
          rows="1"
          type="textarea"
          maxlength="500"
          show-word-limit
        />

        <CustomSelect
          name="repairUser"
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
import { ref, onMounted, reactive } from 'vue'
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

async function onSubmit(values) {
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
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  margin: 1.2rem 0;
  padding-bottom: 4rem;
}
</style>
