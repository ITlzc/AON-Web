<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watchEffect, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
//@ts-ignore
import { getUser, logout, getUserAsset } from '../lib/data_source.js'
//@ts-ignore
import emitter from '../utils/eventBus'
//@ts-ignore
import { User } from 'aonweb'
const user_ = new User()

const { t, locale } = useI18n()
const router = useRouter();
const route = useRoute();
const menuIsOpen = ref(false);
const langIsOpen = ref(false);
const userId = ref('');
const balance = ref(0);
const languageSwitcher = ref<HTMLElement | null>(null);
const walletAddress = ref('');

const isActive = (routeName: string) => route.name === routeName;
const toggleMenu = () => menuIsOpen.value = !menuIsOpen.value

const changeLanguage = (lang: string) => {
    locale.value = lang
    langIsOpen.value = false
    setFontByLanguage(lang)
}

const setFontByLanguage = (language: string) => {
    const root = document.documentElement;

    switch (language) {
        case 'zh':
            root.style.setProperty('--font-family', "'Adobe Heiti Std R', sans-serif");
            root.style.setProperty('--font-style', "normal");
            break;
        case 'en':
            root.style.setProperty('--font-family', "'InterTight', sans-serif");
            root.style.setProperty('--font-style', "italic");
            break;
        default:
            root.style.setProperty('--font-family', "'Adobe Heiti Std R', sans-serif");
            root.style.setProperty('--font-style', "normal");
            break;
    }
}
const handleClickOutside = (event: MouseEvent) => {
    if (languageSwitcher.value && !languageSwitcher.value?.contains(event.target as Node)) {
        langIsOpen.value = false;
    }
};
const signOut = () => {
    user_.logout().then((result: any) => {
        userId.value = ''
        router.replace('/login')
    }).catch((err: any) => {
        console.log(err)
    });
}

const goLogin = () => {
    router.push('/login')
}
async function getBalance() {
    try {
        console.log(userId.value)
        const res = await getUserAsset(userId.value)
        console.log(res, 'getBalance')
        if (res && Array.isArray(res)) {
            balance.value = Number(Number(res[1].balance / res[1].unit).toFixed(2))
        }
    } catch (error) {
        throw error
    }

}
watch(() => userId.value, () => {
    getBalance()
})
// 监听页面切换
watch(() => route.path, () => {
    console.log('watchEffect')
    getUser().then((userInfo: any) => {
        userId.value = userInfo.id
    }).catch((err: any) => {
        console.log('getUser', err)
    });
}, { immediate: true })

const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            walletAddress.value = accounts[0];
        } catch (error) {
            console.error('连接钱包失败:', error);
        }
    } else {
        alert('请安装MetaMask钱包!');
    }
};

onMounted(() => {
    emitter.on('getBalance', () => {
        getBalance()
    })
});

</script>

