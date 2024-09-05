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

        <CustomSelect
          required
          name="qualityPlanId"
          :rules="[{ required: true, message: '请选择保养方案' }]"
          label="保养方案"
          filterOn
          :dataSource="planList"
          :defValue="editData.qualityPlanId"
          :labelProps="[
            { header: '方案号', keyName: 'code' },
            { header: '方案名称', keyName: 'name' },
          ]"
          @dataEvent="e => (editData.qualityPlanId = e.id)"
        />

        <CustomPicker
          required
          name="subtype"
          :rules="[{ required: true, message: '请选择保养类型' }]"
          label="保养类型"
          :dataSource="dictObj['eam_maintenance_type']"
          :defValue="editData.subtype"
          :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
          @dataEvent="e => (editData.subtype = e.dictValue)"
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
import { getEamDeviceList } from '@/api/eam/device'
import { getQualityPlanList } from '@/api/eam/qualityPlan'
import { addEamDeviceSpotInspection } from '@/api/eam/deviceSpotInspection'
import CustomSelect from '@/components/CustomSelect'
import CustomPicker from '@/components/CustomPicker'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'
import { getDict } from '@/utils/dictUtils'

const router = useRouter()

const editData = ref({})
const deviceList = ref([])
const planList = ref([])

const formRef = ref()

onMounted(async () => {
  await getDicts()
  await getDevices()
  await getQualityPlans()
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  const eam_maintenance_type = await getDict('eam_maintenance_type')
  dictObj['eam_maintenance_type'] = eam_maintenance_type
}

async function getDevices() {
  try {
    const { data } = await getEamDeviceList()
    deviceList.value = data.rows ?? []
  } catch (error) {}
}

async function getQualityPlans() {
  try {
    const { data } = await getQualityPlanList()
    planList.value = data.rows ?? []
  } catch (error) {}
}

async function onSubmit() {
  editData.value.type = '2'

  formRef.value
    .validate()
    .then(async () => {
      try {
        const { code, msg } = await addEamDeviceSpotInspection(editData.value)
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
