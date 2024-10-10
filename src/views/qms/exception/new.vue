<template>
  <div>
    <div class="content">
      <van-form ref="formRef" @submit="onSubmit" input-align="right">
        <CustomSelect
          required
          name="exceptionTypeId"
          :rules="[{ required: true, message: '请选择异常代码' }]"
          label="异常代码"
          filterOn
          :dataSource="defectList"
          :defValue="formValue.exceptionTypeId"
          :labelProps="[
            { header: '异常代码', keyName: 'code' },
            { header: '设备名称', keyName: 'name' },
          ]"
          idKey="id"
          @dataEvent="e => (formValue.exceptionTypeId = e.id)"
        />

        <CustomSelect
          name="itemId"
          required
          :rules="[{ required: true, message: '请选择物料编码' }]"
          label="物料编码"
          filterOn
          :dataSource="itemList"
          :defValue="formValue.itemId"
          :labelProps="[
            { header: '物料号', keyName: 'code' },
            { header: '名称', keyName: 'name' },
          ]"
          idKey="id"
          @dataEvent="e => (formValue.itemId = e.id)"
        />

        <CustomPicker
          name="itemType"
          label="物料类型"
          :dataSource="dictObj['qms_item_type']"
          :defValue="formValue.itemType"
          :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
          @dataEvent="e => (formValue.itemType = e.dictValue)"
        />
        <van-field v-model="formValue.quantityTotal" name="quantityTotal" label="总数量" placeholder="请输入总数量">
          <template #input>
            <van-stepper
              v-model="formValue.quantityTotal"
              :min="0"
              :input-width="formValue.quantityTotal?.length <= 2 ? 30 : formValue.quantityTotal?.length * 10 + 'px'"
            />
          </template>
        </van-field>

        <van-field
          v-model="formValue.quantity"
          name="quantity"
          required
          :rules="[{ required: true, message: '请输入异常数量' }]"
          label="异常数量"
          placeholder="异常数量"
        >
          <template #input>
            <van-stepper
              v-model="formValue.quantity"
              :min="0"
              :input-width="formValue.quantity?.length <= 2 ? 30 : formValue.quantity?.length * 10 + 'px'"
            />
          </template>
        </van-field>
        <van-field
          v-model="formValue.description"
          type="textarea"
          autosize
          name="description"
          required
          :rules="[{ required: true, message: '请输入异常描述' }]"
          label="异常描述"
          placeholder="请输入异常描述"
        />
        <CustomPicker
          label="严重程度"
          :dataSource="dictObj['qms_severity_level']"
          :defValue="formValue.severityLevel"
          :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
          @dataEvent="e => (formValue.severityLevel = e.dictValue)"
        />

        <CustomSelect
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
        <van-field name="pictureList" label="图片" placeholder="图片">
          <template #input>
            <BasicUpload :ossId="formValue?.pictureList" @uploadChange="e => (formValue.pictureList = e)" />
          </template>
        </van-field>
      </van-form>
    </div>
    <div class="mb-10 p-2">
      <van-button round block type="primary" @click="onSubmit"> 新 增 </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { addException } from '@/api/qms/exception'
import { getDefectList, getDefectDetail } from '@/api/qms/defect'
import { getItemList, getWorkStationList } from '@/api/base/index'
import { getOperationDetail, getOperationList } from '@/api/mes/operation'

import { useRouter } from 'vue-router'
import { getDict } from '@/utils/dictUtils'

import DateTimePicker from '@/components/DateTimePicker'
import CustomSelect from '@/components/CustomSelect'
import CustomPicker from '@/components/CustomPicker'
import BasicUpload from '@/components/BasicUpload'

import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
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

/**加载字典*/
const dictObj = reactive({})
const getDicts = async () => {
  dictObj['qms_severity_level'] = await getDict('qms_severity_level')
  dictObj['qms_item_type'] = await getDict('qms_item_type')
}

/**获取叶子节点*/
function getLeaNode(nodes) {
  // 获取所有具有子节点的 id
  const parentIds = new Set(nodes.map(node => node.parentId).filter(id => id !== 0))

  // 叶子节点是那些不在 parentIds 中的节点
  return nodes.filter(node => !parentIds.has(node.id))
}

/**获取异常代码列表*/
async function getDefects() {
  try {
    const { data } = await getDefectList()
    // 异常代码时不能选非叶子节点
    const leafNodes = data?.rows ? data.rows : data ? data : []

    defectList.value = getLeaNode(leafNodes)
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

async function onSubmit() {
  console.log(formValue.value)

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
