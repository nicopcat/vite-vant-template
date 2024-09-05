<template>
  <div class="nav-bar-normal">
    <van-nav-bar fixed :title="router.currentRoute.value.meta.title ?? ''">
      <template #left>
        <span @click="router.go(-1)">
          <van-icon name="arrow-left" />
          <span>返回</span>
        </span>
      </template>

      <template #right>
        <!-- <div class="icon-wrapper inline-block" @click="router.push('/')">
          <svg-icon icon-class="home" class-name="nav-bar-icon" />
        </div> -->
        <div class="icon-wrapper inline-block">
          <slot name="search"></slot>
        </div>
      </template>
    </van-nav-bar>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style lang="scss">
.nav-bar-normal {
  padding-bottom: 2.2rem;
  .van-icon,
  span {
    color: var(--yu-font-color--dark);
    margin-right: 4px;
    font-size: 16px;
  }
  .icon-wrapper {
    position: relative;
    .van-badge {
      position: absolute;
      //top: -4px;
      //right: -4px;
      top: 4px;
      right: 4px;
    }
  }
  .nav-bar-icon {
    width: 24px;
    height: 24px;
    margin: 0 8px;
    // color: var(--yu-gray-color);
    cursor: pointer;
  }
}
</style>
