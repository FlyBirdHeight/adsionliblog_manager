import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ShowText',
  setup(props:any, context: any) {
    console.log(props)

    return () => (
        <div>text</div>
    )
  },
})
