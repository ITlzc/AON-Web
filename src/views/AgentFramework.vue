<template>
  <div class="agent-framework">
    <div class="container">
      <div class="header-section">
        <h1>AONWeb: Full-Modality Multi-Agent Collaboration Framework</h1>
        <p class="description">
          Powered by 3,000+ open-source AI models provided by AGI Open Network, AONWeb is a cutting-edge AI Agent framework that offers seamless integration, advanced collaboration, and low-code solutions to empower developers in building intelligent, full-modality AI systems.
        </p>
      </div>

      <div class="features-section">
        <h2>Core Features</h2>
        
        <div class="feature-group">
          <h3>Web3 Integration</h3>
          <ul>
            <li>Smart contract interaction with multiple specialized contracts (AonAgentPoint, AonUser, AonAiModel, etc.)</li>
            <li>Wallet connectivity and authentication</li>
            <li>Token management and reward systems</li>
            <li>Decentralized user management</li>
          </ul>
        </div>

        <div class="feature-group">
          <h3>AI Agent Capabilities</h3>
          <ul>
            <li>Integration with 3000+ state-of-the-art open-source AI models</li>
            <li>Customizable AI parameters and configurations</li>
            <li>Support for various input/output formats</li>
            <li>Scalable AI execution through clustered architecture</li>
          </ul>
        </div>

        <div class="feature-group">
          <h3>Technical Architecture</h3>
          <ul>
            <li>Modular design with clear separation of concerns</li>
            <li>Environment-specific configurations (development/production)</li>
            <li>Cross-domain storage solutions</li>
            <li>Comprehensive error handling and logging</li>
            <li>Telegram Web App integration</li>
          </ul>
        </div>
      </div>

      <div class="github-link">
        <a href="https://github.com/AONAgent/aonweb" target="_blank" class="github-button">
          <img src="@/assets/images/github.svg" alt="GitHub">
          View on GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.agent-framework {
  min-height: 100vh;
  padding: 5rem 2rem 2rem;
  color: #fff;
  position: relative;
  z-index: 1;

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .header-section {
    text-align: center;
    margin-bottom: 4rem;

    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      background: linear-gradient(135deg, #fff 0%, #E8E1F5 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.2;
    }

    .description {
      font-size: 1.2rem;
      line-height: 1.6;
      color: #E8E1F5;
      max-width: 900px;
      margin: 0 auto;
    }
  }

  .features-section {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 2rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);

    h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
      text-align: center;
      color: #fff;
    }

    .feature-group {
      background: rgba(72, 22, 150, 0.2);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      border: 1px solid rgba(72, 22, 150, 0.3);
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-4px);
      }

      h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: #fff;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid rgba(255, 255, 255, 0.1);
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.8rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.5;

          &:before {
            content: "•";
            position: absolute;
            left: 0;
            color: #481696;
            font-weight: bold;
          }

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }

  .github-link {
    text-align: center;
    margin-top: 3rem;

    .github-button {
      display: inline-flex;
      align-items: center;
      gap: 0.8rem;
      background: linear-gradient(135deg, rgba(72, 22, 150, 0.9), rgba(96, 35, 192, 0.9));
      color: #fff;
      text-decoration: none;
      padding: 1rem 2rem;
      border-radius: 24px;
      font-size: 1.1rem;
      font-weight: 500;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

      img {
        width: 24px;
        height: 24px;
      }

      &:hover {
        transform: translateY(-2px);
        background: linear-gradient(135deg, rgba(72, 22, 150, 1), rgba(96, 35, 192, 1));
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
      }
    }
  }

  @media (max-width: 768px) {
    padding: 4rem 1rem 1rem;

    .header-section {
      h1 {
        font-size: 2rem;
      }

      .description {
        font-size: 1rem;
      }
    }

    .features-section {
      padding: 1.5rem;

      h2 {
        font-size: 1.5rem;
      }

      .feature-group {
        h3 {
          font-size: 1.2rem;
        }

        ul li {
          font-size: 0.9rem;
        }
      }
    }

    .github-button {
      padding: 0.8rem 1.5rem;
      font-size: 1rem;

      img {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
