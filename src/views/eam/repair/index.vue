<template>
  <div class="content">
    <div v-for="(item, index) in list" class="content-box" :key="index">
      <van-cell-group inset>
        <van-cell class="flex-col">
          <template #title>
            <span class="text-sm font-bold break-words">{{ item.code }}</span>
          </template>
          <template #label>
            <!-- <div class="">维修工单号：{{ item.code }}</div> -->
            <div class="">
              <van-row justify="space-between">
                <van-col span="8" class="t-title">故障提报时间</van-col>
                <van-col span="16" class="text-res" style="text-align: end">{{ item.faultReportTime }}</van-col>
              </van-row>
              <van-row justify="space-between">
                <van-col span="8" class="text-title">提报人</van-col>
                <van-col span="16" class="text-res" style="text-align: end">{{ item.reportUser }}</van-col>
              </van-row>
              <van-row justify="space-between">
                <van-col span="8" class="text-title">状态</van-col>
                <van-col span="16" class="text-res" style="text-align: end">{{ item.status }}</van-col>
              </van-row>
            </div>
            <!-- <div class="">提报人：{{ item.reportUser }}</div>
            <div class="">状态：{{ item.status }}</div> -->

            <div style="margin: 1rem 0.2rem 0 0">
              <van-button v-if="item.status === 'COMPLETED'"
