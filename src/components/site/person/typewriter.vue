<template>
  <div class="type_writer">
    <div class="writing">
      <h1>writing</h1>
    </div>
    <div class="showing">
      <h1>markdownShow</h1>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'PersonTypeWriter',
}
</script>
<script lang="ts" setup>
import { ref } from 'vue'
</script>
<style lang="scss" scoped>
.type_writer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  .writing {
    flex-shrink: 1;
    width: calc(50% - 20px);
    height: 800px;
    box-shadow: -5px 10px 10px 2px rgba(0, 0, 0, 0.08);
    padding: 5px;
    background-color: #fafcff;
  }
  .writing::after {
    box-shadow: 3px 5px 5px 2px rgba(0, 0, 0, 0.04);
  }
  .showing::before {
    box-shadow: -3px 5px 5px 2px rgba(0, 0, 0, 0.04);
  }
  .showing {
    flex-shrink: 1;
    width: calc(50% - 20px);
    height: 800px;
    box-shadow: 5px 10px 10px 2px rgba(0, 0, 0, 0.08);
    background-color: #f2f3f5;
    padding: 5px;
  }
}
</style>
