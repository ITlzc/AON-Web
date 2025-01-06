<template>
    <div class="input-slider">
        <a-input v-model:value="inputValue" @change="handleInputChange" style="width: 4.17vw; margin-right: .52vw;" />
        <a-slider style="width: 13.85vw;" v-model:value="sliderValue" :min="min" :max="max" :step="step" @change="handleSliderChange" />
    </div>
</template>

<script setup>
import { ref, watch, toRefs } from 'vue';

const props = defineProps({
    modelValue: {
        type: [String, Number],
        // required: true,
    },
    min: {
        type: Number,
        default: 0,
    },
    max: {
        type: Number,
        default: 10000,
    },
    step: {
        type: Number,
        default: 1,
    },
});

const { modelValue, min, max, step } = toRefs(props);
const emit = defineEmits(['update:modelValue']);

const inputValue = ref(modelValue.value);
const sliderValue = ref(modelValue.value);

watch(modelValue, (newValue) => {
    inputValue.value = newValue;
    sliderValue.value = newValue;
});

function handleInputChange(e) {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
        emit('update:modelValue', value);
    }
}

function handleSliderChange(value) {
    emit('update:modelValue', value);
}
</script>

<style scoped>
.input-slider {
    display: flex;
    align-items: center;
}
</style>