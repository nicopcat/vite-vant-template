<template>
  <div class="content">
    <div class="content-box">
      <van-form ref="formRef" input-align="">
        <IndexList label="设备编号">
          <span> {{ repair?.deviceCode }}</span>
        </IndexList>
        <IndexList label="设备名称">
          <span> {{ repair?.deviceName }}</span>
        </IndexList>
        <!-- <IndexList label="工单状态">
            <span> {{ getDetailLabel('eam_repair_status', repair?.status) }}</span>
          </IndexList> -->
        <IndexList label="故障描述">
          <span> {{ repair?.faultReportDescription }}</span>
        </IndexList>
        <!-- <IndexList label="严重程度">
            <span> {{ getDetailLabel('eam_repair_level', repair?.faultLevel) }}</span>
          </IndexList>
          <IndexList label="是否停机">
            <span> {{ getDetailLabel('eam_yes_no', repair?.shutdown) }}</span>
          </IndexList>
          <IndexList label="故障累计时间(分钟)">
            <span> {{ repair?.faultHour }}</span>
          </IndexList>
          <IndexList label="报修时间">
            <span> {{ repair?.faultReportTime }}</span>
          </IndexList>
          <IndexList label="报修人">
            <span> {{ repair?.reportUser }}</span>
          </IndexList>
          <IndexList label="报修人电话">
            <span> {{ repair?.reportUserPhone }}</span>
          </IndexList> -->
        <IndexList label="维修人员" required>
          <CustomSelect
            required
            name="repairUser"
            :rules="[{ required: true, message: '请选择维修人员' }]"
            filterOn
            :dataSource="userList"
            idKey="userId"
            :defValue="formValue.repairUser"
            :labelProps="[
              { header: '用户昵称', keyName: 'nickName' },
              { header: '用户名称', keyName: 'userName' },
            ]"
            @dataEvent="e => (formValue.repairUser = e.userId)"
          />
        </IndexList>
        <IndexList label="是否委外">
          <van-radio-group v-model="formValue.isOutsource" direction="horizontal" style="justify-content: flex-end">
            <van-radio name="1">是</van-radio>
            <van-radio name="0">否</van-radio>
          </van-radio-group>
        </IndexList>
        <IndexList required label="委外原因" v-if="formValue.isOutsource === '1'">
          <van-field
            input-align="right"
            :rules="[{ required: true, message: '请输入委外原因' }]"
            v-model="formValue.outsourceReason"
            name="outsourceReason"
            autosize
            placeholder="请输入委外原因"
            rows="3"
            type="textarea"
            maxlength="500"
            show-word-limit
          />
        </IndexList>
        <IndexList required label="委外供方" v-if="formValue.isOutsource === '1'">
          <van-field
            input-align="right"
            :rules="[{ required: true, message: '请输入委外供方' }]"
            v-model="formValue.outsourceSupply"
            name="outsourceSupply"
            autosize
            placeholder="请输入委外供方"
          />
        </IndexList>
      </van-form>
    </div>
    <div class="mt-4 p-2">
      <van-button round block type="primary" @click="accept"> 受 理 </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAcceptDetailInfo, acceptEamRepair } from '@/api/eam/repair'
import { ResultEnum } from '@/config/constant'
import { showFailToast, showSuccessToast } from 'vant'
import IndexList from '@/views/components/indexList/index'
import CustomSelect from '@/components/CustomSelect'
import { getUserList } from '@/api/system/user'
import { getDetailLabel } from '@/utils/dictUtils'

const router = useRouter()
const repair = ref({})
const formRef = ref(null)
const formValue = ref({
  id: history.state?.id,
  isOutsource: '0',
})

onMounted(async () => {
  await getUsers()
  getDetail()
})
const userList = ref([])

async function getUsers() {
  try {
    const { data } = await getUserList()
    userList.value = data.rows ?? []
  } catch (error) {}
}

async function getDetail() {
  console.log(history.state?.id)
  if (history.state?.id) {
    try {
      const { data } = await getAcceptDetailInfo(history.state?.id)
      repair.value = data
    } catch (error) {}
  }
}

async function accept() {
  formRef.value
    ?.validate()
    .then(async () => {
      console.log(formValue.value)

      try {
        const { code, msg } = await acceptEamRepair(formValue.value)
        if (code == ResultEnum.SUCCESS) {
          showSuccessToast(msg || '提交成功')
          setTimeout(() => {
            router.back()
          }, 500)
        } else {
          showFailToast('操作失败，请稍后再试...')
        }
      } catch (error) {}
    })
    .catch(error => {
      console.log(error)
      // showFailToast('请填写必填项')
    })
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  margin: 1rem 0;
  background-color: #f2f4f8;

  &-box {
    padding: 0.2rem 0;
    border-radius: 4px;
    background-color: #fff;
    margin: 1.5rem 0.6rem;
    padding: 0.5rem 0.8rem;

    .van-row {
      font-size: 15px;
      padding: 0.4rem 0;
    }
  }
}
</style>
