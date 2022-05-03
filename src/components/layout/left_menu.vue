<template>
  <el-menu
    class="left-menu left-aside left-menu-vertical"
    :default-active="activeMenu"
    :text-color="collapse ? '#000' : '#fff'"
    :background-color="collapse ? '' : 'var(--background-color)'"
    :router="true"
    :active-text-color="collapse ? 'fff' : '#000'"
    :collapse="collapse"
    :unique-opened="true"
  >
    <item-menu :menu-data="menuData"></item-menu>
  </el-menu>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted, watch, ref, unref } from 'vue'
import GenerateMenuData from '@/modules/menu_read/read'
import { setup, Options } from 'vue-class-component'
import ItemMenu from '@/components/utils/menu/item_menu.vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  components: {
    ItemMenu,
  },
  setup() {
    let generateMenuData = new GenerateMenuData()
    const route = useRoute()
    const firstJoin = ref<boolean>(true)
    const collapse = ref<boolean>(true)
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
    return {
      menuData,
      activeMenu,
      collapse,
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
