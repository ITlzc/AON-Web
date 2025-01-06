<template>
  <div class="coming-soon">
    <div class="content">
      <h1>Coming Soon</h1>
      <div class="description">
        <p>We are developing revolutionary Tokenization features</p>
        <div class="features">
          <div class="feature">
            <h3>Initial Agent Offering</h3>
            <p>A revolutionary way to launch and monetize AI Agents. Empower creators to tokenize their AI innovations, unlock funding, and provide value-driven services to users, creating endless opportunities in the AI ecosystem.</p>
          </div>
          <div class="feature">
            <h3>Initial Model Offering</h3>
            <p>Unlock the potential of powerful AI models with vast application scenarios and immense value. Tokenization provides developers with a fast track to discover users and monetize their innovations, revolutionizing the way AI models create impact.</p>
          </div>
          <div class="feature">
            <h3>Trade Token</h3>
            <p>The token issuance mechanism mirrors Pump.fun, with all Agent Tokens and Model Tokens entering the external exchange in 100% full circulation.<br><br>Be the first to spot high-value Agent and Model Tokens! 🚀</p>
          </div>
        </div>
      </div>
      <div class="countdown">
        <div class="timer">
          <span>Launch Soon</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic here
</script>

<style lang="scss" scoped>
.coming-soon {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #481696 0%, #8F85B8 100%);
  color: #ffffff;
  text-align: center;

  .content {
    max-width: 1000px;
    margin: 0 auto;
    padding: 60px 40px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(232, 225, 245, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

    h1 {
      font-size: 64px;
      margin-bottom: 30px;
      background: linear-gradient(45deg, #E8E1F5, #FFFFFF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .description {
      margin-bottom: 40px;

      > p {
        font-size: 24px;
        margin-bottom: 40px;
        color: #E8E1F5;
      }
    }

    .features {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
      margin-top: 40px;

      .feature {
        padding: 30px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        border: 1px solid rgba(232, 225, 245, 0.1);
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-5px);
        }

        h3 {
          font-size: 20px;
          margin-bottom: 15px;
          color: #E8E1F5;
        }

        p {
          font-size: 16px;
          line-height: 1.6;
          color: rgba(232, 225, 245, 0.8);
        }
      }
    }
  }

  .countdown {
    margin-top: 60px;

    .timer {
      display: inline-block;
      padding: 15px 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 30px;
      border: 1px solid rgba(232, 225, 245, 0.2);

      span {
        font-size: 24px;
        color: #E8E1F5;
      }
    }
  }
}

@media (max-width: 768px) {
  .coming-soon {
    padding: 20px;

    .content {
      padding: 40px 20px;

      h1 {
        font-size: 48px;
      }

      .description {
        > p {
          font-size: 20px;
        }
      }

      .features {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }
  }
}
</style>
