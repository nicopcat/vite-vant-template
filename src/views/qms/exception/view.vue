<template>
  <div class="content">
    <van-tabs v-model:active="active">
      <van-tab title="异常基础信息">
        <div class="container">
          <div class="box">
            <IndexList label="异常单号"> {{ detailValue?.code }} </IndexList>
            <IndexList label="异常代码"> {{ detailValue?.exceptionTypeCode }} </IndexList>
            <IndexList label="状态">
              {{ getDetailLabel('qms_exception_status', detailValue?.status) }}
            </IndexList>
            <IndexList label="物料编码"> {{ detailValue?.itemCode }} </IndexList>
            <IndexList label="物料名称"> {{ detailValue?.itemName }} </IndexList>
            <IndexList label="物料类型">
              {{ getDetailLabel('qms_item_type', detailValue?.itemType) }}
            </IndexList>
            <IndexList label="总数量"> {{ detailValue?.quantityTotal }} </IndexList>
            <IndexList label="异常数量"> {{ detailValue?.quantity }} </IndexList>
            <IndexList label="严重程度">
              {{ getDetailLabel('qms_severity_level', detailValue?.severityLevel) }}
            </IndexList>
            <IndexList label="工序"> {{ detailValue?.operation }} </IndexList>
            <IndexList label="工位"> {{ detailValue?.workStation }} </IndexList>
            <IndexList label="发现人"> {{ detailValue?.createBy }} </IndexList>
            <IndexList label="发现时间"> {{ detailValue?.createTime }} </IndexList>
            <IndexList label="备注"> {{ detailValue?.remark }} </IndexList>
            <IndexList label="异常描述"> {{ detailValue?.description }} </IndexList>
            <IndexList label="图片" :leftSpan="5">
              <BasicUpload
                v-if="detailValue.pictureList && detailValue.pictureList?.length > 0"
                :max-count="0"
                :deletable="false"
                :ossId="detailValue.pictureList"
              />
              <div v-else>暂无</div>
            </IndexList>
          </div>
        </div>
      </van-tab>
      <van-tab title="异常处理信息">
        <div class="container">
          <div class="box">
            <IndexList label="决策"> {{ detailValue?.defectDecision }} </IndexList>
            <IndexList label="责任班组"> {{ detailValue?.responseClass }} </IndexList>
            <IndexList label="责任人"> {{ detailValue?.responseBy }} </IndexList>
            <IndexList label="原因描述"> {{ detailValue?.reasonDescription }} </IndexList>
            <IndexList label="处理意见"> {{ detailValue?.handleOpinion }} </IndexList>
          </div>
        </div>
      </van-tab>
      <van-tab title="异常关闭信息">
        <div class="container">
          <div class="box">
            <IndexList label="工时(min)">
              {{ Number(detailValue?.workingHours) === 0 ? '' : Number(detailValue?.workingHours) }}
            </IndexList>
            <IndexList label="工时分类">
              {{ getDetailLabel('qms_working_hours_type', detailValue?.workingHoursType) }}
            </IndexList>
            <IndexList label="责任人"> {{ detailValue?.responseBy }} </IndexList>

            <IndexList label="处理班组"> {{ detailValue?.handleClass }} </IndexList>
            <IndexList label="处理人"> {{ detailValue?.handleBy }} </IndexList>
            <IndexList label="处理时间"> {{ detailValue?.handleTime }} </IndexList>
            <IndexList label="处理描述"> {{ detailValue?.handleDescription }} </IndexList>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getViewDetail } from '@/api/qms/exception'
import { listByIds } from '@/api/system/oss'
import IndexList from '@/views/components/indexList/index'
import { getDetailLabel } from '@/utils/dictUtils'
import BasicUpload from '@/components/BasicUpload'

onMounted(() => {
  getDetail()
})

const active = ref(0)
const detailValue = ref({})

async function getDetail() {
  if (history.state?.id) {
    try {
      const { data } = await getViewDetail(history.state?.id)
      detailValue.value = data
      if (data.pictureList && data.pictureList.length > 0) {
        const ids = data.pictureList.join(',')
        const res = await listByIds(ids)
        detailValue.value.ossList = res.data.map(x => {
          return { name: x.fileName, url: x.url }
        })
      }
    } catch (error) {}
  }
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
    }
  }
}
</style>
