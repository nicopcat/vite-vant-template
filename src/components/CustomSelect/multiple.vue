<template>
  <div class="van-cell-custom">
    <!-- <van-field
      v-model="inputValue"
      :label="props.label"
      :placeholder="'请选择' + props.label"
      @click="showPicker = true"
    /> -->
    <van-floating-bubble v-if="props.showFloatingBubble" axis="xy"
 v-model:offset="offset" icon="plus" @click="showPicker = true" />

    <!-- <van-button class="w-full my-1" type="primary" icon="plus">{{props.label}}</van-button> -->
    <van-action-sheet v-model:show="showPicker" :title="props.label">
      <div class="content">
        <div>
          <van-search v-model="filterVal" placeholder="请输入搜索关键词" input-align="center" />
        </div>
        <van-list>
          <van-checkbox-group v-model="checked" @change="onChange">
            <van-cell v-for="item in filterList" :key="item[props.idKey]" :title="item[props.propKey]">
              <template #right-icon>
                <van-checkbox shape="square" :name="item[props.idKey]" :ref="el => (checkboxRefs[index] = el)" />
              </template>
            </van-cell>
          </van-checkbox-group>
        </van-list>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, defineExpose } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
    default: '选择',
  },
  // 默认值
  defValue: {
    type: Array,
    required: false,
    default: () => [],
  },
  // 数据源
  dataSource: {
    type: Array,
    required: true,
    default: () => [],
  },
  // 展示的propKey值
  propKey: {
    type: String,
    required: true,
  },
  // 自定义defValue id的key
  defIdKey: {
    type: String,
    default: 'id',
  },
  // 自定义列表 id的key
  idKey: {
    type: String,
    default: 'id',
  },
  showFloatingBubble:{
    type: Boolean,
    default: true,
  },
})
const h = window.innerHeight
const w = window.innerWidth
const offset = ref({ x: w - 80, y: h - 130 }) // 控制 FloatingBubble 的位置

const emits = defineEmits(['dataEvent'])
const showPicker = ref(false)
const filterVal = ref('')
const checkboxRefs = ref([])
const checked = ref()

const filterList = computed(() => {
  if (!props.dataSource) {
    return
  }
  return props.dataSource.filter(x => x[props.propKey].toLowerCase().includes(filterVal.value.toLowerCase()))
})

onMounted(() => {
  if (!props.defValue) return
  checked.value = props.defValue.map(x => x[props.defIdKey])
})

function onChange(e) {
  // 获得 key arr
  if (!e || e.length < 0) {
    emits('dataEvent', [], null)
  } else {
    const arr = e.map(x => props.dataSource.find(y => y[props.idKey] === x))
    emits('dataEvent', e, arr)
  }
}
function handleDelete(val) {
  checked.value = checked.value.filter(x => x !== val[props.defIdKey])
  const arr = checked.value.map(x => props.dataSource.find(y => y[props.idKey] === x))
  emits('dataEvent', checked.value, arr)
}

defineExpose({
  handleDelete,
})
</script>

<style lang="scss" scoped>
::v-deep.van-cell-custom .van-action-sheet {
  min-height: 50% !important;
}
</style>
