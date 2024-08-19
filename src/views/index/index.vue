<template>
  <div class="section px-1 mb-12">
    <div class="box">
      <van-image width="100%" fit="cover" :src="sf_bg" />
    </div>
    <div class="box bg-white mb-2">
      <van-cell class="box-header font-bold" title="质量管理" value="" />
      <van-grid :border="false" :icon-size="38" clickable class="bg-white">
        <van-grid-item icon="description" icon-color="#2db755" text="检验批管理" @click="redirectTo('qualityLot')" />
        <van-grid-item icon="warning-o" icon-color="#2db755" text="异常管理" @click="redirectTo(2)" />
      </van-grid>
    </div>

    <div class="box bg-white mb-2">
      <van-cell class="box-header font-bold" title="设备管理" value="" />
      <van-grid :border="false" :icon-size="38" clickable>
        <van-grid-item icon="failure" icon-color="#509df0" text="设备维修管理" @click="redirectTo('repair')" />
        <van-grid-item icon="shield-o" icon-color="#509df0" text="保养工单管理" @click="redirectTo('maintenance')" />
        <van-grid-item icon="aim" icon-color="#509df0" text="保养方案管理" @click="redirectTo('spotInspection')" />
        <van-grid-item icon="manager-o" icon-color="#509df0" text="工装管理" @click="redirectTo(6)" />
      </van-grid>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import sf_bg from '@/assets/imgs/sf_bg.jpg'

const router = useRouter()

function redirectTo(params) {
  switch (params) {
    case 'qualityLot':
      router.push('/qms/qualityLot/index')
      break

    case 'repair':
      router.push('/eam/repair/index')
      break

    case 'maintenance':
      router.push('/eam/maintenance/index')
      break

    case 'spotInspection':
      router.push('/eam/spotInspection/index')
      break
    default:
      break
  }
}
</script>

<style lang="less" scoped>
html {
  background-color: #f2f6fa;
}

.content {
  width: 100%;
  .box {
    &-header {
      font-size: medium;
      font-weight: bold;
    }
  }
}
</style>
