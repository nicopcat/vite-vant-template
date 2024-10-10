<template>
  <div class="list-wrapper flex flex-row justify-between items-center">
    <div class="list-left break-all">
      <slot name="left"></slot>
    </div>
    <div class="list-center">
      <slot name="center"></slot>
    </div>
    <div class="list-right break-all">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.list-wrapper {
  min-height: 46px;
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
  // .list-center {
  //   color: var(--yu-font-color--dark);
  //   position: absolute;
  //   top: 50%;
  //   left: 50%;
  //   transform: translate(-50%, -50%);
  // }
  .list-right {
    overflow: auto;
    max-width: 60%;
    line-height: 28px;
    color: var(--yu-gray-color);
  }
}
</style>
