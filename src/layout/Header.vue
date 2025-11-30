<template>
  <el-header class="header">
    <div class="header-left">
      <el-icon class="menu-icon" @click="toggleMenu">
        <Expand v-if="menuStore.isCollapse" />
        <Fold v-else />
      </el-icon>
      <span class="title">我的應用</span>
    </div>
    <div class="header-right">
      <!-- 這裡可以放置其他功能，如用戶信息、通知等 -->
      <span class="user-info">歡迎回來，主人 ♡</span>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { useMenuStore } from '@/stores'
import { Expand, Fold } from '@element-plus/icons-vue'

const menuStore = useMenuStore()

const toggleMenu = () => {
  menuStore.toggleCollapse()
}
</script>

<style lang="scss" scoped>
.header {
  height: 50px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 15px;

    .menu-icon {
      font-size: 20px;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #409eff;
      }
    }

    .title {
      font-size: 18px;
      font-weight: 500;
      color: #303133;
    }
  }

  .header-right {
    .user-info {
      color: #606266;
      font-size: 14px;
    }
  }
}
</style>
