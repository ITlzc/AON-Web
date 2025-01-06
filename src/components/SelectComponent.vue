<template>
  <a-select @select="handleChange" v-model:value="innerValue" >
    <a-select-option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</a-select-option>
  </a-select>
</template>

<script setup>
import { ref, watch, toRefs } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  description: String,

  options: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue']);
const innerValue = ref(props.modelValue);

watch(props, (newProps) => {
  innerValue.value = newProps.modelValue;
});

function handleChange(value) {
  emit('update:modelValue', value);
}
</script>