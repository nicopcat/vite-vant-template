<template>
  <div class="content">
    <van-tabs v-model:active="active">
      <van-tab title="完成页面" name="0">
        <div class="flex flex-row my-3">
          <van-button
            v-if="repair.status === 'WAITINGFORREPAIR'"
            type="primary"
            size="small"
            class="ml-3"
            @click="startEvent"
            >开 始</van-button
          >
          <van-button type="primary" size="small" class="ml-3" @click="onSubmit('save')">保 存</van-button>
          <van-button v-if="repair.status === 'ONGOING'" type="success" size="small" class="ml-3" @click="onSubmit"
            >完 成</van-button
          >
        </div>
        <div class="m-2 py-2 rounded-sm bg-white">
          <van-form ref="formRef" input-align="right" validate-first scroll-to-error>
            <van-cell-group inset>
              <van-field
                v-model="repair.failureCause"
                name="failureCause"
                label="故障原因"
                autosize
                placeholder="故障原因"
                rows="3"
                type="textarea"
                maxlength="500"
                show-word-limit
                required
                :rules="[{ required: true, message: '请填写故障原因' }]"
              />

              <van-field
                v-model="repair.solution"
                name="solution"
                label="解决方案"
                autosize
                placeholder="解决方案"
                rows="3"
                type="textarea"
                maxlength="500"
                show-word-limit
                required
                :rules="[{ required: true, message: '请填写解决方案' }]"
              />

              <van-field
                :model-value="repair?.faultReportTypeLabel"
                is-link
                readonly
                name="faultReportType"
                label="故障类型"
                placeholder="故障类型"
                @click="showPicker = true"
              />
              <van-popup v-model:show="showPicker" round position="bottom">
                <van-picker
                  title="故障类型"
                  :columns="dictObj['eam_repair_type']"
                  @confirm="onConfirm"
                  @cancel="showPicker = false"
                  :columns-field-names="{ text: 'dictLabel', value: 'dictValue' }"
                />
              </van-popup>
              <DateTimePicker
                v-if="repair?.shutdown === '1'"
                v-model="repair.shutdownStartTime"
                label="开始停机时间"
                labelWidth="7em"
                name="shutdownStartTime"
                :rules="[
                  {
                    required: false,
                    message: '请选择开始停机时间',
                    validator: startTimeValidator,
                    trigger: ['onChange', 'onSubmit'],
                  },
                ]"
                :defTime="repair.shutdownStartTime"
                @getTime="e => (repair.shutdownStartTime = e)"
              />
              <DateTimePicker
                v-if="repair?.shutdown === '1'"
                v-model="repair.shutdownEndTime"
                label="结束停机时间"
                labelWidth="7em"
                name="shutdownEndTime"
                :rules="[
                  {
                    required: false,
                    message: '请选择结束停机时间',
                    validator: endTimeValidator,
                    trigger: ['onChange', 'onSubmit'],
                  },
                ]"
                :defTime="repair.shutdownEndTime"
                @getTime="e => (repair.shutdownEndTime = e)"
              />
            </van-cell-group>
          </van-form>
        </div>
      </van-tab>
      <van-tab title="协助人" name="1">
        <div class="flex flex-row my-3">
          <van-button
            v-if="repair.status === 'WAITINGFORREPAIR'"
            type="primary"
            size="small"
            class="ml-3"
            @click="startEvent"
            >开 始</van-button
          >
          <van-button type="primary" size="small" class="ml-3" @click="onSubmit('save')">保 存</van-button>
          <van-button v-if="repair.status === 'ONGOING'" type="success" size="small" class="ml-3" @click="onSubmit"
            >完 成</van-button
          >
        </div>
        <MultipleSelect
          :showFloatingBubble="active == 1"
          ref="multipleUserRef"
          name="repairUser"
          label="用户"
          :dataSource="allUserList"
          :defValue="userList"
          idKey="userId"
          defIdKey="assistantId"
          propKey="nickName"
          @dataEvent="handleAssistantValue"
        />

        <div class="m-2 rounded-sm pb-12" v-if="userList && userList?.length > 0">
          <div class="bg-white my-2 py-2 px-4" v-for="user in userList" :key="user.id">
            <IndexList label="维修人名称">
              {{ user.assistantName }}
            </IndexList>
            <IndexList label="维修人ID">
              {{ user.assistantId }}
            </IndexList>
            <IndexList label="">
              <!-- <van-button size="small" icon="delete" @click="handleDeleteUser(user)"></van-button> -->
              <van-icon name="delete" @click="handleDeleteUser(user)" />
            </IndexList>
          </div>
        </div>
        <van-empty v-else description="请添加协助人" />
      </van-tab>
      <van-tab title="选择备件" name="2">
        <div class="flex flex-row my-3">
          <van-button
            v-if="repair.status === 'WAITINGFORREPAIR'"
            type="primary"
            size="small"
            class="ml-3"
            @click="startEvent"
            >开 始</van-button
          >
          <van-button type="primary" size="small" class="ml-3" @click="onSubmit('save')">保 存</van-button>
          <van-button v-if="repair.status === 'ONGOING'" type="success" size="small" class="ml-3" @click="onSubmit"
            >完 成</van-button
          >
        </div>
        <MultipleSelect
          :showFloatingBubble="active == 2"
          ref="multiplePartRef"
          label="备件"
          :dataSource="allPartList"
          :defValue="partList"
          idKey="id"
          defIdKey="sparePartId"
          propKey="name"
          @dataEvent="handlePartValue"
        />

        <div class="m-2 rounded-sm pb-12" v-if="partList && partList?.length > 0">
          <div class="bg-white my-2 py-2 px-4" v-for="part in partList" :key="part.id">
            <IndexList label="备件编号">
              {{ part.sparePartCode }}
            </IndexList>
            <IndexList label="备件名称">
              {{ part.sparePartName }}
            </IndexList>
            <IndexList label="备件数量">
              <van-stepper v-model="part.quantity" />
            </IndexList>
            <IndexList label="备件用途">
              <van-field class="bg-[#f5f5f5]" v-model="part.remark" name="remark" placeholder="用途" />
            </IndexList>
            <IndexList label="">
              <van-icon name="delete" @click="handleDeletePart(part)" />
            </IndexList>
          </div>
        </div>
        <van-empty v-else description="请添加备件" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { getDoneDetailInfo, saveEamRepair, completeEamRepair, startEamRepair } from '@/api/eam/repair'
