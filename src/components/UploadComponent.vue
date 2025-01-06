<template>
  <!-- <a-input :value="modelValue" :placeholder="description" @input="handleInput" /> -->

  <a-upload v-model:file-list="fileList" :before-upload="beforeUpload" :max-count="1" :custom-request="customRequest"
    list-type="text">
    <a-button class="upload-button">
      <plus-outlined />
      Drop a file or click here to upload
    </a-button>
  </a-upload>
</template>

<script setup>
import { ref, watch } from 'vue';
import { upload_app_resource } from '../lib/data_source.js'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { v4 as uuidv4 } from 'uuid';

const props = defineProps({
  modelValue: [String, Array],
});

const fileList = ref(props.modelValue)

console.log(props.modelValue, fileList.value)

watch(props, (newProps) => {
  console.log(newProps)
  if (newProps) {
    fileList.value = newProps.modelValue && Array.isArray(newProps.modelValue) ? newProps.modelValue : newProps.modelValue && typeof newProps.modelValue === 'string' ? [{
      uid: -1,
      name: newProps.modelValue.split('/').pop(),
      status: 'done',
      url: newProps.modelValue,
      response: newProps.modelValue,
    }] : [];
  }

});


const beforeUpload = (file) => {
  // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
  //   if (!isJpgOrPng) {
  //       message.error('You can only upload JPG/PNG file!');
  //   }
  const isLt30M = file.size / 1024 / 1024 < 30;
  if (!isLt30M) {
    message.error('Image must smaller than 30MB!');
  }
  return isLt30M;
};
const customRequest = async (options) => {
  const { file, onSuccess, onError } = options;
  console.log(file)

  try {
    const uuid = uuidv4().substring(0, 8);
    let data = await upload_app_resource(`model/${uuid + file.name}`, file)
    console.log(data)
    if (data && !data.error) {
      onSuccess(data);
      handleChange(data)
    } else {
      onError(data);
    }
  } catch (error) {
    console.log(error)
    onError(error);
  }
};

const emit = defineEmits(['update:modelValue']);

function handleChange(data) {
  emit('update:modelValue', data);
}
</script>
