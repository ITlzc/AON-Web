
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import Antd from 'ant-design-vue';
import { createPinia } from 'pinia';

import 'ant-design-vue/dist/reset.css';
import './assets/main.css'
import './assets/reset-antd-components-styles.scss'



const app = createApp(App)
const pinia = createPinia();
app.use(pinia)
app.use(router)
app.use(i18n)
app.use(Antd);
app.mount('#app')

if (import.meta.env.MODE === 'production') {
    console.log = () => { };
}
