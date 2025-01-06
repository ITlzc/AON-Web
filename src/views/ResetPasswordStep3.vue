<template>
  <a-spin :spinning="spinning" size="large">
    <div class="reset-password">
      <div class="reset-password-container">
        <div class="error-message" v-if="errorText">
          {{ errorText }}
        </div>

        <div class="reset-password-content" v-if="!signUpSuccess">
          <div class="text-wrapper_1 flex-row">
            <!-- <span class="text_2">&lt;&lt;Return to AON.net</span> -->
            <span class="text_2"></span>
            <span class="text_3">Reset Password</span>
            <!-- <span class="text_4">Using phone number&gt;&gt;</span> -->
          </div>
          <div class="step1">
            <div class="text-wrapper_4 flex-row">
              <span class="text_7">Set A New Password</span>
            </div>
            <div class="box_4 flex-col">
              <div class="text-wrapper_5 flex-col">
                <input v-model="password" type="password" class="text_8" placeholder="+6 character"
                  @blur="v$.password.$touch()" />
              </div>
              <span v-if="v$.password.$error" style="color: #E39734;">
                Password is required and must be at least 6 characters long.
              </span>
            </div>
            <div class="text-wrapper_6 flex-row">
              <span class="text_9">Confirm password</span>
            </div>
            <div class="box_5 flex-col">
              <div class="text-wrapper_7 flex-col">
                <input v-model="confirmPassword" type="password" class="text_10"
                  placeholder="Please enter your Password again" @blur="v$.confirmPassword.$touch()" />
              </div>
              <span v-if="v$.confirmPassword.$error" style="color: #E39734;">
                {{ v$.confirmPassword.$pending ? 'Under verification...' : 'The password must match the confirmed password.' }}
              </span>
            </div>
          </div>
          <div class="block_3 flex-row" @click="handleConfirm">
            <div class="text-wrapper_4 flex-col">
              <span class="paragraph_1 cursor-pointer">Confirm</span>
            </div>
          </div>
        </div>

        <div class="successBox" v-else>
          <div class="box_2 flex-col">
            <img class="image_1" referrerpolicy="no-referrer"
              src="../assets/images/signup_success.png" />
            <span class="text_2">You have successfully reset your password</span>
            <div class="text-wrapper_1 flex-col" @click="goToLogin">
              <span class="text_3 cursor-pointer">Go to login</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useVuelidate from '@vuelidate/core';
import { required, email as emailValidator, minLength, sameAs } from '@vuelidate/validators';
import { resetPasswordConfirm } from '../lib/data_source.js'
import { User } from 'aonweb'

const user_ = new User()
const router = useRouter()
const spinning = ref(false)
const signUpSuccess = ref(false)
const step = ref(1)

const email = ref('')
const password = ref('');
const confirmPassword = ref('');
const agreedToTerms = ref(false)
const isNotAgreed = ref(false)
const ag = ref('');
const code = ref('');
const errorText = ref('')

const rules = {
  password: {
    required,
    minLength: minLength(6),
  },
  confirmPassword: {
    required,
    sameAsPassword: sameAs(password, 'The password must match the confirmed password.'),
  },
};
const v$ = useVuelidate(rules, { password, confirmPassword });

function goToLogin() {
  router.push('/login')
}

const handleConfirm = async () => {
  errorText.value = ''
  try {
    v$.value.$touch();
    if (!v$.value.$invalid) {
      spinning.value = true
      try {
        let resData = await user_.setPassword(password.value)
        if (resData) {
          signUpSuccess.value = true
        }
      } catch (error) {
        console.log(error)
        errorText.value = error.message
      } finally {
        spinning.value = false
      }
    } else {
      spinning.value = false
    }
  } catch (error) {
    errorText.value = error.message
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
    text-align: center;

    .success-icon {
      font-size: 64px;
      color: #10b981;
      margin-bottom: 24px;
      animation: scale-in 0.5s ease-out;
    }

    h1 {
      font-size: 28px;
      color: #fff;
      margin: 0 0 8px;
      font-weight: 600;
      background: linear-gradient(45deg, #6528c4, #9e77e0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p {
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 32px;
      font-size: 16px;
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
  }
}

@keyframes scale-in {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .reset-password {
    padding: 16px;

    &-content {
      padding: 24px 16px;

      .success-icon {
        font-size: 48px;
      }

      h1 {
        font-size: 24px;
      }

      p {
        font-size: 14px;
      }

      .submit-btn {
        font-size: 14px;
      }
    }
  }
}
</style>