<template>
  <el-menu
    class="left-menu left-aside left-menu-vertical"
    default-active="/adsionli-home"
    text-color="var(--text-color)"
    background-color="var(--background-color)"
    active-text-color="#000000"
    :router="true"
    :collapse="false"
  >
    <template v-for="item in menuData" :key="item.index">
      <el-sub-menu :index="item.path" v-if="item.children">
        <template #title>
          <el-icon v-if="item.icon"
            ><component :is="$icon[item.icon]"
          /></el-icon>
          <span style="margin-right: 10px">{{ item.name }}</span>
        </template>
        <template v-for="child in item.children" :key="child.index">
          <template v-if="!child.path">
            <el-menu-item-group :title="child.name">
              <template v-if="child.children">
                <el-menu-item v-for="menu in child.children" :key="menu.index" :index="menu.path">
                  <component
                    style="width: 1.5em; height: 1.5em; margin-right: 8px"
                    v-if="menu.icon"
                    :is="$icon[menu.icon]"
                  />
                  {{ menu.name }}</el-menu-item
                >
              </template>
            </el-menu-item-group>
          </template>
          <el-menu-item v-else :index="child.path">
            <component
              style="width: 1.5em; height: 1.5em; margin-right: 8px"
              v-if="child.icon"
              :is="$icon[child.icon]"
            />
            <span>{{ child.name }}</span>
          </el-menu-item>
        </template>
      </el-sub-menu>
      <el-menu-item :index="item.path" v-else>
        <template #title>
          <el-icon v-if="item.icon"
            ><component :is="$icon[item.icon]"
          /></el-icon>
          <span>{{ item.name }}</span></template
        >
      </el-menu-item>
    </template>
  </el-menu>
</template>
<script lang="ts" setup>
import { ref, watch, computed, defineComponent, reactive } from 'vue'
import { Location, Document, Menu as IconMenu, Setting } from '@element-plus/icons-vue'
import GenerateMenuData from '@/modules/menu_read/read'

let generateMenuData = new GenerateMenuData()
const menuData = reactive(generateMenuData.handleMenuData(generateMenuData.menuData), { deep: true })
</script>

<style lang="scss" scoped>
:root {
  --text-color: #fff;
  --background-color: transparent;
  --el-menu-hover-bg-color: #fff;
}
.group-title {
  color: #dcdde0;
  padding-left: 40px;
  padding: 7px 0 7px 20px;
  line-height: normal;
  font-size: 12px;
}
</style>
