<template>
  <div class="van-cell-custom">
    <van-field
      :disabled="props.disabled"
      v-model="timeStr"
      :label="props.label"
      :placeholder="'请选择' + props.label"
      @click="showPicker = true && !props.disabled"
      readonly
      clickable
      :label-width="labelWidth"
      :required="props.required"
      :name="props.name"
      :rules="props.rules"
    />
    <van-popup v-model:show="showPicker" position="bottom" teleport="body">
      <van-picker-group
        v-model:active-tab="activeTab"
        :title="props.label"
        :tabs="['选择日期', '选择时间']"
        @confirm="confirmTime"
        @cancel="handleCancel"
      >
        <van-date-picker
          @change="dateChangeEvent"
          v-model="currentDate"
          :min-date="minDate ?? new Date(2000, 0, 1)"
          :max-date="maxDate ?? new Date(2034, 0, 1)"
        />
        <van-time-picker
          v-model="currentTime"
          :min-time="props.minTime"
          :max-time="props.maxTime"
          :columns-type="['hour', 'minute', 'second']"
        />
      </van-picker-group>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { parseTime } from '@/utils/index'

const props = defineProps({
  labelWidth: {
    type: [String, Number], // Number + px
  },
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
  minDate: {
    // new Date(2020, 0, 1),
    type: Date,
    default: new Date(2010, 0, 1),
  },
  maxDate: {
    type: Date,
    default: new Date(2035, 0, 1),
  },
  minTime: {
    //格式参考 07:40:00
    type: String,
  },
  maxTime: {
    // 格式参考 07:40:00
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['getTime', 'dateChange'])
onMounted(() => {
  if (!props.defTime) {
    timeStr.value = ''
  } else {
    currentDate.value = parseTime(props.defTime, `{y}-{m}-{d}`).split('-')
    currentTime.value = parseTime(props.defTime, `{h}:{i}:{s}`).split(':')
    timeStr.value = typeof props.defTime === 'string' ? props.defTime : parseTime(props.defTime)
  }
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
      timeStr.value = typeof props.defTime === 'string' ? val : parseTime(new Date())
    }
  }
)
const showPicker = ref(false)
const currentDate = ref()
const currentTime = ref()
const timeStr = ref('')
const activeTab = ref(0)

function confirmTime() {
  showPicker.value = false
  timeStr.value = `${currentDate.value.join('-')} ${currentTime.value.join(':')}`
  emits('getTime', timeStr.value)
  setTimeout(() => {
    activeTab.value = 0
  }, 200)
}

function dateChangeEvent({ selectedValues, selectedOptions, selectedIndexes, columnIndex }) {
  // console.log(selectedOptions)
  // console.log(selectedValues)
  // emits('dateChange', selectedOptions[columnIndex].value)
  emits('dateChange', selectedValues[2])
}

function handleCancel() {
  showPicker.value = false
  activeTab.value = 0
}
</script>

<style lang="scss" scoped>
// .van-cell-custom {
//   border-bottom: 1px solid var(--van-cell-border-color);
// }
</style>
