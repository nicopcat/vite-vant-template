<template>
  <div class="van-cell-custom">
    <van-field
      readonly
      right-icon="search"
      v-model="inputValue"
      :label="props.label"
      :placeholder="'请选择' + props.label"
      @click="showPicker = true"
      :required="props.required"
      :name="props.name"
      :rules="props.rules"
    />
    <van-action-sheet v-model:show="showPicker" :title="props.label" teleport="body">
      <div class="pb-6 min-h-[50vh]">
        <div v-if="props.filterOn">
          <van-search v-model="filterVal" placeholder="请输入搜索关键词" input-align="center" />
        </div>
        <van-list v-if="filterList && filterList.length > 0">
          <van-row class="mx-6 mb-2 ">
            <van-col
              :span="Math.floor(22 / props.labelProps.length)"
              class="font-bold text-sm"
              v-for="(item, i) in props.labelProps"
              :key="i"
              >{{ item.header }}</van-col
            >
          </van-row>
          <van-cell
            class="px-6"
            v-for="item in filterList"
            :key="item.id"
            :title="item[propKey]"
            is-link
            @click="handleSelect(item)"
          >
            <template #title>
              <van-row>
                <van-col
                  :span="Math.floor(24 / props.labelProps.length)"
                  v-for="(prop, i) in props.labelProps"
                  :key="i"
                >
                  <span class="break-all pr-1">{{ item[prop.keyName] }}</span></van-col
                >
              </van-row>
            </template>
          </van-cell>
        </van-list>
        <van-empty v-else description="暂无数据" />
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import {isArray} from '@/utils/validate'

const props = defineProps({
  label: {
    type: String,
    required: true,
    default: '选择',
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
  return props.dataSource.filter(x => x[propKey.value].toLowerCase().includes(filterVal.value.toLowerCase()))
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
.van-cell-custom {
  border-bottom: 1px solid var(--van-cell-border-color);
}
</style>
