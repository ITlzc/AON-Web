<template>
  <a-form :form="form" layout="vertical">
    <div class="form_top_con">
      <a-form-item v-for="([fieldName, fieldData], index) in fields" :key="index"
        :label="fieldData.title ? fieldData.title : fieldName.charAt(0).toUpperCase() + fieldName.slice(1)"
        :name="fieldName">
        <component :is="getComponent(fieldData, fieldName)" v-bind="getComponentProps(fieldData, fieldName)"
          v-model="form[fieldName]" @change="(e: any) => handleChange(e, fieldName)"
          @update:modelValue="(value: any) => handleUpdateModelValue(value, fieldName)" />
      </a-form-item>
    </div>

    <div class="form_bottom_btn">
      <div class="mount">
        <img src="../assets/images/modelMarket/token.png" alt="">
        <!-- <p>-{{ props.price }}</p> -->
        <p>-10</p>
      </div>

      <a-form-item>
        <a-button type="primary" @click="handleSubmit">Generate</a-button>
      </a-form-item>
    </div>

  </a-form>
</template>

<script lang="ts" setup>
import { defineComponent, ref, reactive, onMounted, watch, nextTick } from 'vue';
import InputSlider from './InputSlider.vue';
import SelectComponent from './SelectComponent.vue';
import InputComponent from './InputComponent.vue';
import TextareaComponent from './TextareaComponent.vue';
import SwitchComponent from './SwitchComponent.vue';
import UploadComponent from './UploadComponent.vue';

const props = defineProps({
  fields: {
    type: Object as () => Record<string, any>,
    required: true,
  },
  schemas: {
    type: Object as () => Record<string, any>,
    required: true,
  },
  submitFunc: {
    type: Function,
    required: true,
  },
  price: {
    type: [Number, String],
  },
});

const form: any = reactive({})

watch(props.schemas, (newData, oldData) => {
  console.log(newData)
  if(newData){
    nextTick(() => {
      initializeForm()
    })
  }
}, { deep: true, immediate: true });

// onMounted(() => {
//   initializeForm()
// });

function handleChange(event: any, fieldName: string) {
  console.log(event, fieldName)
  if (event && event.target) {
    form[fieldName] = event.target.value;
  } else if (typeof event === 'boolean') {
    form[fieldName] = event;
  } else if (event && typeof event === 'object' && 'value' in event) {
    form[fieldName] = event.value;
  } else if (event && typeof event === 'object' && 'fileList' in event) {
    form[fieldName] = Array.isArray(event.fileList) && event.fileList.length === 0 && ''
  } else {
    form[fieldName] = event;
  }
}

function handleUpdateModelValue(value: any, fieldName: string) {
  // 处理 update:modelValue 事件的值
  console.log(form[fieldName], fieldName, value)
  form[fieldName] = value;
}

function getComponent(fieldData: any, fieldName: string) {
  if (fieldData.type === 'string' && fieldData.format === 'uri') {
    return UploadComponent
  }
  if (fieldData.allOf || (fieldData.enum && fieldData.enum.length > 0)) {
    return SelectComponent
  }

  if (fieldData.type === 'number') {
    return InputSlider
  }

  if (fieldData.type === 'integer') {
    // if (!fieldData.maximum && !fieldData.allOf) {
    //   return 'a-input-number'
    // }
    return InputSlider
  }

  switch (fieldData.type) {
    case 'string':
      return fieldName === 'prompt' ? TextareaComponent : InputComponent;
    case 'boolean':
      return SwitchComponent
    default:
      return InputComponent;
  }
}

