<template>
    <div class="uploadMyApp">
        <div class="container">
            <p class="itemTit">Create Your Agent</p>

            <!-- 说明区块移到上方 -->
            <div class="info-section">
                <a-flex justify="center" class="info-card">
                    <img src="../assets/images/developerCenter/uploadIcon.png" alt="">
                    <p>If you encounter any problems during the development process, you can refer to the <a
                            href="https://docs.aonnet.io" target="_blank">Agent Development Guide</a></p>
                </a-flex>
            </div>

            <!-- 编辑区域居中 -->
            <div class="edit-section">
                <a-spin :spinning="spinning" size="large">
                    <div class="form-container">
                        <a-form ref="formRef" :model="formState" name="upload_app" layout="vertical"
                            @finish="handleSubmit" @finishFailed="onFinishFailed" :rules="rules">
                            <a-form-item name="name" label="Agent Name (Will Be Used As Subdomain)"
                                :rules="[{ max: 32, required: true, message: 'Please input your agent name (max 32 characters)' }]">
                                <a-input v-model:value="formState.name" placeholder="Names within 32 characters"
                                    :maxlength=32 />
                            </a-form-item>

                            <a-form-item name="title" label="Agent Title"
                                :rules="[{ required: true, message: 'Please input your agent title' }]">
                                <a-input v-model:value="formState.title"
                                    placeholder="Please input your agent title" />
                            </a-form-item>

                            <a-form-item name="icon" label="Agent Icon">
                                <a-upload v-model:file-list="formState.icon" :max-count="1"
                                    :before-upload="beforeUpload_appIcon" accept="image/png, image/jpeg, image/jpg"
                                    :custom-request="customRequest" list-type="picture-card">
                                    <div style="color: #fff;">
                                        <plus-outlined></plus-outlined>
                                        <div class="ant-upload-text">Upload</div>
                                    </div>
                                </a-upload>
                                <div class="ant-upload-text">512 x 512 Pixel Size, Less Than 5M, PNG Format</div>
                            </a-form-item>

                            <a-form-item name="cover" label="Agent Cover">
                                <a-upload v-model:file-list="formState.cover" :max-count="1"
                                    :before-upload="beforeUpload_appIcon" accept="image/png, image/jpeg, image/jpg"
                                    :custom-request="customRequest_cover" list-type="picture-card">
                                    <div style="color: #fff;">
                                        <plus-outlined></plus-outlined>
                                        <div class="ant-upload-text">Upload</div>
                                    </div>
                                </a-upload>
                                <div class="ant-upload-text">512 x 512 Pixel Size, Less Than 5M, PNG Format</div>
                            </a-form-item>

                            <a-form-item name="description" label="Agent Description"
                                :rules="[{ required: true, max: 200, message: 'Please input your agent description (max 200 characters)' }]">
                                <a-textarea v-model:value="formState.description"
                                    placeholder="Please describe your agent's purpose and capabilities within 200 words"
                                    :maxlength="200" />
                            </a-form-item>

                            <a-form-item name="appType" label="Agent Type" :rules="[{ required: true }]">
                                <a-select v-model:value="formState.appType">
                                    <a-select-option value="image">Image Processing</a-select-option>
                                    <a-select-option value="video">Video Processing</a-select-option>
                                    <a-select-option value="audio">Audio Processing</a-select-option>
                                    <a-select-option value="text">Text Processing</a-select-option>
                                </a-select>
                            </a-form-item>

                            <a-form-item name="appPackage" label="Upload Agent Package"
                                :rules="[{ required: true }]">
                                <a-upload v-model:file-list="formState.appPackage" :before-upload="beforeUpload"
                                    :max-count="1" :custom-request="customRequest_package" list-type="text">
                                    <a-button>
                                        <upload-outlined />
                                        Drop a file or click here to upload
                                    </a-button>
                                </a-upload>
                            </a-form-item>

                            <a-form-item name="appRenderings" label="Agent Screenshots"
                                :rules="[{ required: true }]">
                                <div class="UploadApplicationRenderings">
                                    <a-upload-dragger v-model:file-list="formState.appRenderings"
                                        :before-upload="beforeUpload_appIcon" accept="image/png, image/jpeg, image/jpg"
                                        :custom-request="customRequest_renderings" multiple>
                                        <p class="ant-upload-drag-icon">
                                            <upload-outlined />
                                        </p>
                                        <p>Click or drag screenshots to this area to upload</p>
                                        <p>Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                                            banned files</p>
                                    </a-upload-dragger>
                                </div>
                            </a-form-item>

                            <a-form-item name="short_version" label="Version"
                                :rules="[{ required: true, message: 'Please input version' }]">
                                <a-input v-model:value="formState.short_version" placeholder="1.0.0" />
                            </a-form-item>

                            <a-form-item name="build_version" label="Build Version"
                                :rules="[{ required: true, message: 'Please input build version' }]">
                                <a-input v-model:value="formState.build_version" placeholder="1" />
                            </a-form-item>

                            <a-form-item>
                                <a-button type="primary" html-type="submit" class="confirmUpBtn">Submit</a-button>
                            </a-form-item>
                        </a-form>
                    </div>
                </a-spin>
            </div>
        </div>
    </div>
