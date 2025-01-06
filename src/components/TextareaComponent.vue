<template>
  <a-textarea
    :value="modelValue"
    :placeholder="description"
    @input="handleInput"
  ></a-textarea>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  description: String,
});

const emit = defineEmits(['update:modelValue']);

function handleInput(event) {
  emit('update:modelValue', event.target.value);
}
</script>
