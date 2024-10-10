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
            <van-stepper v-model="formValue.quantityTotal" :min="0" input-width="40px" />
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
            <van-stepper v-model="formValue.quantity" :min="1" input-width="40px" />
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
        <van-field v-model="formValue.psn" name="psn" label="序列号" placeholder="序列号" />

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
        <van-field
          type="textarea"
          maxlength="200"
          show-word-limit
          v-model="formValue.remark"
          autosize
          name="remark"
          label="备注"
          placeholder="备注"
        />
        <van-field name="pictureList" label="图片" placeholder="图片">
          <template #input>
            <BasicUpload :ossId="formValue?.pictureList" @uploadChange="e => (formValue.pictureList = e)" />
          </template>
        </van-field>

        <CustomSelect
          label="决策"
          name="defectDecision"
          required
          :rules="[{ required: true, message: '请选择决策' }]"
          filterOn
          :dataSource="exceptionDecisionList"
          :defValue="formValue.defectDecision"
          :labelProps="[
            { header: '决策名称', keyName: 'name' },
            { header: '决策编码', keyName: 'code' },
          ]"
          @dataEvent="e => (formValue.defectDecision = e.id)"
        />

        <CustomSelect
          label="责任班组"
          filterOn
          :dataSource="classList"
          :defValue="formValue.classId"
          :labelProps="[
            { header: '责任班组名称', keyName: 'name' },
            { header: '责任班组编码', keyName: 'code' },
          ]"
          @dataEvent="e => (formValue.classId = e.id)"
        />

        <CustomSelect
          label="责任人"
          filterOn
          :dataSource="userList"
          :defValue="formValue.responseBy"
          idKey="userId"
          :labelProps="[
            { header: '用户昵称', keyName: 'nickName' },
            { header: '用户名称', keyName: 'userName' },
          ]"
          @dataEvent="e => (formValue.responseBy = e.userId)"
        />

        <van-field
          type="textarea"
          maxlength="200"
          show-word-limit
          v-model="formValue.reasonDescription"
          autosize
          name="reasonDescription"
          label="原因描述"
          placeholder="原因描述"
        />

        <van-field
          required
          :rules="[{ required: true, message: '请输入处理意见' }]"
          type="textarea"
          maxlength="200"
          show-word-limit
          v-model="formValue.handleOpinion"
          autosize
          name="handleOpinion"
          label="处理意见"
          placeholder="处理意见"
        />

        <CustomSelect
          label="供应商"
          filterOn
          :dataSource="supplierList"
          :defValue="formValue.vendorId"
          :labelProps="[
            { header: '供应商名称', keyName: 'name' },
            { header: '供应商编码', keyName: 'code' },
          ]"
          @dataEvent="e => (formValue.vendorId = e.id)"
        />
      </van-form>
    </div>
    <div class="mb-10 p-2">
      <van-button class="mb-2" round block type="primary" @click="splitEvent"> 分 拆 </van-button>
      <van-button class="mb-2" round block type="primary" @click="onSubmit"> 提 交 </van-button>
    </div>

    <van-action-sheet v-model:show="showModal" title="处理拆分" @closed="showModal = false">
      <div class="m-2 py-2 rounded-sm bg-white my-4">
        <van-form ref="splitFormRef" input-align="left">
          <CustomSelect
            input-align="left"
            required
            name="exceptionTypeId"
            :rules="[{ required: true, message: '请选择异常代码' }]"
            label="异常代码"
            filterOn
            :dataSource="defectList"
            :defValue="splitFormValue.exceptionTypeId"
            :labelProps="[
              { header: '异常代码', keyName: 'code' },
              { header: '设备名称', keyName: 'name' },
            ]"
            idKey="id"
            @dataEvent="e => (splitFormValue.exceptionTypeId = e.id)"
          />

          <CustomSelect
            input-align="left"
            name="itemId"
            required
            :rules="[{ required: true, message: '请选择物料编码' }]"
            label="物料编码"
            filterOn
            :dataSource="itemList"
            :defValue="splitFormValue.itemId"
            :labelProps="[
              { header: '物料号', keyName: 'code' },
              { header: '名称', keyName: 'name' },
            ]"
            idKey="id"
            @dataEvent="e => (splitFormValue.itemId = e.id)"
          />

          <CustomPicker
            input-align="left"
            name="itemType"
            label="物料类型"
            :dataSource="dictObj['qms_item_type']"
            :defValue="splitFormValue.itemType"
            :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
            @dataEvent="e => (splitFormValue.itemType = e.dictValue)"
          />
          <van-field
            v-model="splitFormValue.quantityTotal"
            name="quantityTotal"
            label="总数量"
            placeholder="请输入总数量"
          >
            <template #input>
              <van-stepper v-model="splitFormValue.quantityTotal" :min="1" input-width="40px" />
            </template>
          </van-field>

          <van-field
            v-model="splitFormValue.quantity"
            name="quantity"
            required
            :rules="[{ required: true, message: '请输入异常数量' }]"
            label="异常数量"
            placeholder="异常数量"
          >
            <template #input>
              <van-stepper v-model="splitFormValue.quantity" :min="0" input-width="40px" />
            </template>
          </van-field>
          <van-field
            v-model="splitFormValue.description"
            type="textarea"
            autosize
            name="description"
            required
            :rules="[{ required: true, message: '请输入异常描述' }]"
            label="异常描述"
            placeholder="请输入异常描述"
          />
          <CustomPicker
            input-align="left"
            label="严重程度"
            :dataSource="dictObj['qms_severity_level']"
            :defValue="splitFormValue.severityLevel"
            :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
            @dataEvent="e => (splitFormValue.severityLevel = e.dictValue)"
          />

          <CustomSelect
            input-align="left"
            label="工序"
            filterOn
            :dataSource="operationList"
            :defValue="splitFormValue.operationId"
            :labelProps="[
              { header: '工序编码', keyName: 'operation' },
              { header: '工序名称', keyName: 'name' },
            ]"
            @dataEvent="e => (splitFormValue.operationId = e.id)"
          />
          <CustomSelect
            input-align="left"
            label="工位"
            filterOn
            :dataSource="workStationList"
            :defValue="splitFormValue.workStationId"
            :labelProps="[
              { header: '工位编码', keyName: 'code' },
              { header: '工位名称', keyName: 'name' },
            ]"
            @dataEvent="e => (splitFormValue.workStationId = e.id)"
          />
          <van-field v-model="splitFormValue.psn" name="psn" label="序列号" placeholder="序列号" />
          <van-field
            type="textarea"
            maxlength="200"
            show-word-limit
            v-model="splitFormValue.remark"
            autosize
            name="psn"
            label="备注"
            placeholder="备注"
          />
          <van-field name="pictureList" label="图片" placeholder="图片">
            <template #input>
              <BasicUpload :ossId="splitFormValue?.pictureList" @uploadChange="e => (splitFormValue.pictureList = e)" />
            </template>
          </van-field>
        </van-form>
      </div>
      <div class="flex flex-row mb-6 w-full justify-end">
        <van-button type="" size="small" class="mr-4" @click="cancelSplit">取消</van-button>
        <van-button type="primary" size="small" class="mr-4" @click="confirmSplit">提交</van-button>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { getExceptionDetail, listExceptionDecision, splitException, handlingException } from '@/api/qms/exception'
