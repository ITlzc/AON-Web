<template>
    <div class="developerCenter">
        <div class="container">
            <p class="itemTit">My Agents</p>
            <p class="account">Account: <span>{{ account }}</span></p>


            <div class="topCon">
                <div class="uploadAppCon">
                    <img src="../assets/images/developerCenter/icon.png" alt="">

                    <div class="right">
                        <p>You can upload and publish your agent here, enjoy low-cost computility, and get a convenient
                            development experience.</p>
                        <div class="btn cursor-pointer" @click="createAnApp">Create An Agent</div>
                    </div>
                </div>

                <div class="rightCon">
                    <div class="rightCon_top">
                        <div class="data_item">
                            <p class="label">My Agents</p>
                            <p class="value">{{ data.my_apps_num }}</p>
                        </div>

                        <div class="data_item">
                            <p class="label">Computility Consumption</p>
                            <p class="value">{{ Number(data.computility_consumption_num / 1000000) || 0 }}</p>
                        </div>
                    </div>
                    <div class="rightCon_bottom">
                        <div class="data_item">
                            <p class="label">Yesterday's Visits</p>
                            <p class="value">{{ data.yesterday_visit_num || 0 }}</p>
                        </div>

                        <div class="data_item">
                            <p class="label">Total Visits</p>
                            <p class="value">{{ data.total_visit_num || 0 }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <p class="itemTit manageMyApp">Manage My Agents</p>

            <a-flex :justify="'center'" :align="'center'" vertical class="noData"
                v-if="data.my_apps_num === 0 && !isLoading">
                <img src="../assets/images/developerCenter/no-data.png" alt="">
                <p>You do not have any uploaded agents</p>
            </a-flex>

            <a-table v-else :dataSource="data.dataSource" :columns="data.columns" :pagination="pagination"
                @change="handleTableChange" :loading="isLoading"
                :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'appInfo'">
                        <div class="app-info">
                            <img :src="record.icon" alt="" v-if="record.icon" />
                            <img src="../assets/images/noLogo.png" alt="" v-else>
                            <div class="app-details">
                                <p class="title">{{ record.title }}</p>
                                <p class="name">{{ record.name }}</p>
                                <p class="category">{{ record.category }}</p>
                            </div>
                        </div>
                    </template>

                    <template v-if="column.key === 'usage'">
                        <div class="usage-info">
                            <div class="computility">
                                <span class="label">Computility:</span>
                                <span class="value">{{ Number(record.computility_point / 1000000) || 0 }}</span>
                            </div>
                            <div class="visits">
                                <span class="label">Visits:</span>
                                <span class="value">{{ record.visit_count || 0 }}</span>
                            </div>
                        </div>
                    </template>

                    <template v-if="column.key === 'status'">
                        <span v-if="record.status === 0" style="color: #FF5621;">Offline</span>
                        <span v-if="record.status === 1" style="color: #FF5621;">Pending Review</span>
                        <span v-if="record.status === 2" style="color: #BF57FB;">In Review</span>
                        <span v-if="record.status === 3" style="color: #E39734;">Approved</span>
                        <span v-if="record.status === 4" style="color: #E39734;">Review Rejected</span>
                        <span v-if="record.status === 5" style="color: #51FFBD;">Online</span>
                        <span v-if="record.status === 6" style="color: #E39734;">Offline</span>
                        <span v-if="record.status === 7" style="color: #E39734;">Draft</span>
                    </template>

                    <template v-if="column.key === 'Operate'">
                        <div class="OperateCon">
                            <div class="edit" @click="goUploadMyApp(record)">
                                <img src="../assets/images/edit_icon.png" alt="">
                                <span :style="{ color: record.status === 2 ? '#878787' : '#51FFBD' }">Edit</span>
                            </div>
                            <div class="switch" @click="handleChangeStatus(record)">
                                <img v-if="record.status === 5" class="offIcon" src="../assets/images/crease_icon.png"
                                    alt="">
                                <img v-else-if="record.status === 6 || record.status === 7 || record.status === 0"
                                    class="onIcon" src="../assets/images/start_icon.png" alt="">
                                <span
                                    :style="{ color: record.status !== 5 && record.status !== 6 && record.status !== 0 ? '#878787' : record.status === 5 ? '#E39734' : '#51FFBD' }">
                                    {{ record.status === 5 ? 'off' : 'on' }}
                                </span>
                            </div>
                        </div>
                    </template>
                </template>
            </a-table>

        </div>
    </div>
    <footer>
        <div class="container footer_con">
            <div class="footer_left">

                <p>{{ $t('foot_foundation') }}</p>
            </div>


        </div>
    </footer>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { my_apps_total, updateApp, yesterday_visit, computility_consumption, total_visit, my_apps, getUser, checkSession, changeAppsStatus, getProfiles } from '../lib/data_source.js'
import { useRoute, useRouter } from 'vue-router';
import { Modal } from 'ant-design-vue';

const route = useRoute();
const router = useRouter();
const isLoading = ref(false);
const userId = ref('');
const account = ref('');

const pagination = reactive({
    current: parseInt(route.query.page) || 1,
    pageSize: 10,
    total: 0,
});

const data = reactive({
    dataSource: [],
    my_apps_num: 0,
    yesterday_visit_num: 0,
    computility_consumption_num: 0,
    total_visit_num: 0,
    columns: [
        {
            title: 'Agent Info',
            key: 'appInfo',
            scopedSlots: { customRender: 'appInfo' },
        },
        {
            title: 'Agent ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Usage',
            key: 'usage',
            scopedSlots: { customRender: 'usage' },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Operate',
            dataIndex: '',
            key: 'Operate',
        },
    ],
})

async function createAnApp() {
    Modal.confirm({
        title: '创建新Agent',
        content: '确定要创建新Agent吗？',
        okText: '确认',
        cancelText: '取消',
        async onOk() {
            let params = {
                status: 7 // 创建为草稿状态
            }
            let res = await updateApp(params)
            if (res && res.length) {
                initData(userId.value)
            }
        }
    });
}

function goUploadMyApp(record) {
    if (record.status === 2) return // 审核中的应用不能编辑
    const id = record.id
    router.push(id ? '/upload-my-application?id=' + id : '/upload-my-application')
}

async function handleChangeStatus(record) {
    if (record.status === 7) return // 草稿状态不能切换
    let status = record.status !== 6 && record.status !== 0 ? 6 : 5

    Modal.confirm({
        title: '确认更改状态',
        content: `确定要将应用 "${record.title}" ${status === 5 ? '上线' : '下线'} 吗？`,
        okText: '确认',
        cancelText: '取消',
        async onOk() {
            let res = await changeAppsStatus(record.id, userId.value, status)
            if (res) {
                initData(userId.value)
            }
        }
    });
}

async function initData(userId) {
    isLoading.value = true
    try {
        data.my_apps_num = await my_apps_total(userId)
        data.yesterday_visit_num = await yesterday_visit(userId)
        data.computility_consumption_num = await computility_consumption(userId)
        data.total_visit_num = await total_visit(userId)
        data.dataSource = await my_apps(userId)
        pagination.total = data.my_apps_num
    } catch (error) {
        console.error('Failed to fetch data:', error)
    } finally {
        isLoading.value = false
    }
}

const handleTableChange = async (pagination_, filters, sorter) => {
    isLoading.value = true
    try {
        pagination.current = pagination_.current;
        pagination.pageSize = pagination_.pageSize;
        router.push({ query: { page: pagination_.current } });
        data.dataSource = await my_apps(userId.value, pagination_.current, pagination_.pageSize)
    } catch (error) {
        console.error('Failed to change page:', error)
    } finally {
        isLoading.value = false
    }
};

onMounted(async () => {
    let session = await checkSession()
    if (!session) {
        router.push('/login?redirectFrom=/developer-portal')
        return
    }
    getUser().then(async (userInfo) => {
        if (userInfo) {
            userId.value = userInfo.id
            initData(userInfo.id)
            let profiles = await getProfiles(userInfo.id)
            if (profiles) {
                account.value = profiles.account || profiles.address || ''
            }
        }
    })
})
</script>

<style lang="scss" scoped>
.developerCenter {
    position: relative;
    z-index: 2;
    padding: 120px 0 80px;
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
        position: relative;
        z-index: 3;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 4rem;

        @media (max-width: 768px) {
            padding: 0 1rem;
        }
    }

    .account {
        color: #FFFFFF;
        font-size: 1.2rem;
        font-weight: bold;
        margin-bottom: 2rem;

        span {
            font-size: 1.2rem;
            font-weight: normal;
        }
    }

    .itemTit {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        font-weight: bold;
        background: linear-gradient(45deg, #E8E1F5, #FFFFFF);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        line-height: 1.2;
    }

    .topCon {
        display: flex;
        gap: 2rem;
        margin-bottom: 4rem;

        @media (max-width: 768px) {
            flex-direction: column;
            padding: 1rem;
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .uploadAppCon {
            flex: 1;
            background: rgba(232, 225, 245, 0.1);
            border: 1px solid rgba(143, 133, 184, 0.3);
            padding: 2.5rem;
            border-radius: 15px;
            display: flex;
            gap: 2rem;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;

            &:hover {
                transform: translateY(-5px);
                border-color: #481696;
                box-shadow: 0 8px 30px rgba(72, 22, 150, 0.2);
            }

            img {
                width: 100px;
                height: 100px;

                @media (max-width: 768px) {
                    width: 60px;
                    height: 60px;
                }
            }

            .right {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 1.5rem;

                @media (max-width: 768px) {
                    gap: 1rem;
                }

                p {
                    font-size: 1.2rem;
                    line-height: 1.6;
                    color: #E8E1F5;
                    margin: 0;

                    @media (max-width: 768px) {
                        font-size: 1rem;
                    }
                }

                .btn {
                    background: linear-gradient(135deg, #481696 0%, #8F85B8 100%);
                    color: #FFFFFF;
                    border: 1px solid rgba(232, 225, 245, 0.3);
                    padding: 1rem 2rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 1rem;
                    white-space: nowrap;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(5px);
                    width: fit-content;

                    &:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 15px rgba(72, 22, 150, 0.3);
                        border-color: #E8E1F5;
                    }
                }
            }
        }

        .rightCon {
            flex: 1;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;

            @media (max-width: 768px) {
                grid-template-columns: 1fr;
                gap: 1rem;
            }

            .data_item {
                background: rgba(232, 225, 245, 0.1);
                border: 1px solid rgba(143, 133, 184, 0.3);
                padding: 2rem;
                border-radius: 15px;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                text-align: center;

                &:hover {
                    transform: translateY(-5px);
                    border-color: #481696;
                    box-shadow: 0 8px 30px rgba(72, 22, 150, 0.2);
                }

                @media (max-width: 768px) {
                    padding: 1.5rem;
                }

                .label {
                    margin-bottom: 1rem;
                    color: #E8E1F5;
                    font-size: 1.1rem;
                }

                .value {
                    font-size: 2.5rem;
                    color: #FFFFFF;
                    font-weight: bold;

                    @media (max-width: 768px) {
                        font-size: 2rem;
                    }
                }
            }
        }
    }

    .manageMyApp {
        margin-top: 3rem;
        margin-bottom: 2rem;
    }

    :deep(.ant-table-wrapper) {
        background: rgba(232, 225, 245, 0.1);
        border: 1px solid rgba(143, 133, 184, 0.3);
        padding: 2rem;
        border-radius: 15px;
        backdrop-filter: blur(10px);

        .ant-table {
            background: transparent;

            .ant-table-thead>tr>th {
                background: transparent;
                color: rgba(232, 225, 245, 0.7);
                font-weight: normal;
                padding: 1.5rem;
                text-align: left;
                border-bottom: 1px solid rgba(143, 133, 184, 0.3);
            }

            .ant-table-tbody>tr>td {
                padding: 1.5rem;
                text-align: left;
                border-bottom: 1px solid rgba(143, 133, 184, 0.3);
                color: #E8E1F5;

                img {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                }
            }

            .table-striped {
                background: rgba(232, 225, 245, 0.05);
            }

            .ant-table-tbody>tr {
                transition: opacity 0.3s ease;

                &.ant-table-row-loading {
                    opacity: 0.5;
                }
            }

            .OperateCon {
                display: flex;
                gap: 1rem;

                .edit,
                .switch {
                    padding: 0.25rem 0.75rem;
                    border-radius: 4px;
                    border: 1px solid rgba(143, 133, 184, 0.3);
                    background: rgba(232, 225, 245, 0.1);
                    color: #E8E1F5;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;

                    &:hover {
                        background: rgba(232, 225, 245, 0.2);
                        border-color: #E8E1F5;
                    }

                    img {
                        width: 16px;
                        height: 16px;
                    }

                    span {
                        font-size: 0.875rem;
                    }
                }

                @media (max-width: 768px) {
                    flex-direction: column;
                    gap: 0.5rem;

                    .edit,
                    .switch {
                        width: 100%;
                        justify-content: center;
                    }
                }
            }

            .ant-table-tbody>tr>td {
                &:nth-child(6) span {
                    // 状态列
                    display: inline-block;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.875rem;

                    &[style*="color: #FF5621"] {
                        // Failed/Offline
                        background: rgba(255, 86, 33, 0.1);
                    }

                    &[style*="color: #BF57FB"] {
                        // In Review
                        background: rgba(191, 87, 251, 0.1);
                    }

                    &[style*="color: #E39734"] {
                        // Approved/Review Rejected/Offline
                        background: rgba(227, 151, 52, 0.1);
                    }

                    &[style*="color: #51FFBD"] {
                        // Online
                        background: rgba(0, 255, 157, 0.1);
                    }
                }
            }
        }
    }

    @media (max-width: 768px) {
        padding: 1rem;

        .itemTit {
            font-size: 2rem;
            text-align: center;
        }

        :deep(.ant-table-wrapper) {
            overflow-x: auto;
            padding: 1rem;

            .ant-table {
                min-width: 800px;
            }
        }
    }

    .app-info {
        display: flex;
        align-items: center;
        gap: 1rem;

        img {
            width: 40px;
            height: 40px;
            border-radius: 8px;
        }

        .app-details {
            .title {
                font-size: 1rem;
                font-weight: 500;
                color: #FFFFFF;
                margin-bottom: 0.25rem;
            }

            .name,
            .category {
                font-size: 0.875rem;
                color: rgba(232, 225, 245, 0.7);
                margin-bottom: 0.125rem;
            }
        }
    }

    .usage-info {

        .computility,
        .visits {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;

            &:last-child {
                margin-bottom: 0;
            }

            .label {
                color: rgba(232, 225, 245, 0.7);
                font-size: 0.875rem;
            }

            .value {
                color: #FFFFFF;
                font-weight: 500;
            }
        }
    }
}
</style>