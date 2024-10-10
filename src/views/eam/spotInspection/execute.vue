<template>
  <div class="content">
    <van-tabs v-model:active="active">
      <van-tab title="检验项">
        <div class="container" v-if="detail?.spotInspectionItems?.length > 0">
          <van-form class="" ref="formRef" input-align="right" scroll-to-error>
            <div class="box" v-for="(item, index) in detail?.spotInspectionItems" :key="index">
              <IndexList label="检验项号"> {{ item.code }} </IndexList>
              <IndexList label="检验项名称"> {{ item.name }} </IndexList>
              <IndexList label="示意图片" :leftSpan="5">
                <BasicUpload
                  v-if="item.exampleOssIds && item.exampleOssIds?.length > 0"
                  :max-count="0"
                  :deletable="false"
                  :ossId="item?.exampleOssIds"
                />
                <div v-else>暂无</div>
              </IndexList>
              <IndexList label="基准"> {{ item.specification }} </IndexList>
              <IndexList label="方法"> {{ item.measureMethod }} </IndexList>
              <div v-if="item.type === '2'">
                <IndexList label="最大值"> {{ item.maxValue }} </IndexList>
                <IndexList label="最小值"> {{ item.minValue }} </IndexList>
              </div>
              <IndexList label="实测值" v-if="item.type === '1' || item.type === '2'" required>
                <div class="flex flex-row justify-end items-center">
                  <van-field
                    input-align="right"
                    v-model="item.actual"
                    name="actual"
                    required
                    :rules="[{ required: true, message: '请输入实测值' }]"
                    placeholder="请输入实测值"
                    @change="actualChange(item.actual, item.maxValue, item.minValue, item)"
                  />
                  <van-icon v-if="item.passed === '0'" name="cross" color="#d03050" size="24" />
                  <van-icon v-if="item.passed === '1'" name="success" color="#0e7a0d" size="24" />
                </div>
              </IndexList>
              <IndexList label="结果" v-if="item.type === '3'" :required="true" :leftSpan="4">
                <div class="flex flex-row justify-end items-center">
                  <van-field
                    input-align="right"
                    v-model="item.passed"
                    name="passed"
                    :rules="[{ required: true, message: '请输入结果' }]"
                    placeholder="请输入结果"
                  >
                    <template #input>
                      <van-radio-group v-model="item.passed" direction="horizontal" style="justify-content: flex-end">
                        <van-radio name="1">{{ item.boolOneValue }}</van-radio>
                        <van-radio name="0">{{ item.boolZeroValue }}</van-radio>
                      </van-radio-group>
                    </template>
                  </van-field>
                  <div>
                    <van-icon v-if="item.passed === '0'" name="cross" color="#d03050" size="24" />
                    <van-icon v-if="item.passed === '1'" name="success" color="#0e7a0d" size="24" />
                  </div>
                </div>
              </IndexList>
              <IndexList label="备注" v-if="item.isRemark === '1'">
                <van-field v-model="item.remark" name="remark" placeholder="请输入备注" />
              </IndexList>
              <IndexList label="现场照片" v-if="item.isPhoto === '1'" :required="true" :leftSpan="5">
                <van-field
                  input-align="right"
                  name="spotOssIds"
                  :rules="[{ validator: photoValidator, message: '请上传现场照片' }]"
                  placeholder="请上传现场照片"
                >
                  <template #input>
                    <BasicUpload :ossId="item?.spotOssIds" @uploadChange="e => (item.spotOssIds = e)" />
                  </template>
                </van-field>
              </IndexList>
            </div>
          </van-form>
          <div class="flex flex-col mb-4 mx-2">
            <van-button type="primary" size="md" round class="my-2" @click="onSubmit('save')">保 存</van-button>
            <van-button type="success" size="md" round class="my-2" @click="onSubmit">提 交</van-button>
          </div>
        </div>
        <van-loading class="grid justify-center items-center pt-5" v-else-if="loading" />
        <van-empty v-else description="暂无数据" />
      </van-tab>
      <van-tab title="点检详情">
        <div class="container">
          <!-- <div class="flex flex-row my-3">
            <van-button type="primary" size="small" class="ml-3" @click="onSubmit('save')">保存</van-button>
            <van-button type="success" size="small" class="ml-3" @click="onSubmit">提交</van-button>
          </div> -->
          <div class="box">
            <IndexList label="任务编号">
              <span> {{ detail?.code }}</span>
            </IndexList>
            <IndexList label="检验类型">
              <span> {{ getDetailLabel('eam_quality_plan_cycle', detail?.type) }}</span>
            </IndexList>
            <IndexList label="状态">
              <span> {{ getDetailLabel('eam_spot_inspection_status', detail?.status) }} </span>
            </IndexList>
            <IndexList label="设备编号">
              <span> {{ detail?.deviceCode }}</span>
            </IndexList>
            <IndexList label="设备名称">
              <span> {{ detail?.deviceName }}</span>
            </IndexList>
            <IndexList label="设备标识">
              <span> {{ detail?.deviceMark }}</span>
            </IndexList>
            <IndexList label="班次">
              <span> {{ getDetailLabel('eam_spot_inspection_shift', detail?.shift) }}</span>
            </IndexList>
            <IndexList label="是否合格">
              <van-tag type="success" size="medium" v-if="detail?.result === '1'"> 合格 </van-tag>
              <van-tag type="danger" size="medium" v-if="detail?.result === '0'"> 不合格 </van-tag>
            </IndexList>
            <IndexList label="创建时间">
              <span> {{ detail?.createTime }}</span>
            </IndexList>
            <IndexList label="备注">
              <span> {{ detail?.remark }}</span>
            </IndexList>
          </div>
        </div>
      </van-tab>
    </van-tabs>

    <van-action-sheet v-model:show="showNotPassedModal" title="点检不合格" @closed="handleCreateCancel">
      <div class="m-2 py-2 rounded-sm bg-white my-4">
        <van-form ref="notPassedFormRef" input-align="left" scroll-to-error>
          <van-field
            v-model="notPassedFormValue.unqualifiedDescription"
            name="unqualifiedDescription"
            required
            :rules="[{ required: true, message: '请填写不合格描述' }]"
            label="不合格描述"
            placeholder="不合格描述"
          />
          <van-field
            v-model="notPassedFormValue.unqualifiedHandle"
            name="unqualifiedHandle"
            required
            :rules="[{ required: true, message: '请填写不合格处理' }]"
            label="不合格处理"
            placeholder="不合格处理"
          />

          <van-field label="创建工单" placeholder="创建工单">
            <template #input>
              <van-radio-group
                label="创建工单"
                v-model="isCreate"
                direction="horizontal"
                style="justify-content: flex-end"
              >
                <van-radio name="1">是</van-radio>
                <van-radio name="0">否</van-radio>
              </van-radio-group>
            </template>
          </van-field>

          <div v-if="isCreate === '1'">
            <CustomSelect
              inputAlign="left"
              required
              name="deviceId"
              :rules="[{ required: true, message: '请选择设备编号' }]"
              label="设备编号"
              filterOn
              :dataSource="deviceList"
              :defValue="detail.deviceId"
              disabled
              :labelProps="[
                { header: '设备编号', keyName: 'code' },
                { header: '设备名称', keyName: 'name' },
              ]"
              idKey="id"
              @dataEvent="e => (notPassedFormValue.deviceId = e.id)"
            />

            <DateTimePicker
              v-model="notPassedFormValue.faultReportTime"
              label="故障提报时间"
              labelWidth="7em"
              required
              name="faultReportTime"
              :rules="[{ required: true, message: '请选择故障提报时间' }]"
              :defTime="notPassedFormValue.faultReportTime"
              @getTime="e => (notPassedFormValue.faultReportTime = e)"
            />

            <CustomSelect
              inputAlign="left"
              required
              name="reportUser"
              :rules="[{ required: true, message: '请选择提报人' }]"
              label="提报人"
              filterOn
              :dataSource="userList"
              :defValue="notPassedFormValue.reportUser"
              idKey="userId"
              :labelProps="[
                { header: '用户昵称', keyName: 'nickName' },
                { header: '用户名称', keyName: 'userName' },
              ]"
              @dataEvent="e => (notPassedFormValue.reportUser = e.userId)"
            />
            <van-field
              v-model="notPassedFormValue.reportUserPhone"
              name="reportUserPhone"
              label="提报人电话"
              placeholder="提报人电话"
            />

            <CustomPicker
              label="故障类型"
              :dataSource="dictObj['eam_repair_type']"
              :defValue="notPassedFormValue.faultReportType"
              :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
              @dataEvent="e => (notPassedFormValue.faultReportType = e.dictValue)"
            />
            <CustomPicker
              label="严重程度"
              :dataSource="dictObj['eam_repair_level']"
              :defValue="notPassedFormValue.faultLevel"
              :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
              @dataEvent="e => (notPassedFormValue.faultLevel = e.dictValue)"
            />
            <CustomPicker
              required
              name="shutdown"
              :rules="[{ required: true, message: '请选择是否停机' }]"
              label="是否停机"
              :dataSource="dictObj['eam_yes_no']"
              :defValue="notPassedFormValue.shutdown"
              :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
              @dataEvent="e => (notPassedFormValue.shutdown = e.dictValue)"
            />

            <van-field
              required
              :rules="[{ required: true, message: '请输入故障描述' }]"
              v-model="notPassedFormValue.faultReportDescription"
              name="faultReportDescription"
              label="故障描述"
              autosize
              placeholder="故障描述"
              rows="3"
              type="textarea"
              maxlength="500"
              show-word-limit
            />
          </div>
        </van-form>
      </div>
      <div class="flex flex-row mb-6 w-full justify-end">
        <van-button type="" size="small" class="mr-4" @click="handleCreateCancel">取消</van-button>
        <van-button type="primary" size="small" class="mr-4" @click="confirm">确认</van-button>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'

