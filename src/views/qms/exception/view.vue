<template>
  <div class="content">
    <van-tabs v-model:active="active">
      <van-tab title="异常基础信息">
        <div class="container">
          <div class="box">
            <IndexList>
              <template #left> 异常单号 </template>
              <template #right>
                <span class="text-black"> {{ detailValue?.code }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 异常代码 </template>
              <template #right>
                <span class="text-black"> {{ detailValue?.exceptionTypeCode }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 状态 </template>
              <template #right>
                <span class="text-black"> {{ getDetailLabel('qms_exception_status', detailValue?.status) }} </span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 物料编码 </template>
              <template #right>
                <span class="text-black"> {{ detailValue?.itemCode }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 物料名称 </template>
              <template #right>
                <span class="text-black"> {{ detailValue?.itemName }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 物料类型 </template>
              <template #right>
                <span class="text-black"> {{ getDetailLabel('qms_item_type', detailValue?.itemType) }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 总数量 </template>
              <template #right>
                <span class="text-black"> {{ detailValue?.quantityTotal }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 异常数量 </template>
              <template #right>
                <span class="text-black"> {{ detailValue?.quantity }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 严重程度 </template>
              <template #right>
                <span class="text-black"> {{ getDetailLabel('qms_severity_level', detailValue?.severityLevel) }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 工序 </template>
              <template #right>
                <span class="text-black"> {{ detailValue?.operation }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 工位 </template>
              <template #right>
                <span class="text-black"> {{ detailValue?.workStation }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 发现人 </template>
              <template #right>
                <span class="text-black"> {{ detailValue?.createBy }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 发现时间 </template>
              <template #right>
                <span class="text-black"> {{ detailValue?.createTime }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 备注 </template>
              <template #right>
                <span class="text-black"> {{ detailValue?.remark }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 异常描述 </template>
              <template #right>
                <span class="text-black"> {{ detailValue?.description }}</span>
              </template>
            </IndexList>
            <IndexList :leftSpan="6">
              <template #left> 图片 </template>
              <template #right>
                <div :key="oss.url" v-for="oss in detailValue?.ossList">
                  <a class="text-blue-700 break-all py-2" :href="oss.url">{{ oss.name }}</a>
                </div>
              </template>
            </IndexList>
          </div>
        </div>
      </van-tab>
      <van-tab title="异常处理信息">
        <div class="container">
          <div class="box">
            <IndexList>
              <template #left> 决策 </template>
              <template #right>
                <span class="text-black"> {{ detailValue?.defectDecision }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 责任班组 </template>
              <template #right>
                <span class="text-black"> {{ detailValue?.responseClass }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 责任人 </template>
              <template #right>
                <span class="text-black"> {{ detailValue?.responseBy }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 处理意见 </template>
              <template #right>
                <span class="text-black"> {{ detailValue?.handleOpinion }}</span>
              </template>
            </IndexList>
          </div>
        </div>
      </van-tab>
      <van-tab title="异常关闭信息">
        <div class="container">
          <div class="box">
            <IndexList>
              <template #left> 工时(min) </template>
              <template #right>
                <span class="text-black"> {{ detailValue?.workingHours }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 处理班组 </template>
              <template #right>
                <span class="text-black"> {{ detailValue?.handleClass }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 处理人 </template>
              <template #right>
                <span class="text-black"> {{ detailValue?.handleBy }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 处理时间 </template>
              <template #right>
                <span class="text-black"> {{ detailValue?.handleTime }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 处理描述 </template>
              <template #right>
                <span class="text-black"> {{ detailValue?.handleDescription }}</span>
              </template>
            </IndexList>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { getViewDetail } from '@/api/qms/exception'
import { listByIds } from '@/api/system/oss'
import IndexList from '@/views/components/indexList/index'
import { getDetailLabel } from '@/utils/dictUtils'

onMounted(() => {})

const active = ref('')
const detailValue = ref({})

async function getDetail() {
  if (history.state?.id) {
    try {
      const { data } = await getViewDetail(history.state?.id)
      detailValue.value = data
      console.log(data.pictureList && data.pictureList.length > 0)
      if (data.pictureList && data.pictureList.length > 0) {
        const ids = data.pictureList.join(',')
        const res = await listByIds(ids)
        detailValue.value.ossList = res.data.map(x => {
          return { name: x.fileName, url: x.url }
        })
        console.log(detailValue.value.ossList)
      }
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
    }
  }
}
</style>
