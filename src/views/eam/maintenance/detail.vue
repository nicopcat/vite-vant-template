<template>
  <div class="content">
    <van-tabs v-model:active="active">
      <van-tab title="故障提报">
        <div class="container">
          <div class="box">
            <IndexList>
              <template #left> 保养工单号 </template>
              <template #right>
                <span class="text-black"> {{ detailData?.code }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 保养类型 </template>
              <template #right>
                <span class="text-black"> {{ detailData?.type }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 保养状态 </template>
              <template #right>
                <span class="text-black"> {{ detailData?.status }} </span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 设备编号 </template>
              <template #right>
                <span class="text-black"> {{ detailData?.device }}</span>
              </template>
            </IndexList>
          </div>
        </div>
      </van-tab>
      <van-tab title="备件信息">
        <div class="container" v-if="detailData.sparePartList && detailData.sparePartList?.length > 0">
          <div class="box" v-for="part in detailData.sparePartList" :key="part.id">
            <IndexList>
              <template #left> 备件编号 </template>
              <template #right>
                <span class="text-black"> {{ part?.code }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 备件名称 </template>
              <template #right>
                <span class="text-black"> {{ part?.name }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 备件数量 </template>
              <template #right>
                <span class="text-black"> {{ part?.quantity }}</span>
              </template>
            </IndexList>
            <IndexList>
              <template #left> 备件用途 </template>
              <template #right>
                <span class="text-black"> {{ part?.remark }}</span>
              </template>
            </IndexList>
          </div>
        </div>
        <van-empty v-else description="暂无数据" />
      </van-tab>
      <van-tab title="详情">
        <div class="container">
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
            <div v-if="item.type === '3'">
              <IndexList>
                <template #left> 0值 </template>
                <template #right> {{ item.boolZeroValue }} </template>
              </IndexList>
              <IndexList>
                <template #left> 1值 </template>
                <template #right> {{ item.boolOneValue }} </template>
              </IndexList>
            </div>

            <div v-if="item.type === '2'">
              <IndexList>
                <template #left> 最大值 </template>
                <template #right> {{ item.maxValue }} </template>
              </IndexList>
              <IndexList>
                <template #left> 最小值 </template>
                <template #right> {{ item.minValue }} </template>
              </IndexList>
            </div>
            <IndexList  >
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
            <IndexList>
              <template #left> 备注 </template>
              <template #right> {{ item.remark }} </template>
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