size="small"
@click="view(item)"
style="margin-right: 10px"
                >查 看</van-button
              >
              <van-button size="small" type="primary" @click="edit(item)" style="margin-right: 10px">编 辑</van-button>
              <van-button
                v-if="item.status === 'ONGOING'"
                type="success"
                size="small"
                style="margin-right: 10px"
                @click="complete(item)"
                >完 成</van-button
              >
              <van-button size="small" style="margin-right: 10px" @click="routerTo(item)">关 闭</van-button>
              <van-button
                v-if="item.status === 'WAITINGFORREPAIR'"
                type="danger"
                size="small"
                style="margin-right: 10px"
                @click="cancel(item)"
                >撤 销</van-button
              >
            </div>
          </template>
          <!-- 自定义单元格最右侧的额外内容 -->
          <!-- <template #value>
            <van-tag type="success">完成</van-tag>
          </template> -->
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const list = ref([
  {
    id : 25,
    code : 'WX202407090003',
    faultReportTime : '2024-07-09 10:48:38',
    reportUser : '超级管理员',
    deviceId : null,
    status : 'COMPLETED',
    deviceCode : 'A-17',
    deviceName : 'A-17',
    deviceMark : 'A',
    faultReportType : 'fault',
    shutdown : '1',
    faultLevel : 'A',
    faultHour : '1',
    faultReportDescription : '测试停机',
    repairUser : '超级管理员',
    reportUserPhone : '15888888888',
    shutdownStartTime : '2024-07-09 10:48:38',
    shutdownEndTime : '2024-08-01 10:49:56',
    remark : null,
    acceptanceTime : null,
    repairStartTime : '2024-07-09 10:49:22',
    repairEndTime : null,
    failureCause : '12',
    solution : '的点点滴滴'
  },
  {
    id : 24,
    code : 'WX202407090002',
    faultReportTime : '2024-07-09 10:47:32',
    reportUser : '超级管理员',
    deviceId : null,
    status : 'CANCELED',
    deviceCode : 'A-17',
    deviceName : 'A-17',
    deviceMark : 'A',
    faultReportType : 'fault',
    shutdown : '1',
    faultLevel : 'A',
    faultHour : '21160',
    faultReportDescription : '停机测试',
    repairUser : null,
    reportUserPhone : '15888888888',
    shutdownStartTime : '2024-07-09 10:47:32',
    shutdownEndTime : null,
    remark : null,
    acceptanceTime : null,
    repairStartTime : null,
    repairEndTime : null,
    failureCause : '',
    solution : ''
  },
  {
    id : 23,
    code : 'WX202407090001',
    faultReportTime : '2024-07-09 08:39:12',
    reportUser : '超级管理员',
    deviceId : null,
    status : 'ONGOING',
    deviceCode : 'A-17',
    deviceName : 'A-17',
    deviceMark : 'A',
    faultReportType : 'fault',
    shutdown : '0',
    faultLevel : '',
    faultHour : '21288',
    faultReportDescription : '不停机维修',
    repairUser : '超级管理员',
    reportUserPhone : '15888888888',
    shutdownStartTime : null,
    shutdownEndTime : null,
    remark : null,
    acceptanceTime : null,
    repairStartTime : '2024-07-09 09:03:26',
    repairEndTime : null,
    failureCause : '',
    solution : '更换23'
  },
  {
    id : 22,
    code : 'WX202407080004',
    faultReportTime : '2024-07-08 16:59:15',
    reportUser : '超级管理员',
    deviceId : null,
    status : 'CLOSED',
    deviceCode : 'A-14',
    deviceName : 'A-14',
    deviceMark : 'A',
    faultReportType : '',
    shutdown : '0',
    faultLevel : '',
    faultHour : '29',
    faultReportDescription : '1',
    repairUser : '超级管理员',
    reportUserPhone : '15888888888',
    shutdownStartTime : null,
    shutdownEndTime : null,
    remark : null,
    acceptanceTime : null,
    repairStartTime : '2024-07-08 17:25:40',
    repairEndTime : null,
    failureCause : '',
    solution : ''
  },
  {
    id : 21,
    code : 'WX202407080003',
    faultReportTime : '2024-07-08 16:44:17',
    reportUser : '超级管理员',
    deviceId : null,
    status : 'CLOSED',
    deviceCode : 'A-17',
    deviceName : 'A-17',
    deviceMark : 'A',
    faultReportType : '',
    shutdown : '0',
    faultLevel : '',
    faultHour : '1039',
    faultReportDescription : '1',
    repairUser : '超级管理员',
    reportUserPhone : '15888888888',
    shutdownStartTime : null,
    shutdownEndTime : null,
    remark : null,
    acceptanceTime : null,
    repairStartTime : '2024-07-09 09:35:58',
    repairEndTime : null,
    failureCause : '1',
    solution : '0'
  },
  {
    id : 20,
    code : 'WX202407080002',
    faultReportTime : '2024-07-08 16:26:01',
    reportUser : '超级管理员',
    deviceId : null,
    status : 'ONGOING',
    deviceCode : 'A-13',
    deviceName : 'A-13',
    deviceMark : 'A',
    faultReportType : 'fault',
    shutdown : '0',
    faultLevel : 'A',
    faultHour : '22261',
    faultReportDescription : '仓储仓储',
    repairUser : '超级管理员',
    reportUserPhone : '15888888888',
    shutdownStartTime : null,
    shutdownEndTime : null,
    remark : null,
    acceptanceTime : null,
    repairStartTime : '2024-07-08 16:29:43',
    repairEndTime : null,
    failureCause : '测试完测',
    solution : '不解决'
  },
  {
    id : 19,
    code : 'WX202407080001',
    faultReportTime : '2024-07-08 16:24:22',
    reportUser : '超级管理员',
    deviceId : null,
    status : 'ONGOING',
    deviceCode : 'A-13',
    deviceName : 'A-13',
    deviceMark : 'A',
    faultReportType : 'fault',
    shutdown : '0',
    faultLevel : 'A',
    faultHour : '22263',
    faultReportDescription : '是数据',
    repairUser : '超级管理员',
    reportUserPhone : '15888888888',
    shutdownStartTime : null,
    shutdownEndTime : null,
    remark : null,
    acceptanceTime : null,
    repairStartTime : '2024-07-08 16:34:59',
    repairEndTime : null,
    failureCause : '9',
    solution : '123'
  },
  {
    id : 18,
    code : 'WX202407030002',
    faultReportTime : '2024-07-03 15:05:37',
    reportUser : '超级管理员',
    deviceId : null,
    status : 'WAITINGFORREPAIR',
    deviceCode : 'A-17',
    deviceName : 'A-17',
    deviceMark : 'A',
    faultReportType : 'fault',
    shutdown : '0',
    faultLevel : 'A',
    faultHour : '29542',
    faultReportDescription : '反反复复',
    repairUser : '疯狂的狮子Li14141414',
    reportUserPhone : '15888888888',
    shutdownStartTime : null,
    shutdownEndTime : null,
    remark : null,
    acceptanceTime : null,
    repairStartTime : null,
    repairEndTime : null,
    failureCause : '',
    solution : ''
  },
  {
    id : 17,
    code : 'WX202407030001',
    faultReportTime : '2024-07-03 14:55:43',
    reportUser : '超级管理员',
    deviceId : null,
    status : 'CLOSED',
    deviceCode : 'A-17',
    deviceName : 'A-17',
    deviceMark : 'A',
    faultReportType : 'shutdown',
    shutdown : '1',
    faultLevel : 'A',
    faultHour : '8378',
    faultReportDescription : 'A-17停机维修',
    repairUser : '超级管理员',
    reportUserPhone : '15888888888',
    shutdownStartTime : '2024-07-03 14:55:43',
    shutdownEndTime : '2024-07-09 10:34:11',
    remark : null,
    acceptanceTime : null,
    repairStartTime : '2024-07-09 10:33:54',
    repairEndTime : null,
    failureCause : '12',
    solution : '33333'
  },
  {
    id : 16,
    code : 'WX202406290001',
    faultReportTime : '2024-06-29 14:12:56',
    reportUser : '超级管理员',
    deviceId : null,
    status : 'WAITINGFORCOMFIRM',
    deviceCode : 'A-10',
    deviceName : 'A-10',
    deviceMark : 'A',
    faultReportType : 'fault',
    shutdown : '1',
    faultLevel : 'A',
    faultHour : '35354',
    faultReportDescription : '故障停机',
    repairUser : null,
    reportUserPhone : '15888888888',
    shutdownStartTime : '2024-06-29 14:12:56',
    shutdownEndTime : null,
    remark : null,
    acceptanceTime : null,
    repairStartTime : null,
    repairEndTime : null,
    failureCause : '',
    solution : ''
  }
])

function view(item){
  router.push({ name : 'RepairView', state : { id : item.id }}) //-> /user/123
}

function edit(params){
  //router.push('/eam/repair/detail')
}
function complete(params){
  //router.push('/eam/repair/detail')
}

function cancel(params){
  console.log(params)
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

  &-box {
    padding: 0.2rem 0;
    border-radius: 4px;
    background-color: #fff;
    margin: 0.6rem;

    .custom-title {
      font-size: 13px;
      font-family: 'Helvetica', sans-serif;
      font-weight: bold;
    }

    .van-row {
      font-size: 15px;
      padding: 0.4rem 0;
    }

    .text {
      padding: 0.4rem 0;

      &-title {
      }

      &-res {
        color: #333;
      }
    }
  }
}

.van-cell {
  padding: 0.4rem;
}
</style>
