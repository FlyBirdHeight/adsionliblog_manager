<template>
  <template v-for="item in menuInfo" :key="item.index">
    <template v-if="item.path">
      <el-sub-menu :index="item.path" v-if="item.children">
        <template #title>
          <el-icon v-if="item.icon"><component :is="$icon[item.icon]" /></el-icon>
          <span style="margin-right: 10px">{{ item.name }}</span>
        </template>
        <template v-if="item.children">
          <item-menu :menu-data="item.children" />
        </template>
      </el-sub-menu>
      <el-menu-item @click="clickMenuItem(item)" :index="item.path" v-else>
        <el-icon v-if="item.icon"><component :is="$icon[item.icon]" /></el-icon>
        <span>{{ item.name }}</span>
      </el-menu-item>
    </template>
    <el-menu-item-group v-else :title="item.name">
      <template v-if="item.children">
        <item-menu :menu-data="item.children" />
      </template>
    </el-menu-item-group>
  </template>
</template>
<script lang="ts">
import { onMounted, defineComponent, reactive, isReactive } from 'vue'

export default defineComponent({
  name: 'ItemMenu',
  props: {
    menuData: {
      type: Object,
      default: {},
    },
  },
  setup(props, context) {
    const menuInfo = isReactive(props.menuData) ? props.menuData : reactive(props.menuData)
    const clickMenuItem = (item: any) => {
      // console.log(item);
    }
    return {
      menuInfo,
      clickMenuItem
    }
  },
})
</script>
<style lang="scss"></style>
