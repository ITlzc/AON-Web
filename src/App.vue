<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { onMounted, watch, ref } from 'vue';
//@ts-ignore
import { getUser, logout, getUserAsset } from './lib/data_source.js'
//@ts-ignore
import emitter from './utils/eventBus'
//@ts-ignore
import { User } from 'aonweb'
const user_ = new User()

const router = useRouter()
const isMenuOpen = ref(false)
const userId = ref('')
const walletAddress = ref('')

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

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

// 监听页面切换
watch(() => router.currentRoute.value.path, () => {
  getUser().then((userInfo: any) => {
    console.log(userInfo)
    userId.value = userInfo.id
  }).catch((err: any) => {
    console.log('getUser', err)
  });
}, { immediate: true })

onMounted(async () => {

})
</script>

<template>
  <a-config-provider :theme="{
    token: {
      colorPrimary: '#481696',
      colorBgContainer: 'transparent',
    }
  }">
    <div id="app">
      <div class="background-container">
        <img src="@/assets/images/home-banner-bg.png" alt="background" class="background-image" />
        <div class="overlay"></div>
      </div>

      <header class="header">
        <div class="logo-container">
          <router-link to="/">
            <img src="@/assets/images/logo.png" alt="Logo" class="logo" />
          </router-link>
        </div>

        <div class="hamburger" :class="{ active: isMenuOpen }" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div class="right-section" :class="{ active: isMenuOpen }">
          <nav class="nav-menu">
            <router-link to="/" class="nav-item" @click="closeMenu">{{ $t("nav_home") }}</router-link>
            <router-link to="/create-agent" class="nav-item" @click="closeMenu">{{ $t("nav_2") }}</router-link>
            <router-link to="/tokenize-agent" class="nav-item" @click="closeMenu">{{ $t("nav_5") }}</router-link>
            <router-link to="/agent-framework" class="nav-item" @click="closeMenu">{{ $t("nav_3") }}</router-link>
            <a href="https://docs.agiopen.network" target="_blank" rel="noopener noreferrer" class="nav-item" @click="closeMenu">{{ $t("nav_6") }}</a>
          </nav>
          <div class="right-menu">
            <div class="links">
              <a href="https://t.me/AGIOpenNetwork" target="_blank" rel="noopener noreferrer">
                <img src="@/assets/images/foot_tg.png" alt="Telegram">
              </a>
              <a href="https://x.com/AGIOpenNetwork" target="_blank" rel="noopener noreferrer">
                <img src="@/assets/images/foot_twitter.png" alt="Twitter">
              </a>
              <a href="https://medium.com/@aon_aonet" target="_blank" rel="noopener noreferrer">
                <img src="@/assets/images/foot_m.png" alt="Medium">
              </a>
            </div>
            <button class="connect-wallet" @click="connectWallet">
              {{ walletAddress ? walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4) : 'Connect Wallet' }}
            </button>
            <img class="line" src="@/assets/images/line.png" alt="">
            <div v-if="!userId" class="login-btn" @click="goLogin">Login</div>
            <div v-else class="user-menu">
              <a-dropdown>
                <div class="user-avatar">
                  <img src="@/assets/images/userIcon.png" alt="User">
                </div>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <router-link to="/developer-portal">{{ $t("nav_4") }}</router-link>
                    </a-menu-item>
                    <a-menu-item>
                      <span @click="signOut">{{ $t("logout") }}</span>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </div>
        </div>
      </header>

      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </a-config-provider>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-style: normal;
}

html, body {
  height: 100%;
  background: linear-gradient(135deg, #481696 0%, #8F85B8 100%);
  color: #E8E1F5;
}

#app {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;

  .background-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(72, 22, 150, 0.9), rgba(143, 133, 184, 0.95));
  }
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  background: rgba(72, 22, 150, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(232, 225, 245, 0.1);
  z-index: 100;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, 
      rgba(72, 22, 150, 0.1),
      rgba(143, 133, 184, 0.1)
    );
    z-index: -1;
  }

  .logo-container {
    .logo {
      height: 40px;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .connect-wallet {
    padding: 8px 16px;
    background: rgba(232, 225, 245, 0.1);
    color: #E8E1F5;
    border: 1px solid rgba(232, 225, 245, 0.2);
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;

    &:hover {
      background: rgba(232, 225, 245, 0.2);
      border-color: rgba(232, 225, 245, 0.3);
    }
  }
}

.right-section {
  display: flex;
  align-items: center;
  gap: 2rem;

  .nav-menu {
    display: flex;
    gap: 2rem;
    margin-right: 2rem;

    .nav-item {
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

  .right-menu {
    display: flex;
    align-items: center;
    gap: 1rem;

    .links {
      display: flex;
      gap: 1rem;
      
      a {
        img {
          height: 24px;
          width: auto;
          transition: opacity 0.3s ease;
          
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }

    .line {
      height: 24px;
    }

    .login-btn {
      padding: 0.5rem 1.5rem;
      background: #481696;
      color: #FFFFFF;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: #5a1dbd;
        transform: translateY(-2px);
      }
    }

    .user-menu {
      .user-avatar {
        cursor: pointer;
        
        img {
          height: 32px;
          width: 32px;
          border-radius: 50%;
        }
      }
    }
  }
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  cursor: pointer;
  z-index: 101;

  span {
    display: block;
    height: 2px;
    width: 100%;
    background-color: #E8E1F5;
    transition: all 0.3s ease;
  }

  &.active {
    span:first-child {
      transform: translateY(9px) rotate(45deg);
    }
    
    span:nth-child(2) {
      opacity: 0;
    }
    
    span:last-child {
      transform: translateY(-9px) rotate(-45deg);
    }
  }
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .right-section {
    position: fixed;
    top: 0;
    right: -100%;
    width: 100%;
    height: 100vh;
    background: rgba(72, 22, 150, 0.95);
    backdrop-filter: blur(10px);
    flex-direction: column;
    justify-content: center;
    transition: all 0.3s ease;
    
    &.active {
      right: 0;
    }

    .nav-menu {
      flex-direction: column;
      gap: 2rem;
      margin-bottom: 2rem;

      .nav-item {
        font-size: 1.2rem;
      }
    }

    .right-menu {
      flex-direction: column;
      gap: 1.5rem;

      .links {
        justify-content: center;
      }

      .line {
        display: none;
      }
    }
  }
}

.main-content {
  padding-top: 55px;
  min-height: calc(100vh - 80px);
  background: rgba(72, 22, 150, 0.8);
  backdrop-filter: blur(10px);
  margin-top: -25px;
  position: relative;
  z-index: 0;
}

.ant-input {
  color: #FFFFFF !important;
}
</style>
