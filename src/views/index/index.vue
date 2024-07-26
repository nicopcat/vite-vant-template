<template>
  <view class="section dashboard-section">
    <view class="content">
      <view class="box">
        <van-image width="100%" fit="cover" src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" />
      </view>
      <view class="box">
        <van-cell class="box-header" title="质量管理" value="" />
        <van-grid :border="false" :icon-size="38" clickable>
          <van-grid-item icon="description" icon-color="#2db755" text="检验批管理" @click="redirectTo(1)" />
          <van-grid-item icon="warning-o" icon-color="#2db755" text="异常管理" @click="redirectTo(2)" />
        </van-grid>
      </view>

      <view class="box">
        <van-cell class="box-header" title="设备管理" value="" />
        <van-grid :border="false" :icon-size="38" clickable>
          <van-grid-item icon="failure" icon-color="#509df0" text="设备维修管理" @click="redirectTo(3)" />
          <van-grid-item icon="shield-o" icon-color="#509df0" text="保养工单管理" @click="redirectTo(4)" />
          <van-grid-item icon="aim" icon-color="#509df0" text="点检工单管理" @click="redirectTo(5)" />
          <van-grid-item icon="manager-o" icon-color="#509df0" text="工装管理" @click="redirectTo(6)" />
        </van-grid>
      </view>
    </view>
  </view>
</template>

<script setup>
//import { ref } from 'vue'
import { useRouter } from 'vue-router'
//import { LoginLayout } from '@/components/YuLayout'
//import YuAppCard from '@/components/YuAppCard'

const router = useRouter()

function redirectTo(params){
  switch (params){
    case 1:
      router.push('/qms/qualityLot/index')
      break
    case 2:
      //router.push('/qms/qualityLot/execute')
      break
    case 3:
      router.push('/eam/repair/index')
      break
    default:
      break
  }
}
</script>

<style lang="less">
html {
  background-color: #f2f6fa;
}

// .content {
//   width: 100%;
//   padding-bottom: 5rem;

//   .box {
//     padding: 0.5rem 0.2rem;
//     background-color: #fff;

//     border: 1px solid rgb(242, 242, 242);
//     border-radius: 4px;
//     margin: 0.4rem;

//     &-header {
//       font-size: medium;
//       font-weight: bold;
//     }
//   }
// }
</style>
