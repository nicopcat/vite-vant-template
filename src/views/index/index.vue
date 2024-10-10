<template>
  <div class="content px-3 mb-20">
    <div class="box">
      <van-image width="100%" fit="cover" :src="sf_bg" />
    </div>
    <div v-for="menu in menuList" :key="menu.moduleCode">
      <div class="box bg-white my-2" v-if="menu.routers.length > 0">
        <van-cell class="box-header font-bold" :title="menu.moduleName" value="" />
        <van-grid :border="false" clickable class="items-baseline text-center">
          <van-grid-item
            v-for="router in menu?.routers"
            :key="router.id"
            icon="description"
            icon-color="#2db755"
            :text="router?.children[0].meta.title"
            @click="redirectTo(router?.children[0].path)"
          >
            <div class="w-14">
              <div class="h-12">
                <van-image width="80%" :src="router?.children[0].meta.iconPath ?? def_menu" />
              </div>
              <div class="text-xs">{{ router?.children[0].meta.title }}</div>
            </div>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import sf_bg from '@/assets/imgs/sf_bg.jpg'
import def_menu from '@/assets/imgs/def_menu.png'
import useUserStore from '@/store/modules/users'

const router = useRouter()
const menuList = ref([])
const userStore = useUserStore()

onMounted(async () => {
  await userStore.GetInfo()
  if (useUserStore().getMenus?.length === 0) {
    menuList.value = await useUserStore().GET_ASYNCMENU()
  } else {
    menuList.value = useUserStore().getMenus
  }
})

function redirectTo(path) {
  router.push(path)
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  .box {
    border: 1px solid white;
    border-radius: 4px;
    &-header {
      font-size: medium;
      font-weight: bold;
    }
  }
}
</style>
