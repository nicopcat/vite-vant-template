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
              <van-col span="8" class="text-title">检验结果</van-col>
              <van-col span="16" class="text-res" style="text-align: end">{{ detailData.qualityLotStatus }}</van-col>
            </van-row>
          </div>
        </template>
      </van-cell>
    </div>

    <div class="m-2">
      <van-button type="primary" size="small" style="margin-right: 10px" @click="save" :loading="saveBtnLoading"
        >保 存</van-button
      >
      <van-button type="success" size="small" @click="submit" :loading="submitBtnLoading">提 交</van-button>
    </div>

    <div class="container">
      <!-- <div class="header">
        <span>检验批详情</span>
      </div> -->
      <div class="box" v-for="(item, index) in detailData.formValue" :key="index">
        <IndexList>
          <template #left> 检验项号 </template>
          <template #right> {{ item.code }} </template>
        </IndexList>
        <IndexList>
          <template #left> 检验项名称 </template>
          <template #right> {{ item.name }} </template>
        </IndexList>
        <IndexList>
          <template #left> 技术要求 </template>
          <template #right> {{ item.specification }} </template>
        </IndexList>
        <IndexList>
          <template #left> 测量方法 </template>
          <template #right> {{ item.measureMethod }} </template>
        </IndexList>
        <IndexList>
          <template #left> 0值 </template>
          <template #right> {{ item.boolZeroValue }} </template>
        </IndexList>
        <IndexList>
          <template #left> 1值 </template>
          <template #right> {{ item.boolOneValue }} </template>
        </IndexList>
        <IndexList>
          <template #left> 实测值 </template>
          <template #right> {{ item.actual }} </template>
        </IndexList>
        <IndexList>
          <template #left> 结果 </template>
          <template #right>
            <van-radio-group v-model="item.passed" direction="horizontal" style="justify-content: flex-end">
              <van-radio name="1">合格</van-radio>
              <van-radio name="0">不合格</van-radio>
            </van-radio-group></template
          >
        </IndexList>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getExecuteInfo, saveQualityLot, submitQualityLot } from '@/api/qms/qualityLot'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'
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
})

async function getDetail() {
  console.log(history.state?.id)
  if (history.state?.id) {
    try {
      const { data } = await getExecuteInfo(history.state?.id)
      detailData.value = data

      console.log(detailData.value)
    } catch (error) {}
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
  } catch (error) {}
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
  } catch (error) {}
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
    padding: 0.3rem 0;
  }

  .custom-title {
    font-size: 1rem;
    font-family: 'Helvetica', sans-serif;
    font-weight: bold;
  }

  .van-row {
    font-size: 15px;

    padding: 0.4rem 0;
  }

  .text {
    padding: 0.4rem 0;

    &-title {
    }

    &-res {
      color: #333;
    }
  }
}

.container {
  width: 100%;
  background-color: #f2f4f8;
  padding-bottom: 3rem;

  .header {
    width: 100%;
    height: 1.5rem;
    background-color: #fff;
    border-left: 4px solid rgb(24, 92, 219);
    padding: 0.3rem 0;

    span {
      padding: 0.4rem 0.8rem;
      color: #333;
      font-size: 16px;
      font-weight: bold;
    }
  }

  .box {
    background-color: #fff;
    padding: 1rem;
    margin: 10px 10px;
    margin-bottom: 1rem;

    &-item {
      margin: 0.4rem;

      .text-title {
        // font-size: 13px;
        color: #969799;
      }
      .text-res {
        // font-size: 13px;
        color: #333;
      }
    }
  }
}
</style>
