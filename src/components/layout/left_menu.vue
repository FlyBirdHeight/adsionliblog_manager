<template>
  <el-menu
    class="left-menu left-aside left-menu-vertical"
    default-active="/adsionli-home"
    text-color="#fff"
    background-color="var(--background-color)"
    :router="true"
    :collapse="false"
    :unique-opened="true"
  >
    <item-menu :menu-data="menuData"></item-menu>
  </el-menu>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
import GenerateMenuData from '@/modules/menu_read/read'
import { setup, Options } from 'vue-class-component'
import ItemMenu from "@/components/utils/menu/item_menu.vue"
export default defineComponent({
  components: {
    ItemMenu,
  },
  setup() {
    let generateMenuData = new GenerateMenuData()
    const menuData = reactive(generateMenuData.handleMenuData(generateMenuData.menuData), { deep: true })
    return {
      menuData,
    }
  },
})
</script>

<style lang="scss" scoped>
:root {
  --text-color: #fff;
  --background-color: transparent;
  --el-menu-hover-bg-color: #fff;
}
</style>
