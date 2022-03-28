<template>
  <daily-status-table></daily-status-table>
</template>
<script lang="ts">
export default {
  name: 'DailyStatus',
}
</script>
<script lang="ts" setup>
import DailyStatusTable from '@/components/utils/table/daily_status_table.vue'
import { ref, defineEmits, computed, watch, reactive, watchEffect, provide, inject } from 'vue'

const emit = defineEmits([])
const status = inject('dailyStatus')
const page = ref<number>(1)
const count = ref<number>(20)
provide('page', page)
provide('count', count)
</script>
<style lang="scss" scoped></style>
