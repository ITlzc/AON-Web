<template>
    <a-spin :spinning="spinning" size="large">
        <div class="playground_built">
            <a-row class='built_top'>
                <a-col :span="16" class="built_top_left">
                    <div class="built_top_left">
                        <div>
                            <span class='model_name'>{{ reactiveData.dataArr?.name }}</span>
                        </div>
                        <div class='tags'>

                            <span v-for="(item, index) in reactiveData.dataArr.tags" class='tag' :key="index">{{ item
                                }}</span>
                            <!-- <span class='tag'>image to image</span>
                        <span class='tag'>Stable Diffusion XL</span>  -->
                            <!-- <span class='tag'>{{ reactiveData.dataArr?.access_status === 1 ? "Public" : "Private" }}</span> -->
                            <span class='tag'>Public</span>
                            <span class='tag'>＄{{ reactiveData.dataArr?.price }}/{{ reactiveData.dataArr?.unit }}</span>
                            <span class='tag'>{{ reactiveData.dataArr?.runs_count }} Runs</span>
                            <span class='tag'>Exec Time: {{ reactiveData.dataArr?.estimat_exe_time_show }} </span>
                            <span class='tag'>Start-up Time: 0 ~ {{ reactiveData.dataArr?.start_up_time_show }} </span>
                        </div>
                    </div>
                </a-col>

                <a-col :span="8">
                    <div class="built_top_right">
                        <a-select @select="handleChangeExample" v-model:value="reactiveData.currentExample">
                            <a-select-option v-for="option in reactiveData.exampleOptions" :key="option.value"
                                :value="option.value">{{ option.label }}</a-select-option>
                        </a-select>
                        <div class="collect" @click="handleCollect(reactiveData.isCollect)">
                            <img v-if="!reactiveData.isCollect" src="../assets/images/modelMarket/collect2.png" alt="">
                            <img v-else src="../assets/images/modelMarket/collected.png" alt="">
                            <span>{{ !reactiveData.isCollect ? 'Collect' : 'Cancel Collect' }}</span>
                        </div>
                    </div>
                </a-col>
            </a-row>

            <div class="built_content">
                <div class="con_left_form">
                    <a-spin :spinning="loading" size="large">
                        <DynamicForm v-if="reactiveData.dataArr?.form?.components?.schemas"
                            :price="reactiveData.dataArr?.price || 10"
                            :fields="Object.entries(reactiveData.dataArr?.form?.components?.schemas.Input.properties)"
                            :schemas="reactiveData.dataArr?.form?.components?.schemas" :submitFunc="handleCreate" />
                    </a-spin>
                </div>
                <div class="con_right_result">
                    <div class="result_head">
                        <p>Output</p>
                        <div class="icons">
                            <!-- <img src="../assets/images/modelMarket/share.png" alt=""> -->
                            <img class="cursor-pointer" @click="handleDownload"
                                src="../assets/images/modelMarket/download.png" alt="">
                        </div>
                    </div>
                    <div class="result_con_box">
                        <div className="generating" v-if="loading && !res_error">
                            <img src="../assets/images/loading.gif" alt="" />
                            <p v-if="countDown >= 1">ETA: {{ remainingHours.toString().padStart(2, '0') }}:{{
        remainingMinutes.toString().padStart(2, '0') }}:{{
        remainingSeconds.toString().padStart(2, '0') }}</p>
                            <p v-else>Accelerating generation...</p>
                        </div>

                        <div v-if="!loading && res_error" className="error_text">
                            <pre>{{ isJSONString(res_error) ? JSON.parse(res_error) : res_error }}</pre>
                        </div>

                        <div class="noTypeOrNoPublish"
                            v-if="!loading && !res_error && (!currentModelItem.type || reactiveData.publishStatus === 0)">
                            <pre>{{ res_error || JSON.parse(JSON.stringify(reactiveData.res_output)) }}</pre>
                        </div>

                        <div class="imgCon"
                            v-if="!loading && !res_error && (currentModelItem.type === 1 || currentModelItem.type === 6 || currentModelItem.type === 8)">
                            <div className="more_img"
                                v-if="Array.isArray(reactiveData.resCon) && reactiveData.resCon.length > 1">
                                <div className="more_img_large">
                                    <img className="img_large"
                                        :src="currentLargeImg ? currentLargeImg : reactiveData.resCon[0]" alt=""
                                        srcset="" />
                                </div>
                                <div className="more_img_item">
                                    <div class="img_item" v-for="(item, index) in reactiveData.resCon"
                                        @click="() => currentLargeImg = item" :key="index">
                                        <img loading="lazy" className="resImg" alt='' :src="item" />
                                        <div v-if="currentLargeImg !== item" class="overlay"></div>
                                    </div>

                                </div>
                            </div>
                            <img v-else-if="reactiveData.resCon" loading="lazy" className="resImg" alt=''
                                :src="reactiveData.resCon" />
                            <img v-else loading="lazy" className="resImg" alt='' src="../assets/images/loading.png" />
                        </div>

                        <div className="textToText" v-if="!loading && !res_error && (currentModelItem.type === 2)">
                            <div className="sender">{{ reactiveData.textareaVal }}</div>
                            <div className="res_message">
                                {{ reactiveData.resCon && Array.isArray(reactiveData.resCon) && reactiveData.resCon.join('') || reactiveData.resCon }}
                            </div>
                        </div>

                        <div className="textToText imgToText"
                            v-if="!loading && !res_error && (currentModelItem.type === 4 || currentModelItem.type === 7 || currentModelItem.type === 11)">
                            <div className="res_message">
                                {{ Array.isArray(reactiveData.resCon) && reactiveData.resCon.length > 0 &&
        reactiveData.resCon[0] }}
                            </div>
                        </div>
                        <div className="textToMedia textToVideo"
                            v-if="!loading && !res_error && (currentModelItem.type === 3 || currentModelItem.type === 5 || currentModelItem.type === 9)">
                            <video ref="videoPlayer" controls preload="auto">
                                <source
                                    :src="Array.isArray(reactiveData.resCon) && reactiveData.resCon.length > 0 ? reactiveData.resCon[0] : reactiveData.resCon" />
                                Your browser does not support the video tag.
                            </video>
                        </div>

                        <div className="textToMedia"
                            v-if="!loading && !res_error && (currentModelItem.type === 10 && reactiveData.resCon)">
                            <AudioComponents
                                :audioSrc="Array.isArray(reactiveData.resCon) && reactiveData.resCon.length > 0 && reactiveData.resCon[0].filename ? reactiveData.resCon[0].filename : reactiveData.resCon" />
                        </div>
                    </div>
                </div>

                <div class="result_apiKeyOrCodes">
                    <div class="bottom_codes">
                        <div class="code">
                            <!-- <a-tabs :activeKey="activeCodeTab" @change="(key: string) => activeCodeTab = key">
                            <a-tab-pane v-for="(item, index) in codeTabItems" :key="item.key"
                                :tab="item.label"></a-tab-pane>
                        </a-tabs> -->

                            <div class="code_head">
                                <p>JS Code</p>
                                <div class="cursor-pointer" @click="handleCopy(codes?.javascript_sdk_show)">
                                    <img src="../assets/images/modelMarket/copy.png" alt="">
                                    <span>Copy Code</span>
                                </div>
                            </div>

                            <div class="tab_con relative">
                                <!-- <div v-if="activeCodeTab === 'JavaScript'">
                                    <pre>{{ codes?.javascript_show }}</pre>
                                </div> -->
                                <div>
                                    <pre>{{ codes?.javascript_sdk_show }}</pre>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </a-spin>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// import { getApiKeys, getModelById, collect } from '../utils/http_apis'
