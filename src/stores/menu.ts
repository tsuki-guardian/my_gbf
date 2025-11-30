import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMenuStore = defineStore('menu', () => {
  // state - 菜單是否收起
  const isCollapse = ref(false)

  // actions
  function toggleCollapse() {
    isCollapse.value = !isCollapse.value
  }

  function setCollapse(value: boolean) {
    isCollapse.value = value
  }

  return {
    isCollapse,
    toggleCollapse,
    setCollapse
  }
})
