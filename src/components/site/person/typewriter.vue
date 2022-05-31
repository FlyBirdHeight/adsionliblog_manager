<template>
  <div class="type_writer">
    <div class="writing">
      <el-scrollbar ref="writingScrollbar" height="800px">
        <p v-show="playingStatus !== 'destroy'" id="writingPerson" style="margin-bottom: 20px"></p>
        <p id="destroyWriting" v-if="playingStatus === 'destroy'"></p>
      </el-scrollbar>
    </div>
    <div class="showing">
      <el-scrollbar height="800px" ref="showingScrollbar">
        <base-md-editor
          style="margin-bottom: 20px"
          :previewOnly="true"
          :previewOnlyData="editorMdData"
        ></base-md-editor>
      </el-scrollbar>
    </div>
  </div>
  <div class="button-list">
    <el-button
      :type="playingStatus == 'destroy' ? 'primary' : 'success'"
      @click="handlePlay(playingStatus == 'destroy' ? 'restart' : 'destroy')"
      >{{ playingStatus == 'destroy' ? '重新播放' : '立即完成播放' }}</el-button
    >
    <el-button
      :disabled="playingStatus === 'destroy' || playingStatus === 'end'"
      :type="playingStatus === 'stop' ? 'info' : 'warning'"
      @click="handlePlay('pause')"
    >
      {{ playingStatus === 'stop' ? '继续播放' : '暂停播放' }}
    </el-button>
  </div>
</template>
<script lang="ts">
import { ref, nextTick, onMounted, reactive } from 'vue'
import { calculateDiff } from '@/modules/person/typewriter/diff.ts'
export default {
  name: 'PersonTypeWriter',
}
</script>
<script lang="ts" setup>
import TypeIt from 'typeit'
import BaseMdEditor from '@/components/utils/md_editor.vue'
const writingPerson = ref()
const editorMdData = ref<string>('')
const showingScrollbar = ref()
const writingScrollbar = ref()
const typeit = ref(null)
const editType = ['type', 'delete']
const playingData = reactive({
  editList: null,
  input: null,
  output: null,
})
const playingStatus = ref<string>('unstart')
/**
 * @method handlePlay 控制播放显示
 */
const handlePlay = (type: string) => {
  if (type === 'destroy') {
    typeit.value.destroy()
    editorMdData.value = playingData.output
    playingStatus.value = 'destroy'
    nextTick(() => {
      let dom = document.getElementById('destroyWriting')
      dom.innerHTML = playingData.output.replace(/\n/g, '<br>')
    })
  } else if (type === 'pause') {
    if (!typeit.value.is('frozen')) {
      playingStatus.value = 'stop'
      typeit.value.freeze()
    } else {
      playingStatus.value = 'running'
      typeit.value.unfreeze()
    }
  } else if (type === 'restart') {
    // typeit.value = null
    playingStatus.value = 'unstart'
    editorMdData.value = ''
    document.getElementById('writingPerson').innerHTML = ''
    setTimeout(() => {
      typeit.value.reset().go()
    }, 500)
  }
}
const generateTypeIt = async () => {
  typeit.value = new TypeIt('#writingPerson', {
    speed: 50,
    waitUntilVisible: true,
    beforeStep: async (instance: TypeIt) => {
      if (!instance[1]) {
        editorMdData.value = editorMdData.value.slice(0, editorMdData.value.length - 1)
      } else {
        let info = instance[1]
        if (info.node) {
          editorMdData.value += instance[1].content
        } else if (!info.node) {
          if (info.content) {
            editorMdData.value += '\n'
          }
        }
      }
      if (writingScrollbar.value.resize$.scrollHeight > writingScrollbar.value.$el.clientHeight) {
        writingScrollbar.value!.setScrollTop(
          writingScrollbar.value.resize$.scrollHeight - writingScrollbar.value.$el.clientHeight + 20
        )
      }
      if (showingScrollbar.value.resize$.scrollHeight > showingScrollbar.value.$el.clientHeight) {
        showingScrollbar.value!.setScrollTop(
          showingScrollbar.value.resize$.scrollHeight - showingScrollbar.value.$el.clientHeight + 20
        )
      }
    },
  })

  for (let handle of playingData.editList) {
    let fn = Reflect.get(typeit.value, handle.fn)
    if (handle.fn === 'type' || handle.fn === 'delete') {
      typeit.value = fn.call(typeit.value, handle.props.data, handle.props.options)
    } else {
      typeit.value = fn.call(typeit.value, handle.props.options)
    }
    typeit.value = Reflect.get(typeit.value, 'pause').call(typeit.value, 500)
  }
  typeit.value.go()
}
onMounted(async () => {
  let drawData = await calculateDiff()
  nextTick(() => {
    playingData.editList = drawData.editList
    playingData.input = drawData.input
    playingData.output = drawData.output
    generateTypeIt()
  })
})
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
    box-shadow: -5px 10px 10px 2px rgba(0, 0, 0, 0.08);
    padding: 5px;
    background-color: #f2f3f5;
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
    box-shadow: 5px 10px 10px 2px rgba(0, 0, 0, 0.08);
    background-color: #fafcff;
    padding: 5px;
  }
}
.button-list {
  margin-top: 20px;
  text-align: center;
}
</style>