// @ts-ignore
import { model } from '../lib/data_source.js'
import { message } from 'ant-design-vue';

// @ts-ignore
import { AI, User } from 'aonweb'
//@ts-ignore
import { checkSession, collect, collect_cancel, is_collect, getUser } from '../lib/data_source.js'

import DynamicForm from '../components/DynamicForm.vue';
import AudioComponents from '../components/AudioComponents.vue'
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import emitter from '../utils/eventBus'

const aonet = new AI({
    app_key: '3337ea1b-3db5-43c5-8628-7399aab6fca9',
    is_async: true,
})

const user_ = new User()

const route = useRoute();
const router = useRouter();

const codeTabItems = ref([
    {
        key: 'Python',
        label: 'Python-H'
    },
    {
        key: 'Python-SDK',
        label: 'Python-S'
    },
    {
        key: 'JavaScript',
        label: 'JS-H'
    },
    {
        key: 'JavaScript-SDK',
        label: 'JS-S'
    },
    {
        key: 'HTTP',
        label: 'HTTP'
    }
])
const activeCodeTab = ref('JavaScript')

const reactiveData: any = reactive({
    exampleOptions: {},
    textareaVal: '',
    resCon: {},
    fileList: [],
    dataArr: {},
    activeModelType: 1,
    publishStatus: 1,
    runCount: '',
    isCollect: false,
    res_output: null,
    currentExample: {}
})
const res_apiKey: any = ref('')
const codes: any = ref('')
const spinning = ref(false)
const submitLoading = ref(false)
const currentModelItem: any = ref({})
const currentLargeImg = ref('')
const userId = ref('')
const countDown = ref(60)
const remainingHours = ref(0)
const remainingMinutes = ref(0)
const remainingSeconds = ref(0)
const loading = ref(false)
const res_error = ref('')
const pollingInterval: any = ref(null)
const timing: any = ref(null)


const videoPlayer: any = ref(null);
let player = null;

let js_sdk_code = `import { AI, User } from 'aonweb'
async function Generate() {
    const options = {
        //Please replace with your own app_key.
        app_key: $APP_KEY,
        is_async: true,
    }
    const aonet = new AI(options)
    const user_ = new User()
    let user = await user_.islogin()

    if (!user) {
        user = await user_.login()
    }

    let params = {}
    params[$MODEL_NAME] = $MODEL_FORM_PARAMS
    let res = await aonet.prediction([$MODEL_NAME], { ...params })
    if (res.code === 200 && res.data) {
        let taskId = res.data.task_id
        let timing = setInterval(async () => {
            try {
                let res = await aonet.task(taskId)
                console.log(res)
                if (res.code === 200 && res.data) {
                    res = res.data
                    if (res.status !== 0) {
                        clearInterval(timing)
                    }
                    if (res.status == 3 || res.status == 4) {
                        let msg = (res.error && res.error) || 'Operation timed out'
                        throw new Error(msg)
                    }

                    if (res.status == 2) {
                        console.log('create successfully, result:',res.result)
                        return res.result
                    }
                }
                if (res.code === 201) {
                    clearInterval(timing)
                    throw new Error(res.message)
                }
            } catch (error) {
                console.log(error)
                if (timing) {
                    clearInterval(timing)
                }
            }
        }, 1000)
    }
    if (res.code === 201) {
        throw new Error(res.message)
    }
}

Generate()
`

watch(activeCodeTab, (newVal) => {
    console.log('activeCodeTab:', newVal);
});

const handleCopy = (e: string) => {
    navigator.clipboard.writeText(e)
        .then(() => {
            message.success('Copied');
        })
        .catch(() => {
            message.error('Copied Failed');
        });
};

async function dealCode(example: any, formData: any,) {
    const modelName = reactiveData.dataArr?.name
    let exampleCode: any = {}

    let js_sdk = js_sdk_code
    exampleCode.javascript_sdk_show = js_sdk
    let input_params = ''
    if (example && example.input) {
        input_params = isJSONString(example.input) ? example.input : JSON.stringify(example.input, null, 6)
    } else if (formData) {
        input_params = isJSONString(formData) ? formData : JSON.stringify(formData, null, 6)
    }


    if (js_sdk && js_sdk.length) {
        exampleCode.javascript_sdk_show = exampleCode.javascript_sdk_show.replace(/\$MODEL_NAME/g, `'${modelName}'`)
        exampleCode.javascript_sdk_show = exampleCode.javascript_sdk_show.replace("$MODEL_FORM_PARAMS", input_params)

    }
    codes.value = exampleCode
}

function isJSONString(str: string) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

