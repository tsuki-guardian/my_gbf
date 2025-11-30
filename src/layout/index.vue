<template>
  <div class="app-layout">
    <Sidebar class="sidebar-container" />
    <div class="main-container">
      <Header class="header-container" />
      <el-main class="content-container">
        <router-view />
      </el-main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
</script>

<style lang="scss" scoped>
.app-layout {
  display: flex;
  height: 100vh;
  width: 100%;

  .sidebar-container {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1001;
  }

  .main-container {
    flex: 1;
    margin-left: 210px;
    transition: margin-left 0.28s;
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    .header-container {
      position: fixed;
      top: 0;
      right: 0;
      left: 210px;
      z-index: 1000;
      transition: left 0.28s;
    }

    .content-container {
      flex: 1;
      margin-top: 50px;
      padding: 20px;
      background-color: #f0f2f5;
      overflow-y: auto;
      min-width: 1024px;
    }
  }
}

// 當菜單收起時調整佈局
:deep(.sidebar.is-collapse) ~ .main-container {
  margin-left: 64px;

  .header-container {
    left: 64px;
  }
}
</style>
