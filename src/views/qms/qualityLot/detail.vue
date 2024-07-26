<template>
  <view>
    <view class="content">
      <view class="header">
        <span>检验批信息</span>
      </view>
      <van-cell-group>
        <van-cell>
          <template #title>
            <span class="custom-title">{{ data.qualityLotCode }}</span>
          </template>
          <template #label>
            <view class="text">
              <van-row justify="space-between">
                <van-col span="8" class="text-title">检验类型</van-col>
                <van-col span="16" class="text-res" style="text-align: end">{{ data.qualityLotType }}</van-col>
              </van-row>
              <van-row justify="space-between">
                <van-col span="8" class="text-title">检验结果</van-col>
                <van-col span="16" class="text-res" style="text-align: end">{{ data.qualityLotStatus }}</van-col>
              </van-row>
            </view>
          </template>
        </van-cell>
      </van-cell-group>
    </view>

    <view class="container">
      <!-- <view class="header">
        <span>检验批详情</span>
      </view> -->
      <view class="box" v-for="(item, index) in data.formValue" :key="index">
        <van-row justify="space-between" class="box-item">
          <van-col span="8" class="text-title">检验项号</van-col>
          <van-col span="16" class="text-res" style="text-align: end">{{ item.code }}</van-col>
        </van-row>
        <van-row justify="space-between" class="box-item">
          <van-col span="8" class="text-title">检验项名称</van-col>
          <van-col span="16" class="text-res" style="text-align: end">{{ item.name }}</van-col>
        </van-row>
        <van-row justify="space-between" class="box-item">
          <van-col span="8" class="text-title">技术要求</van-col>
          <van-col span="16" class="text-res" style="text-align: end">{{ item.specification }}</van-col>
        </van-row>
        <van-row justify="space-between" class="box-item">
          <van-col span="8" class="text-title">测量方法</van-col>
          <van-col span="16" class="text-res" style="text-align: end">{{ item.measureMethod }}</van-col>
        </van-row>
        <van-row justify="space-between" class="box-item">
          <van-col span="8" class="text-title">0值</van-col>
          <van-col span="16" class="text-res" style="text-align: end">{{ item.boolZeroValue }}</van-col>
        </van-row>
        <van-row justify="space-between" class="box-item">
          <van-col span="8" class="text-title">1值</van-col>
          <van-col span="16" class="text-res" style="text-align: end">{{ item.boolOneValue }}</van-col>
        </van-row>
        <van-row justify="space-between" class="box-item">
          <van-col span="8" class="text-title">实测值</van-col>
          <van-col span="16" class="text-res" style="text-align: end">{{ item.actual }}</van-col>
        </van-row>
        <van-row justify="space-between" class="box-item">
          <van-col span="8" class="text-title">结果</van-col>
          <van-col span="16" class="text-res">
            <van-radio-group v-model="item.result" direction="horizontal" style="justify-content: flex-end">
              <van-radio name="1">合格</van-radio>
              <van-radio name="0">不合格</van-radio>
            </van-radio-group>
          </van-col>
        </van-row>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const data = ref({
  qualityLotId : 53,
  qualityLotCode : 'INJECTIONMOLDINGSTARTCHECKSTMO00000101',
  qualityLotType : '注塑开工确认检验',
  qualityLotStatus : '完成',
  formValue : [
    {
      createDept : null,
      createBy : 1,
      createTime : '2024-06-18 21:41:31',
      updateBy : 1,
      updateTime : '2024-06-18 21:41:31',
      qualityLotId : 53,
      qualityLotDetailId : 270,
      qualityLotCode : null,
      qualityPlanId : 18,
      qualityPlanDetailId : 16,
      actual : '',
      remark : '',
      passed : '1',
      code : 'ZKJ-01',
      name : '检查仓内是否存有余油',
      type : '3',
      minValue : '0.0000',
      maxValue : '0.0000',
      boolZeroValue : '不合格',
      boolOneValue : '合格',
      isRemark : '0',
      isRequire : '1',
      specification : '',
      measureMethod : '',
      result : '1'
    },
    {
      createDept : null,
      createBy : 1,
      createTime : '2024-06-18 21:41:31',
      updateBy : 1,
      updateTime : '2024-06-18 21:41:31',
      qualityLotId : 53,
      qualityLotDetailId : 271,
      qualityLotCode : null,
      qualityPlanId : 18,
      qualityPlanDetailId : 17,
      actual : '11',
      remark : '',
      passed : '1',
      code : 'ZKJ-02',
      name : '记录罐车内前次油品类型（内燃机油、液压油、防冻液、基础油）',
      type : '1',
      minValue : '0.0000',
      maxValue : '0.0000',
      boolZeroValue : '',
      boolOneValue : '',
      isRemark : '0',
      isRequire : '1',
      specification : '',
      measureMethod : '',
      result : '1'
    },
    {
      createDept : null,
      createBy : 1,
      createTime : '2024-06-18 21:41:31',
      updateBy : 1,
      updateTime : '2024-06-18 21:41:31',
      qualityLotId : 53,
      qualityLotDetailId : 272,
      qualityLotCode : null,
      qualityPlanId : 18,
      qualityPlanDetailId : 18,
      actual : '',
      remark : '',
      passed : '1',
      code : 'ZKJ-03',
      name : '检查罐体清洁度（杂质/水分）',
      type : '3',
      minValue : '0.0000',
      maxValue : '0.0000',
      boolZeroValue : '不合格',
      boolOneValue : '合格',
      isRemark : '0',
      isRequire : '1',
      specification : '',
      measureMethod : '',
      result : '1'
    },
    {
      createDept : null,
      createBy : 1,
      createTime : '2024-06-18 21:41:31',
      updateBy : 1,
      updateTime : '2024-06-18 21:41:31',
      qualityLotId : 53,
      qualityLotDetailId : 273,
      qualityLotCode : null,
      qualityPlanId : 18,
      qualityPlanDetailId : 19,
      actual : '',
      remark : '',
      passed : '1',
      code : 'ZKJ-04',
      name : '隔舱设备，仓阀是否关闭',
      type : '3',
      minValue : '0.0000',
      maxValue : '0.0000',
      boolZeroValue : '不合格',
      boolOneValue : '合格',
      isRemark : '0',
      isRequire : '1',
      specification : '',
      measureMethod : '',
      result : '1'
    },
    {
      createDept : null,
      createBy : 1,
      createTime : '2024-06-18 21:41:31',
      updateBy : 1,
      updateTime : '2024-06-18 21:41:31',
      qualityLotId : 53,
      qualityLotDetailId : 274,
      qualityLotCode : null,
      qualityPlanId : 18,
      qualityPlanDetailId : 20,
      actual : '',
      remark : '',
      passed : '1',
      code : 'ZKJ-05',
      name : '管线是否吹扫',
      type : '3',
      minValue : '0.0000',
      maxValue : '0.0000',
      boolZeroValue : '不合格',
      boolOneValue : '合格',
      isRemark : '0',
      isRequire : '1',
      specification : '',
      measureMethod : '',
      result : '1'
    },
    {
      createDept : null,
      createBy : 1,
      createTime : '2024-06-18 21:41:31',
      updateBy : 1,
      updateTime : '2024-06-18 21:41:31',
      qualityLotId : 53,
      qualityLotDetailId : 275,
      qualityLotCode : null,
      qualityPlanId : 18,
      qualityPlanDetailId : 21,
      actual : '',
      remark : '',
      passed : '1',
      code : 'ZKJ-06',
      name : '是否静电接地',
      type : '3',
      minValue : '0.0000',
      maxValue : '0.0000',
      boolZeroValue : '不合格',
      boolOneValue : '合格',
      isRemark : '0',
      isRequire : '1',
      specification : '',
      measureMethod : '',
      result : '1'
    },
    {
      createDept : null,
      createBy : 1,
      createTime : '2024-06-18 21:41:31',
      updateBy : 1,
      updateTime : '2024-06-18 21:41:31',
      qualityLotId : 53,
      qualityLotDetailId : 276,
      qualityLotCode : null,
      qualityPlanId : 18,
      qualityPlanDetailId : 22,
      actual : '',
      remark : '',
      passed : '1',
      code : 'ZKJ-07',
      name : '检查是否安装倒车止退器',
      type : '3',
      minValue : '0.0000',
      maxValue : '0.0000',
      boolZeroValue : '不合格',
      boolOneValue : '合格',
      isRemark : '0',
      isRequire : '1',
      specification : '',
      measureMethod : '',
      result : '1'
    },
    {
      createDept : null,
      createBy : 1,
      createTime : '2024-06-18 21:41:31',
      updateBy : 1,
      updateTime : '2024-06-18 21:41:31',
      qualityLotId : 53,
      qualityLotDetailId : 277,
      qualityLotCode : null,
      qualityPlanId : 18,
      qualityPlanDetailId : 23,
      actual : '',
      remark : '',
      passed : '1',
      code : 'ZKJ-08',
      name : '检查下泄油口是否关闭',
      type : '3',
      minValue : '0.0000',
      maxValue : '0.0000',
      boolZeroValue : '不合格',
      boolOneValue : '合格',
      isRemark : '0',
      isRequire : '1',
      specification : '',
      measureMethod : '',
      result : '1'
    }
  ]
})
</script>

<style lang="less" scoped>
page {
  background-color: #f2f4f8;
}

.content {
  width: 100%;
  background-color: #f2f4f8;
  margin-bottom: 1rem;

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

  .custom-title {
    font-size: 13px;
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
        font-size: 13px;
        color: #969799;
      }
      .text-res {
        font-size: 13px;
        color: #333;
      }
    }
  }
}
</style>
