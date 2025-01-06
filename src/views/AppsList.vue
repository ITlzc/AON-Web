<template>
    <div class="appsList">
        <div class="container">
            <div class="header-section">
                <div class="description">
                    <h1>AI Applications</h1>
                    <p>Discover a diverse collection of AI-powered applications built on AGI Open Network. From image processing to natural language understanding, find the perfect tools for your needs.</p>
                </div>
                <div class="search-bar">
                    <a-input v-model:value="searchQuery" @input="handelSearch" placeholder="Search applications...">
                        <template #prefix>
                            <img class="icon" src="@/assets/images/modelMarket/search.png" alt="">
                        </template>
                    </a-input>
                </div>
            </div>

            <a-spin :spinning="spinning" size="large">
                <div class="apps-grid">
                    <a-flex :justify="'center'" :align="'center'" vertical class="noData"
                        v-if="(!data.allApps || data.allApps.length === 0) && !spinning">
                        <img src="../assets/images/developerCenter/no-data.png" alt="">
                        <p>No applications found</p>
                    </a-flex>
                    <div class="app-card" v-for="(app, index) in data.allApps" :key="app.id" 
                        @mouseenter="mouseFunc(app, index)"
                        @mouseleave="showQrCode = null">
                        <div class="app-image">
                            <img v-if="app.cover" :src="app.cover" alt="App Image" />
                            <img v-else src="../assets/images/app-cover.png" alt="App Image" />
                        </div>
                        <div class="app-info">
                            <div class="app-header">
                                <img class="app-icon" :src="app.icon" alt="" v-if="app.icon">
                                <div class="app-icon" v-else></div>
                                <div class="app-details">
                                    <h3>{{ app.title }}</h3>
                                    <p>{{ app.description }}</p>
                                </div>
                            </div>
                            <div :class="`qr-code ${showQrCode === app.id ? 'show' : ''}`">
                                <canvas class="qrcode-canvas" :ref="el => canvasRefs[index] = el"></canvas>
                                <p class="scan-text">Scan QR Code to Use</p>
                                <button class="info-button" @click="goDetail(app.id)">APP Information</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pagination" v-if="pagination.total > 0 && data.allApps.length > 0">
                    <a-pagination 
                        :current="pagination.current"
                        :total="pagination.total" 
                        :pageSize="pagination.pageSize" 
                        @change="handlePageChange" 
                    />
                </div>
            </a-spin>
        </div>
    </div>
    <footer>
        <div class="container footer_con">
            <div class="footer_left">
                <div class="logo">
                    <img src="@/assets/images/logo.png" alt="" />
                </div>
                <p>{{ $t('foot_foundation') }}</p>
            </div>
            <div class="footer_right">
                <a href="https://discord.gg/XQxfY8xx" target="_blank" rel="noopener noreferrer">
                    <img src="@/assets/images/discord.svg" alt="">
                </a>
                <a href="https://t.me/AGIOpenNetwork" target="_blank" rel="noopener noreferrer">
                    <img src="@/assets/images/foot_tg.png" alt="">
                </a>
                <a href="https://medium.com/@agiopennetwork" target="_blank" rel="noopener noreferrer">
                    <img src="@/assets/images/foot_m.png" alt="">
                </a>
            </div>
        </div>
    </footer>
</template>

<script setup>

import { ref, onMounted, reactive, nextTick } from 'vue';
import QRCode from 'qrcode';
import { apps, categorys, checkSession, apps_total } from '../lib/data_source.js'
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { debounce } from 'lodash';

const route = useRoute()
const router = useRouter()

