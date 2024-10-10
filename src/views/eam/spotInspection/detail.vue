<template>
  <div class="content">
    <van-tabs v-model:active="active">
      <van-tab title="检验项" name="检验项">
        <div class="container" v-if="detail?.spotInspectionItems?.length > 0">
          <div class="box" v-for="(item, index) in detail?.spotInspectionItems" :key="index">
            <IndexList label="检验项号">
              {{ item.code }}
            </IndexList>
            <IndexList label="检验项名称">
              {{ item.name }}
            </IndexList>
            <IndexList label="示意图片" :leftSpan="5">
              <BasicUpload
                v-if="item.exampleOssIds && item.exampleOssIds?.length > 0"
                :max-count="0"
                :deletable="false"
                :ossId="item.exampleOssIds"
              />
              <div v-else>暂无</div>
            </IndexList>
            <IndexList label="基准">
              {{ item.specification }}
            </IndexList>
            <IndexList label="方法">
              {{ item.measureMethod }}
            </IndexList>

            <div v-if="item.type === '2'">
              <IndexList label="最大值">
                {{ item.maxValue }}
              </IndexList>
              <IndexList label="最小值">
                {{ item.minValue }}
              </IndexList>
            </div>
            <IndexList label="实测值" v-if="item.type === '1' || item.type === '2'">
              <div class="flex flex-row justify-end">
                <div>{{ item.actual }}</div>
                <div>
                  <van-icon v-if="item.passed === '0'" name="cross" color="#d03050" size="24" />
                  <van-icon v-if="item.passed === '1'" name="success" color="#0e7a0d" size="24" />
                </div>
              </div>
            </IndexList>
            <IndexList label="结果" v-if="item.type === '3'" :leftSpan="6">
              <div class="flex flex-row justify-end">
                <van-radio-group
                  v-model="item.passed"
                  direction="horizontal"
                  style="justify-content: flex-end"
                  disabled
                >
                  <van-radio name="1"> {{ item.boolOneValue }}</van-radio>
                  <van-radio name="0">{{ item.boolZeroValue }}</van-radio>
                </van-radio-group>
                <van-icon v-if="item.passed === '0'" name="cross" color="#d03050" size="24" />
                <van-icon v-if="item.passed === '1'" name="success" color="#0e7a0d" size="24" />
              </div>
            </IndexList>
            <IndexList label="备注" v-if="item.isRemark === '1'">
              {{ item.remark }}
            </IndexList>
            <IndexList label="现场照片" :leftSpan="5">
              <BasicUpload
                v-if="item.spotOssIds && item.spotOssIds?.length > 0"
                :max-count="0"
                :deletable="false"
                :ossId="item.spotOssIds"
              />
              <div v-else>暂无</div>
            </IndexList>
          </div>
        </div>
        <van-loading class="grid justify-center items-center pt-5" v-else-if="loading" />
        <van-empty v-else description="暂无数据" />
      </van-tab>
      <van-tab title="点检详情" name="点检详情">
        <div class="container">
          <div class="box">
            <IndexList label="任务编号">
              <span> {{ detail?.code }}</span>
            </IndexList>
            <IndexList label="检验类型">
              <span> {{ getDetailLabel('eam_quality_plan_cycle', detail?.type) }}</span>
            </IndexList>
            <IndexList label="状态">
              <span> {{ getDetailLabel('eam_spot_inspection_status', detail?.status) }} </span>
            </IndexList>
            <IndexList label="设备编号">
              <span> {{ detail?.deviceCode }}</span>
            </IndexList>
            <IndexList label="设备名称">
              <span> {{ detail?.deviceName }}</span>
            </IndexList>
            <IndexList label="设备标识">
              <span> {{ detail?.deviceMark }}</span>
            </IndexList>
            <IndexList label="班次">
              <span> {{ getDetailLabel('eam_spot_inspection_shift', detail?.shift) }}</span>
            </IndexList>
            <IndexList label="是否合格">
              <van-tag type="success" size="medium" v-if="detail?.result === '1'"> 合格 </van-tag>
              <van-tag type="danger" size="medium" v-if="detail?.result === '0'"> 不合格 </van-tag>
            </IndexList>

            <IndexList label="创建时间">
              <span> {{ detail?.createTime }}</span>
            </IndexList>
            <IndexList label="备注">
              <span> {{ detail?.remark }}</span>
            </IndexList>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getEamSpotInspectionDetail } from '@/api/eam/spotInspection'
import IndexList from '@/views/components/indexList/index'
import { getDetailLabel } from '@/utils/dictUtils'
import BasicUpload from '@/components/BasicUpload'

onMounted(() => {
  getDetail()
})

const active = ref('检验项')
const detail = ref()
const loading = ref(true)

async function getDetail() {
  if (history.state?.id) {
    try {
      const { data } = await getEamSpotInspectionDetail(history.state?.id)
      detail.value = data
    } catch (error) {
    } finally {
      loading.value = false
    }
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

      &-item {
        margin: 0.4rem;
      }
    }
  }
}
</style>
