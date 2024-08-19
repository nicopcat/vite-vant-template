<template>
  <div class="van-cell-custom">
    <van-field
      v-model="timeStr"
      :label="props.label"
      :placeholder="'请选择' + props.label"
      @click="showPicker = true"
      :required="props.required"
      :name="props.name"
      :rules="props.rules"
    />
    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker-group
        :title="props.label"
        :tabs="['选择日期', '选择时间']"
        @confirm="confirmTime"
        @cancel="showPicker = false"
      >
        <van-date-picker v-model="currentDate" />
        <van-time-picker v-model="currentTime" :columns-type="['hour', 'minute', 'second']" />
      </van-picker-group>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { parseTime } from '@/utils/index'

const props = defineProps({
  label: {
    type: String,
    required: true,
    default: '时间',
  },
  defTime: {
    required: false,
    default: new Date(),
  },
  required: {
    type: Boolean,
    required: false,
    default: false,
  },
  name: {
    type: String,
    required: false,
    default: '',
  },
  rules: {
    type: Array,
    required: false,
    default: () => [{ required: false }],
  },
})

const emits = defineEmits(['getTime'])
onMounted(() => {
  currentDate.value = parseTime(props.defTime, `{y}-{m}-{d}`).split('-')
  currentTime.value = parseTime(props.defTime, `{h}:{i}:{s}`).split(':')
  timeStr.value = typeof props.defTime === 'string' ? props.defTime : ''
})

watch(
  () => props.defTime,
  val => {
    if (!val) {
      currentDate.value = parseTime(new Date(), `{y}-{m}-{d}`).split('-')
      currentTime.value = parseTime(new Date(), `{h}:{i}:{s}`).split(':')
      timeStr.value = ''
    } else {
      currentDate.value = parseTime(val, `{y}-{m}-{d}`).split('-')
      currentTime.value = parseTime(val, `{h}:{i}:{s}`).split(':')
      timeStr.value = typeof props.defTime === 'string' ? val : ''
    }
  }
)
const showPicker = ref(false)
const currentDate = ref()
const currentTime = ref()
const timeStr = ref('')

function confirmTime() {
  showPicker.value = false
  timeStr.value = `${currentDate.value.join('-')} ${currentTime.value.join(':')}`
  emits('getTime', timeStr.value)
}
</script>

<style lang="scss" scoped>
.van-cell-custom {
  border-bottom: 1px solid rgba(238, 238, 238, 0.725);
}
</style>
