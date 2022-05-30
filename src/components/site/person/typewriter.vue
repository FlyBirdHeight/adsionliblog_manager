<template>
  <div class="type_writer">
    <div class="writing">
      <p id="writingPerson"></p>
    </div>
    <div class="showing">
      <h1>markdownShow</h1>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, nextTick, onMounted } from 'vue'

export default {
  name: 'PersonTypeWriter',
}
</script>
<script lang="ts" setup>
import { calculateDiff } from '@/modules/person/typewriter/diff.ts'
// @ts-ignore
import TypeIt from 'typeit'
const writingPerson = ref()
onMounted(() => {
  nextTick(() => {
    new TypeIt('#writingPerson', {
      strings: ['This is a great string.', 'But here is a better one.'],
      speed: 50,
      waitUntilVisible: true,
    }).go()
  })
})
calculateDiff();
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
