<template>
  <div class="ai-model">
    <div class="container">
      <div class="header-section">
        <div class="description">
          <h1>AI Model Market</h1>
        </div>
        <div class="search-bar">
          <input type="text" v-model="searchQuery" @input="handelSearch" placeholder="Search models..." />
        </div>
      </div>

      <a-spin :spinning="spinning" size="large">
        <div class="models-grid">
          <div v-for="item in resData.modelList" :key="item.id" class="model-card" @click="goPlayground(item)">
            <div class="model-image">
              <img v-if="item.cover && !isVideoLink(item.cover)" :src="item.cover" :alt="item.name">
              <video v-else-if="item.cover && isVideoLink(item.cover)" autoplay muted loop>
                <source :src="item.cover" type="">
              </video>
              <img v-else src="@/assets/images/cover.jpg" :alt="item.name">
            </div>
            <div class="model-info">
              <h3>{{ item.name }}</h3>
              <p class="model-description">{{ item.desc }}</p>
            </div>
          </div>
        </div>

        <div class="pagination" v-if="pagination.total > 0 && resData.modelList.length > 0">
          <button @click="handlePageChange(pagination.current - 1)" :disabled="pagination.current === 1">&lt;</button>
          <span>{{ pagination.current }}</span>
          <button @click="handlePageChange(pagination.current + 1)" :disabled="pagination.current * pagination.pageSize >= pagination.total">&gt;</button>
          <select v-model="pagination.pageSize" @change="handlePageChange(1)">
            <option value="20">20 / page</option>
            <option value="50">50 / page</option>
            <option value="100">100 / page</option>
          </select>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// @ts-ignore
import { models, models_total, checkSession } from '../lib/data_source.js'
// @ts-ignore
import { debounce } from 'lodash';
import { message } from 'ant-design-vue';

const route = useRoute();
const router = useRouter();

const searchQuery = ref('');
const spinning = ref(false);
const pagination = reactive({
  current: parseInt(route.query.page as string) || 1,
  pageSize: 20,
  total: 0,
})

const resData: any = reactive({
  modelList: [],
})

function handlePageChange(page: number) {
  pagination.current = page;
  router.push({ query: { page: pagination.current } });
  initData({ keywords: searchQuery.value });
}

const debouncedSearch = debounce((filter: any) => {
  console.log('Searching for:', filter);
  initData(filter);
}, 300);

async function handelSearch(e: any) {
  let keywords = e.target.value;
  pagination.current = 1;
  router.push({ query: { page: 1 } });
  debouncedSearch({ keywords });
}

const goPlayground = (item: any) => {
  router.push(`/playground/${item.name}`);
}

async function initData(filter?: any) {
  try {
    spinning.value = true;
    const modelData: any = await models(pagination.current, pagination.pageSize, filter);
    resData.modelList = modelData;

    const total = await models_total(filter);
    pagination.total = total;
  } catch (error) {
    console.log(error);
  } finally {
    spinning.value = false;
  }
}

function isVideoLink(url: string) {
  return url?.toLowerCase().endsWith('.mp4') || url?.toLowerCase().endsWith('.webm');
}

onMounted(() => {
  nextTick(() => {
    initData();
  });
});
</script>

<style lang="scss" scoped>
.ai-model {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #481696 0%, #8F85B8 100%);
  color: #ffffff;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 60px;
  }

  .header-section {
    margin-bottom: 40px;
    padding: 40px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(232, 225, 245, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

    .description {
      text-align: center;
      margin-bottom: 30px;

      h1 {
        font-size: 48px;
        margin-bottom: 20px;
        background: linear-gradient(45deg, #E8E1F5, #FFFFFF);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .search-bar {
      max-width: 600px;
      margin: 0 auto;

      input {
        width: 100%;
        padding: 12px 20px;
        border: 1px solid rgba(232, 225, 245, 0.3);
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
        font-size: 16px;
        backdrop-filter: blur(5px);

        &::placeholder {
          color: rgba(232, 225, 245, 0.6);
        }

        &:focus {
          outline: none;
          border-color: rgba(232, 225, 245, 0.5);
          box-shadow: 0 0 10px rgba(232, 225, 245, 0.2);
        }
      }
    }
  }

  .models-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 40px;
  }

  @media (max-width: 1200px) {
    .models-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 992px) {
    .models-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 576px) {
    .models-grid {
      grid-template-columns: 1fr;
    }
  }

  .model-card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    overflow: hidden;
    transition: transform 0.3s ease;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(232, 225, 245, 0.2);
    cursor: pointer;

    &:hover {
      transform: translateY(-5px);
    }

    .model-image {
      height: 200px;
      overflow: hidden;

      img, video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .model-info {
      padding: 20px;

      h3 {
        font-size: 20px;
        margin-bottom: 10px;
        color: #E8E1F5;
      }

      .model-description {
        font-size: 14px;
        line-height: 1.5;
        color: rgba(232, 225, 245, 0.8);
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-top: 40px;

    button {
      padding: 8px 15px;
      border: 1px solid rgba(232, 225, 245, 0.3);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: #E8E1F5;
      cursor: pointer;
      transition: all 0.3s ease;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.2);
      }
    }

    span {
      color: #E8E1F5;
    }

    select {
      padding: 8px 15px;
      border: 1px solid rgba(232, 225, 245, 0.3);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: #E8E1F5;
      cursor: pointer;

      option {
        background: #481696;
        color: #E8E1F5;
      }
    }
  }
}

@media (max-width: 768px) {
  .ai-model {
    padding: 20px 10px;

    .header-section {
      padding: 20px;

      .description {
        h1 {
          font-size: 36px;
        }
      }
    }
  }
}
</style>