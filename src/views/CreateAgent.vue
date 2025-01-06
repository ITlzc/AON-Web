<template>
  <div class="create-agent-container">
    <!-- Developer Section -->
    <div class="section developer-section">
      <h2>For Developers</h2>
      <div class="content">
        <div class="feature-box">
          <h3>3000+ AI Model APIs</h3>
          <p>Access our extensive collection of AI models to power your custom agents</p>
        </div>
        <div class="feature-box">
          <h3>Agent Framework</h3>
          <p>Build professional agents using our comprehensive development framework</p>
        </div>
        <div class="feature-box">
          <h3>Custom Integration</h3>
          <p>Integrate with existing systems and create specialized solutions</p>
        </div>
        <router-link to="/model-market">
          <el-button type="primary" class="start-button">Start Development</el-button>
        </router-link>
      </div>
    </div>

    <!-- Zero Code Builder Section -->
    <div class="section builder-section">
      <h2>Zero Code for Builders</h2>
      <div class="content">
        <div class="feature-box">
          <h3>Template-Based Creation</h3>
          <p>Choose from pre-built templates to quickly create your own AI agent without coding</p>
        </div>
        <div class="feature-box">
          <h3>Visual Configuration</h3>
          <p>Customize your agent's behavior through an intuitive visual interface</p>
        </div>
        <div class="feature-box">
          <h3>One-Click Deployment</h3>
          <p>Deploy your agent instantly with just one click, no technical expertise required</p>
        </div>
        <div class="feature-box">
          <h3>Real-Time Analytics</h3>
          <p>Monitor your agent's performance and user interactions through detailed analytics</p>
        </div>
        <a href="https://builder.agiopen.network" target="_blank">
          <el-button type="success" class="start-button">Start Building</el-button>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.create-agent-container {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  padding-top: 5rem;
  min-height: calc(100vh - 64px);
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.section {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 28px;
  margin-bottom: 2rem;
  color: #fff;
  text-align: center;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.feature-box {
  background: rgba(72, 22, 150, 0.2);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid rgba(72, 22, 150, 0.3);
  transition: all 0.3s ease;
}

.feature-box:hover {
  background: rgba(72, 22, 150, 0.3);
  transform: translateY(-2px);
}

.feature-box h3 {
  color: #fff;
  margin-bottom: 0.5rem;
  font-size: 20px;
}

.feature-box p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.start-button {
  margin-top: auto;
  width: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
  border: none;
  border-radius: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  color: #fff;
  text-transform: uppercase;
  line-height: 1;
  padding: 0;
}

.developer-section .start-button {
  background: linear-gradient(135deg, rgba(72, 22, 150, 0.9), rgba(96, 35, 192, 0.9));
  box-shadow: 0 4px 15px rgba(72, 22, 150, 0.3);
}

.developer-section .start-button:hover {
  background: linear-gradient(135deg, rgba(72, 22, 150, 1), rgba(96, 35, 192, 1));
  box-shadow: 0 8px 25px rgba(72, 22, 150, 0.5);
}

.builder-section .start-button {
  background: linear-gradient(135deg, rgba(30, 142, 62, 0.9), rgba(52, 168, 83, 0.9));
  box-shadow: 0 4px 15px rgba(30, 142, 62, 0.3);
}

.builder-section .start-button:hover {
  background: linear-gradient(135deg, rgba(30, 142, 62, 1), rgba(52, 168, 83, 1));
  box-shadow: 0 8px 25px rgba(30, 142, 62, 0.5);
}

.start-button:hover {
  transform: translateY(-2px) scale(1.02);
}

.start-button:active {
  transform: translateY(1px) scale(0.98);
}

.start-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: all 0.6s;
}

.start-button:hover::before {
  left: 100%;
}

@media (max-width: 1024px) {
  .create-agent-container {
    flex-direction: column;
    padding: 1rem;
    padding-top: 5rem;
  }

  .section {
    margin-bottom: 2rem;
  }

  .start-button {
    width: 200px;
    height: 44px;
    font-size: 14px;
  }
}
</style>
