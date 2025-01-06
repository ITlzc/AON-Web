<template>
  <a-input
    :value="modelValue"
    :placeholder="description"
    @input="handleInput"
  />
</template>

<script setup>
const props = defineProps({
  modelValue: [String, Number],
  description: String,
});

const emit = defineEmits(['update:modelValue']);

function handleInput(event) {
  emit('update:modelValue', event.target.value);
}
</script>
