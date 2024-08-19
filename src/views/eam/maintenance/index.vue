<template>
  <div class="content">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div v-for="(item, index) in list" class="content-box" :key="index">
          <van-cell-group inset>
            <van-cell class="flex-col">
              <template #title>
                <span class="font-bold break-words">{{ item.code }}</span>
              </template>
              <template #label>
                <IndexList>
                  <template #left> 设备编号 </template>
                  <template #right> {{ item.device }} </template>
                </IndexList>
                <IndexList>
                  <template #left> 设备名称 </template>
                  <template #right> {{ item.deviceName }} </template>
                </IndexList>
                <IndexList>
                  <template #left> 工单状态 </template>
                  <template #right>{{ getLabel(dictObj['eam_maintenance_status'], item.status) }} </template>
                </IndexList>
                <IndexList>
                  <template #left> 工单类型 </template>
                  <template #right>{{ getLabel(dictObj['eam_maintenance_type'], item.type) }} </template>
                </IndexList>
                <IndexList>
                  <template #left> 维保人 </template>
                  <template #right>{{ item.maintenanceUserName }} </template>
                </IndexList>
                <IndexList>
                  <template #left> 计划开始时间 </template>
                  <template #right>{{ item.planStartTime }} </template>
                </IndexList>
                <IndexList>
                  <template #left> 计划结束时间 </template>
                  <template #right>{{ item.planEndTime }} </template>
                </IndexList>
                <IndexList>
                  <template #left> 是否停机 </template>
                  <template #right>{{ getLabel(dictObj['eam_yes_no'], item.isShutdown + '') }} </template>
                </IndexList>
                <IndexList>
                  <template #left> 保养说明 </template>
                  <template #right>{{ item.remark }} </template>
                </IndexList>
                <div class="mt-4">
                  <van-button
                    size="small"
                    type="primary"
                    @click="execute(item)"
                    class="mr-2"
                    v-if="item.status === 'PROGRESSING' || item.status === 'PENDING'"
                    >执 行</van-button
                  >
                  <van-button size="small" @click="detail(item)" class="mr-2">详情</van-button>

                  <van-button
                    type="success"
                    size="small"
                    class="mr-2"
                    @click="accept(item)"
                    v-if="item.status === 'PLAN'"
                    >受 理</van-button
                  >

                  <van-button
                    type="danger"
                    size="small"
                    class="mr-2"
                    @click="skip(item)"
                    v-if="item.status === 'PROGRESSING' || item.status === 'PENDING'"
                    >跳 过</van-button
                  >
                </div>
              </template>
            </van-cell>
          </van-cell-group>
        </div>
      </van-list>
    </van-pull-refresh>

    <van-dialog
      v-model:show="showClose"
      :title="backType === 1 ? '维修工单关闭' : '维修工单撤销'"
      :confirm-button-text="backType === 1 ? '确认关闭' : '确认撤销'"
      show-cancel-button
      :before-close="beforeCloseDialogClose"
      @confirm="confirmClose"
      @cancel="showClose = false"
    >
      <div class="p-3">
        <van-form required="auto" ref="closeFormRef">
          <van-field
            name="remark"
            v-model="closeFormValue.remark"
            label="备注"
            placeholder="备注"
            rows="2"
            type="textarea"
            maxlength="500"
            show-word-limit
            :rules="[{ required: true, message: '请填写备注' }]"
          />
        </van-form>
      </div>
    </van-dialog>

    <van-floating-bubble axis="xy" v-model:offset="offset" icon="plus" @click="handleNew" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getEamMaintenanceList, skipEamMaintenance, updatePending } from '@/api/eam/maintenance'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
import IndexList from '@/views/components/indexList/index'
import { getDict, getLabel } from '@/utils/dictUtils'
import { showConfirmDialog } from 'vant'

const router = useRouter()

onMounted(() => {
  getDicts()
})

