<template>
  <div class="section user-section">
    <div class="head">
      <van-nav-bar class="nav-bar">
        <template #left>
          <van-icon name="arrow-left" @click="router.push('/')" />
        </template>

        <template #title>
          <div class="title">用户中心</div>
        </template>
      </van-nav-bar>

      <div class="head-bg">
        <img class="img1" :src="bg1" alt="" />
        <img class="img2" :src="bg2" alt="" />
      </div>

      <yu-card class="user-info">
        <template #body>
          <div class="card-body flex flex-row items-center">
            <div class="avatar">
              <img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif" alt="" />
            </div>
            <div class="info">
              <div class="name">
                <div class="user-name ellipsis">Hi, {{ userInfo?.nickName ?? '尊敬的用户' }}</div>
                <div class="mb-2" v-if="!!siteName">
                  <van-tag type="primary" size="medium"> {{ siteName }}</van-tag>
                </div>
              </div>
              <div class="phone ellipsis">{{ userInfo?.phonenumber ?? '' }}</div>
            </div>
          </div>
        </template>
      </yu-card>
    </div>

    <div class="body">
      <yu-card class="user-info-card">
        <template #body>
          <list class="user-info-list">
            <template #left>个人信息</template>
            <template #right>
              <div>修改资料 <van-icon name="arrow" /></div>
            </template>
          </list>

          <list class="user-info-list">
            <template #left>修改密码</template>
            <template #right>
              <div>
                <van-icon name="arrow" />
              </div>
            </template>
          </list>

          <!-- <list class="user-info-list">
            <template #left>绑定信息</template>
            <template #right>
              <div>
                <van-icon name="arrow" />
              </div>
            </template>
          </list> -->
        </template>
      </yu-card>

      <yu-card class="user-info-card">
        <template #body>
          <list class="user-info-list">
            <template #left>登录时间</template>
            <template #right>
              <div>
                {{ userInfo.loginDate }}
              </div>
            </template>
          </list>

          <list class="user-info-list">
            <template #left>
              <span class="w-1/8">角色 </span>
            </template>

            <template #right>
              <div>
                {{ userRoles }}
              </div>
            </template>
          </list>
        </template>
      </yu-card>

      <!-- <yu-card class="user-info-card">
        <template #body>
          <list class="user-info-list">
            <template #left>个人信息</template>
            <template #right>
              <div>修改资料 <van-icon name="arrow" /></div>
            </template>
          </list>

          <list class="user-info-list">
            <template #left>修改密码</template>
            <template #right>
              <div>
                <van-icon name="arrow" />
              </div>
            </template>
          </list>

          <list class="user-info-list">
            <template #left>绑定信息</template>
            <template #right>
              <div>
                <van-icon name="arrow" />
              </div>
            </template>
          </list>
        </template>
      </yu-card> -->

      <yu-card class="user-info-card">
        <template #body>
          <list class="user-info-list" @click="loginOut">
            <template #center>
              <div>退出登录</div>
            </template>
          </list>
        </template>
      </yu-card>
    </div>

    <div class="foot"></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { showConfirmDialog } from 'vant'
import YuCard from '@/components/YuCard'
import list from '@/views/components/list/index.vue'
import bg1 from '@/assets/imgs/bg-img1.png'
import bg2 from '@/assets/imgs/bg-img2.png'
import { getSiteList } from '@/api/system/user'

import { useRouter } from 'vue-router'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const router = useRouter()
const siteList = reactive([])
const siteName = ref('')

const userInfo = userStore.getUserInfo?.user
console.log(userInfo)
const userRoles = computed(() => {
  return userInfo.roles.map(x => x.roleName).join(',')
})
onMounted(() => {
  getSite()
})

const getSite = async () => {
  try {
    const { data } = await getSiteList()
    const list = data.voList ?? []
    siteList.splice(0, siteList.length, ...list)
    console.log(siteList)
    siteName.value = siteList.find(x => x.siteId === userInfo.siteId)?.companyName
  } catch (error) {
    console.log(`get site list error: ${error}`)
  }
}

async function loginOut() {
  try {
    await showConfirmDialog({
      title: '登出',
      message: '是否确认退出',
    })
    userStore.logout()
    await router.push(`/login`)
    window && window.location.reload()
  } catch (e) {}
}
</script>

<style lang="scss" scoped>
.user-section {
  background: var(--yu-gray-color--light);
  min-height: 100vh;

  .head {
    height: 170px;
    position: relative;
    .nav-bar {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      background: transparent;
      border: none;
      .van-icon {
        color: var(--yu-white-color);
      }
      .title {
        color: var(--yu-white-color);
      }
      &:after {
        border: none;
      }
    }
    .head-bg {
      height: 150px;
      background: var(--yu-linear-bg-color);
      position: relative;
      overflow: hidden;
      width: 100%;
      img {
        display: inline-block;
        position: absolute;
        width: 80px;
        height: auto;
        opacity: 0.2;
        &.img1 {
          top: 0;
          right: 0;
        }
        &.img2 {
          bottom: 0;
          left: 0;
        }
      }
    }
  }

  .user-info {
    position: absolute;
    top: 66px;
    left: 13px;
    width: calc(100% - 26px);
    z-index: 9;
    .card-head-wrapper {
    }
    .card-body-wrapper {
      .avatar {
        width: 60px;
        height: 60px;
        overflow: hidden;
        border-radius: 50%;
        margin-right: 16px;
        box-shadow: var(--yu-border-shadow--light);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .info {
        color: rgba(36, 45, 61, 1);
        font-size: 13px;
        line-height: 18px;
        padding-top: 10px;
        text-align: left;
        width: calc(100% - 60px - 16px);
        .name {
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          align-items: center;
          .user-name {
            margin-bottom: 4px;
            font-weight: 600;
          }
          .phone {
          }
        }
      }
    }
    .card-foot-wrapper {
    }
  }

  .body {
    padding: 0 13px;
    margin-top: 10px;
  }
  .user-info-card {
    display: block;
    width: 100%;
    padding: 0;
    margin-bottom: 8px;
  }
}
</style>
