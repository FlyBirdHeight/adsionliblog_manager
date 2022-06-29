<template>
  <div class="person-presentation">
    <div class="setting">
      <presentation-container></presentation-container>
    </div>
    <!-- <div class="divider"></div> -->
    <!-- <div class="show">show</div> -->
  </div>
</template>
<script lang="ts">
import { ref } from 'vue'
export default {
  name: 'PersonPresentation',
}
</script>
<script lang="ts" setup>
import PresentationContainer from '@/components/site/person/presentation/container'
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
    height: auto;
    box-shadow: 0px -15px 15px 3px rgba(0, 0, 0, 0.08);
    margin-bottom: 50px;
    padding: 5px;
    // overflow: hidden;
  }
  .divider {
    border: 1px solid #f2f3f5;
    width: 100%;
  }
  .show {
    margin-top: 5px;
    flex-shrink: 1;
    width: 100%;
    height: 400px;
    box-shadow: 0px 15px 15px 3px rgba(0, 0, 0, 0.08);
    background-color: #f5f7fa;
    padding: 5px;
    overflow: hidden;
  }
}
</style>
