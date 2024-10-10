<template>
  <div class="content">
    <van-form ref="formRef" @submit="onSubmit" input-align="right">
      <van-field
        v-model="formValue.workingHours"
        label="工时(min)"
        placeholder="请输入工时"
        name="workingHours"
        type="number"
        :required="isRequired"
        :rules="[
          {
            required: isRequired,
            validator: workingHoursValidator,
            message: '请输入工时',
            type: 'number',
          },
        ]"
      />

      <CustomPicker
        :required="isRequired"
        name="workingHoursType"
        :rules="[{ required: isRequired, message: '请选择工时分类' }]"
        label="工时分类"
        :dataSource="dictObj['qms_working_hours_type']"
        :defValue="formValue.workingHoursType"
        :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
        @dataEvent="e => (formValue.workingHoursType = e.dictValue)"
      />
      <CustomSelect
        label="处理班组"
        filterOn
        :dataSource="classList"
        :defValue="formValue.handleClassId"
        :labelProps="[
          { header: '处理班组名称', keyName: 'name' },
          { header: '处理班组编码', keyName: 'code' },
        ]"
        @dataEvent="e => (formValue.handleClassId = e.id)"
      />
      <!-- <van-field v-model="formValue.handleClassId" name="handleClassId" label="处理班组" placeholder="处理班组" /> -->
      <CustomSelect
        name="handleBy"
        :required="isRequired"
        :rules="[{ required: isRequired, message: '请输入处理人' }]"
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
        placeholder="请输入处理描述"
        rows="3"
        type="textarea"
        maxlength="500"
        show-word-limit
      />

      <div class="mt-4 p-2">
        <van-button round block type="primary" native-type="submit"> 提交 </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { recheckException } from '@/api/qms/exception'
import { getUserList } from '@/api/system/user'
import { listClass } from '@/api/base/index'

import useUserStore from '@/store/modules/users'
import { useRouter } from 'vue-router'
import { showFailToast, showSuccessToast } from 'vant'
import { ResultEnum } from '@/config/constant'
import { getDict } from '@/utils/dictUtils'
import { parseTime } from '@/utils/index'

import CustomPicker from '@/components/CustomPicker'
import DateTimePicker from '@/components/DateTimePicker'
import CustomSelect from '@/components/CustomSelect'

const router = useRouter()

const formValue = ref({
  id: history.state?.id,
  handleBy: '',
  handleClassId: '',
  handleDescription: '',
  handleTime: parseTime(new Date(), `{y}-{m}-{d} {h}:{i}:{s}`),
  workingHours: null,
  workingHoursType: '',
})

const isRequired = ref(false)
const formRef = ref(null)

const userList = ref([])
const classList = ref([])

onMounted(() => {
  getDicts()
  getUserInfo()
  getUsers()
  getClassList()
  const defectDecision = history.state?.defectDecision
  isRequired.value = defectDecision === '返工' || defectDecision === '返修'
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  dictObj['qms_working_hours_type'] = await getDict('qms_working_hours_type')
}

function getUserInfo() {
  const userInfo = useUserStore().getUserInfo
  formValue.value.handleBy = userInfo?.user?.userId
}

async function getUsers() {
  try {
    const { data } = await getUserList()
    userList.value = data.rows ?? []
  } catch (error) {}
}

async function getClassList() {
  try {
    const { data } = await listClass()
    classList.value = data?.rows ? data.rows : data ? data : []
  } catch (error) {}
}

const workingHoursValidator = e => {
  if (Number(e) < 0) {
    return '请输入正数'
  }
}

async function onSubmit() {
  formRef.value
    .validate()
    .then(async () => {
      console.log(formValue.value)

      try {
        const { code, msg } = await recheckException(formValue.value)
        if (code == ResultEnum.SUCCESS) {
          showSuccessToast(msg || '提交成功')
          setTimeout(() => {
            router.back()
          }, 500)
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
:deep(.van-stepper__input) {
  width: 40px;
}
</style>
