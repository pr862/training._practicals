declare module '@vueup/vue-quill' {
  import { DefineComponent } from 'vue'
  export const QuillEditor: DefineComponent<{
    theme?: string
    toolbar?: string | object | any[]
    modules?: object
    contentType?: 'html' | 'delta' | 'text'
    content?: string | object
    placeholder?: string
    readOnly?: boolean
  }>
}