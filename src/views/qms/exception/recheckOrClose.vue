<template>
  <div class="content">
    <van-form @submit="onSubmit" input-align="right" validate-first scroll-to-error>
      <van-cell-group inset>
        <van-field
          v-model="formValue.workingHours"
          label="工时(min)"
          placeholder="工时(min)"
          name="workingHours"
          :required="isRecheck"
          :rules="isRecheck ? [{ required: true, message: '请输入工时' }] : null"
        >
          <template #input>
            <van-stepper v-model="formValue.workingHours" />
          </template>
        </van-field>

        <CustomPicker
          :required="isRecheck"
          name="workingHoursType"
          :rules="isRecheck ? [{ required: true, message: '请选择工时分类' }] : null"
          label="工时分类"
          :dataSource="dictObj['qms_working_hours_type']"
          :defValue="formValue.workingHoursType"
          :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
          @dataEvent="e => (formValue.workingHoursType = e.dictValue)"
        />

        <van-field v-model="formValue.handleClassId" name="handleClassId" label="处理班组" placeholder="处理班组" />
        <CustomSelect
          name="handleBy"
          :required="isRecheck"
          :rules="isRecheck ? [{ required: true, message: '请输入处理人' }] : null"
          label="处理人"
          :dataSource="userList"
          :defValue="formValue.handleBy"
          idKey="userId"
          :labelProps="[{ header: '', keyName: 'nickName' }]"
          filterOn
          @dataEvent="e => (formValue.handleBy = e.userId)"
        />

        <DateTimePicker
          name="handleTime"
          label="处理时间"
          :defTime="formValue.handleTime"
          v-model="formValue.handleTime"
          @getTime="e => (formValue.handleTime = e)"
        />

        <van-field
          v-model="formValue.handleDescription"
          name="handleDescription"
          required
          :rules="[{ required: true, message: '请输入处理描述' }]"
          label="处理描述"
          autosize
          placeholder="处理描述"
          rows="3"
          type="textarea"
          maxlength="500"
          show-word-limit
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
import { closeException, recheckException } from '@/api/qms/exception'

import { getUserList } from '@/api/system/user'
import DateTimePicker from '@/components/DateTimePicker'
import CustomSelect from '@/components/CustomSelect'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'
import CustomPicker from '@/components/CustomPicker'
import useUserStore from '@/store/modules/users'
import { getDict } from '@/utils/dictUtils'
import { parseTime } from '@/utils/index'

const router = useRouter()

const userList = ref([])
const formValue = ref({
  id: history.state?.id,
  handleBy: '',
  handleClassId: '',
  handleDescription: '',
  handleTime: parseTime(new Date(), `{y}-{m}-{d} {h}:{i}:{s}`),
  workingHours: '',
  workingHoursType: '',
})

const isRecheck = ref(false)
onMounted(() => {
  getDicts()
  getUserInfo()
  getUsers()
  console.log(history.state?.type)
  isRecheck.value = history.state?.type === 'recheck'
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  dictObj['qms_working_hours_type'] = await getDict('qms_working_hours_type')
}

function getUserInfo() {
  const userInfo = useUserStore().getUserInfo
  formValue.value.handleBy = userInfo.user.userId + ''
}

async function getUsers() {
  try {
    const { data } = await getUserList()
    userList.value = data.rows ?? []
  } catch (error) {}
}

async function onSubmit() {
  console.log(formValue.value)
  const apiType = isRecheck.value ? recheckException : closeException
  try {
    const { code, msg } = await apiType(formValue.value)
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

:deep(.van-stepper__input) {
  width: 40px;
}
</style>
