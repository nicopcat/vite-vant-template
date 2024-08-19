<template>
  <div class="">
    <van-row justify="space-between py-1 items-baseline">
      <van-col :span="props.leftSpan" class="text-sm text-slate-400 break-all mb-1">
        <slot name="left"></slot>
      </van-col>
      <!-- <div class="list-center fr">
      <slot name="center"></slot>
    </div> -->
      <van-col :span="24 - props.leftSpan" class="text-sm text-end text-black break-all">
        <slot name="right"></slot>
      </van-col>
    </van-row>
  </div>
</template>

<script setup>
const props = defineProps({
  leftSpan: {
    type: Number,
    default: 10,
  },
})
</script>

<style lang="scss" scoped>
.list-wrapper {
  height: 46px;
  line-height: 46px;
  padding: 0 8px 0 19px;
  border-radius: 0;
  border-bottom: 1px solid var(--yu-gray-color--light);
  position: relative;
  font-size: 12px;
  &:first-child {
    border-radius: 5px 5px 0 0;
  }
  &:last-child {
    border-radius: 0 0 5px 5px;
    border: none;
  }
  .list-left {
    color: var(--yu-font-color--dark);
  }
  .list-center {
    color: var(--yu-font-color--dark);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .list-right {
    color: var(--yu-gray-color);
  }
}
</style>