const activeTab = ref('All');
const activeTabKey = ref('0');
const spinning = ref(false);
const resData = reactive({
    modelList: [],
    categorys: []
})
const showQrCode = ref(null)
const canvasRefs = ref([]);
const data = reactive({
    recommendedApps: [
        // { id: 1, name: 'Feitian-Changeface', image: 'image_url', qrCode: 'qr_code_url' },
        // 添加更多推荐应用
    ],
    allApps: [
        // { id: 2, name: 'Feitian-Changeface', image: 'image_url' },
        // 添加更多应用
    ]
})
const pagination = reactive({
    current: parseInt(route.query.page) || 1,
    pageSize: 20,
    total: 0,
})
const goDetail = (id) => {
    router.push(`/applications-detail/${id}`)
}
const onTabClick = (label, key) => {
    activeTab.value = label;

    activeTab.value = label
    activeTabKey.value = key
    pagination.current = 1
    let filter = key === '0' ? '' : { category: key }
    initData(filter)
};
const debouncedSearch = debounce((filter) => {
    console.log('Searching for:', filter);
    initData(filter)
}, 300);
async function handelSearch(e) {
    let keywords = e.target.value
    pagination.current = 1
    router.push({ query: { page: 1 } });
    let filter = activeTabKey.value === '0' ? { keywords } : { category: activeTabKey.value, keywords }
    debouncedSearch(filter);
}

function handlePageChange(page, pageSize) {
    pagination.current = page;
    pagination.pageSize = pageSize;
    let filter = activeTabKey.value === '0' ? '' : { category: activeTabKey.value }
    router.push({ query: { page: pagination.current } });
    initData(filter)
}

function mouseFunc(item, index) {
    showQrCode.value = item.id
    const code_url = `https://${data.allApps[index] && data.allApps[index].name || ''}.aonmesh.ai`
    console.log(code_url)

    nextTick(() => {
        generateQRCode(code_url, canvasRefs.value[index]);
    });
}

const generateQRCode = (data, canvas) => {
    data && QRCode.toCanvas(canvas, data, (error) => {
        if (error) console.error(error);
    });
};
async function initData(filter) {
    try {
        spinning.value = true
        const allAppsData = await apps(pagination.current, pagination.pageSize, filter)
        data.allApps = allAppsData

        const categoryData = await categorys()
        categoryData.forEach((element) => {
            element.key = element.id
            element.label = element.name
        });
        resData.categorys = categoryData
        resData.categorys.unshift({
            key: "0",
            label: "All",
            id: 0,
            name: "All",
            sort: 0,
        })

        apps_total(filter).then((res) => {
            console.log(res)
            pagination.total = res
        })
    } catch (error) {
        spinning.value = false
        message.error(error.message)
    } finally {
        spinning.value = false
    }
}

onMounted(async () => {
    // let session = await checkSession()
    // if (!session) {
    //     router.push('/login')
    // }
    nextTick(() => {
        initData()
    })
})

</script>

