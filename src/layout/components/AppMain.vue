<template>
  <section class="app-main">
    <router-view>
      <template #default="{ Component }">
        <!--        <el-scrollbar :height="height">-->
        <transition appear name="fade-transform" mode="out-in">
          <keep-alive :include="cachedViews">
            <component :is="Component" :key="key" />
          </keep-alive>
        </transition>
        <!--        </el-scrollbar>-->
      </template>
    </router-view>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTagsViewStore } from '@/store'

const route = useRoute()
const tagsViewStore = useTagsViewStore()

const key = computed(() => route.path)
const cachedViews = computed(() => tagsViewStore.cachedViews)

defineOptions({
  name: 'AppMain',
})
</script>

<style lang="scss" scoped>
.app-main {
  min-height: calc(100vh - 35px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #f0f2f5;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
.hasTagsView {
  .app-main {
    min-height: calc(100vh - 84px);
  }
  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
