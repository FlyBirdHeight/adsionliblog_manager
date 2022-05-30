<template>
  <div class="person-presentation">
    <div class="setting">setting</div>
    <div class="divider"></div>
    <div class="show">show</div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'PersonPresentation',
}
</script>
<script lang="ts" setup>
import { ref } from 'vue'
</script>
<style lang="scss" scoped>
.person-presentation {
  margin-top: 15px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  .setting {
    flex-shrink: 1;
    width: 100%;
    height: 400px;
    box-shadow: 0px -15px 15px 3px rgba(0, 0, 0, 0.08);
    margin-bottom: 5px;
    background-color: #F5F7FA;
    padding: 10px;
  }
  .divider {
    border: 1px solid #F2F3F5;
    width: 100%;
  }
  .show {
    margin-top: 5px;
    flex-shrink: 1;
    width: 100%;
    height: 400px;
    box-shadow: 0px 15px 15px 3px rgba(0, 0, 0, 0.08);
    padding: 10px;
  }
}
</style>
