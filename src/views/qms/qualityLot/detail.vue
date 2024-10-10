<template>
  <div>
    <div class="content mt-1">
      <div class="header py-2 flex flex-col">
        <div class="px-2 font-bold">检验批信息</div>
      </div>
      <van-cell class="flex-col">
        <template #title>
          <span class="text-sm font-bold break-words">{{ detailData.qualityLotCode }}</span>
        </template>
        <template #label>
          <div class="text">
            <van-row justify="space-between">
              <van-col span="8" class="text-title">检验类型</van-col>
              <van-col span="16" class="text-res" style="text-align: end">{{ detailData.qualityLotType }}</van-col>
            </van-row>
            <van-row justify="space-between">
              <van-col span="8" class="text-title">检验批状态</van-col>
              <van-col span="16" class="text-res" style="text-align: end">{{ detailData.qualityLotStatus }}</van-col>
            </van-row>
            <!-- <van-row justify="space-between">
              <van-col span="8" class="text-title">检验结果</van-col>
              <van-col span="16" class="text-res" style="text-align: end">{{ detailData.qualityLotStatus }}</van-col>
            </van-row> -->
            <div v-if="workOrderInfo">
              <van-row justify="space-between">
                <van-col span="8" class="text-title">成品物料名称</van-col>
                <van-col span="16" class="text-res" style="text-align: end">{{ workOrderInfo.itemName }}</van-col>
              </van-row>
              <van-row justify="space-between">
                <van-col span="8" class="text-title">成品批次 </van-col>
                <van-col span="16" class="text-res" style="text-align: end">{{ workOrderInfo.batchNumber }}</van-col>
              </van-row>
              <van-row justify="space-between">
                <van-col span="8" class="text-title"> 数量 </van-col>
                <van-col span="16" class="text-res" style="text-align: end">{{ workOrderInfo.quantity }}</van-col>
              </van-row>
            </div>
          </div>
        </template>
      </van-cell>
    </div>

    <div class="container">
      <div class="box" v-for="(item, index) in detailData.formValue" :key="index">
        <IndexList label="检验项号"> {{ item.code }} </IndexList>
        <IndexList label="检验项名称"> {{ item.name }} </IndexList>
        <IndexList label="技术要求"> {{ item.specification }} </IndexList>
        <IndexList label="测量方法"> {{ item.measureMethod }} </IndexList>
        <div v-if="item.type === '2'">
          <IndexList label="最大值"> {{ item.boolZeroValue }} </IndexList>
          <IndexList label="最小值"> {{ item.boolOneValue }} </IndexList>
        </div>
        <div v-if="item.type === '3'">
          <IndexList label="0值"> {{ item.boolZeroValue }} </IndexList>
          <IndexList label="1值"> {{ item.boolOneValue }} </IndexList>
        </div>
        <IndexList label="结果">
          <div class="flex flex-row justify-end items-center">
            <div>
              <van-icon v-if="item.passed === '0'" name="cross" color="#d03050" size="24" />
              <van-icon v-if="item.passed === '1'" name="success" color="#0e7a0d" size="24" />
            </div>
          </div>
        </IndexList>
        <IndexList v-if="item.type === '1'" label="实测值" :required="item.isRequire === '1'">
          {{ subItem.actual }}
        </IndexList>
        <IndexList v-if="item.isSampling === '1'" label="采样数量" required>
          {{ subItem.sampleSize }}
        </IndexList>
        <IndexList label="备注" v-if="item.isRemark === '1'">
          {{ item.remark }}
        </IndexList>
        <IndexList label="图片" v-if="item.type === '6'" :leftSpan="4">
          <van-field input-align="right">
            <template #input>
              <BasicUpload
                v-if="!!item.actual"
                :max-count="0"
                :deletable="false"
                :isResultArray="false"
                :ossId="item.actual"
              />
              <div v-else>暂无</div>
            </template>
          </van-field>
        </IndexList>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getExecuteInfo, getWorkOrderByQualityLotId } from '@/api/qms/qualityLot'
import BasicUpload from '@/components/BasicUpload'
import IndexList from '@/views/components/indexList/index'

const detailData = ref({
  qualityLotId: '',
  qualityLotCode: '',
  qualityLotType: '',
  qualityLotStatus: '',
  formValue: [],
})

onMounted(() => {
  getDetail()
  getWorkInfo()
})

async function getDetail() {
  if (history.state?.id) {
    try {
      const { data } = await getExecuteInfo(history.state?.id)
      detailData.value = data
    } catch (error) {}
  }
}

const workOrderInfo = ref(null)
async function getWorkInfo() {
  const id = history.state?.id
  const { data } = await getWorkOrderByQualityLotId(id)
  console.log(data)
  if (data) {
    data.batchNumber = data.extendList.find(item => item.key === 'batchNumber')?.value
    workOrderInfo.value = data
    console.log(workOrderInfo.value)
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  background-color: #f2f4f8;
  margin-bottom: 1rem;

  .header {
    width: 100%;
    background-color: #fff;
    border-left: 4px solid rgb(24, 92, 219);
  }

  .van-row {
    font-size: 15px;
    padding: 0.4rem 0;
  }

  .text {
    padding: 0.4rem 0;

    &-res {
      color: #333;
    }
  }
}

.container {
  width: 100%;
  background-color: #f2f4f8;
  padding-bottom: 4rem;

  .box {
    background-color: #fff;
    padding: 0.5rem 1rem;
    margin: 10px 10px;
    margin-bottom: 1rem;
  }
}
</style>