import { getEamSpotInspectionDetail, editEamSpotInspection, executeEamSpotInspection } from '@/api/eam/spotInspection'
import { getEamDeviceList } from '@/api/eam/device'
import { getUserList } from '@/api/system/user'

import { useRouter } from 'vue-router'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
import useUserStore from '@/store/modules/users'

import { getDict } from '@/utils/dictUtils'
import { parseTime } from '@/utils/index'
import { getDetailLabel } from '@/utils/dictUtils'

import BasicUpload from '@/components/BasicUpload'
import DateTimePicker from '@/components/DateTimePicker'
import CustomSelect from '@/components/CustomSelect'
import CustomPicker from '@/components/CustomPicker'
import IndexList from '@/views/components/indexList/index'

const router = useRouter()
onMounted(async () => {
  await getDicts()
  await getDevices()
  await getUsers()
  await getDetail()
})
const deviceList = ref([])
const userList = ref([])
const loading = ref(true)

function getUserId() {
  const userInfo = useUserStore().getUserInfo
  return userInfo?.user?.userId
}
function getPhoneNumber() {
  const userInfo = useUserStore().getUserInfo
  return userInfo?.user?.phonenumber
}
async function getDevices() {
  try {
    const { data } = await getEamDeviceList()
    deviceList.value = data.rows ?? []
  } catch (error) {}
}