// 加载字典
const dictObj = reactive({})
const getDicts = async () => {
  const eam_maintenance_type = await getDict('eam_maintenance_type')
  const eam_maintenance_status = await getDict('eam_maintenance_status')
  const eam_yes_no = await getDict('eam_yes_no')
  dictObj['eam_maintenance_type'] = eam_maintenance_type
  dictObj['eam_maintenance_status'] = eam_maintenance_status
  dictObj['eam_yes_no'] = eam_yes_no
}

const list = ref([])

const h = window.innerHeight
const w = window.innerWidth
const offset = ref({ x: w - 80, y: h - 130 }) // 控制 FloatingBubble 的位置

const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const queryParams = reactive({
  pageNum: 0,
  pageSize: 10,
})

const total = ref(0)

// 上拉加载
const onLoad = () => {
  loading.value = true
  queryParams.pageNum++
  getList()
}

// 下拉刷新
const onRefresh = () => {
  list.value = []
  queryParams.pageNum = 0
  // 清空列表数据
  finished.value = false

  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true
  onLoad()
}

async function getList() {
  if (list.value.length >= total.value && queryParams.pageNum > 1) {
    finished.value = true
    return
  }
  if (refreshing.value) {
    list.value = []
    refreshing.value = false
  }

  loading.value = true
  try {
    const { data } = await getEamMaintenanceList(queryParams)
    list.value = [...list.value, ...data.rows]
    total.value = data.total
    // 加载状态结束
    loading.value = false
    console.log(data)
  } catch (error) {}
}

/* 执行 */
function execute(params) {
  router.push({ name: 'MaintenanceExecute', state: { id: params.id } })
}

/* 详情 */
function detail(item) {
  router.push({ name: 'MaintenanceDetail', state: { id: item.id } }) // -> /user/123
}

/* 受理 */
function accept(item) {
  showConfirmDialog({
    message: '是否确认受理工单？',
  })
    .then(async () => {
      const { code, msg } = await updatePending(item.id)
      if (code == ResultEnum.SUCCESS) {
        showSuccessToast(msg || '提交成功')
        onRefresh()
      } else {
        showFailToast('操作失败，请稍后再试...')
      }
    })
    .catch(() => {
      // on cancel
    })
}

/* 跳过 */
async function skip(item) {
  showConfirmDialog({
    message: '是否确认跳过工单？',
  })
    .then(async () => {
      const { code, msg } = await skipEamMaintenance(item.id)
      if (code == ResultEnum.SUCCESS) {
        showSuccessToast(msg || '提交成功')
        onRefresh()
      } else {
        showFailToast('操作失败，请稍后再试...')
      }
    })
    .catch(() => {
      // on cancel
    })
}

const showClose = ref(false)
const closeFormValue = ref({
  id: '',
  status: '',
  remark: '',
})
const closeFormRef = ref()
const backType = ref(1)

const beforeCloseDialogClose = () => {
  return false
}

function confirmClose(e) {
  closeFormRef.value
    .validate(['remark'])
    .then(async () => {
      try {
        const request = backType.value === 1 ? closeEamRepair : undoEamRepair

        const { code, msg } = await request({
          id: closeFormValue.value.id,
          remark: closeFormValue.value.remark,
        })
        if (code == ResultEnum.SUCCESS) {
          showSuccessToast(msg || '提交成功')
          onRefresh()
          closeFormValue.value.id = ''
          closeFormValue.value.remark = ''
          setTimeout(() => {
            showClose.value = false
          }, 300)
        } else {
          showFailToast('操作失败，请稍后再试...')
        }
      } catch (error) {}
    })
    .catch(error => {})
}

function handleNew() {
  router.push({ name: 'MaintenanceNew' })
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  margin: 1rem 0;
  margin-bottom: 4rem;
  background-color: #f2f4f8;

  &-box {
    padding: 0.2rem 0;
    border-radius: 4px;
    background-color: #fff;
    margin: 0.6rem;

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
}

.van-cell {
  padding: 0.4rem;
}
</style>
