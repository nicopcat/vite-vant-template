<template>
  <div class="content">
    <van-tabs v-model:active="active">
      <van-tab title="完成页面" name="0">
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
            </van-cell-group>
          </van-form>
        </div>

        <div class="mt-10 mx-1">
          <van-button type="primary" class="w-full mb-2" @click="onSubmit('save')">保 存</van-button>
          <van-button type="success" class="w-full mb-2" @click="onSubmit">完 工</van-button>
        </div>
      </van-tab>
      <van-tab title="协助人" name="1">
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

        <div class="m-2 rounded-sm pb-12">
          <div class="bg-white my-2 py-2 px-4" v-for="user in userList" :key="user.id">
            <IndexList>
              <template #left> 维修人名称 </template>
              <template #right>{{ user.assistantName }} </template>
            </IndexList>
            <IndexList>
              <template #left> 维修人ID </template>
              <template #right> {{ user.assistantId }}</template>
            </IndexList>
            <IndexList>
              <template #left> </template>
              <template #right>
                <!-- <van-button size="small" icon="delete" @click="handleDeleteUser(user)"></van-button> -->
                <van-icon name="delete" @click="handleDeleteUser(user)" />
              </template>
            </IndexList>
          </div>
        </div>
      </van-tab>
      <van-tab title="选择备件" name="2">
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

        <div class="m-2 rounded-sm pb-12">
          <div class="bg-white my-2 py-2 px-4" v-for="part in partList" :key="part.id">
            <IndexList>
              <template #left> 备件编号 </template>
              <template #right> {{ part.sparePartCode }} </template>
            </IndexList>
            <IndexList>
              <template #left> 备件名称 </template>
              <template #right> {{ part.sparePartName }} </template>
            </IndexList>
            <IndexList>
              <template #left> 备件数量 </template>
              <template #right><van-stepper v-model="part.quantity" /></template>
            </IndexList>
            <IndexList>
              <template #left> 备件用途 </template>
              <template #right>
                <van-field class="bg-[#f5f5f5]" v-model="part.remark" name="remark" placeholder="用途"
              /></template>
            </IndexList>
            <IndexList>
              <template #left> </template>
              <template #right><van-icon name="delete" @click="handleDeletePart(part)" /> </template>
            </IndexList>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { getDoneDetailInfo, saveEamRepair, completeEamRepair } from '@/api/eam/repair'
import { getEamSparePartList } from '@/api/eam/sparePart'
import { getUserList } from '@/api/system/user'
import { getDict, getLabel } from '@/utils/dictUtils'
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
  const eam_repair_type_dict = await getDict('eam_repair_type')
  const eam_repair_status_dict = await getDict('eam_repair_status')
  const eam_device_mark_dict = await getDict('eam_device_mark')
  const eam_yes_no_dict = await getDict('eam_yes_no')
  const eam_repair_level_dict = await getDict('eam_repair_level')

  dictObj['eam_repair_type'] = eam_repair_type_dict
  dictObj['eam_repair_status'] = eam_repair_status_dict
  dictObj['eam_device_mark'] = eam_device_mark_dict
  dictObj['eam_yes_no'] = eam_yes_no_dict
  dictObj['eam_repair_level'] = eam_repair_level_dict
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
}

.van-cell {
  padding: 0.4rem;
}
</style>
