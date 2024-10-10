<template>
  <div class="content">
    <van-tabs v-model:active="active">
      <van-tab title="故障提报">
        <div class="container">
          <div class="box">
            <IndexList label="设备编号">
              <span> {{ repair?.deviceCode }}</span>
            </IndexList>
            <IndexList label="设备名称">
              <span> {{ repair?.deviceName }}</span>
            </IndexList>
            <IndexList label="工单状态">
              <!-- <span > {{ getLabel(dictObj['eam_repair_status'], repair?.status) }} </span> -->
              <span> {{ getDetailLabel('eam_repair_status', repair?.status) }} </span>
            </IndexList>
            <IndexList label="故障描述">
              <span> {{ repair?.faultReportDescription }}</span>
            </IndexList>
            <IndexList label="严重程度">
              <span> {{ getDetailLabel('eam_repair_level', repair?.faultLevel) }}</span>
            </IndexList>
            <IndexList label="是否停机">
              <span> {{ getDetailLabel('eam_yes_no', repair?.shutdown) }}</span>
            </IndexList>
            <IndexList :leftSpan="10" label="故障累计时间(分钟)">
              <span> {{ repair?.qualityFault }}</span>
            </IndexList>
            <IndexList label="报修时间">
              <span> {{ repair?.faultReportTime }}</span>
            </IndexList>
            <IndexList label="报修人">
              <span> {{ repair?.reportUser }}</span>
            </IndexList>
            <IndexList label="报修人电话">
              <span> {{ repair?.reportUserPhone }}</span>
            </IndexList>
            <IndexList label="附件">
              <BasicUpload v-if="imgOssIdsList?.length > 0" :max-count="0" :deletable="false" :ossId="imgOssIdsList" />
              <div v-else>暂无</div>
            </IndexList>
          </div>
        </div>
      </van-tab>
      <van-tab title="故障处理">
        <div class="container">
          <div class="box">
            <IndexList label="故障原因">
              <span> {{ repair?.failureCause }}</span>
            </IndexList>
            <IndexList label="解决方案">
              <span> {{ repair?.solution }}</span>
            </IndexList>
            <IndexList label="故障类型">
              <!-- <span > {{ getLabel(dictObj['eam_repair_type'], repair?.faultReportType) }}</span> -->
              <span> {{ getDetailLabel('eam_repair_type', repair?.faultReportType) }}</span>
            </IndexList>
            <div v-if="repair?.shutdownStartTime !== null">
              <IndexList label="开始停机时间">
                <span> {{ repair?.shutdownStartTime }}</span>
              </IndexList>
              <IndexList label="结束停机时间">
                <span> {{ repair?.shutdownEndTime }}</span>
              </IndexList>
            </div>
            <IndexList label="停机时间(min)" v-if="repair?.shutdownStartTime !== null && repair?.shutdownEndTime">
              <span> {{ repair?.qualityShutdown }}</span>
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
            <IndexList label="备件编号">
              <span> {{ part?.sparePartCode }}</span>
            </IndexList>
            <IndexList label="备件名称">
              <span> {{ part?.sparePartName }}</span>
            </IndexList>
            <IndexList label="备件数量">
              <span> {{ part?.quantity }}</span>
            </IndexList>
            <IndexList label="备件用途">
              <span> {{ part?.remark }}</span>
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
import { getDict, getLabel, getDetailLabel } from '@/utils/dictUtils'
import BasicUpload from '@/components/BasicUpload'

onMounted(() => {
  // getDicts()
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  const eam_repair_type_dict = await getDict('eam_repair_type')
  const eam_repair_status_dict = await getDict('eam_repair_status')
  const eam_device_mark_dict = await getDict('eam_device_mark')
  dictObj['eam_yes_no'] = await getDict('eam_yes_no')
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
const imgOssIdsList = ref([])

async function getDetail() {
  if (history.state?.id) {
    try {
      const { data } = await getViewDetailInfo(history.state?.id)
      repair.value = data.repair
      partList.value = data.partList
      userList.value = data.userList
      imgOssIdsList.value = data.imgOssIds
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
</style>
