<template>
  <div class="content">
    <van-tabs v-model:active="active">
      <van-tab title="故障提报">
        <div class="container">
          <div class="box">
            <IndexList>
              <template #left> 设备编号 </template>
              <template #right>
                <span class="text-black"> {{ repair?.deviceCode }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 设备名称 </template>
              <template #right>
                <span class="text-black"> {{ repair?.deviceName }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 工单状态 </template>
              <template #right>
                <span class="text-black"> {{ getLabel(dictObj['eam_repair_status'], repair?.status) }} </span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 故障描述 </template>
              <template #right>
                <span class="text-black"> {{ repair?.faultReportDescription }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 严重程度 </template>
              <template #right>
                <span class="text-black"> {{ getLabel(dictObj['eam_repair_level'], repair?.faultLevel) }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 是否停机 </template>
              <template #right>
                <span class="text-black"> {{ getLabel(dictObj['eam_yes_no'], repair?.shutdown) }}</span>
              </template>
            </IndexList>
            <IndexList :leftSpan="10">
              <template #left> 故障累计时间(分钟) </template>
              <template #right>
                <span class="text-black"> {{ repair?.faultHour }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 报修时间 </template>
              <template #right>
                <span class="text-black"> {{ repair?.faultReportTime }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 报修人 </template>
              <template #right>
                <span class="text-black"> {{ repair?.reportUser }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 报修人电话 </template>
              <template #right>
                <span class="text-black"> {{ repair?.reportUserPhone }}</span>
              </template>
            </IndexList>
          </div>
        </div>
      </van-tab>
      <van-tab title="故障处理">
        <div class="container">
          <div class="box">
            <IndexList>
              <template #left> 故障原因 </template>
              <template #right>
                <span class="text-black"> {{ repair?.failureCause }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 解决方案 </template>
              <template #right>
                <span class="text-black"> {{ repair?.solution }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 故障类型 </template>
              <template #right>
                <span class="text-black"> {{ getLabel(dictObj['eam_repair_type'], repair?.faultReportType) }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 开始停机时间 </template>
              <template #right>
                <span class="text-black"> {{ repair?.shutdownStartTime }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 结束停机时间 </template>
              <template #right>
                <span class="text-black"> {{ repair?.shutdownEndTime }}</span>
              </template>
            </IndexList>
          </div>
        </div>
      </van-tab>
      <van-tab title="协助人">
        <div class="container">
          <div class="box" v-if="userList && userList?.length > 0">
            <van-row justify="space-between" class="text-sm text-slate-400">
              <van-col span="16" class="py-1">维修人名称</van-col>
              <van-col span="8" class="py-1">维修人ID</van-col>
            </van-row>
            <van-row
              justify="space-between"
              v-for="user in userList"
              :key="user.id"
              class="text-sm border-b-4 border-slate-700"
            >
              <van-col span="16" class="py-1">{{ user.assistantName }} </van-col>
              <van-col span="8" class="py-1">{{ user.assistantId }}</van-col>
            </van-row>
          </div>
          <van-empty v-else description="暂无数据" />
        </div>
      </van-tab>
      <van-tab title="备件信息">
        <div class="container" v-if="partList && partList?.length > 0">
          <div class="box" v-for="part in partList" :key="part.id">
            <IndexList>
              <template #left> 备件编号 </template>
              <template #right>
                <span class="text-black"> {{ part?.sparePartCode }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 备件名称 </template>
              <template #right>
                <span class="text-black"> {{ part?.sparePartName }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 备件数量 </template>
              <template #right>
                <span class="text-black"> {{ part?.quantity }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 备件用途 </template>
              <template #right>
                <span class="text-black"> {{ part?.remark }}</span>
              </template>
            </IndexList>
          </div>
        </div>
        <van-empty v-else description="暂无数据" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { getViewDetailInfo } from '@/api/eam/repair'
import IndexList from '@/views/components/indexList/index'
import { getDict, getLabel } from '@/utils/dictUtils'

onMounted(() => {
  getDicts()
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

async function getDetail() {
  if (history.state?.id) {
    try {
      const { data } = await getViewDetailInfo(history.state?.id)
      repair.value = data.repair
      partList.value = data.partList
      userList.value = data.userList
    } catch (error) {}
  }
}
getDetail()

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

// .van-cell {
//   padding: 0.4rem;
// }
</style>
