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
      <van-date-picker
        :title="props.label"
        v-model="currentDate"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="confirmTime"
        @cancel="showPicker = false"
      />
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
    type: Date,
  },
  maxDate: {
    type: Date,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['getTime'])
onMounted(() => {
  console.log(props.defTime)

  if (!props.defTime) {
    timeStr.value = ''
  } else {
    currentDate.value = parseTime(props.defTime, `{y}-{m}-{d}`).split('-')
    timeStr.value =
      typeof props.defTime === 'string'
        ? props.defTime
        : typeof props.defTime === 'Date'
        ? parseTime(props.defTime, `{y}-{m}-{d}`)
        : parseTime(new Date(), `{y}-{m}-{d}`)
  }
})

watch(
  () => props.defTime,
  val => {
    if (!val) {
      currentDate.value = parseTime(new Date(), `{y}-{m}-{d}`).split('-')
      timeStr.value = ''
    } else {
      currentDate.value = parseTime(val, `{y}-{m}-{d}`).split('-')
      timeStr.value =
        typeof props.defTime === 'string'
          ? props.defTime
          : typeof props.defTime === 'Date'
          ? parseTime(props.defTime, `{y}-{m}-{d}`)
          : parseTime(new Date(), `{y}-{m}-{d}`)
    }
  }
)
const showPicker = ref(false)
const currentDate = ref()
const timeStr = ref('')

function confirmTime() {
  showPicker.value = false
  timeStr.value = `${currentDate.value.join('-')}`
  emits('getTime', timeStr.value)
}
</script>

<style lang="scss" scoped>
// .van-cell-custom {
//   border-bottom: 1px solid var(--van-cell-border-color);
// }
</style>