async function handleChangeExample(value: any) {
    res_error.value = ''
    const current_example = reactiveData.exampleOptions[value - 1]
    let input = reactiveData.exampleOptions[value - 1].input
    if (input && !isJSONString(input)) input = JSON.stringify(input, null, 6)
    if (input.includes('https://replicate.delivery') || input.includes('https://pbxt.replicate.delivery')) {
        input = input.replace(/https:\/\/replicate\.delivery|https:\/\/pbxt\.replicate\.delivery/g, 'https://delivery.iaon.ai')
    }
    input = isJSONString(input) ? JSON.parse(input) : input


    let resProperties = reactiveData.dataArr.form.components.schemas.Input
    let output = reactiveData.exampleOptions[value - 1].output

    if (output && !isJSONString(output)) output = JSON.stringify(output, null, 2)
    if (output.includes('https://replicate.delivery') || output.includes('https://pbxt.replicate.delivery')) {
        output = output.replace(/https:\/\/replicate\.delivery|https:\/\/pbxt\.replicate\.delivery/g, 'https://delivery.iaon.ai')
    }
    output = isJSONString(output) ? JSON.parse(output) : output

    if (Array.isArray(output) && output.length > 0) {
        currentLargeImg.value = output[0]
    }
    reactiveData.resCon = output
    if (!currentModelItem.type || reactiveData.publishStatus === 0) {
        reactiveData.res_output = reactiveData.resCon
    }
    const initialValues_ = Object.fromEntries(
        Object.entries(resProperties).map(([fieldName, fieldData]: any) => [
            fieldName,
            fieldData.default,
        ])
    );
    console.log(initialValues_, input)
    const initialValues = { ...initialValues_, ...input }

    Object.entries(reactiveData.dataArr.form.components.schemas.Input.properties).map(([fieldName, fieldData]: any) => {
        if (fieldData.type === 'string' && fieldData.format === 'uri') {
            console.log(initialValues[fieldName])
            let fileList: any = []
            if (Array.isArray(initialValues[fieldName]) && initialValues[fieldName].length > 0) {
                fileList = [...initialValues[fieldName]]
                console.log(fileList)

                // [{ uid: -id, url: res.preview_images, response: res.preview_images, name: res.preview_images.split('/').pop(), status: 'done' }]
                fileList = fileList.map((file: any, index: any) => {
                    if (!file.url.includes('https://replicate.delivery')) {
                        return {
                            uid: -index,
                            name: file.url.split('/').pop(),
                            status: 'done',
                            url: file.url,
                            response: file.url,
                        }
                    }
                })
            } else {
                fileList = initialValues[fieldName] && initialValues[fieldName].includes('https://replicate.delivery') ? [{
                    uid: '-1',
                    name: initialValues[fieldName],
                    status: 'done',
                    url: initialValues[fieldName],
                    response: initialValues[fieldName],
                }] : []
            }
            reactiveData.dataArr.form.components.schemas.Input.properties[fieldName] = { ...fieldData, default: fileList }
        }
        reactiveData.dataArr.form.components.schemas.Input.properties[fieldName].default = initialValues[fieldName]
    })

    dealCode(current_example, '')
}

async function handleCollect(type: number) {
    console.log(type, userId.value)
    try {
        let session = await checkSession()
        if (!session) {
            router.push('/login?redirectFrom=/developer-portal')
            return
        }
        let res
        if (!type) {
            res = await collect(currentModelItem.value.id, userId.value)
        } else {
            res = await collect_cancel(currentModelItem.value.id, userId.value)
        }

        if (res && Array.isArray(res)) {
            reactiveData.isCollect = res.length
            queryIsCollect()
        }
    } catch (error) {
        console.log(error)
        message.error('Collect Failed')
    }
}

async function queryIsCollect() {
    try {
        const isCollect = await is_collect(route.params.id, userId.value)
        if (isCollect && Array.isArray(isCollect)) {
            reactiveData.isCollect = isCollect.length
        }
    } catch (error) {
        throw error
    }
}