<style lang="scss" scoped>
.appsList {
    min-height: 100vh;
    padding: 20px;
    background: linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95));

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 16px;

        .header-section {
            margin: 60px 0 32px;
            text-align: center;

            .description {
                max-width: 800px;
                margin: 0 auto 32px;
                padding: 0 16px;

                h1 {
                    font-size: clamp(1.5rem, 5vw, 2.5rem);
                    color: #FFFFFF;
                    margin: 0 0 16px;
                    font-weight: 600;
                    background: linear-gradient(45deg, #6528c4, #9e77e0);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                p {
                    font-size: clamp(0.875rem, 3vw, 1.1rem);
                    line-height: 1.6;
                    color: rgba(255, 255, 255, 0.9);
                    margin: 0;
                    font-weight: 400;
                }
            }

            .search-bar {
                max-width: min(600px, 90%);
                margin: 0 auto;

                .ant-input-affix-wrapper {
                    padding: clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px);
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 8px;

                    &:hover, &:focus {
                        border-color: #6366f1;
                    }

                    .ant-input {
                        background: transparent;
                        color: #fff;
                        font-size: clamp(0.875rem, 2.5vw, 1rem);

                        &::placeholder {
                            color: rgba(255, 255, 255, 0.5);
                        }
                    }

                    .icon {
                        width: 20px;
                        height: 20px;
                        opacity: 0.7;
                    }
                }
            }
        }

        .apps-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: clamp(16px, 3vw, 24px);
            margin-top: 32px;
            padding: 0 clamp(8px, 2vw, 16px);

            .app-card {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                overflow: hidden;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.1);
                cursor: pointer;

                &:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                }

                .app-image {
                    width: 100%;
                    height: 200px;
                    overflow: hidden;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        transition: transform 0.3s ease;
                    }
                }

                .app-info {
                    padding: 16px;
                    position: relative;

                    .app-header {
                        display: flex;
                        align-items: center;
                        gap: 12px;

                        .app-icon {
                            width: 48px;
                            height: 48px;
                            border-radius: 12px;
                            background: rgba(255, 255, 255, 0.1);
                            overflow: hidden;

                            img {
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                            }
                        }

                        .app-details {
                            flex: 1;

                            h3 {
                                font-size: 1.1rem;
                                color: #fff;
                                margin: 0 0 4px;
                                font-weight: 600;
                            }

                            p {
                                font-size: 0.9rem;
                                color: rgba(255, 255, 255, 0.7);
                                margin: 0;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                display: -webkit-box;
                                -webkit-line-clamp: 2;
                                -webkit-box-orient: vertical;
                            }
                        }
                    }

                    .qr-code {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.9);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                        padding: 16px;

                        &.show {
                            opacity: 1;
                        }

                        .qrcode-canvas {
                            width: 120px;
                            height: 120px;
                            margin-bottom: 12px;
                        }

                        .scan-text {
                            color: #fff;
                            font-size: 0.9rem;
                            margin: 8px 0;
                        }

                        .info-button {
                            background: #6366f1;
                            color: #fff;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 6px;
                            font-size: 0.9rem;
                            cursor: pointer;
                            transition: background-color 0.3s ease;

                            &:hover {
                                background: #4f46e5;
                            }
                        }
                    }
                }
            }

            .noData {
                grid-column: 1 / -1;
                padding: 48px 0;
                text-align: center;

                img {
                    width: 120px;
                    height: 120px;
                    margin-bottom: 16px;
                    opacity: 0.7;
                }

                p {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 1.1rem;
                    margin: 0;
                }
            }
        }

        .pagination {
            margin: 32px 0;
            display: flex;
            justify-content: center;

            :deep() {
                .ant-pagination-item {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.2);

                    a {
                        color: #fff;
                    }

                    &.ant-pagination-item-active {
                        background: #6366f1;
                        border-color: #6366f1;
                    }
                }

                .ant-pagination-prev,
                .ant-pagination-next {
                    button {
                        background: rgba(255, 255, 255, 0.1);
                        border-color: rgba(255, 255, 255, 0.2);
                        color: #fff;

                        &:hover {
                            border-color: #6366f1;
                        }
                    }
                }
            }
        }
    }
}

footer {
    background: rgba(15, 23, 42, 0.95);
    padding: 32px 0;
    margin-top: 64px;

    .footer_con {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .footer_left {
            display: flex;
            align-items: center;
            gap: 16px;

            .logo {
                img {
                    height: 40px;
                }
            }

            p {
                color: rgba(255, 255, 255, 0.7);
                margin: 0;
                font-size: 0.9rem;
            }
        }

        .footer_right {
            display: flex;
            gap: 16px;

            a {
                opacity: 0.7;
                transition: opacity 0.3s ease;

                &:hover {
                    opacity: 1;
                }

                img {
                    height: 24px;
                }
            }
        }
    }
}

@media (max-width: 768px) {
    .appsList {
        padding: 16px;

        .container {
            .header-section {
                margin: 40px 0 24px;

                .description {
                    margin-bottom: 24px;
                }
            }
        }
    }

    footer {
        .footer_con {
            flex-direction: column;
            gap: 24px;
            text-align: center;

            .footer_left {
                flex-direction: column;
            }
        }
    }
}

@media (max-width: 480px) {
    .apps-grid {
        grid-template-columns: 1fr !important;
    }
}
</style>