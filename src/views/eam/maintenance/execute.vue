<template>
  <div class="content">
    <van-tabs v-model:active="active">
      <van-tab title="故障提报">
        <div class="container">
          <div class="flex flex-row my-3">
            <van-button
              type="primary"
              size="small"
              class="w-12 ml-3"
              @click="onStart"
              v-if="detailData?.startTime === null"
              >开 始</van-button
            >
            <van-button
              type="primary"
              size="small"
              class="w-12 ml-3"
              @click="onShutdown"
              v-if="detailData?.startTime !== null && detailData?.shutdownStartTime === null"
              >停 机</van-button
            >
            <van-button
              type="primary"
              size="small"
              class="w-12 ml-3"
              @click="onRestart"
              v-if="detailData?.shutdownStartTime !== null && detailData?.shutdownEndTime === null"
              >恢 复</van-button
            >
            <van-button
              type="primary"
              size="small"
              class="w-12 ml-3"
              @click="onSubmit('save')"
              v-if="detailData?.startTime !== null"
              >保 存</van-button
            >
            <van-button type="success" size="small" class="w-12 ml-3" @click="onSubmit">完 成</van-button>
          </div>
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
      <van-tab title="备件信息" name="备件信息">
        <div class="container">
          <MultipleSelect
            :showFloatingBubble="active == '备件信息'"
            ref="multiplePartRef"
            label="备件"
            :dataSource="allPartList"
            :defValue="detailData.sparePartList"
            idKey="id"
            defIdKey="sparePartId"
            propKey="name"
            @dataEvent="handlePartValue"
          />
          <div v-if="detailData.sparePartList && detailData.sparePartList?.length > 0">
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
                <template #right><van-stepper v-model="part.quantity" /></template>
              </IndexList>
              <IndexList>
                <template #left> 备件用途 </template>
                <template #right>
                  <van-field class="bg-[#f5f5f5]" v-model="part.remark" name="remark" placeholder="用途"
                /></template>
              </IndexList>
              <IndexList>
                <template #left> </template>
                <template #right><van-icon name="delete" @click="handleDeletePart(part)" /> </template>
              </IndexList>
            </div>
          </div>
          <van-empty v-else description="请添加备件" />
        </div>
      </van-tab>
      <van-tab title="详情">
        <div class="container">
          <van-form ref="formRef" input-align="right" scroll-to-error>
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

              <IndexList v-if="item.type === '2' || item.type === '1'">
                <template #left> <span class="required">实测值 </span> </template>
                <template #right>
                  <van-field
                    class="bg-[#f5f5f5]"
                    v-model="item.actual"
                    name="actual"
                    placeholder="请输入实测值"
                    required
                    :rules="[{ required: true, message: '请输入实测值' }]"
                  />
                </template>
              </IndexList>
              <IndexList>
                <template #left><span :class="item.type !== '2' ? 'required' : ''"> 结果 </span> </template>
                <template #right>
                  <van-field
                    v-model="item.passed"
                    name="actual"
                    placeholder="请输入结果"
                    :required="item.type !== '2'"
                    :rules="[{ required: item.type !== '2', message: '请输入结果' }]"
                  >
                    <template #input>
                      <van-radio-group
                        :disabled="item.type === '2'"
                        v-model="item.passed"
                        direction="horizontal"
                        style="justify-content: flex-end"
                      >
                        <van-radio name="1">合格</van-radio>
                        <van-radio name="0">不合格</van-radio>
                      </van-radio-group>
                    </template>
                  </van-field>
                </template>
              </IndexList>
              <IndexList v-if="item.isRemark === '1'">
                <template #left> 备注 </template>
                <template #right>
                  <van-field class="bg-[#f5f5f5]" v-model="item.remark" name="remark" placeholder="请输入备注" />
                </template>
              </IndexList>
            </div>
          </van-form>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { getEamSparePartList } from '@/api/eam/sparePart'
import IndexList from '@/views/components/indexList/index'
import { getExecuteInfo, startEamMaintenance, shutdown, restart, save, submit } from '@/api/eam/maintenance'
import MultipleSelect from '@/components/CustomSelect/multiple'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'

const router = useRouter()
onMounted(() => {
  getDetail()
  getSparePartList()
})

const active = ref('')
const allPartList = ref([])

const detailData = ref()
const multiplePartRef = ref()
const formRef = ref()

async function getSparePartList() {
  try {
    const { data } = await getEamSparePartList()
    allPartList.value = data?.rows ?? []
  } catch (error) {}
}

async function getDetail() {
  if (history.state?.id) {
    try {
      const { data } = await getExecuteInfo(history.state?.id)
      detailData.value = data
    } catch (error) {}
  }
}

function handlePartValue(ids, objList) {
  if (!objList) return
  // 用长度判断是删除还是增加
  if (detailData.value.sparePartList.length < ids.length) {
    // 改为追加，不覆盖
    const currentIds = detailData.value.sparePartList.map(x => x.sparePartId)
    // 处理list，跳过已存在的数据
    const uniqueList = objList.filter(x => !currentIds.includes(x.id))
    const addOn = uniqueList.map((x, i) => {
      return {
        id: new Date().valueOf() + i,
        sparePartId: x.id,
        code: x.code,
        name: x.name,
      }
    })

    detailData.value.sparePartList = [...detailData.value.sparePartList, ...addOn]
  } else {
    detailData.value.sparePartList = detailData.value.sparePartList.filter(x => ids.includes(x.sparePartId))
  }
}

function handleDeletePart(part) {
  multiplePartRef.value.handleDelete(part)
}

/* 开始 */
async function onStart() {
  try {
    const { code, msg } = await startEamMaintenance({
      id: history.state?.id,
    })
    if (code == ResultEnum.SUCCESS) {
      showSuccessToast(msg || '提交成功')
      router.back()
    } else {
      showFailToast('操作失败，请稍后再试...')
    }
  } catch (error) {}
}

/* 停机 */
async function onShutdown() {
  try {
    const { code, msg } = await shutdown({
      id: history.state?.id,
    })
    if (code == ResultEnum.SUCCESS) {
      showSuccessToast(msg || '提交成功')
      router.back()
    } else {
      showFailToast('操作失败，请稍后再试...')
    }
  } catch (error) {}
}

/* 恢复 */
async function onRestart() {
  try {
    const { code, msg } = await restart({
      id: history.state?.id,
    })
    if (code == ResultEnum.SUCCESS) {
      showSuccessToast(msg || '提交成功')
      router.back()
    } else {
      showFailToast('操作失败，请稍后再试...')
    }
  } catch (error) {}
}

/* 保存/完成 */
async function onSubmit(action) {
  console.log(detailData.value)
  if (action === 'save') {
    try {
      const { code, msg } = await save(detailData.value)
      if (code == ResultEnum.SUCCESS) {
        showSuccessToast(msg || '提交成功')
        router.back()
      } else {
        showFailToast('操作失败，请稍后再试...')
      }
    } catch (error) {}
  } else {
    if (!formRef.value) return
    formRef.value
      .validate()
      .then(async () => {
        try {
          const { code, msg } = await submit(detailData.value)
          if (code == ResultEnum.SUCCESS) {
            showSuccessToast(msg || '提交成功')
            router.back()
          } else {
            showFailToast('操作失败，请稍后再试...')
          }
        } catch (error) {}
      })
      .catch(error => {
        showFailToast('请填写必填项')
      })
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

.van-cell {
  padding: 0.2rem;
}

.required:before {
  margin-right: 2px;
  color: var(--van-field-required-mark-color);
  content: '*';
}
</style>
