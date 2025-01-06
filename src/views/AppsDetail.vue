<template>
    <div class="page flex-col">
        <div class="box_2 flex-col">
            <span class="text_4">APP Information</span>
            <div class="box_3 flex-row justify-between">
                <div class="box_4 flex-row">
                    <img class="image_1" v-if="res_data.detail.cover" referrerpolicy="no-referrer" :src="res_data.detail.cover" />
                    <img class="image_1" v-else referrerpolicy="no-referrer" src="../assets/images/app-cover.png" />
                    <div class="image-text_1 flex-row justify-between">
                        <img class="image_2" referrerpolicy="no-referrer" v-if="res_data.detail.icon" :src="res_data.detail.icon" />
                        <div class="text-group_1 flex-col">
                            <span class="text_5">{{ res_data.detail.title }}</span>
                            <span class="paragraph_1">{{ res_data.detail.description }}<br /></span>
                        </div>
                    </div>
                </div>
                <div class="box_5 flex-row">
                    <div class="image-text_2 flex-col justify-between">
                        <canvas class="qrcode-canvas" height="14.85vw" width="14.85vw" ref="canvasRef"></canvas>
                        <span class="text-group_2">Scan QR code for use</span>
                    </div>
                </div>
            </div>
            <span class="text_6">Application Preview</span>
            <div class="image-wrapper_1 flex-row">
                <img class="image_4"
                    v-if="Array.isArray(res_data.detail.preview_images) && res_data.detail.preview_images.length"
                    referrerpolicy="no-referrer" :src="item" v-for="(item, index) in res_data.detail.preview_images"
                    :key="index" />
                <img class="image_4" v-else-if="res_data.detail.preview_images && res_data.detail.preview_images !== 'None'" referrerpolicy="no-referrer" :src="res_data.detail.preview_images" />

            </div>
            <span class="text_7">Application Description</span>
            <p class="paragraph_2">{{ res_data.detail.description }}</p>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { updateApp, updateAppVersion, upload_app_resource, my_apps_byId, my_apps_version_byId } from '../lib/data_source.js'
import QRCode from 'qrcode';

const router = useRouter();
const route = useRoute();
const canvasRef = ref('');
const res_data = reactive({
    detail: {}
})


const generateQRCode = (data, canvas) => {
    data && QRCode.toCanvas(canvas, data, (error) => {
        if (error) console.error(error);
    });
};
async function getItemById(id) {
    my_apps_byId(id).then(res => {
        console.log(res)
        const isRes = res && res.length > 0
        res_data.detail = isRes ? res[0] : {}
        const code_url = `https://${res[0].name && res[0].name || ''}.aonmesh.ai`
        console.log(code_url)
        generateQRCode(code_url, canvasRef.value)
    })
}

