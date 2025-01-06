<template>
    <div className="playIcon" @click="onPlayPause">
        <img v-if="!isPlaying" class="handleBtn" src="../assets/images/play-fill.png" alt="" />
        <img v-else class="handleBtn" src="../assets/images/pause.png" alt="" />
    </div>
    <div className="times">{{ formatTime(currentTime) }}</div>
    <div className="process">
        <div ref="containerRef"></div>
        <div v-if="!durationTime" className="process_null"></div>
    </div>
    <div className="times">{{ formatTime(durationTime) }}</div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import WaveSurfer from 'wavesurfer.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'

const props = defineProps({
    audioSrc: {
        type: [String, Object],
        required: true
    }
})

watch(() => props.audioSrc, (newVal, oldVal) => {
    // 时间回到开始
    wavesurfer.seekTo(0)
    // 加载新的音频
    wavesurfer.load(newVal)
})

console.log(props.audioSrc)

const containerRef = ref(null)
const isPlaying = ref(false)
const durationTime = ref(0)
const currentTime = ref(0)
let wavesurfer

const formatTime = (seconds) => [seconds / 60, seconds % 60].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':')

onMounted(() => {
    wavesurfer = WaveSurfer.create({
        container: containerRef.value,
        waveColor: '#722ED1',
        // progressColor: '#5CDBD3',
        progressColor: '#fff',
        url: props.audioSrc,
    })

    // Play on click
    wavesurfer.on('interaction', () => {
        wavesurfer.play()
    })

    // Rewind to the beginning on finished playing
    wavesurfer.on('finish', () => {
        wavesurfer.setTime(0)
    })

    wavesurfer.on('decode', (duration) => {
        console.log('Decode', duration + 's')
        durationTime.value = duration
    })

    wavesurfer.on('play', () => {
        console.log('Play')
        isPlaying.value = true
    })

    wavesurfer.on('pause', () => {
        console.log('Pause')
        isPlaying.value = false
    })

    wavesurfer.on('timeupdate', (currentT) => {
        currentTime.value = currentT
    })
    console.log(wavesurfer)
})

const onPlayPause = () => {
    wavesurfer.playPause()
}

</script>