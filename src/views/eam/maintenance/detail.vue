<template>
  <div class="content">
    <van-tabs v-model:active="active">
      <van-tab title="保养详情">
        <div class="container">
          <div class="box">
            <IndexList label="保养工单号">
              {{ detail?.code }}
            </IndexList>
            <IndexList label="保养类型">
              {{ getDetailLabel('eam_quality_plan_cycle', detail?.type) }}
            </IndexList>
            <IndexList label="状态">
              {{ getDetailLabel('eam_maintenance_status', detail?.status) }}
            </IndexList>
            <IndexList label="设备编号">
              {{ detail?.device }}
            </IndexList>
            <IndexList label="设备名称">
              {{ detail?.deviceName }}
            </IndexList>
            <IndexList label="设备标识">
              {{ detail?.deviceMark }}
            </IndexList>

            <IndexList label="辅助人">
              {{ detail?.helpByName }}
            </IndexList>
            <IndexList label="是否合格">
              <van-tag type="success" size="medium" v-if="detail?.result === '1'"> 合格 </van-tag>
              <van-tag type="danger" size="medium" v-if="detail?.result === '0'"> 不合格 </van-tag>
            </IndexList>
            <IndexList label="创建时间">
              {{ detail?.createTime }}
            </IndexList>
          </div>
        </div>
      </van-tab>
      <van-tab title="检验项">
        <div class="container" v-if="detail?.startTime !== null">
          <div class="box" v-for="(item, index) in detail.formValue" :key="index">
            <IndexList label="检验项号"> {{ item.code }} </IndexList>
            <IndexList label="检验项名称"> {{ item.name }} </IndexList>
            <IndexList label="是否委外">
              {{ getLabel(dictObj['eam_yes_no'], item?.isOutsourcing) }}
            </IndexList>
            <IndexList label="基准"> {{ item.specification }} </IndexList>
            <IndexList label="方法"> {{ item.measureMethod }} </IndexList>
            <IndexList label="部位"> {{ item.part }} </IndexList>
            <IndexList label="时间/次"> {{ item.perTimes }} </IndexList>
            <IndexList label="人数"> {{ item.headcount }} </IndexList>
            <!-- <div v-if="item.type === '3'">
              <IndexList label="0值"> {{ item.boolZeroValue }} </IndexList>
              <IndexList label="1值"> {{ item.boolOneValue }} </IndexList>
            </div> -->
            <div v-if="item.type === '2'">
              <IndexList label="最大值"> {{ item.maxValue }} </IndexList>
              <IndexList label="最小值"> {{ item.minValue }} </IndexList>
            </div>
            <IndexList label="实测值" v-if="item.type === '1' || item.type === '2'">
              <div class="flex flex-row justify-end items-center">
                {{ item.actual }}
                <van-icon v-if="item.passed === '0'" name="cross" color="#d03050" size="24" />
                <van-icon v-if="item.passed === '1'" name="success" color="#0e7a0d" size="24" />
              </div>
            </IndexList>
            <IndexList label="结果" v-if="item.type === '3'">
              <div class="flex flex-row justify-end items-center">
                <van-radio-group
                  disabled
                  v-model="item.passed"
                  direction="horizontal"
                  style="justify-content: flex-end"
                >
                  <van-radio name="1"> {{ item.boolOneValue }}</van-radio>
                  <van-radio name="0">{{ item.boolZeroValue }}</van-radio>
                </van-radio-group>
                <div>
                  <van-icon v-if="item.passed === '0'" name="cross" color="#d03050" size="24" />
                  <van-icon v-if="item.passed === '1'" name="success" color="#0e7a0d" size="24" />
                </div>
              </div>
            </IndexList>
            <IndexList label="备注" v-if="item.isRemark === '1'">
              {{ item.remark }}
            </IndexList>
            <IndexList label="示意图片" :leftSpan="5">
              <BasicUpload
                v-if="item.exampleOssIds?.length > 0"
                :max-count="0"
                :deletable="false"
                :ossId="item.exampleOssIds"
              />
              <div v-else>暂无</div>
            </IndexList>
            <IndexList label="现场照片" v-if="item.isPhoto === '1'" :leftSpan="5">
              <BasicUpload
                v-if="item.spotOssIds?.length > 0"
                :max-count="0"
                :deletable="false"
                :ossId="item.spotOssIds"
              />
              <div v-else>暂无</div>
            </IndexList>
          </div>
        </div>
        <van-empty v-else description="暂无数据" />
      </van-tab>
      <van-tab title="备件信息">
        <div class="container" v-if="detail.sparePartList && detail.sparePartList?.length > 0">
          <div class="box" v-for="part in detail.sparePartList" :key="part.id">
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
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getExecuteInfo } from '@/api/eam/maintenance'
import IndexList from '@/views/components/indexList/index'
import { getDict, getLabel, getDetailLabel } from '@/utils/dictUtils'
import BasicUpload from '@/components/BasicUpload'
import { getUserDetail } from '@/api/system/user'

onMounted(() => {
  getDicts()
})
// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  dictObj['eam_yes_no'] = await getDict('eam_yes_no')
}

const active = ref('')
const detail = ref()

async function getUser(id = 0) {
  const { data } = await getUserDetail(id)
  detail.value.helpByName = data.user.nickName
}

async function getDetail() {
  if (history.state?.id) {
    try {
      const { data } = await getExecuteInfo(history.state?.id)
      detail.value = data
      if (data.helpBy) {
        getUser(data.helpBy)
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

      &-item {
        margin: 0.4rem;
      }
    }
  }
}
</style>