function getComponentProps(fieldData: any, fieldName: string) {
  const form_props: Record<string, any> = {};
  if (fieldData.allOf) {
    const refField = fieldData.allOf.find((item: any) => item.$ref);
    if (refField && props.schemas) {
      const refPath = refField.$ref.substring(refField.$ref.lastIndexOf('/') + 1);
      const refObj = props.schemas[refPath];

      form_props.options = refObj && refObj.enum && refObj.enum.length > 0 && refObj.enum.map((enumValue: any, index: number) => ({ label: enumValue, value: enumValue }));
    }
  }
  if(!fieldData.allOf && fieldData.enum && fieldData.enum.length > 0){
    form_props.options = fieldData.enum.map((enumValue: any, index: number) => ({ label: enumValue, value: enumValue }));
  }
  form_props.description = fieldData.description
  if (fieldData.type === 'integer' || fieldData.type === 'number') {
    form_props.min = fieldData.minimum;
    form_props.max = fieldData.maximum;
    form_props.step = fieldData.type === 'integer' ? 1 : 0.01;
    // console.log(form_props)
  }
  // if(fieldData.format && fieldData.format === 'uri'){
  //   form_props['file-list'] = fieldData.default || []
  // }

  // console.log(form_props)

  return form_props;
}
function initializeForm() {
  props.fields.forEach(([fieldName, fieldData]: any) => {
    form[fieldName] = fieldData.default === undefined && fieldData.type === 'string' ? '' : fieldData.default === undefined && fieldData.type === 'number' ? 0 : fieldData.default; // 设置默认值

    // if (fieldData.type === 'string' && fieldData.format === 'uri' && fieldData.default) {
    //   form[fieldName] = [{
    //     uid: '-1',
    //     name: fieldData.default,
    //     status: 'done',
    //     url: fieldData.default,
    //     response: fieldData.default,
    //   }]
    // } else {
    //   form[fieldName] = fieldData.default === undefined && fieldData.type === 'string' ? '' : fieldData.default === undefined && fieldData.type === 'number' ? 0 : fieldData.default; // 设置默认值
    // }
  });
}
function isJSONString(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}
function handleSubmit() {
  console.log(form)
  props.submitFunc(form)
}
</script>

<style lang="scss" scoped>
.ant-form-item .ant-form-item-label>label {
  font-family: Open Sans, Open Sans;
  font-weight: bold;
  font-size: .83vw;
  color: #FFFFFF;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.ant-form-item-control {
  border: none;
  box-shadow: none;
}

.ant-form-item-control:focus-within {
  box-shadow: none;
  border: none;
}

.ant-input-status-error:not(.ant-input-disabled):not(.ant-input-borderless).ant-input {
  border: none;
  box-shadow: none;
}

.ant-input {
  background-color: #343434;
  color: #fff;
  border: none;
  outline: none;
  padding: .63vw;

  font-family: Open Sans, Open Sans;
  font-weight: 400;
  font-size: .83vw;
  color: #D5D5D5;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.ant-input-number {
  background-color: #343434;
  color: #fff;
  border: none;
  outline: none;

  font-family: Open Sans, Open Sans;
  font-weight: 400;
  font-size: .83vw;
  color: #D5D5D5;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.ant-input-number-input-wrap,
.ant-input-number .ant-input-number-input {
  height: 2.19vw;
}

.ant-input::placeholder,
.ant-input-number::placeholder {
  color: #D5D5D5;
}

.ant-input:focus,
.ant-input:hover,
.ant-input-number:focus,
.ant-input-number:hover {
  background-color: #343434;
  border: none;
  box-shadow: none;
}


.ant-btn-dashed,
.ant-btn-default,
.ant-select {
  background-color: #343434;
  color: #D5D5D5;
}

.ant-select {
  padding: .63vw;
}

.ant-select .ant-select-selector {
  border: 0;
}

.ant-select:not(.ant-select-disabled):not(.ant-select-customize-input):not(.ant-pagination-size-changer):hover .ant-select-selector {
  border: 0;
  color: #D5D5D5;
}

.ant-select-focused:where(.css-dev-only-do-not-override-124lni8).ant-select:not(.ant-select-disabled):not(.ant-select-customize-input):not(.ant-pagination-size-changer) .ant-select-selector {
  box-shadow: none;
  color: #D5D5D5;
}

.ant-select-single .ant-select-selector {
  border: none;
  color: #D5D5D5;
}

.ant-btn-primary {
  box-shadow: none;
  border: none;
}

.ant-upload-text {
  color: #fff;
  font-size: .83vw;
}



.ant-upload-wrapper.ant-upload-picture-card-wrapper .ant-upload.ant-upload-select,
.ant-upload-wrapper .ant-upload-drag {
  background-color: #343434;
  border: none;
}

.ant-upload-wrapper .ant-upload-drag {
  width: 17.29vw;
  height: 17.29vw;
  overflow: hidden;
}

.upload-button {
  color: #fff;
  width: 100%;
}
</style>