<template>
  <el-menu
    class="left-menu left-aside left-menu-vertical"
    :default-active="activeMenu"
    :router="true"
    :collapse="collapse"
    :unique-opened="true"
    background-color="#c7ecee"
    text-color="#130f40"
    active-text-color="#00b894"
  >
    <item-menu :menu-data="menuData"></item-menu>
  </el-menu>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted, watch, ref, unref, watchEffect } from 'vue'
import GenerateMenuData from '@/modules/menu_read/read'
import { setup, Options } from 'vue-class-component'
import ItemMenu from '@/components/utils/menu/item_menu.vue'
import { useRoute } from 'vue-router'
import { useState } from '@/utils/store/map'
export default defineComponent({
  components: {
    ItemMenu,
  },
  setup() {
    let generateMenuData = new GenerateMenuData()
    const storeState = useState('header', ['activeRouter'])
    const route = useRoute()
    const firstJoin = ref<boolean>(true)
    const collapse = ref<boolean>(false)
    const menuData = reactive(generateMenuData.handleMenuData(generateMenuData.menuData))
    const activeMenu = ref<string>('adsionli-home')
    watch(
      () => route.path,
      (newV, oldV) => {
        if (firstJoin.value) {
          firstJoin.value = false
          activeMenu.value = newV
        }
      }
    )
    watchEffect(() => {
      activeMenu.value = storeState.activeRouter.value.router
    })
    return {
      menuData,
      activeMenu,
      collapse,
    }
  },
})
</script>

<style lang="scss" scoped></style>
