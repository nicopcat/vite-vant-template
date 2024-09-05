<template>
  <div class="content">
    <div class="card-head-wrapper">
      <slot name="head"></slot>
    </div>
    <div class="content-body">
      <slot name="body"></slot>
    </div>
    <div class="card-foot-wrapper">
      <slot name="foot"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  width: 100%;
  margin: 1rem 0;
  background-color: #f2f4f8;

  &-box {
    padding: 0.2rem 0;
    border-radius: 4px;
    background-color: #fff;
    margin: 1.5rem 0.6rem;

    .van-row {
      font-size: 15px;
      padding: 0.4rem 0;
    }
  }
}
</style>
