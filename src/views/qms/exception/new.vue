<template>
  <div class="content mt-5 mx-2 mb-10 pb-10">
    <div class="content-box rounded py-2 bg-white">
      <van-form class="" ref="formRef" @submit="onSubmit" input-align="right" validate-first scroll-to-error>
        <CustomSelect
          required
          name="exceptionTypeId"
          :rules="[{ required: true, message: '请选择异常代码' }]"
          label="异常代码"
          filterOn
          :dataSource="defectList"
          :defValue="formValue.exceptionTypeId"
          :labelProps="[
            { header: '设备名称', keyName: 'name' },
            { header: '异常代码', keyName: 'code' },
          ]"
          idKey="id"
          @dataEvent="e => (formValue.exceptionTypeId = e.id)"
        />

        <CustomSelect
          required
          name="itemId"
          :rules="[{ required: true, message: '请选择物料编码' }]"
          label="物料编码"
          filterOn
          :dataSource="itemList"
          :defValue="formValue.itemId"
          :labelProps="[
            { header: '物料号', keyName: 'code' },
            { header: '名称', keyName: 'name' },
          ]"
          @dataEvent="e => (formValue.itemId = e.id)"
        />

        <CustomPicker
          required
          name="itemType"
          :rules="[{ required: true, message: '请选择物料类型' }]"
          label="物料类型"
          :dataSource="dictObj['qms_item_type']"
          :defValue="formValue.itemType"
          :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
          @dataEvent="e => (formValue.itemType = e.dictValue)"
        />

        <van-field
          v-model="formValue.quantityTotal"
          type="number"
          name="quantityTotal"
          label="总数量"
          placeholder="总数量"
        />
        <van-field v-model="formValue.quantity" type="number" name="quantity" label="异常数量" placeholder="异常数量" />
        <van-field
          v-model="formValue.description"
          type="textarea"
          autosize
          name="description"
          label="异常描述"
          placeholder="异常描述"
        />
        <CustomPicker
          required
          name="severityLevel"
          :rules="[{ required: true, message: '请选择严重程度' }]"
          label="严重程度"
          :dataSource="dictObj['qms_severity_level']"
          :defValue="formValue.severityLevel"
          :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
          @dataEvent="e => (formValue.severityLevel = e.dictValue)"
        />

        <CustomSelect
          required
          name="operationId"
          :rules="[{ required: true, message: '请选择工序' }]"
          label="工序"
          filterOn
          :dataSource="operationList"
          :defValue="formValue.operationId"
          :labelProps="[
            { header: '工序编码', keyName: 'operation' },
            { header: '工序名称', keyName: 'name' },
          ]"
          @dataEvent="e => (formValue.operationId = e.id)"
        />
        <CustomSelect
          required
          name="workStationId"
          :rules="[{ required: true, message: '请选择工位' }]"
          label="工位"
          filterOn
          :dataSource="workStationList"
          :defValue="formValue.workStationId"
          :labelProps="[
            { header: '工位编码', keyName: 'code' },
            { header: '工位名称', keyName: 'name' },
          ]"
          @dataEvent="e => (formValue.workStationId = e.id)"
        />
        <van-field v-model="formValue.psn" name="psn" label="序列号" placeholder="序列号" />
        <van-field v-model="formValue.pictureList" name="psn" label="图片" placeholder="图片">
          <template #input>
            <BasicUpload @uploadChange="uploadChange" />
          </template>
        </van-field>

        <div class="mt-4 p-2">
          <van-button round block type="primary" native-type="submit"> 新 增 </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { addException } from '@/api/qms/exception'
import { getDefectList, getDefectDetail } from '@/api/qms/defect'
import { getItemList, getWorkStationList } from '@/api/base/index'
import { getOperationDetail, getOperationList } from '@/api/mes/operation'

import DateTimePicker from '@/components/DateTimePicker'
import CustomSelect from '@/components/CustomSelect'
import CustomPicker from '@/components/CustomPicker'
import BasicUpload from '@/components/BasicUpload'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'
import { getDict } from '@/utils/dictUtils'

const router = useRouter()

const formValue = ref({})

const defectList = ref([])
const itemList = ref([])
const operationList = ref([])
const workStationList = ref([])

const formRef = ref()

onMounted(async () => {
  await getDicts()
  await getDefects()
  await getItems()
  await getOperations()
  await getWorkStations()
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  dictObj['qms_severity_level'] = await getDict('qms_severity_level')
  dictObj['qms_item_type'] = await getDict('qms_item_type')
}

async function getDefects() {
  try {
    const { data } = await getDefectList()
    defectList.value = data?.rows ? data.rows : data ? data : []
  } catch (error) {}
}

async function getItems() {
  try {
    const { data } = await getItemList()
    itemList.value = data?.rows ? data.rows : data ? data : []
  } catch (error) {}
}

async function getOperations() {
  try {
    const { data } = await getOperationList()
    operationList.value = data?.rows ? data.rows : data ? data : []
  } catch (error) {}
}
async function getWorkStations() {
  try {
    const { data } = await getWorkStationList()
    workStationList.value = data?.rows ? data.rows : data ? data : []
  } catch (error) {}
}

const uploadChange = (e) =>{
  console.log(e);
}

async function onSubmit() {
  console.log('okk')
  console.log(formValue.value)
  return

  formRef.value
    .validate()
    .then(async () => {
      try {
        const { code, msg } = await addException(formValue.value)
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
// .content {
//   width: 100%;
//   margin: 1rem 0;
//   background-color: #f2f4f8;

//   &-box {
//     padding: 0.2rem 0;
//     border-radius: 4px;
//     background-color: #fff;
//     margin: 1.5rem 0.6rem;

//     .van-row {
//       font-size: 15px;
//       padding: 0.4rem 0;
//     }
//   }
// }
</style>
