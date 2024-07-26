<template>
  <div class="">
    <div v-for="(item, index) in list" class="my-4 w-full" :key="index">
      <van-cell-group inset>
        <van-cell class="flex-col">
          <template #title>
            <span class="text-sm font-bold break-words">{{ item.code }}</span>
          </template>
          <template #label>
            <div class="text-sm mt-1">
              检验类型：<span class="text-black"> {{ item.type }}</span>
            </div>
            <div class="text-sm mt-1">
              检验结果： <span class="text-black">{{ item.result }}</span>
            </div>
            <div class="text-sm mt-1">
              检验状态： <span class="text-black"> {{ item.status }}</span>
            </div>
            <div class="mt-3">
              <van-button type="success"
icon="down"
size="small"
@click="execute(item)"
style="margin-right: 10px"
                >执 行</van-button
              >
              <van-button type="primary" icon="notes-o" size="small" @click="detail(item)">详 情</van-button>
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
    id : 143,
    code : 'FILLINGLOTPRODUCTINSPECTIONSTMO00000701',
    qualityPlanId : 28,
    type : 'FILLINGLOTPRODUCTINSPECTION',
    result : '',
    status : 'NEW',
    createTime : '2024-06-26 10:50:00'
  },
  {
    id : 142,
    code : 'FILLINGLOTPRODUCTINSPECTIONSTMO00000701',
    qualityPlanId : 28,
    type : 'FILLINGLOTPRODUCTINSPECTION',
    result : '',
    status : 'NEW',
    createTime : '2024-06-26 10:48:58'
  },
  {
    id : 140,
    code : 'FILLINGLOTPRODUCTINSPECTIONSTMO00000701',
    qualityPlanId : 28,
    type : 'FILLINGLOTPRODUCTINSPECTION',
    result : '',
    status : 'NEW',
    createTime : '2024-06-26 10:43:55'
  },
  {
    id : 139,
    code : 'FILLINGLOTPRODUCTINSPECTIONSTMO00000701',
    qualityPlanId : 28,
    type : 'FILLINGLOTPRODUCTINSPECTION',
    result : '',
    status : 'NEW',
    createTime : '2024-06-26 10:40:57'
  },
  {
    id : 138,
    code : 'FILLINGLOTPRODUCTINSPECTIONSTMO00000701',
    qualityPlanId : 26,
    type : 'FILLINGLOTPRODUCTINSPECTION',
    result : '',
    status : 'NEW',
    createTime : '2024-06-26 10:39:19'
  },
  {
    id : 137,
    code : 'FILLINGLOTPRODUCTINSPECTIONSTMO00000701',
    qualityPlanId : 26,
    type : 'FILLINGLOTPRODUCTINSPECTION',
    result : '',
    status : 'NEW',
    createTime : '2024-06-26 10:39:14'
  },
  {
    id : 136,
    code : 'FILLINGLOTPRODUCTINSPECTIONSTMO00000701',
    qualityPlanId : 26,
    type : 'FILLINGLOTPRODUCTINSPECTION',
    result : '',
    status : 'NEW',
    createTime : '2024-06-26 10:38:57'
  },
  {
    id : 56,
    code : 'FILLINGLOTPRODUCTINSPECTIONSTMO00000101',
    qualityPlanId : 28,
    type : 'FILLINGLOTPRODUCTINSPECTION',
    result : '',
    status : 'NEW',
    createTime : '2024-06-19 20:20:58'
  },
  {
    id : 55,
    code : 'FILLINGLOTPRODUCTINSPECTIONSTMO00000101',
    qualityPlanId : 28,
    type : 'FILLINGLOTPRODUCTINSPECTION',
    result : '',
    status : 'NEW',
    createTime : '2024-06-19 20:20:02'
  },
  {
    id : 54,
    code : 'FILLINGLOTPRODUCTINSPECTIONSTMO00000101',
    qualityPlanId : 28,
    type : 'FILLINGLOTPRODUCTINSPECTION',
    result : '',
    status : 'NEW',
    createTime : '2024-06-19 20:12:53'
  }
])

function execute(params){
  //uni.navigateTo({ url: '/pages/qms/qualityLot/execute' })
  router.push('/qms/qualityLot/execute')
}

function detail(params){
  router.push('/qms/qualityLot/detail')
  //uni.navigateTo({ url: '/pages/qms/qualityLot/detail' })
}
</script>

<style lang="less" scoped>
page {
  background-color: #f2f4f8;
}

// .content {
//   .custom-title {
//     font-size: 13px;
//     font-family: 'Helvetica', sans-serif;
//     font-weight: bold;
//   }

//   width: 100%;
//   margin: 1rem 0;
//   background-color: #f2f4f8;

//   &-box {
//     padding: 0.2rem 0;
//     border-radius: 4px;
//     background-color: #fff;
//     margin: 0.6rem;

//     .custom-title {
//       font-size: 11px;
//     }
//   }
// }
// .van-cell {
//   padding: 0.4rem;
// }
</style>