import { getUserList } from '@/api/system/user'
import { getDefectList } from '@/api/qms/defect'
import { getItemList, getWorkStationList } from '@/api/base/index'
import { getOperationList } from '@/api/mes/operation'
import { listClass, listSupplier } from '@/api/base/index'

import useUserStore from '@/store/modules/users'
import { useRouter } from 'vue-router'
import { getDict } from '@/utils/dictUtils'

import BasicUpload from '@/components/BasicUpload'
import CustomPicker from '@/components/CustomPicker'
import CustomSelect from '@/components/CustomSelect'

import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast, showConfirmDialog } from 'vant'

const router = useRouter()

const userList = ref([])
const formRef = ref(null)
const formValue = ref({})
const defectList = ref([])
const itemList = ref([])
const operationList = ref([])
const workStationList = ref([])
const exceptionDecisionList = ref([])
const classList = ref([])
const supplierList = ref([])

// split
const showModal = ref(false)
const splitFormValue = ref({
  id: '',
  code: '',
  exceptionTypeId: '',
  itemId: '',
  itemType: '',
  quantityTotal: 0,
  quantity: 0,
  description: '',
  severityLevel: '',
  operationId: '',
  psn: '',
  workStationId: '',
  remark: '',
  pictureList: [],
  defectDecision: '',
  classId: '',
  responseBy: '',
  reasonDescription: '',
  handleOpinion: '',
  vendorId: '',
})
const splitFormRef = ref(null)

