<template>
  <a-spin :spinning="spinning" size="large">
    <div class="login">
      <div class="login-container">
        <div class="error-message" v-if="errorText">
          {{ errorText }}
        </div>

        <div class="login-content">
          <h1>Welcome Back</h1>
          <p>Log in to your AGI Open Network account</p>

          <div class="form-group">
            <label>Email</label>
            <input type="text" v-model="email" @blur="v$.email.$touch()" placeholder="Please enter your email"
              :class="{ 'error': v$.email.$error }" />
            <span class="error-text" v-if="v$.email.$error">
              Please enter a valid email address.
            </span>
          </div>

          <div class="form-group">
            <div class="password-header">
              <label>Password</label>
              <a @click="forgotPassword" class="forgot-link">Forgot?</a>
            </div>
            <input type="password" v-model="password" @blur="v$.password.$touch()" placeholder="+6 character"
              :class="{ 'error': v$.password.$error }" />
            <span class="error-text" v-if="v$.password.$error">
              Password is required and must be at least 6 characters long.
            </span>
          </div>

          <button class="login-btn" @click="login">Login</button>

          <div class="social-login">
            <p>Or log in with</p>
            <div class="social-buttons">
              <button class="social-btn github" @click="loginWithGitHub">
                <img src="../assets/images/login_icon_github.png" alt="GitHub" />
                <span>GitHub</span>
              </button>
              <button class="social-btn twitter" @click="loginWithTwitter">
                <img src="../assets/images/login_icon_twitter.png" alt="Twitter" />
                <span>Twitter</span>
              </button>
            </div>
          </div>

          <div class="signup-link">
            <span>Don't have an account? </span>
            <a @click="goToSignUp">Sign Up Here</a>
          </div>

          <p class="terms">
            By signing up with AON ID, you agree to Users Terms.
          </p>
        </div>
      </div>

      <div class="web3-login">
        <div class="web3-login-content">
          <p>Or connect wallet</p>
          <div class="wallet-buttons">
            <button class="wallet-btn metamask" @click="loginWithMetaMask">
              <img src="../assets/images/metamask-logo.svg" alt="MetaMask" />
              <span>MetaMask</span>
            </button>
            <button class="wallet-btn walletconnect" @click="loginWithWalletConnect">
              <img src="../assets/images/walletconnect-logo.svg" alt="WalletConnect" />
              <span>WalletConnect</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import useVuelidate from '@vuelidate/core';
import { required, email as emailValidator, minLength, sameAs } from '@vuelidate/validators';
import { loginWithEmail, linkTwitter, linkGithub, linkGoogle } from '../lib/data_source.js'
import { User } from 'aonweb'
import { ethers } from "ethers";

const user_ = new User()

const route = useRoute();
const router = useRouter();
const email = ref('');
const password = ref('');
const spinning = ref(false);
const errorText = ref('');
const redirectTo_ = ref('');
const walletAddress = ref('');

// Web3钱包登录函数
async function loginWithMetaMask() {
  if (window.ethereum) {
    try {
      spinning.value = true;
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      walletAddress.value = accounts[0];

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(accounts[0]);

      console.log(signature)

      // 签名
      // const signature = await window.ethereum.request({
      //   method: 'personal_sign',
      //   params: [accounts[0], accounts[0]],
      // });
      // 存储钱包地址并跳转到绑定邮箱页面
      localStorage.setItem('walletAddress', accounts[0]);
      sessionStorage.setItem('signature', signature);


      // console.log(signature)

      // { walletAddress: accounts[0], signature }
      router.push('/bind-email');
    } catch (error) {
      console.error('MetaMask登录失败:', error);
      errorText.value = '连接MetaMask失败，请重试';
    } finally {
      spinning.value = false;
    }
  } else {
    errorText.value = '请安装MetaMask钱包';
  }
}

async function loginWithWalletConnect() {
  try {
    spinning.value = true;
    // 这里添加WalletConnect的连接逻辑
    // 需要先安装并配置WalletConnect
    errorText.value = 'WalletConnect即将推出';
  } catch (error) {
    console.error('WalletConnect登录失败:', error);
    errorText.value = '连接WalletConnect失败，请重试';
  } finally {
    spinning.value = false;
  }
}

const rules = {
  email: {
    required,
    emailValidator,
  },
  password: {
    required,
    minLength: minLength(6),
  }
};

const v$ = useVuelidate(rules, { email, password });

function goToSignUp() {
  router.push('/sign-up')
}

function forgotPassword() {
  router.push('/forgot-password')
}

async function loginWithTwitter() {
  let redirectTo = redirectTo_.value ? redirectTo_.value : window.location.origin + '/developer-portal'
  console.log(redirectTo, 'loginWithTwitter redirectTo')
  let data = await user_.third_party_login('twitter', redirectTo)
  console.log(data)
}

async function loginWithGitHub() {
  let redirectTo = redirectTo_.value ? redirectTo_.value : window.location.origin + '/developer-portal'
  console.log(redirectTo, 'loginWithGitHub redirectTo')
  // let data = await linkGithub(redirectTo)
  let data = await user_.third_party_login('github', redirectTo)
  console.log(data)
}

