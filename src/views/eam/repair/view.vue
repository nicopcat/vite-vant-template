<template>
  <div class="content">
    <van-tabs v-model:active="active">
      <van-tab title="故障提报">
        <div class="m-2 rounded-sm bg-white">
          <List>
            <template #left> <span class="text-sm text-slate-400"> 设备编号</span> </template>
            <template #right>
              <span class="text-sm text-black"> {{ repair?.deviceCode }}</span>
            </template>
          </List>
          <List>
            <template #left> <span class="text-sm text-slate-400"> 设备名称</span> </template>
            <template #right>
              <span class="text-sm text-black"> {{ repair?.deviceName }}</span>
            </template>
          </List>
          <List>
            <template #left> <span class="text-sm text-slate-400"> 工单状态</span> </template>
            <template #right>
              <span class="text-sm text-black"> {{ repair?.status }}</span>
            </template>
          </List>
          <List>
            <template #left> <span class="text-sm text-slate-400"> 故障描述</span> </template>
            <template #right>
              <span class="text-sm text-black"> {{ repair?.faultReportDescription }}</span>
            </template>
          </List>
          <List>
            <template #left> <span class="text-sm text-slate-400"> 严重程度</span> </template>
            <template #right>
              <span class="text-sm text-black"> {{ repair?.faultLevel }}</span>
            </template>
          </List>
          <List>
            <template #left> <span class="text-sm text-slate-400"> 是否停机</span> </template>
            <template #right>
              <span class="text-sm text-black"> {{ repair?.shutdown }}</span>
            </template>
          </List>
          <List>
            <template #left> <span class="text-sm text-slate-400"> 故障累计时间(分钟)</span> </template>
            <template #right>
              <span class="text-sm text-black"> {{ repair?.faultHour }}</span>
            </template>
          </List>
          <List>
            <template #left> <span class="text-sm text-slate-400"> 报修时间</span> </template>
            <template #right>
              <span class="text-sm text-black"> {{ repair?.faultReportTime }}</span>
            </template>
          </List>
          <List>
            <template #left> <span class="text-sm text-slate-400"> 报修人</span> </template>
            <template #right>
              <span class="text-sm text-black"> {{ repair?.reportUser }}</span>
            </template>
          </List>
          <List>
            <template #left> <span class="text-sm text-slate-400"> 报修人电话</span> </template>
            <template #right>
              <span class="text-sm text-black"> {{ repair?.reportUserPhone }}</span>
            </template>
          </List>
        </div>
      </van-tab>
      <van-tab title="故障处理">内容 2</van-tab>
      <van-tab title="协助人">内容 3</van-tab>
      <van-tab title="备件信息">内容 4</van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getViewDetailInfo } from '@/api/eam/repair'
import List from '@/views/components/list'

const router = useRouter()
const route = useRoute()
const active = ref('')
const repair = ref({})
const partList = ref([])
const userList = ref([])

async function getDetail(){
  console.log(history.state?.id)
  if (history.state?.id){
    try {
      const { data } = await getViewDetailInfo(history.state?.id)
      repair.value = data.repair
      partList.value = data.partList
      userList.value = data.userList

      console.log('repair', repair.value)
    } catch (error){}
    //请求详情url：
    ///api/eam/EamRepair/view/25
  }
}
getDetail()

function check(params){
  console.log(params)
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
