<template>
  <a-spin :spinning="spinning || spinning_verify" size="large">
    <div class="bind-email">
      <div class="bind-container">
        <div class="error-message" v-if="errorText">
          {{ errorText }}
        </div>

        <div class="bind-content">
          <h1>Bind Your Email</h1>
          <p>Bind your email to complete wallet login</p>

          <div class="wallet-info">
            <span>Connected Wallet:</span>
            <span class="wallet-address">{{ walletAddress }}</span>
          </div>

          <div class="form-group" v-if="step === 1">
            <label>Email</label>
            <input type="text" v-model="email" @blur="v$.email.$touch()" placeholder="Please enter your email"
              :class="{ 'error': v$.email.$error }" />
            <span class="error-text" v-if="v$.email.$error">
              Please enter a valid email address.
            </span>
          </div>

          <div class="form-group" v-if="step === 1">
            <label>Password</label>
            <input type="password" v-model="password" @blur="v$.password.$touch()" placeholder="+6 character"
              :class="{ 'error': v$.password.$error }" />
            <span class="error-text" v-if="v$.password.$error">
              Password is required and must be at least 6 characters long.
            </span>
          </div>

          <div class="form-group" v-if="step === 2">
            <label>Verification Code</label>
            <input type="text" v-model="code" placeholder="Please enter the verification code in your email" />
          </div>

          <button class="bind-btn" @click="bindEmail">Bind Email</button>

          <p class="terms">
            By binding email with AON ID, you agree to Users Terms.
          </p>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useVuelidate from '@vuelidate/core';
import { required, email as emailValidator, minLength } from '@vuelidate/validators';

import { bindMetaMask, checkMetaMask } from '../lib/data_source.js'
import { Spin } from 'ant-design-vue';

import { User } from 'aonweb'

const user_ = new User()

const router = useRouter();
const route = useRoute();
const email = ref('');
const password = ref('');
const code = ref('');
const spinning = ref(false);
const spinning_verify = ref(false);
const errorText = ref('');
const redirectTo_ = ref('');
const account = ref('');
const walletAddress = ref('');
const step = ref(1);
const signature = ref('');

// 从路由参数或localStorage获取钱包地址
const initWalletAddress = () => {
  const address = localStorage.getItem('walletAddress');
  const signature_ = sessionStorage.getItem('signature');
  if (address) {
    account.value = address;
    signature.value = signature_;
    walletAddress.value = `${address.slice(0, 6)}...${address.slice(-4)}`;
  } else {
    // 如果没有钱包地址，重定向到登录页
    router.replace('/login');
  }
};

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

const bindEmail = async () => {
  if (step.value === 2) {
    signUp()
    return
  }

  const result = await v$.value.$validate();
  errorText.value = '';

  if (result) {
    spinning.value = true;
    try {
      // TODO: 调用后端API绑定邮箱
      // const res = await bindWalletEmail(email.value);

      //   let res = await bindMetaMask('0x14a1e07badf586cd661ba4d324a35d578248ba23278662e2074236a78d872dee318acc4bea27212f515c464cebb093fd8a651d0faefc85decc9121387567b6ae1c', '0x2d4e6b96bd85248d13020d392e99558abfb4f74c')
      // console.log(res)
      // return

      console.log(account.value)
      let isBind = await checkMetaMask(account.value, email.value)
      console.log(isBind)
      if (isBind && isBind.data && isBind.code === 200) {
        let isCheck = isBind.data.exist //true 已经绑定 false 未绑定
        let isCheckEmail = isBind.data.email //true 已经注册邮箱 false 未注册邮箱
        // 邮箱已被注册 但未绑定成功
        if ((isCheckEmail && !isCheck) || isCheck) {
          login()
          return
        }
        
        if (!isCheck) {
          createAccount()
        }
      } else {
        errorText.value = isBind.message;
      }
    } catch (error) {
      console.error('绑定邮箱失败:', error);
      errorText.value = error.message || '绑定邮箱失败，请重试';
    } finally {
      spinning.value = false;
    }
  }
};