import { getEamSparePartList } from '@/api/eam/sparePart'
import { getUserList } from '@/api/system/user'
import { getDict, getLabel } from '@/utils/dictUtils'
import DateTimePicker from '@/components/DateTimePicker'
import MultipleSelect from '@/components/CustomSelect/multiple'
import IndexList from '@/views/components/indexList/index'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'

const router = useRouter()

onMounted(async () => {
  await getDicts()
  await getDetail()
  await getUsers()
  await getSparePartList()
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  dictObj['eam_repair_type'] = await getDict('eam_repair_type')
  dictObj['eam_repair_status'] = await getDict('eam_repair_status')
  dictObj['eam_device_mark'] = await getDict('eam_device_mark')
  dictObj['eam_yes_no'] = await getDict('eam_yes_no')
  dictObj['eam_repair_level'] = await getDict('eam_repair_level')
}

const active = ref('')
const repair = ref({})
const partList = ref([])
const userList = ref([])
const allUserList = ref([])
const allPartList = ref([])
const multipleUserRef = ref()
const multiplePartRef = ref()
const formRef = ref()

async function getDetail() {
  if (history.state?.id) {
    try {
      const { data } = await getDoneDetailInfo(history.state?.id)
      repair.value = data.repair
      partList.value = data.partList
      userList.value = data.userList
      repair.value.faultReportTypeLabel = getLabel(dictObj['eam_repair_type'], repair.value.faultReportType)
    } catch (error) {}
  }
}

async function getUsers() {
  try {
    const { data } = await getUserList()
    allUserList.value = data?.rows ?? []
  } catch (error) {}
}

async function getSparePartList() {
  try {
    const { data } = await getEamSparePartList()
    allPartList.value = data?.rows ?? []
  } catch (error) {}
}

const showPicker = ref(false)
function onConfirm(params) {
  repair.value.faultReportTypeLabel = dictObj['eam_repair_type'][params.selectedIndexes].dictLabel
  repair.value.faultReportType = params.selectedValues[0]
  showPicker.value = false
}

function handleAssistantValue(arr, list) {
  if (!list) return
  userList.value = list.map(x => {
    return {
      assistantId: x.userId,
      assistantName: x.nickName,
      userName: x.userName,
    }
  })
}

function handleDeleteUser(user) {
  multipleUserRef.value.handleDelete(user)
}

function handlePartValue(ids, objList) {
  if (!objList) return
  // 用长度判断是删除还是增加
  if (partList.value.length < ids.length) {
    // 改为追加，不覆盖
    const currentIds = partList.value.map(x => x.sparePartId)
    // 处理list，跳过已存在的数据
    const uniqueList = objList.filter(x => !currentIds.includes(x.id))
    const addOn = uniqueList.map((x, i) => {
      return {
        id: new Date().valueOf() + i,
        sparePartId: x.id,
        sparePartCode: x.code,
        sparePartName: x.name,
      }
    })

    partList.value = [...partList.value, ...addOn]
  } else {
    partList.value = partList.value.filter(x => ids.includes(x.sparePartId))
  }
}

function handleDeletePart(part) {
  multiplePartRef.value.handleDelete(part)
}

async function onSave() {
  //校验必填
  try {
    const { code, msg } = await saveEamRepair({
      repair: repair.value,
      userList: userList.value,
      partList: partList.value,
    })
    if (code == ResultEnum.SUCCESS) {
      showSuccessToast(msg || '提交成功')
      router.back()
    } else {
      showFailToast('操作失败，请稍后再试...')
    }
  } catch (error) {}
}

async function onSubmit(action) {
  formRef.value
    .validate()
    .then(async () => {
      const request = action === 'save' ? saveEamRepair : completeEamRepair
      try {
        const { code, msg } = await request({
          repair: repair.value,
          userList: userList.value,
          partList: partList.value,
        })
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

function startEvent() {
  formRef.value
    .validate()
    .then(async () => {
      try {
        await saveEamRepair({
          repair: repair.value,
          userList: userList.value,
          partList: partList.value,
        })

        const { code, msg } = await startEamRepair({ id: repair.value.id })
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

// 时间校验
function startTimeValidator(e) {
  const startTime = new Date(e).getTime()
  const endTime = new Date(repair.value.shutdownEndTime).getTime()
  if (!endTime) return true
  if (endTime < startTime) {
    return '开始时间不能晚于结束时间!'
  }
}

function endTimeValidator(e) {
  const endTime = new Date(e).getTime()
  const startTime = new Date(repair.value.shutdownStartTime).getTime()
  if (!startTime) return true
  if (endTime < startTime) {
    return '结束时间不能早于开始时间!'
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  margin: 1rem 0;
  background-color: #f2f4f8;

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
}

:deep(.van-cell) {
  padding: 0.4rem;
}
</style>
