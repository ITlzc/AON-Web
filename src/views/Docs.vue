<template>
  <div class="docs-container">
    <div class="content">
      <h1>Documentation</h1>
      <p class="subtitle">Explore our comprehensive guides and documentation</p>
      
      <div class="docs-grid">
        <div class="doc-card" @click="navigateToDoc('getting-started')">
          <div class="icon">
            <img src="@/assets/images/illustrations/ai-agent.svg" alt="Getting Started" />
          </div>
          <h2>Getting Started</h2>
          <p>Quick start guide for building and deploying your first AI agent</p>
          <div class="learn-more">
            Learn More <span class="arrow">→</span>
          </div>
        </div>

        <div class="doc-card" @click="navigateToDoc('framework')">
          <div class="icon">
            <img src="@/assets/images/illustrations/features.svg" alt="Framework" />
          </div>
          <h2>Agent Framework</h2>
          <p>Deep dive into our agent framework architecture and core concepts</p>
          <div class="learn-more">
            Learn More <span class="arrow">→</span>
          </div>
        </div>

        <div class="doc-card" @click="navigateToDoc('tokenization')">
          <div class="icon">
            <img src="@/assets/images/illustrations/token.svg" alt="Tokenization" />
          </div>
          <h2>Agent Tokenization</h2>
          <p>Learn about agent tokenization, trading, and revenue distribution</p>
          <div class="learn-more">
            Learn More <span class="arrow">→</span>
          </div>
        </div>

        <div class="doc-card" @click="navigateToDoc('api')">
          <div class="icon">
            <img src="@/assets/images/illustrations/marketplace.svg" alt="API Reference" />
          </div>
          <h2>API Reference</h2>
          <p>Complete API documentation for developers and integrators</p>
          <div class="learn-more">
            Learn More <span class="arrow">→</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const navigateToDoc = (section: string) => {
  // TODO: Implement navigation to specific documentation sections
  console.log(`Navigating to ${section} documentation`);
}
</script>

<style lang="scss" scoped>
.docs-container {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #481696 0%, #8F85B8 100%);
  color: #ffffff;

  .content {
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 60px;
    text-align: center;

    h1 {
      font-size: 48px;
      margin-bottom: 20px;
      background: linear-gradient(45deg, #E8E1F5, #FFFFFF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      font-size: 20px;
      color: #E8E1F5;
      margin-bottom: 60px;
    }

    .docs-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 30px;
      padding: 20px;
    }

    .doc-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      border: 1px solid rgba(232, 225, 245, 0.2);
      padding: 30px;
      text-align: left;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        transform: translateY(-5px);
        background: rgba(255, 255, 255, 0.15);

        .learn-more {
          .arrow {
            transform: translateX(5px);
          }
        }
      }

      .icon {
        width: 60px;
        height: 60px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 12px;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }
      }

      h2 {
        font-size: 24px;
        margin-bottom: 15px;
        color: #E8E1F5;
      }

      p {
        font-size: 16px;
        line-height: 1.6;
        color: rgba(232, 225, 245, 0.8);
        margin-bottom: 20px;
      }

      .learn-more {
        font-size: 16px;
        color: #E8E1F5;
        display: flex;
        align-items: center;
        gap: 5px;

        .arrow {
          transition: transform 0.3s ease;
        }
      }
    }
  }
}

@media (max-width: 1200px) {
  .docs-container .content .docs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .docs-container {
    padding: 20px;

    .content {
      h1 {
        font-size: 36px;
      }

      .subtitle {
        font-size: 18px;
      }

      .docs-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }
  }
}
</style>
