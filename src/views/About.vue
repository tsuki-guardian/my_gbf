<template>
  <div class="about">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>關於頁面</span>
        </div>
      </template>
      <div class="content">
        <h2>關於本系統</h2>
        <p>這是一個使用 Vue 3 + TypeScript + Element Plus 構建的應用</p>
        <el-divider />
        <h3>技術棧</h3>
        <ul>
          <li>Vue 3 - 漸進式 JavaScript 框架</li>
          <li>TypeScript - JavaScript 的超集</li>
          <li>Vite - 下一代前端構建工具</li>
          <li>Element Plus - Vue 3 UI 組件庫</li>
          <li>Vue Router - 官方路由管理器</li>
          <li>Pinia - Vue 狀態管理</li>
          <li>SCSS - CSS 預處理器</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// About 頁面
</script>

<style lang="scss" scoped>
.about {
  .card-header {
    font-size: 18px;
    font-weight: 500;
  }

  .content {
    h2 {
      color: #409eff;
      margin-bottom: 15px;
    }

    h3 {
      color: #606266;
      margin: 15px 0 10px;
    }

    p {
      color: #606266;
      line-height: 1.6;
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        padding: 8px 0;
        color: #606266;
        border-bottom: 1px solid #ebeef5;

        &:last-child {
          border-bottom: none;
        }

        &:before {
          content: "✓";
          color: #67c23a;
          margin-right: 10px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
