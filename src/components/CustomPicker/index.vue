<template>
  <div class="van-cell-custom">
    <van-field
      v-model="inputValue"
      is-link
      readonly
      :label="props.label"
      :placeholder="'请选择' + props.label"
      @click="showPicker = true"
      :required="props.required"
      :name="props.name"
      :rules="props.rules"
    />
    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker
        :title="props.label"
        :columns="dataSource"
        @confirm="onConfirm"
        @cancel="showPicker = false"
        :columns-field-names="props.columnsField"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

// 该组件只做字典picker，其他列表选用CustomSelect
const props = defineProps({
  label: {
    type: String,
    required: true,
    default: '',
  },
  // 数据源
  dataSource: {
    type: Array,
    required: true,
    default: () => [],
  },
  // 默认值
  defValue: {
    type: [String, Number],
    required: false,
    default: '',
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
  columnsField: {
    type: Object,
    required: false,
    default: { text: 'dictLabel', value: 'dictValue' },
  },
})

const emits = defineEmits(['dataEvent'])

const showPicker = ref(false)
const inputValue = ref('')

const hasBothValues = computed(() => {
  return props.dataSource.length > 0 && !!props.defValue
})

watch(hasBothValues, newValue => {
  if (newValue) {
    const item = props.dataSource.find(x => x[props.columnsField.value] == props.defValue)
    inputValue.value = item ? item[props.columnsField.text] : props.defValue
  }
})

function onConfirm(value) {
  inputValue.value = value.selectedOptions[0][props.columnsField.text]
  emits('dataEvent', value.selectedOptions[0])
  showPicker.value = false
}
</script>

<style lang="scss" scoped>
.van-cell-custom {
  border-bottom: 1px solid rgba(238, 238, 238, 0.725);
}
</style>
