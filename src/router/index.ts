import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ModelMarket from '../views/ModelMarket.vue'
import Playground from '../views/Playground.vue'
import DeveloperCenter from '../views/DeveloperCenter.vue'
import UploadMyApp from '../views/UploadMyApp.vue'
import AppsList from '../views/AppsList.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ResetPassword from '../views/ResetPassword.vue'
import ResetPasswordStep2 from '../views/ResetPasswordStep2.vue'
import ResetPasswordStep3 from '../views/ResetPasswordStep3.vue'
import AppsDetail from '../views/AppsDetail.vue'
import Landing from '../views/Landing.vue'
import ComingSoon from '../views/ComingSoon.vue'
import Docs from '../views/Docs.vue'
import CreateAgent from '../views/CreateAgent.vue'
import AgentFramework from '../views/AgentFramework.vue'
import BindEmail from '../views/BindEmail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: Landing
    },
    {
      path: '/model-market',
      name: 'model-market',
      component: ModelMarket
    },
    {
      path: '/tokenize-agent',
      name: 'tokenize-agent',
      component: ComingSoon
    },
    {
      path: '/docs',
      name: 'docs',
      component: Docs
    },
    {
      path: '/playground/:name',
      name: 'playground',
      component: Playground
    },
    {
      path: '/developer-portal',
      name: 'developer-portal',
      component: DeveloperCenter
    },
    {
      path: '/upload-my-application',
      name: 'upload-my-application',
      component: UploadMyApp
    },
    {
      path: '/applications-list',
      name: 'applications-list',
      component: AppsList
    },
    {
      path: '/applications-detail/:id',
      name: 'applications-detail',
      component: AppsDetail
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: Register
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ResetPassword
    },
    {
      path: '/reset-password-verify',
      name: 'reset-password-verify',
      component: ResetPasswordStep2
    },
    {
      path: '/reset-password-submit',
      name: 'reset-password-submit',
      component: ResetPasswordStep3
    },
    {
      path: '/bind-email',
      name: 'bind-email',
      component: BindEmail
    },
    {
      path: '/create-agent',
      name: 'create-agent',
      component: CreateAgent
    },
    {
      path: '/agent-framework',
      name: 'agent-framework',
      component: AgentFramework
    }
  ]
})

export default router