async function getUsers() {
  try {
    const { data } = await getUserList()
    userList.value = data.rows ?? []
  } catch (error) {}
}

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  dictObj['eam_repair_type'] = await getDict('eam_repair_type')
  dictObj['eam_repair_level'] = await getDict('eam_repair_level')
  dictObj['eam_yes_no'] = await getDict('eam_yes_no')
}

const active = ref('')
const detail = ref()
const multiplePartRef = ref()
const formRef = ref()
const showNotPassedModal = ref(false)
const isCreate = ref('0') // 是否创建工单
const isCreated = computed(() => {
  return isCreate.value === '1'
})
const notPassedFormRef = ref()

const notPassedFormValue = ref({
  unqualifiedDescription: '',
  unqualifiedHandle: '',
  deviceId: 0,
  faultReportTime: new Date(),
  reportUser: getUserId(),
  reportUserPhone: getPhoneNumber(),
  faultReportType: '',
  faultLevel: '',
  shutdown: '',
  faultReportDescription: '',
})

async function getDetail() {
  loading.value = true
  if (history.state?.id) {
    try {
      const { data } = await getEamSpotInspectionDetail(history.state?.id)
      detail.value = data
    } catch (error) {
    } finally {
      loading.value = false
    }
  }
}

const photoValidator = e => {
  if (e?.length === 0) return false
  return true
}

