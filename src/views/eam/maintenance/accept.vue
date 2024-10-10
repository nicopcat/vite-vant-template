<template>
  <div class="content">
    <div class="m-2 py-2 rounded-sm bg-white">
      <van-form ref="formRef" input-align="right" validate-first scroll-to-error>
        <CustomSelect
          disabled
          readonly
          label="设备名称"
          filterOn
          :dataSource="deviceList"
          :defValue="formValue.deviceId"
          :labelProps="[
            { header: '设备名称', keyName: 'name' },
            { header: '设备编号', keyName: 'code' },
          ]"
          idKey="id"
          @dataEvent="e => (formValue.deviceId = e.id)"
        />

        <DateTimePicker
          v-model="formValue.expectMaintenanceTime"
          label="预计保养时间"
          labelWidth="7em"
          required
          name="expectMaintenanceTime"
          :rules="[{ required: true, message: '请选择预计保养时间' }]"
          :defTime="formValue.expectMaintenanceTime"
          @getTime="e => (formValue.expectMaintenanceTime = e)"
        />
        <CustomSelect
          required
          name="maintenanceUser"
          :rules="[{ required: true, message: '请选择保养人' }]"
          label="保养人"
          filterOn
          :dataSource="userList"
          :defValue="formValue.maintenanceUser"
          idKey="userId"
          :labelProps="[
            { header: '用户昵称', keyName: 'nickName' },
            { header: '用户名称', keyName: 'userName' },
          ]"
          @dataEvent="e => (formValue.maintenanceUser = e.userId)"
        />
        <van-field name="actual" label="是否委外">
          <template #input>
            <van-switch v-model="isOutsource" />
          </template>
        </van-field>
        <van-field
          required
          v-model="formValue.outsourceReason"
          name="outsourceReason"
          :rules="[{ required: true, message: '请填写委外原因' }]"
          label="委外原因"
          type="textarea"
          placeholder="请填写委外原因"
          v-if="isOutsource === true"
        />
        <van-field
          required
          v-model="formValue.outsourceSupply"
          name="outsourceSupply"
          :rules="[{ required: true, message: '请填写委外供方' }]"
          label="委外供方"
          type="textarea"
          placeholder="请填写委外供方"
          v-if="isOutsource === true"
        />
      </van-form>
    </div>
    <div class="w-full">
      <van-button type="primary" round class="w-full my-4" @click="onSubmit">确认</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { updatePending } from '@/api/eam/maintenance'
import { getEamDeviceList } from '@/api/eam/device'
import { getDict } from '@/utils/dictUtils'
import CustomSelect from '@/components/CustomSelect'
import { parseTime } from '@/utils/index'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
import DateTimePicker from '@/components/DateTimePicker'
import { getUserList } from '@/api/system/user'

const router = useRouter()

onMounted(async () => {
  await getDicts()
  await getDeviceList()
  await getUsers()
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  dictObj['eam_maintenance_type'] = await getDict('eam_maintenance_type')
  dictObj['eam_yes_no'] = await getDict('eam_yes_no')
}

const userList = ref([])
const deviceList = ref([])

const formRef = ref()
const formValue = ref({
  id: history.state?.id,
  deviceId: history.state?.deviceId,
  maintenanceUser: '',
  expectMaintenanceTime: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
  isOutsource: '',
  outsourceReason: '',
  outsourceSupply: '',
})
const isOutsource = ref(false)
async function getDeviceList() {
  try {
    const { data } = await getEamDeviceList()
    deviceList.value = data.rows
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
      formValue.value.isOutsource = isOutsource.value ? '1' : '0'
      console.log(formValue.value)
      try {
        const { code, msg } = await updatePending(formValue.value)
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
page {
  background-color: #f2f4f8;
}

.content {
  width: 100%;
  margin: 1rem 0;
  background-color: #f2f4f8;
  .required:before {
    margin-right: 2px;
    color: var(--van-field-required-mark-color);
    content: '*';
  }
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

  .container {
    width: 100%;
    background-color: #f2f4f8;
    padding-bottom: 3rem;

    .box {
      background-color: #fff;
      padding: 0.5rem 1rem;
      margin: 10px 10px;
      margin-bottom: 1rem;

      &-item {
        margin: 0.4rem;
      }
    }
  }
}
</style>