const createAccount = async () => {
  errorText.value = ''
  try {
    v$.value.$touch();
    if (!v$.value.$invalid) {
      spinning_verify.value = true
      try {
        let resData = await user_.email_signUp(email.value, password.value)
        console.log(resData)
        if (resData && resData.user && !(resData.user.identities && resData.user.identities.length) && (resData.user.user_metadata && !resData.user.user_metadata.email)) {
          message.error('The email is already in use')
          throw new Error('The email is already in use')
        }
        if (resData) {
          step.value = 2
        }
      } catch (error) {
        console.log(error)
      } finally {
        spinning_verify.value = false
      }
    } else {
      spinning_verify.value = false
    }
  } catch (error) {
    errorText.value = error.message
  }
}

const signUp = async () => {
  console.log(code.value)
  if (!code.value) {
    return
  }
  spinning.value = true
  try {
    let resData = await user_.verifyOtp(email.value, code.value, 'signup')
    console.log(resData)
    if (resData) {
      let res = await bindMetaMask(signature.value, account.value)
      console.log(res)
      if (res && res.code == 200) {
        localStorage.removeItem('walletAddress');
        sessionStorage.removeItem('signature');

        if (redirectTo_.value) {
          router.push(redirectTo_.value)
        } else {
          router.push('/developer-portal');
        }
      }
    }
  } catch (error) {
    console.log(error)
    errorText.value = error.message
  } finally {
    spinning.value = false
  }
}

async function login() {
  v$.value.$touch();
  errorText.value = ''
  if (!v$.value.$invalid) {
    spinning.value = true

    console.log(email.value, password.value)

    try {
      const res = await user_.email_login(email.value, password.value);
      console.log(res, redirectTo_.value)
      if (res) {
        let res_bind = await bindMetaMask(signature.value, account.value)
        console.log(res_bind)
        if (res_bind) {
          localStorage.removeItem('walletAddress');
          sessionStorage.removeItem('signature');

          if (redirectTo_.value) {
            router.push(redirectTo_.value)
          } else {
            router.push('/developer-portal');
          }
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

// 页面加载时初始化钱包地址
onMounted(() => {
  initWalletAddress();
  nextTick(() => {
    const redirectFrom = route.query.redirectFrom
    console.log(redirectFrom)
    redirectTo_.value = redirectFrom
  })
});
</script>

<style lang="scss" scoped>
.bind-email {
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

  .bind-container {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 480px;
    background: rgba(232, 225, 245, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(232, 225, 245, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .error-message {
    background: rgba(255, 59, 48, 0.1);
    color: #FF3B30;
    padding: 12px;
    border-radius: 20px 20px 0 0;
    text-align: center;
  }

  .bind-content {
    padding: 32px;

    h1 {
      color: #E8E1F5;
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
      text-align: center;
    }

    p {
      color: rgba(232, 225, 245, 0.6);
      text-align: center;
      margin-bottom: 24px;
    }

    .wallet-info {
      background: rgba(232, 225, 245, 0.05);
      border: 1px solid rgba(232, 225, 245, 0.1);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        color: rgba(232, 225, 245, 0.6);
      }

      .wallet-address {
        color: #E8E1F5;
        font-family: monospace;
      }
    }
  }

  .form-group {
    margin-bottom: 24px;

    label {
      display: block;
      color: #E8E1F5;
      margin-bottom: 8px;
    }

    input {
      width: 100%;
      padding: 12px;
      background: rgba(232, 225, 245, 0.1);
      border: 1px solid rgba(232, 225, 245, 0.2);
      border-radius: 8px;
      color: #E8E1F5;
      transition: all 0.3s;

      &::placeholder {
        color: rgba(232, 225, 245, 0.3);
      }

      &:focus {
        outline: none;
        border-color: rgba(232, 225, 245, 0.4);
        background: rgba(232, 225, 245, 0.15);
      }

      &.error {
        border-color: #FF3B30;
      }
    }

    .error-text {
      color: #FF3B30;
      font-size: 12px;
      margin-top: 4px;
    }
  }

  .bind-btn {
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

  .terms {
    color: rgba(232, 225, 245, 0.4);
    font-size: 12px;
    text-align: center;
    margin: 0;
  }
}
</style>
