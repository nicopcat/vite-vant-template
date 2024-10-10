<template>
  <div class="van-cell-custom">
    <van-field
      :input-align="inputAlign"
      readonly
      :right-icon="props.disabled ? '' : 'search'"
      v-model="inputValue"
      :label="props.label"
      :placeholder="'请选择' + props.label"
      @click="showPicker = !props.disabled && true"
      :required="props.required"
      :name="props.name"
      :rules="props.rules"
      :disabled="props.disabled"
    />
    <van-action-sheet v-model:show="showPicker" :title="props.label" teleport="body">
      <div class="pb-6 min-h-[50vh]">
        <div v-if="props.filterOn">
          <van-search v-model="filterVal" placeholder="请输入关键词" input-align="center" />
        </div>
        <van-cell>
          <template #title>
            <van-row class="">
              <van-col :span="11" class="font-bold text-sm" v-for="(item, i) in props.labelProps" :key="i">{{
                item.header
              }}</van-col>
            </van-row>
          </template>
        </van-cell>
        <div class="h-[50vh]">
          <DynamicScroller class="h-full" :items="filterList" :min-item-size="54" :key-field="props.idKey">
            <template v-slot="{ item, index, active }">
              <DynamicScrollerItem
                :item="item"
                :active="active"
                :size-dependencies="[item.message]"
                :data-index="index"
              >
                <van-cell is-link @click="handleSelect(item)" class="flex flex-row justify-around items-center py-2">
                  <template #title>
                    <van-row>
                      <van-col :span="12" v-for="(prop, i) in props.labelProps" :key="i">
                        <div class="text-xs break-words">{{ item[prop.keyName] }}</div></van-col
                      >
                    </van-row>
                  </template>
                </van-cell>
              </DynamicScrollerItem>
            </template>
          </DynamicScroller>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { isArray } from '@/utils/validate'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  inputAlign: {
    // 内容左右align
    type: String,
    default: 'right',
  },
  // 默认值
  defValue: {
    type: [String, Number],
    required: false,
    default: '',
  },
  // 数据源
  dataSource: {
    type: Array,
    required: true,
    default: () => [],
  },
  // 展示的propKey值
  // propKey: {
  //   type: String,
  //   required: true,
  // },
  // key名和对应的中文
  labelProps: {
    type: Array,
    required: true,
    default: () => [{ header: '', keyName: 'name' }],
  },
  // secPropKey: {
  //   type: String,
  //   required: false,
  // },
  // 自定义id的key
  idKey: {
    type: String,
    default: 'id',
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
  filterOn: {
    type: Boolean,
    required: false,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['dataEvent'])
const showPicker = ref(false)
const inputValue = ref('')
const filterVal = ref('')
const propKey = ref('')
onMounted(() => {
  // 取第一个keyName
  propKey.value = props.labelProps[0].keyName
  const item = filterList.value.find(x => x[props.idKey] == props.defValue)
  inputValue.value = item ? item[propKey.value] : props.defValue
})

const filterList = computed(() => {
  if (!props.dataSource || !propKey.value || !isArray(props.dataSource)) {
    return []
  }

  if (props.labelProps.length === 1) {
    return props.dataSource.filter(x => x[propKey.value].toLowerCase().includes(filterVal.value.toLowerCase()))
  } else {
    return props.dataSource.filter(
      x =>
        x[propKey.value].toLowerCase().includes(filterVal.value.toLowerCase()) ||
        x[props.labelProps[1].keyName].toLowerCase().includes(filterVal.value.toLowerCase())
    )
  }
})

watch(
  () => filterList.value,
  val => {
    const item = val.find(x => x[props.idKey] == props.defValue)
    inputValue.value = item ? item[propKey.value] : props.defValue
  }
)

watch(
  () => props.defValue,
  newValue => {
    const item = filterList.value.find(x => x[props.idKey] == props.defValue)
    inputValue.value = item ? item[propKey.value] : props.defValue
  }
)

function handleSelect(value) {
  inputValue.value = value[propKey.value]
  emits('dataEvent', value)

  showPicker.value = false
}
</script>

<style lang="scss" scoped>
.van-cell-custom .van-cell {
  // border-bottom: 1px solid var(--van-cell-border-color);
  // padding: 0;
}
</style>