async function fetchData() {
    try {
        spinning.value = true
        await queryIsCollect()
        const data: any = await model(route.params.name)
        console.log(data)
        if (data && data.length) {
            const resData = data[0]
            currentModelItem.value = resData
            let example: any = null
            if (resData && resData.examples && resData.examples.length) {
                // let options = []
                let options = resData.examples && resData.examples.length > 0 && resData.examples.map((item: any, index: number) => {
                    item.value = index + 1
                    item.label = 'Example-' + Number(index + 1)
                    return item
                })
                reactiveData.exampleOptions = options
                example = resData.examples[0]
                if (example && example.input) {
                    let input: any = isJSONString(example.input) ? JSON.parse(example.input) : example.input
                    reactiveData.textareaVal = input.prompt
                }
                if (example && example.output && example.output.length) {
                    if (!isJSONString(example.output)) example.output = JSON.stringify(example.output, null, 2)
                    if (example.output.includes('https://replicate.delivery') || example.output.includes('https://pbxt.replicate.delivery')) {
                        example.output = example.output.replace(/https:\/\/replicate\.delivery|https:\/\/pbxt\.replicate\.delivery/g, 'https://delivery.iaon.ai')
                    }
                    let output: any = isJSONString(example.output) ? JSON.parse(example.output) : example.output
                    console.log(output)
                    reactiveData.resCon = output
                    if (Array.isArray(output) && output.length > 0) {
                        currentLargeImg.value = output[0]
                    }

                    if (output.audio_files) {
                        console.log(example.output.audio_files)
                        reactiveData.resCon = output.audio_files
                    }

                    if (!currentModelItem.type || reactiveData.publishStatus === 0) {
                        reactiveData.resCon = output
                    }
                }

            }
            if (resData.form) {
                let resProperties = resData.form.components.schemas.Input.properties
                let exampleOutput = reactiveData.resCon
                reactiveData.res_output = exampleOutput
                const sortedProperties = Object.entries(resProperties).sort(
                    ([, a]: any, [, b]: any) => (a['x-order'] || 0) - (b['x-order'] || 0)
                );
                const initialValues_ = Object.fromEntries(
                    Object.entries(resProperties).map(([fieldName, fieldData]: any) => [
                        fieldName,
                        fieldData.default,
                    ])
                );
                let input = {}
                if (example && example.input) {
                    if (!isJSONString(example.input)) example.input = JSON.stringify(example.input, null, 6)
                    if (example.input.includes('https://replicate.delivery') || example.input.includes('https://pbxt.replicate.delivery')) {
                        example.input = example.input.replace(/https:\/\/replicate\.delivery|https:\/\/pbxt\.replicate\.delivery/g, 'https://delivery.iaon.ai')
                    }
                    input = isJSONString(example.input) ? JSON.parse(example.input) : example.input
                }
                const initialValues = { ...initialValues_, ...input }

                resData.form.components.schemas.Input.properties = Object.fromEntries(sortedProperties);
                Object.entries(resData.form.components.schemas.Input.properties).map(([fieldName, fieldData]: any) => {
                    if (fieldData.type === 'string' && fieldData.format === 'uri') {
                        let fileList: any = []
                        if (Array.isArray(initialValues[fieldName]) && initialValues[fieldName].length > 0) {
                            fileList = [...initialValues[fieldName]]
                            console.log(fileList)

                            // [{ uid: -id, url: res.preview_images, response: res.preview_images, name: res.preview_images.split('/').pop(), status: 'done' }]
                            fileList = fileList.map((file: any, index: any) => {
                                if (file.url.includes('https://replicate.delivery')) {
                                    return {
                                        uid: -index,
                                        name: file.url.split('/').pop(),
                                        status: 'done',
                                        url: file.url,
                                        response: file.url,
                                    }
                                }
                            })
                        } else {
                            let fileObj: any = {}
                            fileList = initialValues[fieldName] && initialValues[fieldName].includes('https://replicate.delivery') ? [{
                                uid: '-1',
                                name: initialValues[fieldName],
                                status: 'done',
                                url: initialValues[fieldName],
                                response: initialValues[fieldName],
                            }] : []
                        }

                        console.log(initialValues[fieldName], fieldData)

                        resData.form.components.schemas.Input.properties[fieldName] = { ...fieldData, default: fileList }
                    }
                    resData.form.components.schemas.Input.properties[fieldName].default = initialValues[fieldName]
                })
            }

            let estimatExeTime = resData.estimat_exe_time ? resData.estimat_exe_time : 60
            let estimat_exe_time_show = estimatExeTime + ' s'
            if (estimatExeTime > 60) {
                let temp = estimatExeTime / 60
                estimat_exe_time_show = Math.round(temp * 10) / 10 + ' m'
            }

            if (estimatExeTime >= 360) {
                let temp = estimatExeTime / 360
                estimat_exe_time_show = Math.round(temp * 10) / 10 + ' h'
            }

            if (estimatExeTime >= 86400) {
                let temp = estimatExeTime / 86400
                estimat_exe_time_show = Math.round(temp * 10) / 10 + ' day'
            }
            resData.estimat_exe_time_show = estimat_exe_time_show

            let startUpTime = resData.start_up_time ? resData.start_up_time : 60
            let start_up_time_show = startUpTime + ' s'
            if (startUpTime > 60) {
                let temp = startUpTime / 60
                start_up_time_show = Math.round(temp * 10) / 10 + ' m'
            }

            if (startUpTime >= 360) {
                let temp = startUpTime / 360
                start_up_time_show = Math.round(temp * 10) / 10 + ' h'
            }

            if (startUpTime >= 86400) {
                let temp = startUpTime / 86400
                start_up_time_show = Math.round(temp * 10) / 10 + ' day'
            }
            resData.start_up_time_show = start_up_time_show

            if (resData.price) {
                resData.price = resData.price ? resData.price / 1000000 : 0
            }

            console.log("fetchData", resData)
            reactiveData.publishStatus = resData.publish_status
            reactiveData.activeModelType = resData.type
            reactiveData.currentExample = example
            reactiveData.dataArr = resData

            const count = parseInt(resData.run_count)
            let temp = resData.run_count
            if (count >= 1000) {
                temp = count / 1000 + 'K'
            }
            if (count >= 1000000) {
                temp = count / 1000000 + 'M'
            }

            if (count >= 1000000000) {
                temp = count / 1000000000 + 'B'
            }

            if (count >= 1000000000000) {
                temp = count / 1000000000000 + 'T'
            }
            reactiveData.runCount = temp

            dealCode(example, resData)
        }


    } catch (error: any) {
        console.log(error)
        message.error(error.message);
        spinning.value = false
    } finally {
        spinning.value = false
    }
}
function getFileExtension(url: string) {
    // 创建一个 URL 对象
    const urlObj = new URL(url);
    // 获取路径部分
    const pathname = urlObj.pathname;
    // 提取文件名
    const filename: any = pathname.split('/').pop();
    // 提取文件后缀
    const extension = filename.split('.').pop();

    // 如果没有后缀名，返回空字符串
    if (filename === extension) {
        return '';
    }

    return extension;
}
async function handleDownload() {
    if (loading.value || res_error.value) {
        return
    }
    try {
        let downloadUrl = reactiveData.resCon
        // Fetch the image as a blob

        if (currentModelItem.value.type === 10) {
            downloadUrl = Array.isArray(reactiveData.resCon) && reactiveData.resCon.length > 0 && reactiveData.resCon[0].filename ? reactiveData.resCon[0].filename : reactiveData.resCon
        }
        if (currentLargeImg.value) {
            downloadUrl = currentLargeImg.value
        }
        console.log(downloadUrl)
        const response = await fetch(downloadUrl);
        const blob = await response.blob();

        // Create a link element and set the URL using the blob
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const extension = getFileExtension(downloadUrl);
        link.download = 'downloaded-file.' + extension; // 设置下载的文件名

        // Append the link to the body and click it to trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up by removing the link element
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error downloading the image:', error);
    }
}

async function getResult(taskId: string) {
    pollingInterval.value = setInterval(async () => {
        try {
            let res = await aonet.task(taskId)
            console.log(res)
            if (res.code === 200 && res.data) {
                res = res.data
                if (res.status == 3 || res.status == 4) {
                    let msg = (res.error && res.error) || 'Operation timed out'
                    res_error.value = res.error
                    throw new Error(msg)
                }

                if (res.status == 1 || res.status == 2) {
                    if (res.result && !isJSONString(res.result)) res.result = JSON.stringify(res.result, null, 2)
                    if (res.result.includes('https://replicate.delivery') || res.result.includes('https://pbxt.replicate.delivery')) {
                        res.result = res.result.replace(/https:\/\/replicate\.delivery|https:\/\/pbxt\.replicate\.delivery/g, 'https://delivery.iaon.ai')
                    }
                    res.result = isJSONString(res.result) ? JSON.parse(res.result) : res.result
                    if (Array.isArray(res.result) && res.result.length > 0) {
                        currentLargeImg.value = res.result[0]
                    }
                    if (res && res.result && res.result.audio_files) {
                        reactiveData.resCon = res.result.audio_files
                        return
                    }
                    reactiveData.resCon = res.result
                    if (!currentModelItem.type || reactiveData.publishStatus === 0) {
                        reactiveData.res_output = JSON.stringify({ result: res.result }, null, 2)
                    }
                }

                if (res.status !== 0) {
                    loading.value = false
                    remainingHours.value = 0
                    remainingMinutes.value = 0
                    remainingSeconds.value = 0
                    emitter.emit('getBalance')
                    if (timing.value) {
                        clearInterval(timing.value)
                    }
                    if (pollingInterval.value) {
                        clearInterval(pollingInterval.value)
                    }
                }
            }
            if (res.code === 201) {
                loading.value = false
                res_error.value = res.message
                remainingHours.value = 0
                remainingMinutes.value = 0
                remainingSeconds.value = 0
                emitter.emit('getBalance')
                if (timing.value) {
                    clearInterval(timing.value)
                }
                if (pollingInterval.value) {
                    clearInterval(pollingInterval.value)
                }
                throw new Error(res.message)
            }
        } catch (error: any) {
            console.log(error)
            res_error.value = error.message || 'Processing failed'
            loading.value = false
            remainingHours.value = 0
            remainingMinutes.value = 0
            remainingSeconds.value = 0
            emitter.emit('getBalance')
            if (timing.value) {
                clearInterval(timing.value)
            }
            if (pollingInterval.value) {
                clearInterval(pollingInterval.value)
            }
        } finally {
        }
    }, 1000)

}

