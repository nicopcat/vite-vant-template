<template>
  <div class="van-cell-custom">
    <van-field
      :disabled="props.disabled"
      v-model="inputValue"
      readonly
      :label="props.label"
      :placeholder="'请选择' + props.label"
      @click="handleClick"
      :required="props.required"
      :name="props.name"
      :rules="props.rules"
    />
    <van-popup v-if="!props.multiple" v-model:show="showPicker" position="bottom" teleport="body">
      <van-picker
        :title="props.label"
        :columns="dataSource"
        @confirm="onConfirm"
        @cancel="showPicker = false"
        :columns-field-names="props.columnsField"
      />
    </van-popup>

    <van-action-sheet v-else v-model:show="showMultiplePicker" :title="props.label" teleport="body">
      <div class="content min-h-[50vh]">
        <van-list v-if="props.dataSource && props.dataSource.length > 0">
          <van-checkbox-group v-model="checked" @change="onChange" shape="square">
            <van-cell
              v-for="(item, index) in props.dataSource"
              :key="item[props.columnsField.text]"
              :title="item[props.columnsField.text]"
              @click="toggle(index)"
            >
              <template #right-icon>
                <van-checkbox
                  :name="item[props.columnsField.value]"
                  :ref="el => (checkboxRefs[index] = el)"
                  @click.stop
                />
              </template>
            </van-cell>
          </van-checkbox-group>
        </van-list>
        <van-empty v-else description="暂无数据" />
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'

// 该组件只做字典picker，其他列表选用CustomSelect
const props = defineProps({
  // 是否多选
  multiple: {
    type: Boolean,
    default: false,
  },
  // 表单左侧label
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
    type: [String, Number, Array],
    required: false,
    default: '',
  },
  // 校验相关，是否必填
  required: {
    type: Boolean,
    required: false,
    default: false,
  },
  // 校验相关，匹配名称
  name: {
    type: String,
    required: false,
    default: '',
  },
  // 校验相关，rules
  rules: {
    type: Array,
    required: false,
    default: () => [{ required: false }],
  },
  // 定义key和value名，默认为字典的
  columnsField: {
    type: Object,
    required: false,
    default: { text: 'dictLabel', value: 'dictValue' },
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['dataEvent'])

onMounted(() => {
  if (!props.defValue) return
  if (props.multiple) {
    checked.value = props.defValue.map(x => x[props.columnsField.text])
  }
})

const inputValue = ref('') // 右侧回显

const showPicker = ref(false) // 控制单选弹层显示
const showMultiplePicker = ref(false) // 控制多选弹层显示
const checkboxRefs = ref([]) // 多选checkbox ref
const checked = ref() // 选中值，数组

/**控制弹层 */
function handleClick() {
  if (!!props.disabled) return
  props.multiple ? (showMultiplePicker.value = true) : (showPicker.value = true)
}
const hasDataSource = computed(() => {
  return props.dataSource.length > 0
})

/**监听是否同时有默认值 */
watch(
  () => props.defValue,
  newValue => {
    if (hasDataSource && !props.multiple) {
      const item = props.dataSource.find(x => x[props.columnsField.value] == props.defValue)
      inputValue.value = item ? item[props.columnsField.text] : props.defValue
    }
  }
)

/**监听是否同时有dataSource和默认值 */
watch(hasDataSource, newValue => {
  if (newValue && !props.multiple) {
    const item = props.dataSource.find(x => x[props.columnsField.value] == props.defValue)
    inputValue.value = item ? item[props.columnsField.text] : props.defValue
  }
})

/**单选，confirm事件 */
function onConfirm(value) {
  inputValue.value = value.selectedOptions[0][props.columnsField.text]
  emits('dataEvent', value.selectedOptions[0])
  showPicker.value = false
}

/**多选，change事件 */
function onChange(e) {
  if (!e || e.length < 0) {
    emits('dataEvent', [], null)
  } else {
    const arr = e.map(x => props.dataSource.find(y => y[props.columnsField.value] === x))
    emits('dataEvent', e, arr) // emit 只含dictValue的数组以及完整的数组

    inputValue.value = arr.map(x => x.dictLabel).join(',')
  }
}

/**清除单个数据项 */
function handleDelete(val) {
  checked.value = checked.value.filter(x => x !== val[props.columnsField.value])
  const arr = checked.value.map(x => props.dataSource.find(y => y[props.columnsField.value] === x))
  emits('dataEvent', checked.value, arr)
}

/**清空所有数据项 */
function handleDeleteAll() {
  checked.value = []
  inputValue.value = ''
  emits('dataEvent', [])
}

/**切换选中状态 */
const toggle = index => {
  checkboxRefs.value[index].toggle()
}

defineExpose({
  handleDelete,
  handleDeleteAll,
})
</script>
