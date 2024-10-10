<template>
  <div class="container">
    <div class="card-head-wrapper">
      <div class="title">
        <slot name="head"></slot>
      </div>
    </div>
    <div class="card-body-wrapper">
      <slot name="body"></slot>
    </div>
    <div class="card-foot-wrapper">
      <slot name="foot"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  display: flex;
  flex-flow: column;
  box-sizing: border-box;
  width: 100%;
  padding: var(--van-cell-vertical-padding) var(--van-cell-horizontal-padding);
  overflow: hidden;
  color: var(--van-cell-text-color);
  font-size: var(--van-cell-font-size);
  line-height: var(--van-cell-line-height);
  .card-head-wrapper {
    .title {
      font-weight: bold;
      word-break: break-all;
    }
  }
  .card-body-wrapper {
    margin-top: var(--van-cell-label-margin-top);
  }
  .card-foot-wrapper {
    margin-top: 1rem;
  }
}
</style>
