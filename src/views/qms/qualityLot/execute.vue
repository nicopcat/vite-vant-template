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
    <div class="container" v-if="detailData.formValue && detailData.formValue?.length > 0">
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

        <IndexList v-if="item.type === '2' || item.type === '1'" label="实测值" :required="item.isRequire === '1'">
          <van-field
            input-align="right"
            v-model="item.actual"
            name="actual"
            :rules="[{ required: item.isRequire === '1', message: '请输入实测值' }]"
            placeholder="请输入实测值"
            @change="actualChange(item.actual, item.maxValue, item.minValue, item)"
          />
        </IndexList>
        <IndexList v-if="item.isSampling === '1'" label="采样数量" required>
          <van-field
            input-align="right"
            v-model="item.sampleSize"
            name="sampleSize"
            :rules="[{ required: true, message: '请输入采样数量' }]"
            placeholder="请输入采样数量"
            type="number"
          />
        </IndexList>
        <IndexList label="备注" v-if="item.isRemark === '1'">
          <van-field v-model="item.remark" type="textarea" input-align="right" name="remark" placeholder="请输入备注" />
        </IndexList>
        <IndexList label="图片" v-if="item.type === '6'" :leftSpan="4">
          <van-field input-align="right">
            <template #input>
              <BasicUpload :isResultArray="false" :ossId="item.actual" @uploadChange="e => (item.actual = e)" />
            </template>
          </van-field>
        </IndexList>
      </div>
      <div class="mb-10 p-2">
        <van-button type="primary" round block class="mt-2" @click="save" :loading="saveBtnLoading">保 存</van-button>
        <van-button type="success" round block class="mt-2" @click="submit" :loading="submitBtnLoading"
          >提 交</van-button
        >
      </div>
    </div>
    <van-empty v-else description="暂无内容" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getExecuteInfo, saveQualityLot, submitQualityLot, getWorkOrderByQualityLotId } from '@/api/qms/qualityLot'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'

import BasicUpload from '@/components/BasicUpload'
import IndexList from '@/views/components/indexList/index'

const router = useRouter()
const detailData = ref({
  qualityLotId: '',
  qualityLotCode: '',
  qualityLotType: '',
  qualityLotStatus: '',
  formValue: [],
})

const saveBtnLoading = ref(false)
const submitBtnLoading = ref(false)

onMounted(() => {
  getDetail()
  getWorkInfo()
})

async function getDetail() {
  console.log(history.state?.id)
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
  if (data) {
    data.batchNumber = data.extendList.find(item => item.key === 'batchNumber')?.value
    workOrderInfo.value = data
  }
}

// 实测值校验
function actualChange(actual, maxValue, minValue, subItem) {
  switch (subItem.type) {
    //  当type == 1时，实测值有值则为合格
    case '1':
      if (actual || actual.length > 0) {
        subItem.passed = '1'
      } else {
        subItem.passed = '0'
      }
      break

    //  当type == 2, 实测值在最小值、最大值范围内的为合格
    case '2':
      if (Number(actual) || Number(actual) === 0) {
        if (actual >= Number(minValue) && actual <= Number(maxValue)) {
          subItem.passed = '1'
        } else {
          subItem.passed = '0'
        }
      } else {
        subItem.passed = ''
        subItem.actual = ''
      }
      break
    default:
      break
  }
}

async function save() {
  saveBtnLoading.value = true
  detailData.value.qualityLotStatus = '检验中'
  try {
    const { code, msg } = await saveQualityLot(detailData.value)
    if (code == ResultEnum.SUCCESS) {
      showSuccessToast(msg || '保存成功')
      setTimeout(() => {
        router.back()
      }, 600)
    } else {
      showFailToast('操作失败，请稍后再试...')
    }
  } catch (error) {
  } finally {
    saveBtnLoading.value = false
  }
}

async function submit() {
  submitBtnLoading.value = true
  detailData.value.qualityLotStatus = '完成'
  detailData.value.formValue.result = detailData.value.formValue.passed
  try {
    const { code, msg } = await submitQualityLot(detailData.value)
    if (code == ResultEnum.SUCCESS) {
      showSuccessToast(msg || '提交成功')
      setTimeout(() => {
        router.back()
      }, 600)
    } else {
      showFailToast('操作失败，请稍后再试...')
    }
  } catch (error) {
  } finally {
    submitBtnLoading.value = false
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
    margin-top: 0.5rem;
    padding: 0.5rem 0;
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
  padding-bottom: 2rem;

  .box {
    background-color: #fff;
    padding: 1rem;
    margin: 10px 10px;
    margin-bottom: 1rem;
  }
}
</style>
