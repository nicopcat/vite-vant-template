<template>
  <div class="content">
    <van-tabs v-model:active="active">
      <van-tab title="故障提报">
        <div class="container">
          <div class="box">
            <IndexList label="保养工单号">
              <span> {{ detailData?.code }}</span>
            </IndexList>
            <IndexList label="保养类型">
              <span> {{ detailData?.type }}</span>
            </IndexList>
            <IndexList label="保养状态">
              <span> {{ detailData?.status }} </span>
            </IndexList>
            <IndexList label="设备编号">
              <span> {{ detailData?.device }}</span>
            </IndexList>
          </div>
        </div>
      </van-tab>
      <van-tab title="备件信息">
        <div class="container" v-if="detailData.sparePartList && detailData.sparePartList?.length > 0">
          <div class="box" v-for="part in detailData.sparePartList" :key="part.id">
            <IndexList label="备件编号">
              <span> {{ part?.code }}</span>
            </IndexList>
            <IndexList label="备件名称">
              <span> {{ part?.name }}</span>
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
      <van-tab title="详情">
        <div class="container">
          <div class="box" v-for="(item, index) in detailData.formValue" :key="index">
            <IndexList label="检验项号">
              {{ item.code }}
            </IndexList>
            <IndexList label="检验项名称">
              {{ item.name }}
            </IndexList>
            <IndexList label="技术要求">
              {{ item.specification }}
            </IndexList>
            <IndexList label="测量方法">
              {{ item.measureMethod }}
            </IndexList>
            <div v-if="item.type === '3'">
              <IndexList label="0值">
                {{ item.boolZeroValue }}
              </IndexList>
              <IndexList label="1值">
                {{ item.boolOneValue }}
              </IndexList>
            </div>

            <div v-if="item.type === '2'">
              <IndexList label="最大值">
                {{ item.maxValue }}
              </IndexList>
              <IndexList label="最小值">
                {{ item.minValue }}
              </IndexList>
            </div>

            <IndexList label="实测值">
              {{ item.actual }}
            </IndexList>

            <IndexList label="结果">
              <van-radio-group disabled v-model="item.passed" direction="horizontal" style="justify-content: flex-end">
                <van-radio name="1">合格</van-radio>
                <van-radio name="0">不合格</van-radio>
              </van-radio-group>
            </IndexList>
            <IndexList label="备注">
              {{ item.remark }}
            </IndexList>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getExecuteInfo } from '@/api/eam/maintenance'
import IndexList from '@/views/components/indexList/index'

onMounted(() => {})

const active = ref('')
const detailData = ref()

async function getDetail() {
  if (history.state?.id) {
    try {
      const { data } = await getExecuteInfo(history.state?.id)
      detailData.value = data
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