</template>

<script setup>

import { ref, onMounted, reactive, nextTick } from 'vue';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { v4 as uuidv4 } from 'uuid';
import { updateApp, updateAppVersion, upload_app_resource, my_apps_byId, my_apps_version_byId, check_name_exsit } from '../lib/data_source.js'
import { useRouter, useRoute } from 'vue-router';

const formRef = ref(null);
const router = useRouter()
const route = useRoute()
// 判断对象是否包含user的key

const formState = reactive({
    name: '',
    title: '',
    icon: [],
    cover: [],
    description: '',
    appType: 'image',
    appPackage: [],
    appRenderings: [],

    short_version: '',
    build_version: '',
    app_key: ''
});

const spinning = ref(false)

const fileList = ref([]);
const loading = ref(false);
const appIconUrl = ref('');

const showDevelopmentHelp = ref(false);

const rules = {
    name: [
        { required: true, max: 12, message: 'Please input your agent name (max 32 characters)' }
    ],
    description: [
        { required: true, max: 200, message: 'Please input your agent description (max 200 characters)' }
    ],
    appType: [{ required: true }],
    appPackage: [{ required: true }],
    appAddress: [{ required: true }],
    appRenderings: [{ required: true }]
};

async function getItemById(id) {
    spinning.value = true
    my_apps_byId(id).then(res => {
        res = res && res.length && res[0]
        console.log(res)
        formState.name = res.name
        formState.title = res.title
        formState.description = res.description
        
        formState.appAddress = res.appAddress
        if (res.category) {
            formState.appType = res.category
        }
        if (res.preview_images && Array.isArray(res.preview_images) && res.preview_images.length) {
            formState.appRenderings = res.preview_images.map((item, index) => ({ uid: -index, url: item, response: item, name: item.split('/').pop(), status: 'done', }))
        } else if(res.preview_images && res.preview_images !== 'None') {
            formState.appRenderings = [{ uid: -id, url: res.preview_images, response: res.preview_images, name: res.preview_images.split('/').pop(), status: 'done' }]
        }
        console.log(formState.appRenderings)
        formState.app_key = res.app_key
        res.icon && res.icon.length && (formState.icon = [{ uid: res.app_key, url: res.icon, status: 'done', response: res.icon}])
        res.cover && res.cover.length && (formState.cover = [{ uid: -res.app_key, url: res.cover, status: 'done', response: res.cover}])

        if (res.app_version && res.app_version.length) {
            let app_version_res = res.app_version[0]
            formState.short_version = app_version_res.short_version
            formState.build_version = Number(app_version_res.build_version)
            formState.appPackage = [{ uid: res.app_key, url: app_version_res.package_url, response: app_version_res.package_url, name: app_version_res.package_url.split('/').pop(), status: 'done', }]
        }
        spinning.value = false
    }).catch(err => {
        message.error(err.message);
    })

}

const beforeUpload = (file) => {
    // Implement your file validation logic here
    return true;
};

const beforeUpload_appIcon = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
        message.error('Image must smaller than 5MB!');
    }
    return isJpgOrPng && isLt5M;
};

