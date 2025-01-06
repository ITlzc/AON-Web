<template>
  <a-spin :spinning="spinning" size="large">
    <div class="reset-password">
      <div class="reset-password-container">
        <div class="error-message" v-if="errorText">
          {{ errorText }}
        </div>

        <div class="reset-password-content">
          <h1>Reset Password</h1>
          <p>Enter your email to reset your password</p>

          <div class="form-group">
            <label>Email</label>
            <input 
              type="text" 
              v-model="email" 
              @blur="v$.email.$touch()" 
              placeholder="Please enter your email"
              :class="{ 'error': v$.email.$error }"
            />
            <span class="error-text" v-if="v$.email.$error">
              Please enter a valid email address.
            </span>
          </div>

          <button class="submit-btn" @click="handleConfirm">
            Send Verification
          </button>

          <div class="login-link">
            <span>Remember your password? </span>
            <a @click="goToLogin">Login Here</a>
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useVuelidate from '@vuelidate/core'
import { required, email as emailValidator } from '@vuelidate/validators'
import { message } from 'ant-design-vue'
import { User } from 'aonweb'

const user_ = new User()
const router = useRouter()
const email = ref('')
const spinning = ref(false)
const errorText = ref('')

const rules = {
  email: {
    required,
    emailValidator,
  }
}
const v$ = useVuelidate(rules, { email })

function goToLogin() {
  router.push('/login')
}

async function handleConfirm() {
  errorText.value = ''
  v$.value.$touch()
  if (!v$.value.$invalid) {
    spinning.value = true
    try {
      let redirectTo = window.location.origin + '/reset-password-submit'
      const res = await user_.resetPasswordForEmail(email.value, redirectTo)
      if (res) {
        message.success('Email sent successfully')
        router.push({
          name: 'reset-password-verify',
          state: { email: email.value }
        })
      }
    } catch (error) {
      console.error(error)
      errorText.value = error.message
    } finally {
      spinning.value = false
    }
  }
}
</script>

<style lang="scss" scoped>
.reset-password {
  min-height: 100vh;
  background: linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(72, 22, 150, 0.2), transparent 70%);
    pointer-events: none;
  }

  &-container {
    width: 100%;
    max-width: 480px;
    position: relative;
    z-index: 1;

    .error-message {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #ef4444;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 14px;
      backdrop-filter: blur(10px);
    }
  }

  &-content {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    h1 {
      font-size: 28px;
      color: #fff;
      margin: 0 0 8px;
      font-weight: 600;
      text-align: center;
      background: linear-gradient(45deg, #6528c4, #9e77e0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p {
      color: rgba(255, 255, 255, 0.7);
      text-align: center;
      margin-bottom: 32px;
      font-size: 16px;
    }

    .form-group {
      margin-bottom: 24px;

      label {
        display: block;
        color: #fff;
        margin-bottom: 8px;
        font-weight: 500;
      }

      input {
        width: 100%;
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        color: #fff;
        font-size: 16px;
        transition: all 0.3s ease;

        &::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        &:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }

        &.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
        }
      }

      .error-text {
        color: #ef4444;
        font-size: 14px;
        margin-top: 8px;
        display: block;
      }
    }

    .submit-btn {
      width: 100%;
      padding: 12px;
      background: linear-gradient(45deg, #6528c4, #9e77e0);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .login-link {
      margin-top: 24px;
      text-align: center;
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;

      a {
        color: #6366f1;
        text-decoration: none;
        cursor: pointer;
        margin-left: 4px;
        transition: color 0.3s ease;

        &:hover {
          color: #818cf8;
          text-decoration: underline;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .reset-password {
    padding: 16px;

    &-content {
      padding: 24px 16px;

      h1 {
        font-size: 24px;
      }

      p {
        font-size: 14px;
      }

      .form-group {
        input {
          font-size: 14px;
        }
      }

      .submit-btn {
        font-size: 14px;
      }
    }
  }
}
</style>