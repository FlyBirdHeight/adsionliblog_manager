<template>
  <dialog-show
    :modal="true"
    :draggable="false"
    :showFooter="true"
    :title="'图片上传设置'"
    :width="'40%'"
    :show="props.show"
    @closeDialog="closeDialog"
  >
    <template #mainBody>
      <el-scrollbar height="400px">
        <el-form size="small" label-position="left" :model="formData">
          <el-form-item v-for="(image, index) in formData.image" :label="`图片${image.index + 1}:`">
            <div class="editor-image-setting">
              <el-form :ref="(el) => imageSettingForm.push(el)" :model="image" label-position="left" size="small">
                <el-form-item style="margin-bottom: 10px" label="图片名称:">
                  <el-input v-model="image.name" disabled />
                </el-form-item>
                <el-form-item label="保存路径:">
                  <el-autocomplete
                    style="width: 100%"
                    :fetch-suggestions="getFullPath"
                    @select="handleSelect(index)"
                    @change="changePath(index)"
                    v-model="image.path"
                  ></el-autocomplete>
                </el-form-item>
              </el-form>
            </div>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </template>
    <template #foot>
      <div class="edit-solution-footer">
        <el-button @click="submit" type="primary">设置完成</el-button>
        <el-button @click="closeDialog" type="info">关闭</el-button>
      </div>
    </template>
  </dialog-show>
</template>
<script lang="ts">
import { ref, defineProps, defineEmits, computed, onMounted, reactive, watch } from 'vue'
import { getFilePath } from '@/plugin/image/upload/requestData.ts'
import { setInfoReg, getFindPath, judgeNewPath } from '@/plugin/image/upload/vaildate.ts'
export default {
  name: 'EditorImageSetting',
}
</script>
<script lang="ts" setup>
import DialogShow from '@/components/dialog/dialog.vue'
const props = defineProps<{
  show: false
  imageList: []
}>()
const emit = defineEmits(['submitSetting', 'closeDialog'])
const imageSettingForm = ref([])
const pathList = ref([])
const formData = reactive({
  image: [],
})
watch(
  () => props.imageList,
  (newV, oldV) => {
    if (newV.length != 0) {
      const data = newV.map((v) => {
        return {
          directory_id: v.directory_id,
          is_create: v.is_create,
          name: v.name,
          path: v.path,
          index: v.index,
        }
      })
      formData.image = data
    } else {
      formData.image = []
    }
  }
)
/**
 * @method getFullPath 获取完整的保存路径
 */
const getFullPath = (queryString: string, cb: (arg: any) => void) => {
  const results = getFindPath(queryString, pathList.value)

  cb(results)
}
/**
 * @method handleSelect 处理远程搜索点击事件
 */
const handleSelect = function (index: number) {
  formData.image[index].directory_id =
    pathList.value[pathList.value.findIndex((v) => v.value === formData.image[index].path)].id
  formData.image[index].is_create = false
}
/**
 * @method changePath 改变路径时触发
 * @param {string | number} value 输入的路径值
 */
const changePath = function (index: number) {
  let findPath = getFindPath(formData.image[index].path, pathList.value)
  if (findPath.length == 0) {
    formData.image[index].directory_id = null
    formData.image[index].is_create = true
  } else {
    let findIndex = findPath.findIndex((v) => v.value === formData.image[index].path)
    if (findIndex == -1) {
      formData.image[index].directory_id = null
      formData.image[index].is_create = true
    } else {
      formData.image[index].directory_id = findPath[findIndex].id
      formData.image[index].is_create = false
    }
  }
}
const submit = () => {
  formData.image.forEach((v, i) => {
    if (!v.directory_id && !v.is_create) {
      changePath(i)
    }
  })
  emit('submitSetting', formData.image)
}
const closeDialog = () => {
  emit('closeDialog')
}
watch(
  () => props.show,
  async (newV, oldV) => {
    if (newV) {
      pathList.value = await getFilePath()
    }
  }
)
</script>
<style lang="scss" scoped>
.editor-image-setting {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 5px 5px 12px 2px rgba(0, 0, 0, 0.08);
  padding: 10px;
}
</style>