async function handleCreate(formParams: any) {
    console.log({ ...formParams })
    res_error.value = ''
    let session = await checkSession()
    let user = await user_.islogin()
    console.log(session, user)
    if (!session) {
        router.push('/login?redirectFrom=/playground/' + route.params.name)
        return
    }
    const model: any = currentModelItem.value

    dealCode('', formParams)

    // await aonet.start_task(['modelName'], 'modelName', 'modelName', {...inputParams}, price, userId?)
    // if (model.publish_status === 0) {
    //     message.error('Model is not publish yet')
    //     return
    // }

    try {
        console.log(model.name, userId.value)
        loading.value = true

        let estimat_exe_time = model.estimat_exe_time || 60
        let start_up_time = model.start_up_time || 60
        let count = Number(estimat_exe_time) + Number(start_up_time)
        countDown.value = count
        timing.value = setInterval(() => {
            const hours = Math.floor(count / 3600);
            const minutes = Math.floor((count % 3600) / 60);
            const seconds = count % 60;
            remainingHours.value = hours
            remainingMinutes.value = minutes
            remainingSeconds.value = seconds
            count -= 1;
            countDown.value = count
            if (count === 0) {
                clearInterval(timing.value)
                remainingHours.value = 0
                remainingMinutes.value = 0
                remainingSeconds.value = 0
            }
        }, 1000)

        let params: any = {}
        params[model.name] = { ...formParams }
        let res = await aonet.prediction([model.name], { ...params })
        console.log(res)
        if (res.code === 200 && res.data) {
            let taskId = res.data.task_id
            getResult(taskId)
        }
        if (res.code === 201) {
            res_error.value = res.message
            throw new Error(res.message)
        }
    } catch (error: any) {
        message.error(error.message)
        res_error.value = error.message || 'Operation timed out'

        loading.value = false
        remainingHours.value = 0
        remainingMinutes.value = 0
        remainingSeconds.value = 0
        if (timing.value) {
            clearInterval(timing.value)
        }
        emitter.emit('getBalance')
        console.log(error.message)
    } finally {

    }
}


onMounted(() => {
    getUser().then((userInfo: any) => {
        userId.value = userInfo.id
    })
    fetchData()

    // nextTick(() => {
    //     console.log(videoPlayer.value)
    //     if (videoPlayer.value && (currentModelItem.value.type == 3 || currentModelItem.value.type === 5 || currentModelItem.value.type === 9)) {
    //         try {
    //             player = videojs(videoPlayer.value, {
    //                 autoplay: true,
    //                 controls: true,
    //                 preload: 'auto',
    //                 playsinline: true,
    //                 'x5-playsinline': true
    //             });
    //         } catch (error) {

    //         }
    //     }
    // })
})

onUnmounted(() => {
    if (pollingInterval.value) {
        clearInterval(pollingInterval.value)
    }

    if (timing.value) {
        clearInterval(timing.value)
    }
})

</script>