<template>
    <header>
        <div class="header_con">
            <RouterLink to="/" class="logo">
                <img src="/src/assets/images/logo.png" alt="logo" />
            </RouterLink>
            <div class="headRight">
                <nav>
                    <RouterLink to="/">{{ $t("nav_home") }}</RouterLink>
                    <RouterLink to="/create-agent">{{ $t("nav_2") }}</RouterLink>
                    <RouterLink to="/tokenize-agent">{{ $t("nav_5") }}</RouterLink>
                    <RouterLink to="/agent-framework">{{ $t("nav_3") }}</RouterLink>
                    <RouterLink to="/docs">{{ $t("nav_6") }}</RouterLink>
                </nav>

                <div :class="{ 'h5_menu': true, 'open': menuIsOpen, 'close': !menuIsOpen }" @click="toggleMenu">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <ul :class="{ 'expanded': menuIsOpen, 'collapsed': !menuIsOpen, 'h5_menu_list': true }">

                    <div class="headRight_btn">
                        <img class="lang" src="@/assets/images/lang.png" alt="">
                        <img class="line" src="@/assets/images/line.png" alt="">
                        <img class="user" src="@/assets/images/userIcon.png" alt="">
                        <div class="login">Login</div>
                    </div>

                    <li>
                        <RouterLink to="/" @click="toggleMenu">
                            <span>{{ $t("nav_home") }}</span>
                            <img class="arrow" src="../assets/images/Frame.png" alt="">
                        </RouterLink>
                    </li>

                    <li>
                        <RouterLink to="/create-agent" @click="toggleMenu">
                            <span>{{ $t("nav_2") }}</span>
                            <img class="arrow" src="../assets/images/Frame.png" alt="">
                        </RouterLink>
                    </li>

                    <li>
                        <RouterLink to="/tokenize-agent" @click="toggleMenu">
                            <span>{{ $t("nav_5") }}</span>
                            <img class="arrow" src="../assets/images/Frame.png" alt="">
                        </RouterLink>
                    </li>

                    <li>
                        <RouterLink to="/agent-framework" @click="toggleMenu">
                            <span>{{ $t("nav_3") }}</span>
                            <img class="arrow" src="../assets/images/Frame.png" alt="">
                        </RouterLink>
                    </li>

                    <li>
                        <RouterLink to="/docs" @click="toggleMenu">
                            <span>{{ $t("nav_6") }}</span>
                            <img class="arrow" src="../assets/images/Frame.png" alt="">
                        </RouterLink>
                    </li>
                </ul>

            </div>

            <!-- <div class="headRight_btn headRight_btn_web"> -->
            <div class="headRight_btn">
                <button class="connect-wallet" @click="connectWallet">
                    {{ walletAddress ? walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4) : 'Connect Wallet' }}
                </button>
                <div class="links">
                    <a href="https://t.me/AGIOpenNetwork" target="_blank" rel="noopener noreferrer"><img
                            src="@/assets/images/foot_tg.png" alt=""></a>
                    <a href="https://medium.com/@aon_aonet" target="_blank" rel="noopener noreferrer"><img
                            src="@/assets/images/foot_m.png" alt=""></a>
                </div>
                <img class="line" src="@/assets/images/line.png" alt="">

                <a-dropdown :arrow="{ pointAtCenter: true }">
                    <div class="lang_con" ref="languageSwitcher">
                        <img class="lang" src="@/assets/images/lang.png" @click="langIsOpen = !langIsOpen" alt="">
                    </div>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item>
                                <span @click="changeLanguage('zh')">CN</span>
                            </a-menu-item>
                            <a-menu-item>
                                <span @click="changeLanguage('en')">EN</span>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>

                <!-- <div class="lang_con" ref="languageSwitcher">
                    <img class="lang" src="@/assets/images/lang.png" @click="langIsOpen = !langIsOpen" alt="">
                    <ul :style="{ display: langIsOpen ? 'block' : 'none' }">
                        <li @click="changeLanguage('zh')">
                            <p>CN</p>
                        </li>
                        <li @click="changeLanguage('en')">
                            <p>EN</p>
                        </li>
                    </ul>
                </div> -->
                <!-- <img class="line" src="@/assets/images/line.png" alt="">
                <img class="user" src="@/assets/images/userIcon.png" alt=""> -->
                <div class="login" v-if="!userId" @click="goLogin">
                    <div class="login_content">
                        Login
                    </div>
                </div>

                <a-dropdown class="userCon-dropdown" :arrow="true" v-else>
                    <div class="userCon">
                        <img class="moneyIcon" src="../assets/images/money.png" alt="">
                        <p>{{ balance }} </p>
                        <img class="userIcon" src="../assets/images/user.png" alt="">
                    </div>

                    <template #overlay>
                        <a-menu>
                            <a-menu-item>
                                <RouterLink to="/developer-portal">{{ $t("nav_4") }}</RouterLink>
                            </a-menu-item>
                            <a-menu-item>
                                <span @click="signOut">{{ $t("logout") }}</span>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>

            </div>

        </div>

    </header>


</template>


<style lang="scss" scoped>
header {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    background: #fff;
}

.header_con {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 5.63vw;
    width: 100%;
    margin: 0 auto;
    padding-left: 2.08vw;
    padding-right: 1.25vw;
}

