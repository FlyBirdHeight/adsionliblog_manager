<template>
  <el-calendar>
    <template #dateCell="{ data }">
      <p :class="data.isSelected ? 'is-selected' : ''">
        {{ data.day.split('-').slice(1).join('-') }}
        {{ data.isSelected ? '✔️' : '' }}
      </p>
    </template>
  </el-calendar>
</template>
<script lang="ts" setup>
import { DateSetting, DateType, getMonth, DateInfo, getWholeDaily } from "@/plugin/daily/setting"
import { ref, reactive, onMounted } from 'vue';

const dateList = ref<DateInfo>();
onMounted(() => {
    dateList.value = getMonth();
    getWholeDaily(dateList.value)
})

const dailyDate = ref<DateSetting[]>([]);

</script>
<style lang="scss"></style>
