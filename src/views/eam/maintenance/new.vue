<template>
  <div class="content">
    <van-tabs v-model:active="active">
      <van-tab title="新增保养工单" name="0">
        <div class="m-2 py-2 rounded-sm bg-white">
          <van-form ref="formRef" input-align="right" validate-first scroll-to-error>
            <!-- <van-cell-group inset> -->
            <div>
              <van-field
                label-width="6.8em"
                v-model="daterange"
                name="daterange"
                label="保养计划区间"
                placeholder="选择保养计划区间"
                required
                :rules="[{ required: true, message: '请选择保养计划区间' }]"
                @click="showDatePicker = true"
                readOnly
              />
              <van-calendar v-model:show="showDatePicker" type="range" @confirm="onDatePickerConfirm" />
            </div>

            <CustomPicker
              required
              name="period"
              :rules="[{ required: true, message: '请选择保养周期' }]"
              label="保养周期"
              :dataSource="dictObj['eam_maintenance_period']"
              :defValue="formValue.period"
              :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
              @dataEvent="e => (formValue.period = e.dictValue)"
            />

            <CustomPicker
              required
              name="subtype"
              :rules="[{ required: true, message: '请选择保养类型' }]"
              label="保养类型"
              :dataSource="dictObj['eam_maintenance_type']"
              :defValue="formValue.subtype"
              :columnsField="{ text: 'dictLabel', value: 'dictValue' }"
              @dataEvent="e => (formValue.subtype = e.dictValue)"
            />
            <div class="px-2">
              <van-field
                v-model="formValue.remark"
                name="remark"
                label="保养说明"
                placeholder="保养说明"
                rows="1"
                type="textarea"
                maxlength="500"
                show-word-limit
              />
            </div>

            <!-- </van-cell-group> -->
          </van-form>
        </div>
        <div class="mt-10 mx-1">
          <van-button type="primary" class="w-full mb-2" @click="onSubmit('save')">提 交</van-button>
        </div>
      </van-tab>
      <van-tab title="保养设备" name="1">
        <MultipleSelect
          :showFloatingBubble="active == 1"
          ref="multiplePartRef"
          label="备件"
          :dataSource="allDeviceList"
          idKey="id"
          propKey="name"
          @dataEvent="handlePartValue"
        />
        <div class="m-2 rounded-sm pb-12" v-if="deviceList && deviceList?.length > 0">
          <div class="bg-white my-2 py-2 px-4" v-for="part in deviceList" :key="part.id">
            <IndexList>
              <template #left> 备件编号 </template>
              <template #right> {{ part.code }} </template>
            </IndexList>
            <IndexList>
              <template #left> 备件名称 </template>
              <template #right> {{ part.name }} </template>
            </IndexList>
            <IndexList>
              <template #left> 设备类型 </template>
              <template #right> {{ part.type }}</template>
            </IndexList>
            <IndexList>
              <template #left> 操作</template>
              <template #right><van-icon color="" name="delete" @click="handleDeletePart(part)" /> </template>
            </IndexList>
          </div>
        </div>
        <van-empty v-else description="请添加设备" />
      </van-tab>
      <van-tab title="时间列表" name="2">
        <div class="pb-10">
          <div class="flex flex-row m-2 justify-start">
            <DateTimeBtnPicker label="受理时间" @getTime="handleTime" />
            <van-button size="small" type="primary" class="ml-2" @click="handleAutoDate">自动生成</van-button>
          </div>

          <div class="container">
            <div class="box" v-if="planDate && planDate?.length > 0">
              <van-row justify="space-between" class="text-sm text-slate-400">
                <van-col span="20" class="py-1">计划开始日期</van-col>
                <van-col span="4" class="py-1">操作</van-col>
              </van-row>
              <van-row
                justify="space-between"
                v-for="date in planDate"
                :key="date"
                class="text-sm my-2 border-b-4 border-slate-700"
              >
                <van-col span="20" class="py-1">{{ date }} </van-col>
                <van-col span="4" class="py-1 text-blue-700">
                  <van-button plain size="mini" @click="handleDelDate(date)">删 除</van-button>
                </van-col>
              </van-row>
            </div>
            <van-empty v-else description="请添加时间" />
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { addEamMaintenance } from '@/api/eam/maintenance'
import { getEamDeviceList } from '@/api/eam/device'
import { getDict } from '@/utils/dictUtils'
import MultipleSelect from '@/components/CustomSelect/multiple'
import IndexList from '@/views/components/indexList/index'
import CustomPicker from '@/components/CustomPicker'
import DateTimeBtnPicker from '@/components/DateTimePicker/btnSelect'
import { parseTime } from '@/utils/index'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'

const router = useRouter()

onMounted(async () => {
  await getDicts()
  await getDeviceList()
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  const eam_maintenance_type = await getDict('eam_maintenance_type')
  const eam_maintenance_period = await getDict('eam_maintenance_period')
  const eam_yes_no_dict = await getDict('eam_yes_no')

  dictObj['eam_maintenance_type'] = eam_maintenance_type
  dictObj['eam_maintenance_period'] = eam_maintenance_period
  dictObj['eam_yes_no'] = eam_yes_no_dict
}

const active = ref('')
const deviceList = ref([])

const allDeviceList = ref([])
const multiplePartRef = ref()
const formRef = ref()
const formValue = ref({})

const showDatePicker = ref(false)
function onDatePickerConfirm(values) {
  const [start, end] = values
  const startDate = parseTime(start, `{y}-{m}-{d}`)
  const endDate = parseTime(end, `{y}-{m}-{d}`)
  daterange.value = `${startDate} ~ ${endDate}`
  showDatePicker.value = false
}

async function getDeviceList() {
  try {
    const { data } = await getEamDeviceList()
    allDeviceList.value = data.rows
    console.log(allDeviceList.value)
  } catch (error) {}
}

function handlePartValue(ids, objList) {
  if (!objList) return
  // 用长度判断是删除还是增加
  if (deviceList.value.length < ids.length) {
    // 改为追加，不覆盖
    const currentIds = deviceList.value.map(x => x.sparePartId)
    // 处理list，跳过已存在的数据
    const uniqueList = objList.filter(x => !currentIds.includes(x.id))
    deviceList.value = uniqueList
  } else {
    deviceList.value = deviceList.value.filter(x => ids.includes(x.id))
  }
}

function handleDeletePart(part) {
  multiplePartRef.value.handleDelete(part)
}

const daterange = ref('')
const planDate = ref([])

function handleTime(e) {
  planDate.value.push(e)
}

function handleAutoDate() {
  if (!daterange.value) {
    showFailToast('请填写保养计划区间!')
    return
  }

  planDate.value = []
  const startDate = daterange.value.slice(0, 11) + '00:00:00'
  planDate.value.push(startDate)
}

function handleDelDate(e) {
  planDate.value = planDate.value.filter(x => e !== x)
}

async function onSubmit() {
  formValue.value.deviceList = deviceList.value.map(x => x.id)
  formValue.value.planStartTimeList = planDate.value
  
  formRef.value
    .validate()
    .then(async () => {
      try {
        const { code, msg } = await addEamMaintenance(formValue.value)
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
