<template>
  <div class="">
    <div class="content">
      <van-form ref="formRef" @submit="onSubmit" input-align="right">
        <!-- <BasicUpload  /> -->

        <CustomSelect
          required
          name="deviceId"
          :rules="[{ required: true, message: '请选择设备' }]"
          label="设备"
          filterOn
          :dataSource="deviceList"
          :defValue="editData.deviceId"
          :labelProps="[
            { header: '设备编码', keyName: 'code' },
            { header: '设备名称', keyName: 'name' },
          ]"
          idKey="id"
          @dataEvent="e => (editData.deviceId = e.id)"
        />

        <CustomPicker
          required
          name="type"
          :rules="[{ required: true, message: '请选择检验类型' }]"
          label="检验类型"
          :dataSource="dictObj['eam_quality_plan_cycle']"
          :defValue="editData.type"
          :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
          @dataEvent="e => (editData.type = e.dictValue)"
        />
        <CustomPicker
          label="班次"
          :dataSource="dictObj['eam_spot_inspection_shift']"
          :defValue="editData.shift"
          :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
          @dataEvent="e => (editData.shift = e.dictValue)"
        />
      </van-form>
    </div>
    <div class="mb-10 p-2">
      <van-button round block type="primary" @click="onSubmit"> 新 增 </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { getEamDeviceList } from '@/api/eam/device'
import { addEamSpotInspection } from '@/api/eam/spotInspection'
import CustomSelect from '@/components/CustomSelect'
import CustomPicker from '@/components/CustomPicker'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'
import { getDict } from '@/utils/dictUtils'

const router = useRouter()

const editData = ref({})
const deviceList = ref([])

const formRef = ref()

onMounted(async () => {
  await getDicts()
  await getDevices()
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  dictObj['eam_quality_plan_cycle'] = await getDict('eam_quality_plan_cycle')
  dictObj['eam_spot_inspection_shift'] = await getDict('eam_spot_inspection_shift')
}

async function getDevices() {
  try {
    const { data } = await getEamDeviceList()
    deviceList.value = data.rows ?? []
  } catch (error) {}
}

async function onSubmit() {
  formRef.value
    .validate()
    .then(async () => {
      try {
        const { code, msg } = await addEamSpotInspection(editData.value)
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