<style lang="scss">
.playground_built {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 5vw);
    padding-top: 5vw;

    .built_top {
        padding: 0 3.33vw;
        padding-top: 1.25vw;

        .built_top_left {
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            .model_name {
                font-size: 2.08vw;
                font-family: 'Open Sans', sans-serif;
                font-weight: bold;
                color: #FFFFFF;
            }

            .tags {
                margin-top: .83vw;

                .tag {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: #333333;
                    border-radius: 2px;
                    padding: .21vw;
                    font-size: .63vw;
                    font-family: 'Open Sans', sans-serif;
                    font-weight: 600;
                    color: #FFFFFF;
                    margin-right: .42vw;
                }
            }
        }

        .built_top_right {
            height: 100%;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;

            .collect {
                height: 2.5vw;
                background: #121514;
                border: 1px solid #686868;
                border-radius: 41.67vw;
                padding: .63vw 1.04vw;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;

                img {
                    height: 1.25vw;
                    width: 1.25vw;
                    margin-right: .42vw;
                }

                span {
                    font-family: Open Sans, Open Sans;
                    font-weight: bold;
                    font-size: .83vw;
                    color: #FFFFFF;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                }
            }

            .ant-select {
                height: 2.5vw !important;
                width: 11.19vw;
                margin-right: 1.25vw;
            }

            .ant-select-selector .ant-select-selection-search-input {
                height: 100%;
            }

            .ant-select-single .ant-select-selector .ant-select-selection-item,
            .ant-select-single .ant-select-selector .ant-select-selection-placeholder {
                line-height: 2.5vw;
            }

            .ant-select-selector {
                height: 100%;
                background: #121514;
                border-radius: 41.67vw;
                border: 1px solid #686868;
            }

            .ant-select-single .ant-select-selector {
                font-size: .83vw;
                padding: 0;
                font-family: 'Open Sans', sans-serif;
                font-weight: 600;
                color: #fff;
            }

            .ant-select .ant-select-selection-item {
                font-weight: 500;
                flex-grow: 0.8,
            }

            .ant-select .ant-select-arrow {
                inset-inline-end: 1.04vw;
                font-size: .73vw;
            }

            .ant-select-single.ant-select-show-arrow .ant-select-selection-item,
            .ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder {
                padding: 0 .94vw;
                text-align: left;
            }

            .ant-select-dropdown .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
                color: #fff !important;
            }

            button {
                width: auto;
                height: 2.08vw;
                font-size: .83vw;
                font-family: 'Open Sans', sans-serif;
                font-weight: 600;
                border-radius: 1.67vw;
                background-color: #fff;
                color: #722ED1;
                padding: 0 .94vw;
            }
        }

        .tabs {
            margin-top: 1.67vw;
            height: 3.75vw;

            .ant-tabs-top>.ant-tabs-nav::before,
            .ant-tabs-bottom>.ant-tabs-nav::before,
            .ant-tabs-top>div>.ant-tabs-nav::before,
            .ant-tabs-bottom>div>.ant-tabs-nav::before {
                display: none !important;
            }

            .ant-tabs>.ant-tabs-nav .ant-tabs-nav-list {
                // width: 100%;
                justify-content: space-between;
                background-color: #17171A;
                background-image: url('../../assets/images/playground/top_tabsBorderBg.png');
                background-size: 100% 100%;
                background-repeat: no-repeat;
                padding: .21vw .42vw;
                margin-bottom: .26vw;
            }

            .ant-tabs-top>.ant-tabs-nav {
                margin: 0;
            }

            .ant-tabs .ant-tabs-tab {
                font-size: 1.04vw;
                font-family: 'Open Sans', sans-serif;
                font-weight: 400;
                padding: .21vw .83vw .31vw;
                color: #FFFFFF;
            }

            .ant-tabs .ant-tabs-tab:hover {
                // color: #722ED1;
            }

            .ant-tabs .ant-tabs-tab.ant-tabs-tab-active {
                padding-left: .83vw;
                padding-right: .83vw;
                background-color: #484848;
            }

            .ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
                color: #FFFFFF;
            }

            .ant-tabs .ant-tabs-ink-bar {
                background-color: transparent;
            }
        }
    }

    .built_content {
        display: flex;
        flex-direction: row;
        justify-content: center;
        padding: 1.67vw;

        .con_left_form {
            width: 23.33vw;
            background-color: #1A1A1A;
            position: relative;


            .form_top_con {
                height: 28.96vw;
                padding: 1.25vw;
                // padding-bottom: 3.65vw;
                overflow-y: scroll;
                background-color: #1A1A1A;

                .ant-form-item .ant-form-item-label>label {
                    font-size: .83vw;
                    font-family: 'Open Sans', sans-serif;
                    font-weight: 700;
                    color: #FFFFFF;
                }

                .ant-input {
                    border-radius: 2px;
                    min-height: 2.19vw;
                    border: none;
                    background-color: #343434;
                }

                .ant-form-item-control-input-content textarea {
                    height: auto;
                }

                .ant-select {
                    min-height: 2.19vw;
                    padding: 0.63vw 0;
                }

                .ant-select-focused.ant-select:not(.ant-select-disabled):not(.ant-select-customize-input):not(.ant-pagination-size-changer) .ant-select-selector {
                    box-shadow: none !important;
                }

                .ant-select-outlined:not(.ant-select-disabled):not(.ant-select-customize-input):not(.ant-pagination-size-changer):hover .ant-select-selector,
                .ant-select-outlined:not(.ant-select-customize-input) .ant-select-selector,
                .ant-input-outlined {
                    border: none;
                    background: #484848;
                }

                .ant-select .ant-select-selection-item {
                    text-align: left;
                }

                .ant-select-outlined:not(.ant-select-customize-input) .ant-select-selector,
                .ant-input-affix-wrapper {
                    border-radius: 2px;
                }

                .ant-select-single .ant-select-selector {
                    font-size: .83vw;
                    font-family: 'Open Sans', sans-serif;
                }

                .ant-select .ant-select-selection-item {
                    font-weight: 400;
                }


                .ant-select-single.ant-select-show-arrow .ant-select-selection-item,
                .ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder {
                    padding: 0 .42vw;
                    text-align: left;
                }

                .ant-select-focused .ant-select-outlined:not(.ant-select-disabled):not(.ant-select-customize-input):not(.ant-pagination-size-changer) .ant-select-selector {
                    box-shadow: none;
                }

                .ant-select-single .ant-select-selector,
                .ant-select .ant-select-arrow {
                    color: #fff;
                    outline: none;
                    border: none;
                }

                .ant-input {
                    font-size: .83vw;
                    font-family: 'Open Sans', sans-serif;
                    font-weight: 400;
                    color: #FFFFFF;
                }


                .ant-input-number {
                    min-height: 2.19vw;
                    width: 4.48vw;
                    font-size: .83vw;
                    font-family: 'Open Sans', sans-serif;
                    font-weight: 400;
                    color: #FFFFFF;
                }

                .ant-col-6 {
                    text-align: left;
                }

                .ant-input-number-outlined {
                    border: none;
                    background: #484848;
                    color: #FFFFFF;
                }


                .ant-input-number .ant-input-number-input {
                    font-size: .83vw;
                    line-height: 2.19vw;
                    padding-block: 0;
                    color: #FFFFFF;
                }

                .ant-upload {
                    width: 100%;
                }

                .ant-upload-wrapper .ant-upload-drag {
                    border: none;
                    background-color: #484848;
                }

                .ant-upload-wrapper .ant-upload-drag p.ant-upload-drag-icon .anticon {
                    color: #fff;
                }

                .ant-upload-wrapper .ant-upload-list .ant-upload-list-item .ant-upload-icon .anticon {
                    color: #FFFFFF;
                }

                .ant-upload-list-item {
                    color: #FFFFFF;
                }

                .ant-upload-list-item a:hover {
                    color: #722ed1;
                }


                .ant-upload-wrapper .ant-upload-drag .ant-upload-drag-container {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                }

                .ant-upload-wrapper .ant-upload-drag p.ant-upload-drag-icon {
                    margin: 0;
                    margin-right: .42vw;
                }

                .ant-upload-wrapper .ant-upload-drag p.ant-upload-drag-icon .anticon {
                    font-size: .94vw;
                }

                .ant-upload-wrapper .ant-upload-drag p.ant-upload-text {
                    font-size: .83vw;
                    color: #FFFFFF;
                }

                .ant-slider .ant-slider-rail {
                    background-color: #484848;
                    border: 1px solid #484848;
                    height: .42vw;
                    border-radius: .26vw;
                }

                .ant-slider .ant-slider-track {
                    background: linear-gradient(196deg, #5CDBD3 0%, #722ED1 100%);
                    ;
                    border-radius: .26vw;
                    height: .42vw;
                }

                .ant-slider-horizontal .ant-slider-step {
                    height: .42vw;
                }

                .ant-slider .ant-slider-handle::after {
                    box-shadow: 0 0 0 2px rgba(81, 255, 189, 1);
                }

                .ant-slider-horizontal .ant-slider-handle {
                    inset-block-start: .16vw;
                }

                .ant-checkbox .ant-checkbox-inner {
                    height: .83vw;
                    width: .83vw;
                }

                .ant-checkbox-wrapper {
                    font-family: 'Open Sans', sans-serif;
                    font-size: .83vw;
                    color: #FFFFFF;
                }
            }

            .form_bottom_btn {
                height: 5vw;
                padding: 1.25vw;
                width: 100%;
                z-index: 10;
                background: #1A1A1A;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                margin-top: 1.25vw;

                .ant-form-item {
                    margin: 0;
                }

                .mount {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    padding: .42vw;
                    background-color: #343434;
                    border-radius: .21vw;
                    min-width: 6.25vw;

                    img {
                        width: 1.67vw;
                        height: 1.67vw;
                    }

                    p {
                        margin: 0;
                        margin-left: .21vw;
                        font-family: Open Sans, Open Sans;
                        font-weight: 600;
                        font-size: 1.04vw;
                        color: #FFFFFF;
                        text-align: center;
                        font-style: normal;
                        text-transform: none;
                        white-space: nowrap;
                    }
                }



                .ant-btn {
                    margin-left: 1.25vw;
                    font-family: Open Sans, Open Sans;
                    font-weight: 800;
                    font-size: 1.04vw;
                    color: #121514;
                    text-align: center;
                    font-style: normal;
                    text-transform: none;

                    min-width: 11.67vw;
                    height: 2.5vw;
                    background: linear-gradient(180deg, #20F5BB 0%, #2F54EB 100%);
                    border-radius: .21vw;
                }
            }

            .upload-button {
                color: #fff;
                width: 100%;
                height: 2.5vw;
                background: #343434;
                border-radius: .21vw;
                border: none;
                text-align: left;
            }

            .ant-switch {
                background: #343434;
            }

            .ant-switch.ant-switch-checked {
                background: #00b96b;
            }
        }

        .con_right_result {
            width: 37.5vw;
            margin-left: 1.67vw;
            background-color: #1A1A1A;
            // padding: 0 1.25vw;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;

            .result_head {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                padding: 1.25vw;
                height: 3.75vw;

                p {
                    font-family: Open Sans, Open Sans;
                    font-weight: bold;
                    font-size: .83vw;
                    color: #FFFFFF;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                    margin: 0;
                }

                &>div {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                    align-items: center;

                    img {
                        width: 1.25vw;
                        height: 1.25vw;
                        margin-left: 1.25vw;
                    }
                }
            }

            .result_con_box {
                height: 31.46vw;
                max-width: 37.5vw;
                background: #343434;
                overflow: scroll;

                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: relative;
                padding: 1.25vw;

                .noTypeOrNoPublish {
                    height: 100%;
                    width: 100%;
                    overflow: scroll;

                    p {
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        flex-wrap: wrap;
                        align-items: center;
                        max-width: 37.5vw;
                        font-size: 1.25vw;
                        color: #fff;
                        margin: 0;
                    }

                    pre {
                        height: 100%;
                        color: rgb(46, 180, 171);
                        margin: 0;
                    }

                }

                .imgCon {
                    height: 100%;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;

                    .resImg {
                        height: 100%;
                        width: auto;
                        object-fit: contain;
                    }
                }

                .generating {
                    img {
                        width: auto;
                        height: 18.04vw;
                    }

                    p {
                        font-size: 1.25vw;
                        font-weight: 800;
                        text-align: center;
                        color: #ffffff;
                    }
                }

                .error_text {
                    height: 100%;
                    width: 100%;
                    overflow: scroll;

                    pre {
                        height: 100%;
                        color: rgb(46, 180, 171);
                        margin: 0;
                    }
                }

                .textToText {
                    height: 100%;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: flex-start;
                    padding-bottom: .52vw;
                    overflow: scroll;

                    border-radius: 6px;


                    .sender {
                        width: 100%;
                        min-height: 2.5vw;
                        background: #484848;
                        border-radius: 6px;
                        padding: .52vw .83vw .68vw;


                        font-size: 1.04vw;
                        font-family: 'Open Sans', sans-serif;
                        font-weight: 400;
                        text-align: left;
                        color: #bfbfbf;
                        margin-bottom: .73vw;
                    }

                    .res_message {
                        width: 100%;
                        height: auto;
                        margin-bottom: .73vw;
                        background: #484848;
                        border-radius: 6px;
                        padding: .52vw .83vw .68vw;

                        font-size: 1.04vw;
                        font-family: 'Open Sans', sans-serif;
                        font-weight: 400;
                        text-align: left;
                        color: #bfbfbf;
                        line-height: 1.88vw;
                    }

                }

                .imgToText {
                    height: 100%;
                    width: 100%;
                }

                .textToMedia {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-around;
                    width: 100%;
                    height: 100%;

                    audio {
                        width: 100%;
                        /* 设置播放器宽度为100% */
                        background-color: transparent;
                    }


                    .playIcon {
                        .handleBtn {
                            height: 2.08vw;
                            width: 2.08vw;
                            margin: 0;
                        }
                    }

                    .process {
                        width: 22.71vw;
                        position: relative;

                        .process_null {
                            position: absolute;
                            top: 50%;
                            left: 0;
                            width: 100%;
                            height: .21vw;
                            background: #ffffff;
                        }
                    }

                    .times {
                        font-size: 1.04vw;
                        font-family: 'Open Sans', sans-serif;
                        font-weight: 400;
                        text-align: left;
                        color: #ffffff;
                    }
                }

                .textToVideo {
                    width: 100%;
                    // height: 19.58vw;
                    height: 100%;
                    border: none;

                    .video-react {
                        padding: 0 !important;
                        height: 100%;
                        width: 100%;
                        background-color: transparent;

                        .video-react-big-play-button {

                            height: 1.98vw;
                            width: 1.98vw;
                            background-color: #fff;
                            line-height: 1.98vw;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            border-radius: 50%;
                            color: #000;

                        }

                        .video-react-control-bar {
                            bottom: -1.82vw;
                            background-color: rgba(8, 8, 8, 0.5);
                            border-radius: .78vw;
                            align-items: center;
                        }

                        .video-react-slider {
                            background-color: #e5e7eb;
                        }

                        .video-react-time-control {
                            display: flex;
                            align-items: center;
                            line-height: normal;
                            font-size: .73vw;
                        }
                    }

                    video {
                        height: 100%;
                        width: 100%;
                        outline: none;
                    }
                }

                .resImg {
                    max-height: 100%;
                    max-width: 100%;
                }

                .more_img {
                    height: 100%;
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: row;
                    justify-content: center;
                    gap: 1.04vw;
                    -webkit-gap: 1.04vw;
                    overflow: scroll;

                    .more_img_large {
                        height: 19.69vw;
                        max-width: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        .img_large {
                            // max-height: 24.38vw;
                            height: 100%;
                            max-width: 100%;
                            width: auto;
                        }


                    }

                    .more_img_item {
                        width: 100%;
                        overflow: scroll;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-around;
                        gap: .83vw;
                        -webkit-gap: .83vw;
                        // margin: 0 2.6vw;

                        .img_item {
                            position: relative;

                            img {
                                height: 7.6vw;
                                width: auto;
                                max-width: 7.6vw;
                                border-radius: 2px;
                                cursor: pointer;
                                // transform-origin: left top;
                                transition: transform 0.3s ease;
                            }

                            img:hover {
                                transform: scale(1.1);
                            }

                            .overlay {
                                background-color: rgb(57, 60, 74);
                                opacity: 0.8;
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                transition: opacity 0.3s ease;
                                cursor: pointer;
                            }

                            .overlay:hover {
                                opacity: 0;
                            }
                        }


                    }
                }

            }
        }

        .result_apiKeyOrCodes {
            display: flex;
            flex-direction: column;
            width: 29.79vw;
            margin-left: 1.25vw;
            background-color: #1A1A1A;

            .itemLabel {
                font-size: .83vw;
                font-family: 'Open Sans', sans-serif;
                font-weight: 700;
                color: #fff;

                display: flex;
                flex-direction: row;
                justify-content: space-between;

                span {
                    text-align: left;
                }

                img {
                    height: 1.25vw;
                    width: 1.25vw;
                }
            }

            .top_apikey {
                width: 100%;

                .apikey_con {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    margin-top: .42vw;
                    background-color: #484848;
                    padding: .89vw .83vw;

                    font-size: .83vw;
                    font-family: 'Open Sans', sans-serif;
                    font-weight: 400;
                    color: #fff;

                    .apikey_text {
                        display: inline-block;
                        max-width: 100%;
                        overflow: scroll;
                    }

                    .toLogin {
                        font-size: .83vw;
                        font-family: 'Open Sans', sans-serif;
                        font-weight: 400;
                        text-decoration: underline;
                        text-align: left;
                        color: #fff;
                        line-height: 1.35vw;
                    }

                    img {
                        height: 1.25vw;
                        width: 1.25vw;
                    }
                }
            }

            .bottom_codes {
                // margin-top: 1.25vw;

                .code_head {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    padding: 1.25vw;
                    height: 3.75vw;

                    p {
                        font-family: Open Sans, Open Sans;
                        font-weight: bold;
                        font-size: .83vw;
                        color: #FFFFFF;
                        text-align: left;
                        font-style: normal;
                        text-transform: none;
                        margin: 0;
                    }

                    &>div {
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-end;
                        align-items: center;

                        img {
                            width: 1.25vw;
                            height: 1.25vw;
                            margin-right: 0.25vw;
                        }

                        span {
                            font-family: Open Sans, Open Sans;
                            font-weight: 400;
                            font-size: .83vw;
                            color: #51FFBD;
                            text-align: left;
                            font-style: normal;
                            text-decoration-line: underline;
                            text-transform: none;
                        }
                    }
                }

                .code {
                    // border: 1px solid #f5f5f5;
                    // margin-top: .78vw;

                    .ant-tabs-nav {
                        background-color: #1A1A1A;
                    }

                    .ant-tabs-top>.ant-tabs-nav::before,
                    .ant-tabs-bottom>.ant-tabs-nav::before,
                    .ant-tabs-top>div>.ant-tabs-nav::before,
                    .ant-tabs-bottom>div>.ant-tabs-nav::before {
                        display: none !important;
                    }

                    .ant-tabs-nav-more {
                        display: none;
                    }

                    .ant-tabs>.ant-tabs-nav .ant-tabs-nav-list {
                        height: 3.75vw;
                        width: 100%;
                        justify-content: space-between;
                        background-color: #1A1A1A;
                        background-image: url('../../assets/images/playground/tabsBorderBg.png');
                        background-size: 100% 100%;
                        background-repeat: no-repeat;
                        // padding: .21vw .42vw;
                        // margin-bottom: .26vw;
                    }

                    .ant-tabs .ant-tabs-tab {
                        font-size: .83vw;
                        font-family: 'Open Sans', sans-serif;
                        font-weight: 400;
                        color: #fff;
                        padding: .31vw 1.15vw .42vw;
                    }

                    .ant-tabs .ant-tabs-tab+.ant-tabs-tab {
                        margin: 0;
                    }

                    // .ant-tabs .ant-tabs-tab:hover{
                    //     color: #722ED1;
                    // }

                    .ant-tabs .ant-tabs-tab.ant-tabs-tab-active {
                        background-color: #484848;
                    }

                    .ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
                        color: #FFFFFF;
                    }

                    .ant-tabs .ant-tabs-ink-bar {
                        background-color: transparent;
                    }

                    // .ant-tabs >.ant-tabs-nav .ant-tabs-nav-list{
                    //     width: 100%;
                    //     justify-content: space-around;
                    // }

                    .ant-tabs-top>.ant-tabs-nav {
                        margin: 0;
                    }

                    .tab_con {
                        height: 31.46vw;
                        background-color: #343434;
                        padding-right: 1.25vw;

                        div {
                            height: 100%;
                            overflow: scroll;


                            pre {
                                height: 100%;
                                padding: 1.25vw;
                                color: rgba(46, 180, 171, 1);
                            }
                        }
                    }
                }


            }
        }
    }
}

code,
code span {
    color: #fff !important;
    text-shadow: none !important;
}
</style>
