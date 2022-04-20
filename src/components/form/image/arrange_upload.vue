<template>
<el-form :model="formData">

</el-form>
</template>
<script lang="ts">
export default {
    name: "ArrangeUploadForm"
}
</script>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed, watch, reactive, watchEffect } from 'vue'
const props = defineProps()
const emit = defineEmits([])
const formData = reactive({
    
})
</script>
<style lang="scss" scoped>
</style>