async function loginWithGoogle() {
  let redirectTo = redirectTo_.value ? redirectTo_.value : window.location.origin + '/developer-portal'
  // let data = await linkGoogle(redirectTo)
  let data = await user_.third_party_login('google', redirectTo)
  console.log(data)
}

async function login() {
  v$.value.$touch();
  errorText.value = ''
  if (!v$.value.$invalid) {
    spinning.value = true

    try {
      const res = await user_.email_login(email.value, password.value);
      console.log(res, redirectTo_.value)
      if (res) {
        if (redirectTo_.value) {
          router.push(redirectTo_.value)
        } else {
          router.push('/developer-portal');
        }
      }
    } catch (error) {
      console.error(error, error.message);
      errorText.value = error.message;
    } finally {
      spinning.value = false
    }
  }
}

onMounted(() => {
  nextTick(() => {
    const redirectFrom = route.query.redirectFrom
    console.log(redirectFrom)
    redirectTo_.value = redirectFrom
  })


})
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #481696 0%, #8F85B8 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;

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
    z-index: 1;
  }

  .login-container {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 480px;
    background: rgba(232, 225, 245, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(232, 225, 245, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    padding: 40px;

    @media (max-width: 768px) {
      padding: 20px;
    }
  }

  .error-message {
    background: rgba(227, 151, 52, 0.1);
    border: 1px solid #E39734;
    color: #E39734;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: center;
  }

  .login-content {
    h1 {
      font-size: 36px;
      margin-bottom: 16px;
      font-weight: bold;
      background: linear-gradient(45deg, #E8E1F5, #FFFFFF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-align: center;
    }

    p {
      color: #E8E1F5;
      text-align: center;
      margin-bottom: 32px;
      font-size: 16px;
    }
  }

  .form-group {
    margin-bottom: 24px;

    label {
      display: block;
      color: #E8E1F5;
      margin-bottom: 8px;
      font-size: 14px;
    }

    input {
      width: 100%;
      padding: 12px 16px;
      background: rgba(232, 225, 245, 0.1);
      border: 1px solid rgba(143, 133, 184, 0.3);
      border-radius: 8px;
      color: #FFFFFF;
      font-size: 16px;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: #E8E1F5;
        box-shadow: 0 0 10px rgba(232, 225, 245, 0.2);
      }

      &.error {
        border-color: #E39734;
      }

      &::placeholder {
        color: rgba(232, 225, 245, 0.5);
      }
    }

    .error-text {
      color: #E39734;
      font-size: 12px;
      margin-top: 4px;
    }
  }

  .password-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .forgot-link {
      color: #51FFBD;
      font-size: 14px;
      cursor: pointer;
      transition: color 0.3s ease;

      &:hover {
        color: lighten(#51FFBD, 10%);
      }
    }
  }

  .login-btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #481696 0%, #8F85B8 100%);
    border: none;
    border-radius: 8px;
    color: #E8E1F5;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    margin-bottom: 24px;

    &:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  }

  .web3-login {
    margin-top: 24px;
    width: 100%;
    max-width: 480px;
    position: relative;
    z-index: 2;

    .web3-login-content {
      background: rgba(232, 225, 245, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      border: 1px solid rgba(232, 225, 245, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      padding: 24px;
      text-align: center;

      p {
        color: rgba(232, 225, 245, 0.6);
        font-size: 14px;
        margin-bottom: 16px;
      }

      .wallet-buttons {
        display: flex;
        gap: 16px;
        justify-content: center;
        flex-wrap: wrap;
      }

      .wallet-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 8px 24px;
        border-radius: 8px;
        border: 1px solid rgba(232, 225, 245, 0.2);
        background: rgba(232, 225, 245, 0.1);
        color: #E8E1F5;
        cursor: pointer;
        transition: all 0.3s;
        min-width: 160px;

        img {
          width: 24px;
          height: 24px;
        }

        &.metamask {
          border-color: #F6851B;

          &:hover {
            background: rgba(246, 133, 27, 0.1);
          }
        }

        &.walletconnect {
          border-color: #3B99FC;

          &:hover {
            background: rgba(59, 153, 252, 0.1);
          }
        }
      }
    }
  }

  .social-login {
    margin-bottom: 32px;
    text-align: center;

    p {
      color: rgba(232, 225, 245, 0.6);
      font-size: 14px;
      margin-bottom: 16px;
    }

    .social-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
    }

    .social-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 24px;
      border-radius: 8px;
      border: 1px solid rgba(232, 225, 245, 0.2);
      background: rgba(232, 225, 245, 0.1);
      color: #E8E1F5;
      cursor: pointer;
      transition: all 0.3s;

      img {
        width: 24px;
        height: 24px;
      }

      &:hover {
        background: rgba(232, 225, 245, 0.2);
        border-color: rgba(232, 225, 245, 0.3);
      }
    }
  }

  .signup-link {
    text-align: center;
    margin-bottom: 24px;

    span {
      color: #E8E1F5;
    }

    a {
      color: #51FFBD;
      cursor: pointer;
      transition: color 0.3s ease;

      &:hover {
        color: lighten(#51FFBD, 10%);
      }
    }
  }

  .terms {
    color: rgba(232, 225, 245, 0.5);
    font-size: 12px;
    text-align: center;
    line-height: 1.5;
  }
}
</style>