/* 保存&完成 */
async function onSubmit(action) {
  console.log(detail.value.spotInspectionItems)

  let isNotPassed = detail.value.spotInspectionItems.some(x => x.passed === '0' || !x.passed)
  detail.value.result = !isNotPassed ? '1' : '0'
  if (action === 'save') {
    // 后端校验result为必填，所以改为每一项的passed值必须要有，与 item.type === '2'时实测值才为必填的规则有冲突
    const hasEmptyResult = detail.value.spotInspectionItems.some(x => x.passed == '')
    if (hasEmptyResult) {
      showFailToast('请填写是否合格和实测值')
      return
    }
    try {
      const { code, msg } = await editEamSpotInspection(detail.value)
      if (code == ResultEnum.SUCCESS) {
        showSuccessToast(msg || '提交成功')
        router.back()
      } else {
        showFailToast('操作失败，请稍后再试...')
      }
    } catch (error) {}
  } else {
    if (!formRef.value) return
    formRef.value
      .validate()
      .then(async () => {
        if (detail.value.spotInspectionItems && detail.value.spotInspectionItems.length > 0) {
          // 若存在不合格项,弹出弹框
          const hasUnqualified = detail.value.spotInspectionItems.some(x => {
            if (x.passed == 0) {
              showNotPassedModal.value = true
              return true // 跳出循环
            }
            return false
          })
          if (hasUnqualified) return
        }

        let isNotPassed = detail.value.spotInspectionItems.some(x => x.passed == 0 || !x.passed)
        const params = {
          id: detail.value.id,
          result: !isNotPassed ? '1' : '0',
          spotInspectionItems: detail.value.spotInspectionItems,
        }
        console.log(detail.value)
        console.log(params)
        try {
          const { code, msg } = await executeEamSpotInspection(params)
          if (code == ResultEnum.SUCCESS) {
            showSuccessToast(msg || '提交成功')
            router.back()
          } else {
            showFailToast('操作失败，请稍后再试...')
          }
        } catch (error) {}
      })
      .catch(error => {
        console.log(error)
        // showFailToast('请填写必填项')
      })
  }
}

function actualChange(actual, maxValue, minValue, subItem) {
  switch (subItem.type) {
    //  当type == 1时，实测值有值则为合格
    case '1':
      if (actual || actual.length > 0) {
        subItem.passed = '1'
      } else {
        subItem.passed = '0'
      }
      break

    //  当type == 2, 实测值在最小值、最大值范围内的为合格
    case '2':
      if (Number(actual) || Number(actual) === 0) {
        if (actual >= Number(minValue) && actual <= Number(maxValue)) {
          subItem.passed = '1'
        } else {
          subItem.passed = '0'
        }
      } else {
        subItem.passed = ''
        subItem.actual = ''
      }
      break
    default:
      break
  }
}

// 确认创建工单
const confirm = () => {
  notPassedFormRef.value
    ?.validate()
    .then(async () => {
      let isNotPassed = detail.value.spotInspectionItems.some(x => x.passed == 0 || !x.passed)

      const faultReportTime = parseTime(notPassedFormValue.value.faultReportTime, '{y}-{m}-{d} {h}:{i}:{s}')

      notPassedFormValue.value.deviceId = detail.value.deviceId
      const eamRepairObj = notPassedFormValue.value

      const newObj = { ...eamRepairObj }
      delete newObj.unqualifiedDescription
      delete newObj.unqualifiedHandle
      newObj.faultReportTime = faultReportTime

      const params = {
        id: detail.value.id,
        result: !isNotPassed ? '1' : '0',
        unqualifiedDescription: notPassedFormValue.value.unqualifiedDescription,
        unqualifiedHandle: notPassedFormValue.value.unqualifiedHandle,
        spotInspectionItems: detail.value.spotInspectionItems,
      }

      if (isCreated.value) {
        Object.assign(params, { eamRepair: newObj })
      }

      console.log(params)

      try {
        const { code, msg } = await executeEamSpotInspection(params)
        if (code == ResultEnum.SUCCESS) {
          showSuccessToast(msg || '提交成功')
          router.back()
        } else {
          showFailToast('操作失败，请稍后再试...')
        }
      } catch (error) {}
    })
    .catch(error => {
      console.log(error)
      showFailToast('请填写必填项')
    })
}

function handleCreateCancel() {
  showNotPassedModal.value = false
  isCreate.value = '0'
  notPassedFormValue.value.unqualifiedDescription = ''
  notPassedFormValue.value.unqualifiedHandle = ''
  notPassedFormValue.value.deviceId = 0
  notPassedFormValue.value.faultReportTime = new Date()
  notPassedFormValue.value.reportUser = getUserId()
  notPassedFormValue.value.reportUserPhone = getPhoneNumber()
  notPassedFormValue.value.faultReportType = ''
  notPassedFormValue.value.faultLevel = ''
  notPassedFormValue.value.shutdown = ''
  notPassedFormValue.value.faultReportDescription = ''
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  margin: 1rem 0;
  background-color: #f2f4f8;

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

.required:before {
  margin-right: 2px;
  color: var(--van-field-required-mark-color);
  content: '*';
}
</style>