onMounted(() => {
  getDicts()
  getUserInfo()
  getUsers()
  getItems()
  getOperations()
  getWorkStations()
  getDefects()
  getExceptionDecisionList()
  getClassList()
  getSupplierList()
  getDetail()
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  dictObj['qms_working_hours_type'] = await getDict('qms_working_hours_type')
  dictObj['qms_severity_level'] = await getDict('qms_severity_level')
  dictObj['qms_item_type'] = await getDict('qms_item_type')
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
async function getExceptionDecisionList() {
  try {
    const { data } = await listExceptionDecision()
    exceptionDecisionList.value = data?.rows ? data.rows : data ? data : []
  } catch (error) {}
}
async function getClassList() {
  try {
    const { data } = await listClass()
    classList.value = data?.rows ? data.rows : data ? data : []
  } catch (error) {}
}
async function getSupplierList() {
  try {
    const { data } = await listSupplier()
    supplierList.value = data?.rows ? data.rows : data ? data : []
  } catch (error) {}
}
async function getDetail() {
  if (history.state?.id) {
    try {
      const { data } = await getExceptionDetail(history.state?.id)
      formValue.value = data
      if (data.pictureList && data.pictureList.length > 0) {
        const ids = data.pictureList.join(',')
        const res = await listByIds(ids)
        formValue.value.ossList = res.data.map(x => {
          return { name: x.fileName, url: x.url }
        })
      }
    } catch (error) {}
  }
}

async function splitEvent() {
  if (Number(formValue.value.quantity) <= 1) {
    showFailToast('异常数量大于1才能分拆')
    return
  }
  showModal.value = true

  setTimeout(() => {
    Object.assign(splitFormValue.value, formValue.value)
    splitFormValue.value.quantity = ''
    splitFormValue.value.remark =
      '异常原数量：' + formValue.value.quantity + ' 异常原单号：' + splitFormValue.value.code
  }, 300)
}

function confirmSplit() {
  if (formValue.value.quantity <= Number(splitFormValue.value.quantity)) {
    showFailToast('分拆异常数量必须小于原异常的异常数量')
    return
  }

  splitFormRef.value
    .validate()
    .then(async () => {
      console.log(splitFormValue.value)

      try {
        const { code, msg } = await splitException(splitFormValue.value)
        if (code == ResultEnum.SUCCESS) {
          showSuccessToast(msg || '提交成功')
          formValue.value.quantity = Number(formValue.value.quantity) - Number(splitFormValue.value.quantity)
          showModal.value = false
        } else {
          showFailToast('操作失败，请稍后再试...')
        }
      } catch (error) {}
    })
    .catch(error => {})
}

function cancelSplit() {
  for (const key in splitFormValue.value) {
    if (Object.hasOwnProperty.call(splitFormValue.value, key)) {
      splitFormValue.value[key] = null
    }
  }
  showModal.value = false
}

async function onSubmit() {
  showConfirmDialog({
    message: '提交后无法再次编辑，是否确定?',
  })
    .then(async () => {
      formRef.value
        .validate()
        .then(async () => {
          console.log(formValue.value)
          try {
            const { code, msg } = await handlingException(formValue.value)
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
    })
    .catch(() => {
      // on cancel
    })
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