.headRight {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.headRight_btn {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.headRight_btn img {
    cursor: pointer;
}

.headRight_btn .lang {
    width: 1.35vw;
    height: 1.35vw;
    margin-right: 1.09vw;
}

.lang_con {
    height: 100%;
    display: flex;
    align-items: center;
    position: relative;
}

.lang_con ul {
    position: absolute;
    top: 2.35vw;
    left: 0;
    z-index: 16;
    border-radius: .52vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: auto;
    height: auto;
    transition: all 0.3s ease;
}

.lang_con ul li {
    cursor: pointer;
    margin-bottom: 5px;
}

.lang_con ul li p {
    font-family: Adobe Heiti Std R;
    font-size: 1.14vw;
    color: #FFFFFF;
    text-align: left;
    font-style: normal;

}

.lang_con ul li:last-child p {
    border: none;
}

.headRight_btn .line {
    width: 2px;
    height: 1.88vw;
    margin-right: 1.09vw;
}

.headRight_btn .user {
    width: 1.82vw;
    height: 1.82vw;
    margin-right: 1.09vw;
}

.headRight_btn .login {
    width: 7.71vw;
    height: 2.6vw;
    line-height: 2.29vw;
    border-radius: 1.56vw;
    font-size: 2.81vw;
    background: linear-gradient(180deg, #20F5BB 0%, #2F54EB 100%);
    border-radius: 4.17vw;
    padding: .16vw;
    cursor: pointer;
    margin-left: .52vw;

    .login_content {
        height: 100%;
        width: 100%;
        background: #282A33;
        border-radius: 4.17vw;

        font-family: Roboto, Roboto;
        font-weight: 500;
        font-size: 1.25vw;
        color: #FFFFFF;
        text-align: center;
        font-style: normal;
        text-transform: none;
    }
}

.userCon {
    margin-left: .52vw;
    min-width: 10vw;
    height: 2.5vw;
    background: #000000;
    border-radius: 4.17vw;
    border: 1px solid #5CDBD3;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: .42vw;

    .moneyIcon {
        height: 1.67vw;
        width: 1.67vw;
    }

    .userIcon {
        width: 1.88vw;
        height: 1.88vw;
        border-radius: 50%;
    }

    p {
        font-family: Open Sans, Open Sans;
        font-weight: 600;
        font-size: 1.15vw;
        color: #FFFFFF;
        text-align: left;
        font-style: normal;
        text-transform: none;
        margin: 0;
    }
}

.logo {
    display: flex;
    align-items: center;
}

.logo img {
    height: 2.66vw;
    // width: 2.66vw;
    margin-right: .57vw;
}

.logo .logo_text {
    width: 4.32vw;
    height: 1.2vw;
    margin: 0;
}

.h5_menu,
.h5_menu_list {
    display: none;
}

nav {
    display: flex;
    align-items: center;
    gap: 2rem;

    a {
        color: #fff;
        text-decoration: none;
        font-size: 1rem;
        font-weight: 500;
        position: relative;
        font-family: 'Montserrat', sans-serif;
        letter-spacing: 0.5px;
        transition: all 0.3s ease;
        background: linear-gradient(135deg, #fff 0%, #E8E1F5 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 1px rgba(255, 255, 255, 0.1);

        &:hover, &.router-link-active {
            transform: translateY(-1px);
            background: linear-gradient(135deg, #fff 0%, #fff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 2px rgba(255, 255, 255, 0.2);

            &:after {
                width: 100%;
                opacity: 1;
            }
        }

        &:after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(135deg, #fff 0%, #E8E1F5 100%);
            transition: all 0.3s ease;
            opacity: 0;
        }
    }
}

.links {
    display: flex;
    align-items: center;
    margin-right: 1.09vw;
}

.links a {
    display: inline-flex;
    height: auto;
}

.links img {
    height: 2.6vw;
    width: 2.6vw;
    margin-left: 1.77vw;
}

.connect-wallet {
    padding: 8px 16px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 20px;
    transition: background 0.3s;
}

.connect-wallet:hover {
    background: #45a049;
}

@media screen and (max-width: 980px) {
    .header_con {
        height: 16.88vw;
        padding-left: 5vw;
        padding-right: 5.78vw;
    }

    .header_con .headRight_btn_web {
        display: none;
    }

    .headRight_btn {
        justify-content: flex-end;
        /* margin-bottom: 3.13vw; */
    }

    .headRight_btn .lang {
        width: 4.06vw;
        height: 4.06vw;
        margin-right: 1.09vw;
    }

    .headRight_btn .line {
        width: 2px;
        height: 4.98vw;
        margin-right: 2.97vw;
    }

    .headRight_btn .user {
        width: 5.47vw;
        height: 5.47vw;
        margin-right: 3.13vw;
    }

    .headRight_btn .login {
        display: none;
        width: 14.17vw;
        height: 6.09vw;
        line-height: 6.09vw;
        font-size: 2.81vw;

        .login_content {
            font-size: 2.91vw;
        }
    }


    .userCon {
        min-width: 8vw;
        height: 6.09vw;
        background: #000000;
        border-radius: 4.17vw;
        border: 1px solid #5CDBD3;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 1.42vw;
        display: none;


        .moneyIcon {
            height: 3.67vw;
            width: 3.67vw;
        }

        .userIcon {
            width: 3.88vw;
            height: 3.88vw;
            border-radius: 50%;
        }

        p {
            font-size: 2.15vw;
            margin: 0 1.25vw;

        }
    }

    .logo img {
        height: 7.97vw;
        // width: 8.13vw;
        margin-right: 1.72vw;
    }

    .logo .logo_text {
        width: 10.78vw;
        height: 2.97vw;
        margin: 0;
    }

    nav {
        display: none;
    }

    nav {
        display: none;
    }

    .h5_menu {
        display: none;
        background-color: transparent;
        border: 0px;
        width: 5vw;
        height: 4.06vw;
        position: relative;
        z-index: 15;
        pointer-events: all;
    }

    .h5_menu span {
        width: 100%;
        height: 1px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-color: rgb(242, 242, 242);
        opacity: 1;
        transition: transform 0.25s ease-out 0s, opacity 0.25s ease 0s;
    }


    .open span:nth-of-type(1) {
        transform: translate(-30%, -50%) rotate(-45deg) scaleX(0.8);
    }

    .open span:nth-of-type(2) {
        transform: translate(-30%, -50%) rotate(45deg) scaleX(0.8);
    }

    .open span:nth-of-type(3) {
        display: none;
    }

    .close span:nth-of-type(1) {
        -webkit-transform: translate(-50%, calc(-50% - 0.4rem));
        -moz-transform: translate(-50%, calc(-50% - 0.4rem));
        -ms-transform: translate(-50%, calc(-50% - 0.4rem));
        transform: translate(-50%, calc(-50% - 0.4rem));
    }

    .close span:nth-of-type(2) {
        -webkit-transform: translate(-50%, calc(-50% + 0.4rem));
        -moz-transform: translate(-50%, calc(-50% + 0.4rem));
        -ms-transform: translate(-50%, calc(-50% + 0.4rem));
        transform: translate(-50%, calc(-50% + 0.4rem));
    }

    .expanded {
        height: calc(100vh);
        display: flex;
        opacity: 1;
        transition: all 0.3s ease;
        position: fixed;
        top: 16.88vw;
        left: 0;
        padding: 3.44vw 0;
    }

    .collapsed {
        height: 0;
        padding: 0;
        position: absolute;
        left: 0;
        top: 72px;
    }

    .h5_menu_list {
        display: flex;
    }

    .headRight ul {
        overflow: hidden;
        height: 0;
        opacity: 0;
        width: 100%;
        z-index: 99;
        display: flex;
        flex-direction: column;
        background: #101014;
    }

    .headRight li {
        width: calc(100% - 25px);
        margin: 0 auto;
    }

    .headRight li a {
        font-family: Adobe Heiti Std R;
        font-size: 3.91vw;
        font-weight: 700;
        text-align: center;
        padding: 3.13vw 5vw;
        background-color: #232328;
        color: #fff;
        margin-bottom: 5.78vw;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .headRight ul li a img {
        height: 3.75vw;
        width: 2.66vw;
    }

    .links {
        margin-right: 2.97vw;
    }

    .links img {
        height: 6.09vw;
        width: 6.09vw;
        margin-left: 2.22vw;
    }

    .lang_con {
        height: 100%;
        display: flex;
        align-items: center;
        position: relative;
    }

    .lang_con ul {
        top: 5.26vw;
    }

    .lang_con ul li {
        cursor: pointer;
        margin-bottom: 5px;
    }

    .lang_con ul li p {
        font-size: 4.14vw;
    }
}
</style>