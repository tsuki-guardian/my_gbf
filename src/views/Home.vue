<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="welcome-card">
          <template #header>
            <div class="card-header">
              <span>總之先隨便塞點字在這</span>
            </div>
          </template>
          <div class="welcome-content">
            <h2>這是您的首頁儀表板</h2>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>計數器示例</span>
            </div>
          </template>
          <div class="counter-demo">
            <p class="count-display">計數: {{ counterStore.count }}</p>
            <p class="count-display">雙倍: {{ counterStore.doubleCount }}</p>
            <el-space>
              <el-button type="primary" @click="counterStore.increment">
                增加
              </el-button>
              <el-button type="warning" @click="counterStore.decrement">
                減少
              </el-button>
              <el-button type="info" @click="counterStore.reset">
                重置
              </el-button>
            </el-space>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>快速導航</span>
            </div>
          </template>
          <div class="quick-nav">
            <el-button type="primary" :icon="InfoFilled" @click="$router.push({ name: 'About' })">
              關於頁面
            </el-button>
            <el-button type="success" @click="toggleMenu">
              {{ menuStore.isCollapse ? '展開' : '收起' }}菜單
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore, useMenuStore } from '@/stores'
import { InfoFilled } from '@element-plus/icons-vue'

const counterStore = useCounterStore()
const menuStore = useMenuStore()

const toggleMenu = () => {
  menuStore.toggleCollapse()
}
</script>

<style lang="scss" scoped>
.home {
  .card-header {
    font-size: 16px;
    font-weight: 500;
  }

  .welcome-card {
    .welcome-content {
      text-align: center;

      h2 {
        color: #409eff;
        margin-bottom: 15px;
      }

      p {
        color: #606266;
        font-size: 16px;
      }
    }
  }

  .counter-demo {
    text-align: center;

    .count-display {
      font-size: 18px;
      color: #303133;
      margin-bottom: 15px;
    }
  }

  .quick-nav {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
}
</style>