onMounted(() => {
    nextTick(() => {
        if (route.params.id) {
            getItemById(route.params.id)
        }
    })
})
</script>
<style lang="scss" scoped>
.page {
    background-color: rgba(16, 16, 20, 1);
    position: relative;
    width: 100vw;
    overflow: hidden;

    .box_2 {
        width: 100vw;
        margin-bottom: 0.06vw;

        .text_4 {
            width: 62.92vw;
            height: 2.92vw;
            overflow-wrap: break-word;
            color: rgba(255, 255, 255, 1);
            font-size: 2.08vw;
            font-family: 'Open Sans', sans-serif;
            font-weight: 800;
            text-align: left;
            white-space: nowrap;
            line-height: 2.82vw;
            margin: 2.08vw 0 0 18.54vw;
        }

        .box_3 {
            width: 62.92vw;
            height: 19.59vw;
            margin: 1.66vw 0 0 18.54vw;

            .box_4 {
                background-color: rgba(52, 52, 52, 1);
                border-radius: 24px;
                width: 41.25vw;
                height: 19.59vw;
                border: 1px solid rgba(112, 112, 112, 1);

                .image_1 {
                    width: 17.09vw;
                    height: 17.09vw;
                    margin: 1.25vw 0 0 1.25vw;
                    border-radius: .63vw;
                }

                .image-text_1 {
                    width: 17.71vw;
                    height: 3.75vw;
                    margin: 14.58vw 3.95vw 0 1.25vw;

                    .image_2 {
                        width: 3.75vw;
                        height: 3.75vw;
                        border-radius: 8px;
                    }

                    .text-group_1 {
                        width: 13.55vw;
                        height: 3.75vw;

                        .text_5 {
                            width: 13.55vw;
                            height: 1.46vw;
                            overflow-wrap: break-word;
                            color: rgba(255, 255, 255, 1);
                            font-size: 1.04vw;
                            font-family: 'Open Sans', sans-serif;
                            font-weight: 700;
                            text-align: left;
                            line-height: 1.41vw;

                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 1;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }

                        .paragraph_1 {
                            width: 13.55vw;
                            overflow-wrap: break-word;
                            color: rgba(213, 213, 213, 1);
                            font-size: 0.62vw;
                            font-family: 'Open Sans', sans-serif;
                            font-weight: normal;
                            text-align: left;
                            line-height: 0.84vw;
                            margin-top: 0.21vw;

                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                }
            }

            .box_5 {
                background-color: rgba(52, 52, 52, 1);
                border-radius: 24px;
                width: 19.59vw;
                height: 19.59vw;
                border: 1px solid rgba(112, 112, 112, 1);

                .image-text_2 {
                    width: 14.85vw;
                    height: 17.09vw;
                    margin: 1.25vw 0 0 2.39vw;

                    .qrcode-canvas {
                        width: 14.85vw !important;
                        height: 14.8vw !important;
                        border-radius: .63vw;
                    }

                    .text-group_2 {
                        width: 10vw;
                        height: 1.25vw;
                        overflow-wrap: break-word;
                        color: rgba(255, 255, 255, 1);
                        font-size: 0.83vw;
                        font-family: 'Open Sans', sans-serif;
                        font-weight: 600;
                        text-align: center;
                        white-space: nowrap;
                        line-height: 1.15vw;
                        margin: 1.04vw 0 0 2.39vw;
                    }
                }
            }
        }

        .text_6 {
            width: 62.92vw;
            height: 2.92vw;
            overflow-wrap: break-word;
            color: rgba(255, 255, 255, 1);
            font-size: 2.08vw;
            font-family: 'Open Sans', sans-serif;
            font-weight: 800;
            text-align: left;
            white-space: nowrap;
            line-height: 2.82vw;
            margin: 3.33vw 0 0 18.54vw;
        }

        .image-wrapper_1 {
            width: 62.92vw;
            justify-content: flex-start;
            margin: 1.66vw 0 0 18.54vw;

            .image_4 {
                width: 19.59vw;
                height: 38.34vw;
                margin-right: 2.09vw;
                box-shadow: .83vw .83vw 1.25vw 0px rgba(255,255,255,0.102);
                border-radius: 1.25vw;
                border: 1px solid #605F5F;
            }
        }

        .text_7 {
            width: 62.92vw;
            height: 2.92vw;
            overflow-wrap: break-word;
            color: rgba(255, 255, 255, 1);
            font-size: 2.08vw;
            font-family: 'Open Sans', sans-serif;
            font-weight: 800;
            text-align: left;
            white-space: nowrap;
            line-height: 2.82vw;
            margin: 3.33vw 0 0 18.54vw;
        }

        .paragraph_2 {
            width: 62.92vw;
            overflow-wrap: break-word;
            color: rgba(213, 213, 213, 1);
            font-size: 0.93vw;
            font-family: 'Open Sans', sans-serif;
            font-weight: normal;
            text-align: left;
            line-height: 1.31vw;
            margin: 3.33vw 0 3.64vw 18.54vw;
        }
    }
}
</style>