const customRequest = async (options) => {
    const { file, onSuccess, onError } = options;
    console.log(file)

    try {
        const uuid = uuidv4().substring(0, 8);
        console.log(`appIcon/${uuid}`)
        let data = await upload_app_resource(`appIcon/${uuid}`, file)
        console.log(data)
        file.thumbUrl = data;
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
};

const customRequest_cover = async (options) => {
    const { file, onSuccess, onError } = options;
    console.log(file)
    try {
        const uuid = uuidv4().substring(0, 8);
        console.log(`appCover/${uuid}`)
        let data = await upload_app_resource(`appCover/${uuid}`, file)
        console.log(data)
        file.thumbUrl = data;
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
};

const customRequest_package = async (options) => {
    const { file, onSuccess, onError } = options;
    console.log(file)

    try {
        const uuid = uuidv4().substring(0, 8);
        console.log(`package/${uuid}`)
        let data = await upload_app_resource(`package/${uuid}`, file, 'app_package')
        console.log(data)
        if (data && !data.error) {
            onSuccess(data);
        } else {
            onError(data);
        }
    } catch (error) {
        onError(error);
    }
};

const customRequest_renderings = async (options) => {
    const { file, onSuccess, onError } = options;
    console.log(file)

    try {
        const uuid = uuidv4().substring(0, 8);
        console.log(`renderings/${uuid}`)
        let data = await upload_app_resource(`renderings/${uuid}`, file)
        console.log(data)
        file.thumbUrl = data;
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
};

function validateSubdomain(subdomain) {
    // 校验是否为空字符串
    if (!subdomain || subdomain.trim() === '') {
        return false;
    }

    // 正则表达式：只能包含字母、数字、连字符，不能以连字符开头或结尾，长度1-63
    const subdomainRegex = /^(?!-)[A-Za-z0-9-]{1,32}(?<!-)$/;

    // 校验子域名是否符合规则
    return subdomainRegex.test(subdomain);
}

const check_name = async (name,app_id) => {
    let app_count = await check_name_exsit(name,app_id)
    if (app_count > 0) {
        return true
    }
    return false
}

const handleSubmit = async () => {
    // Handle form submission logic here
    try {
        console.log(formState, 'formState');
        if (!validateSubdomain(formState.name)) {
            message.error('Invalid name: only letters, numbers, and hyphens. No hyphen at start or end, length 1-32.')
            return
        }
       
        let app_id = route.query.id || props.app_id
        if (await check_name(formState.name,app_id)) {
            message.error('Name is exist')
            return
        }
        spinning.value = true
        showDevelopmentHelp.value = true;
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // 平滑滚动
        });

        const iconUrl = formState.icon && formState.icon.length && formState.icon[0].response
        const coverUrl = formState.cover && formState.cover.length && formState.cover[0].response
        const packageUrl = formState.appPackage && formState.appPackage.length && formState.appPackage[0].response
        const appRenderingsUrl = formState.appRenderings && formState.appRenderings.length && formState.appRenderings.map(item => item.response)

        console.log(iconUrl, coverUrl, packageUrl, appRenderingsUrl.length)
        if(!iconUrl || !coverUrl || !packageUrl || !appRenderingsUrl.length){
            spinning.value = false
            message.error('Please upload all required files')
            return
        }

        let updateApp_params = {
            name: formState.name,
            title: formState.title,
            description: formState.description,
            cover: coverUrl,
            category: formState.appType,
            icon: iconUrl,
            preview_images: appRenderingsUrl
        }
        if (route.query.id) {
            updateApp_params.id = route.query.id
        }
        console.log(updateApp_params, 'formState params')
        let res = await updateApp(updateApp_params)
        console.log(res)
        if (res && res.length) {
            const app_key = res[0].id
            let updateAppVersion_params = {
                package_url: packageUrl,
                short_version: formState.short_version,
                build_version: formState.build_version,
                app_key,
            }

            let res_version = await updateAppVersion(updateAppVersion_params)
            if (res_version && res_version.length) {
                spinning.value = false
                formRef.value?.resetFields();
                router.push('/developer-portal')
            }
        }
    } catch (error) {
        console.log(error)
        spinning.value = false
    }
};

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

onMounted(() => {
    nextTick(() => {
        if (route.query.id) {
            getItemById(route.query.id)
        }
    })
})

</script>

<style lang="scss" scoped>
.uploadMyApp {
    position: relative;
    z-index: 2;
    padding-top: 120px;
    min-height: 100vh;
    width: 100%;
    background: linear-gradient(135deg, #481696 0%, #8F85B8 100%);

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          radial-gradient(circle at 20% 30%, rgba(72, 22, 150, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(232, 225, 245, 0.15) 0%, transparent 50%);
        z-index: -1;
    }

    .container {
        max-width: 1400px;
        width: 96%;
        margin: 0 auto;
        padding: 0 2%;
        position: relative;
        z-index: 2;
    }

    .itemTit {
        font-size: 36px;
        text-align: center;
        margin-bottom: 40px;
        font-weight: bold;
        background: linear-gradient(45deg, #E8E1F5, #FFFFFF);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        line-height: 1.2;
    }

    .info-section {
        margin-bottom: 40px;

        .info-card {
            background: rgba(232, 225, 245, 0.1);
            border: 1px solid rgba(143, 133, 184, 0.3);
            border-radius: 15px;
            padding: 30px;
            backdrop-filter: blur(10px);
            max-width: 800px;
            margin: 0 auto;
            text-align: center;

            img {
                width: 60px;
                height: 60px;
                margin-right: 20px;
            }

            p {
                color: #E8E1F5;
                line-height: 1.6;
                font-size: 16px;
                margin: 0;

                a {
                    color: #51FFBD;
                    text-decoration: none;
                    transition: all 0.3s ease;

                    &:hover {
                        color: #FFFFFF;
                    }
                }
            }
        }
    }

    .edit-section {
        .form-container {
            max-width: 800px;
            margin: 0 auto;
        }

        :deep(.ant-form) {
            background: rgba(232, 225, 245, 0.1);
            border: 1px solid rgba(143, 133, 184, 0.3);
            border-radius: 15px;
            padding: 30px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;

            .ant-form-item {
                margin-bottom: 24px;

                .ant-form-item-label > label {
                    color: #E8E1F5;
                    font-size: 16px;
                }

                .ant-input,
                .ant-select-selector,
                .ant-input-number,
                .ant-picker {
                    background: rgba(232, 225, 245, 0.1);
                    border: 1px solid rgba(143, 133, 184, 0.3);
                    color: #FFFFFF;

                    &:hover,
                    &:focus {
                        border-color: #481696;
                        box-shadow: 0 0 0 2px rgba(72, 22, 150, 0.2);
                    }
                }

                .ant-upload {
                    background: rgba(232, 225, 245, 0.1);
                    border: 1px solid rgba(143, 133, 184, 0.3);
                    color: #E8E1F5;

                    &:hover {
                        border-color: #481696;
                    }

                    .anticon {
                        color: #E8E1F5;
                    }
                }

                .ant-upload-text {
                    color: #E8E1F5;
                    margin-top: 8px;
                    font-size: 14px;
                }
            }
        }
    }

    :deep(.ant-btn) {
        background: linear-gradient(135deg, #481696 0%, #8F85B8 100%);
        border: 1px solid rgba(232, 225, 245, 0.3);
        color: #FFFFFF;
        height: 40px;
        padding: 0 24px;
        border-radius: 8px;
        font-weight: bold;
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(72, 22, 150, 0.3);
            border-color: #E8E1F5;
        }

        &[disabled] {
            background: rgba(232, 225, 245, 0.1);
            color: rgba(232, 225, 245, 0.5);
            border-color: rgba(143, 133, 184, 0.3);
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
    }

    @media (max-width: 768px) {
        padding-top: 80px;

        .container {
            padding: 0 20px;
        }

        .itemTit {
            font-size: 28px;
            margin-bottom: 30px;
        }

        .info-section {
            margin-bottom: 30px;

            .info-card {
                padding: 20px;
                flex-direction: column;
                text-align: center;

                img {
                    width: 50px;
                    height: 50px;
                    margin: 0 0 15px 0;
                }
            }
        }

        .edit-section {
            :deep(.ant-form) {
                padding: 20px;
            }
        }
    }
}
</style>