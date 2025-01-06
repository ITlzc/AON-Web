<template>
  <a-switch v-model:checked="innerValue" ></a-switch>
</template>

<script setup>
import { ref, watch, toRefs } from 'vue';

const props = defineProps({
  modelValue: [Boolean],
});

const { modelValue } = toRefs(props);

const emit = defineEmits(['update:modelValue']);
const innerValue = ref(modelValue.value);

watch(modelValue, (newValue) => {
  innerValue.value = newValue;
});

function handleChange(value) {
  emit('update:modelValue', value);
}
</script>