<template>
    <a-spin :spinning="spinning" size="large">
        <div class="register" v-if="!signUpSuccess">
            <div class="register-container">
                <div class="error-message" v-if="errorText">
                    {{ errorText }}
                </div>

                <div class="register-content">
                    <h1>Create Account</h1>
                    <p>Join AGI Open Network today</p>

                    <div class="step-content" v-if="step === 1">
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

                        <div class="form-group">
                            <label>Password</label>
                            <input 
                                type="password" 
                                v-model="password" 
                                @blur="v$.password.$touch()" 
                                placeholder="+6 character"
                                :class="{ 'error': v$.password.$error }"
                            />
                            <span class="error-text" v-if="v$.password.$error">
                                Password is required and must be at least 6 characters long.
                            </span>
                        </div>

                        <div class="form-group">
                            <label>Confirm Password</label>
                            <input 
                                type="password" 
                                v-model="confirmPassword" 
                                @blur="v$.confirmPassword.$touch()" 
                                placeholder="Please enter your Password again"
                                :class="{ 'error': v$.confirmPassword.$error }"
                            />
                            <span class="error-text" v-if="v$.confirmPassword.$error">
                                {{ v$.confirmPassword.$pending ? 'Under verification...' : 'The password must match the confirmed password.' }}
                            </span>
                        </div>

                        <div class="terms-group">
                            <label class="checkbox-label">
                                <input 
                                    type="checkbox" 
                                    v-model="agreedToTerms" 
                                    @change="e => isNotAgreed = !e.target.checked"
                                />
                                <span>I agree with AON's Terms of Service, Privacy Policy, and default Notification Settings.</span>
                            </label>
                            <span class="error-text" v-if="isNotAgreed">
                                You need to agree to the user agreement.
                            </span>
                        </div>
                    </div>

                    <div class="step-content" v-if="step === 2">
                        <div class="form-group">
                            <label>Verification Code</label>
                            <input 
                                type="text" 
                                v-model="code" 
                                placeholder="Please enter the verification code in your email"
                            />
                        </div>
                    </div>

                    <button class="submit-btn" @click="createAccount">
                        {{ step === 1 ? 'Create Account' : 'Sign Up' }}
                    </button>

                    <div class="login-link">
                        <span>Already have an account? </span>
                        <a @click="goToLogin">Login Here</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="success-container" v-else>
            <div class="success-content">
                <img src="../assets/images/signup_success.png" alt="Success" />
                <h2>Congratulations!</h2>
                <p>Your account has been successfully created</p>
                <button class="submit-btn" @click="goToLogin">
                    Go to Login
                </button>
            </div>
        </div>
    </a-spin>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useVuelidate from '@vuelidate/core';
import { required, email as emailValidator, minLength, sameAs } from '@vuelidate/validators';
import { message } from 'ant-design-vue';
// import { checkSession, signupWithEmail, verifyEmail } from '../lib/data_source.js'
import { User } from 'aonweb'
const user_ = new User()

const requiredTrue = (value) => value === true || 'You need to agree to the user agreement.';

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
    email: {
        required,
        emailValidator,
    },
    password: {
        required,
        minLength: minLength(6),
    },
    agreedToTerms: {
        required,
    },
    confirmPassword: {
        required,
        sameAsPassword: sameAs(password, 'The password must match the confirmed password.'),
    },
};
const v$ = useVuelidate(rules, { email, password, confirmPassword, agreedToTerms });

function goToLogin() {
    router.push('/login')
}

const createAccount = async () => {
    errorText.value = ''
    if (step.value === 2) {
        signUp()
        return
    }
    try {
        v$.value.$touch();
        console.log(agreedToTerms.value)
        if (!agreedToTerms.value) {
            isNotAgreed.value = true
            return
        }
        if (!v$.value.$invalid) {
            spinning.value = true
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
                spinning.value = false
            }
        } else {
            spinning.value = false
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
            signUpSuccess.value = true
        }
    } catch (error) {
        console.log(error)
        errorText.value = error.message
    } finally {
        spinning.value = false
    }
}
</script>

<style lang="scss" scoped>
.register {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    width: 100%;
    background: linear-gradient(135deg, #481696 0%, #8F85B8 100%);
    display: flex;
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

    .register-container {
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

    .register-content {
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

    .terms-group {
        margin-bottom: 24px;

        .checkbox-label {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            color: #E8E1F5;
            font-size: 14px;
            cursor: pointer;

            input[type="checkbox"] {
                margin-top: 3px;
            }

            span {
                line-height: 1.4;
            }
        }

        .error-text {
            color: #E39734;
            font-size: 12px;
            margin-top: 4px;
            display: block;
        }
    }

    .submit-btn {
        width: 100%;
        padding: 12px;
        background: linear-gradient(135deg, #481696 0%, #8F85B8 100%);
        color: #FFFFFF;
        border: 1px solid rgba(232, 225, 245, 0.3);
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-bottom: 24px;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(72, 22, 150, 0.3);
            border-color: #E8E1F5;
        }
    }

    .login-link {
        text-align: center;
        margin-bottom: 24px;

        span {
            color: #E8E1F5;
        }

        a {
            color: #51FFBD;
            cursor: pointer;
            transition: color 0.3s ease;
            margin-left: 4px;

            &:hover {
                color: lighten(#51FFBD, 10%);
            }
        }
    }
}

.success-container {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    width: 100%;
    background: linear-gradient(135deg, #481696 0%, #8F85B8 100%);
    display: flex;
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

    .success-content {
        position: relative;
        z-index: 2;
        text-align: center;
        background: rgba(232, 225, 245, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        border: 1px solid rgba(232, 225, 245, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        padding: 40px;
        max-width: 480px;
        width: 100%;

        img {
            width: 120px;
            height: 120px;
            margin-bottom: 24px;
        }

        h2 {
            font-size: 28px;
            margin-bottom: 16px;
            font-weight: bold;
            background: linear-gradient(45deg, #E8E1F5, #FFFFFF);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        p {
            color: #E8E1F5;
            margin-bottom: 32px;
            font-size: 16px;
        }

        .submit-btn {
            width: 100%;
            max-width: 200px;
        }
    }
}
</style>