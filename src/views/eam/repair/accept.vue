<template>
  <div class="content">
    <div class="container">
      <div class="box">
        <IndexList>
          <template #left> <span class="text-sm text-slate-400"> 设备编号</span> </template>
          <template #right>
            <span class="text-sm text-black"> {{ repair?.deviceCode }}</span>
          </template>
        </IndexList>
        <IndexList>
          <template #left> <span class="text-sm text-slate-400"> 设备名称</span> </template>
          <template #right>
            <span class="text-sm text-black"> {{ repair?.deviceName }}</span>
          </template>
        </IndexList>
        <IndexList>
          <template #left> <span class="text-sm text-slate-400"> 工单状态</span> </template>
          <template #right>
            <span class="text-sm text-black"> {{ repair?.status }}</span>
          </template>
        </IndexList>
        <IndexList>
          <template #left> <span class="text-sm text-slate-400"> 故障描述</span> </template>
          <template #right>
            <span class="text-sm text-black"> {{ repair?.faultReportDescription }}</span>
          </template>
        </IndexList>
        <IndexList>
          <template #left> <span class="text-sm text-slate-400"> 严重程度</span> </template>
          <template #right>
            <span class="text-sm text-black"> {{ repair?.faultLevel }}</span>
          </template>
        </IndexList>
        <IndexList>
          <template #left> <span class="text-sm text-slate-400"> 是否停机</span> </template>
          <template #right>
            <span class="text-sm text-black"> {{ repair?.shutdown }}</span>
          </template>
        </IndexList>
        <IndexList>
          <template #left> <span class="text-sm text-slate-400"> 故障累计时间(分钟)</span> </template>
          <template #right>
            <span class="text-sm text-black"> {{ repair?.faultHour }}</span>
          </template>
        </IndexList>
        <IndexList>
          <template #left> <span class="text-sm text-slate-400"> 报修时间</span> </template>
          <template #right>
            <span class="text-sm text-black"> {{ repair?.faultReportTime }}</span>
          </template>
        </IndexList>
        <IndexList>
          <template #left> <span class="text-sm text-slate-400"> 报修人</span> </template>
          <template #right>
            <span class="text-sm text-black"> {{ repair?.reportUser }}</span>
          </template>
        </IndexList>
        <IndexList>
          <template #left> <span class="text-sm text-slate-400"> 报修人电话</span> </template>
          <template #right>
            <span class="text-sm text-black"> {{ repair?.reportUserPhone }}</span>
          </template>
        </IndexList>
      </div>

      <div class="mt-4 p-2">
        <van-button round block type="primary" @click="accept"> 受 理 </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { getAcceptDetailInfo, acceptEamRepair } from '@/api/eam/repair'
import List from '@/views/components/list'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
import IndexList from '@/views/components/indexList/index'

const router = useRouter()
const repair = ref({})

async function getDetail() {
  console.log(history.state?.id)
  if (history.state?.id) {
    try {
      const { data } = await getAcceptDetailInfo(history.state?.id)
      repair.value = data
    } catch (error) {}
  }
}
getDetail()

async function accept(params) {
  try {
    const { code, msg } = await acceptEamRepair({ id: history.state?.id })
    if (code == ResultEnum.SUCCESS) {
      showSuccessToast(msg || '提交成功')
      setTimeout(() => {
        router.back()
      }, 500)
    } else {
      showFailToast('操作失败，请稍后再试...')
    }
  } catch (error) {}
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

.van-cell {
  padding: 0.4rem;
}
</style>
