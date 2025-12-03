<template>
  <div class="sidebar" :class="{ 'is-collapse': menuStore.isCollapse }">
    <el-menu
      :default-active="activeMenu"
      :collapse="menuStore.isCollapse"
      :collapse-transition="false"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409eff"
      router
    >
      <el-menu-item index="/">
        <el-icon><HomeFilled /></el-icon>
        <template #title>首頁</template>
      </el-menu-item>

      <el-sub-menu index="2">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span>系統設置</span>
        </template>
        <el-menu-item index="">個人資料</el-menu-item>
        <el-menu-item index="">帳號設置</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="3">
        <template #title>
          <el-icon><Box /></el-icon>
          <span>小工具</span>
        </template>
        <el-menu-item :index="getRoutePath('GachaParse')">卡池分析</el-menu-item>
      </el-sub-menu>

      <el-menu-item :index="getRoutePath('About')">
        <el-icon><InfoFilled /></el-icon>
        <template #title>關於</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMenuStore } from '@/stores'
import { HomeFilled, Setting, InfoFilled, Box } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()

const activeMenu = computed(() => {
  const { path } = route
  return path
})

// 根據路由名稱獲取路徑
const getRoutePath = (name: string) => {
  const resolved = router.resolve({ name })
  return resolved.path
}
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  background-color: #304156;
  transition: width 0.28s;
  width: 210px;

  &.is-collapse {
    width: 64px;
  }

  :deep(.el-menu) {
    border-right: none;
    height: 100%;
    width: 100% !important;
  }

  :deep(.el-sub-menu__title) {
    &:hover {
      background-color: #263445 !important;
    }
  }

  :deep(.el-menu-item) {
    &:hover {
      background-color: #263445 !important;
    }
  }
}
</style>
