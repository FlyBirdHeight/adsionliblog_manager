<template>
  <div class="daily-setting">
    <div class="title"></div>
    <div class="body">
      <daily></daily>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'DailySetting',
}
</script>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import Daily from "@/components/daily/setting/daily"

</script>
<style lang="scss"></style>
