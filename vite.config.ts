import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  // 開發環境使用根路徑，生產環境使用 /my_gbf/
  base: process.env.NODE_ENV === 'production' ? '/my_gbf/' : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 將 node_modules 中的依賴分割
          if (id.includes('node_modules')) {
            // Element Plus 相關庫
            if (id.includes('element-plus')) {
              return 'element-plus'
            }
            // Vue 核心庫
            if (id.includes('vue') && !id.includes('element-plus')) {
              return 'vue-vendor'
            }
            // 其他第三方庫
            return 'vendor'
          }
          // 將大型 JSON 資料檔案分割（如果檔案路徑包含 json）
          if (id.includes('/json/') && id.endsWith('.json')) {
            if (id.includes('character.json')) {
              return 'data-character'
            }
            if (id.includes('summons.json')) {
              return 'data-summons'
            }
            return 'data'
          }
        }
      }
    },
    // 調整 chunk 大小警告限制為 1000 KB（因為資料檔案確實很大）
    chunkSizeWarningLimit: 1000
  }
})
