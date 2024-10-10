<template>
  <div class="section yu-login-layout">
    <div class="header-container">
      <div class="logo-container">
        <img :src="logo" alt="Logo" />
      </div>
      <div class="title-container">
        <span class="title">智能工厂平台</span>
        <span class="manas-label">Smart Factory</span>
      </div>
    </div>
    <div class="body-container">
      <slot name="body"></slot>
    </div>
    <div class="foot-container w-full fixed bottom-2 right-2">
      <slot name="foot"></slot>
    </div>
  </div>
</template>

<script setup>
import logo from '@/assets/imgs/logo.png'
</script>

<style lang="scss" scoped>
.section {
  height: 100vh;
  background-color: #f5f7fa; // 背景颜色
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.header-container {
  background: linear-gradient(135deg, #0379e7, #1b84ecce); // 渐变背景
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 30px;
}
.logo-container {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 auto;
  overflow: hidden;
  img {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
}

.title-container {
  margin-top: 10px;
}

.title {
  font-size: 2.2rem;
  font-weight: bold;
  color: white; // 白色文字
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.5s ease-in-out;
}

.manas-label {
  display: block; // 让 Manas 字样在新行显示
  font-size: 1.2rem;
  font-weight: normal;
  color: #f0f8ff; // 浅色
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.body-container {
  // 这里可以添加 body-container 的样式
}

.foot-container {
  // 这里可以添加 foot-container 的样式
}
</style>
