<template>
  <div class="landing">
    <section class="hero">
      <div class="hero-content">
        <h1>The Open Platform for AI Agents</h1>
<h1></h1>
        <h1>Empowering everyone to create, deploy, and monetize AI agents.</h1>
        <div class="cta-buttons">
          <button class="btn btn-primary" @click="createAgent">Create Agent</button>
          <button class="btn btn-secondary" @click="buildAidapp">Tokenize Agent</button>
        </div>
      </div>
    </section>

    <section class="cards-section">
      <div class="card">
        <div class="card-icon">
          <img src="@/assets/images/illustrations/ai-agent.svg" alt="AI Agent" />
        </div>
        <h3>Agent Creation</h3>
        <p>Build powerful AI Agents effortlessly with zero-code tools and AI models.</p>
      </div>
      <div class="card">
        <div class="card-icon">
          <img src="@/assets/images/illustrations/token.svg" alt="Agent Token" />
        </div>
        <h3>Agent Tokenization</h3>
        <p>Tokenize AI Agent through Initial Agent Offering (IAO)</p>
      </div>
      <div class="card">
        <div class="card-icon">
          <img src="@/assets/images/illustrations/marketplace.svg" alt="Marketplace" />
        </div>
        <h3>Agent Framework</h3>
        <p>Introduction of AON’s Full-Modality Multi-Agent Collaboration Framework</p>
      </div>
    </section>

    <section class="ai-agent-section">
      <h2>Agent Creation</h2>
      <div class="agent-content">
        <div class="agent-info">
          <h3>Create Your Own Agent</h3>
          <p>Build and customize your AI agent with powerful features</p>
          <ul>
            <li>Quickly create AI Agents with zero-code tools</li>
            <li>Build advanced AI Agents and applications using APIs for 3,000+ open-source models</li>
            <li>Enjoy free compute power with AON</li>
          </ul>
        </div>
        <div class="agent-showcase">
          <div class="agent-card">
            <img src="@/assets/images/illustrations/ai-agent.svg" alt="AI Assistant" />
            <h4>AI Assistant</h4>
            <p>Build AI Agents with zero-code tools </p>
          </div>
          <div class="agent-card">
            <img src="@/assets/images/illustrations/features.svg" alt="Custom Agent" />
            <h4>For professional developers</h4>
            <p>Leverage AI models to build powerful AI Agents</p>
          </div>
        </div>
      </div>
    </section>

    <section class="agent-pump-section">
      <h2>Tokenize AI Agents and Models</h2>
      <div class="pump-content">
        <div class="pump-stats">
          <div class="stat-card">
            <img src="@/assets/images/illustrations/token.svg" alt="Tokenization" />
            <h4>Tokenization</h4>
            <p>Tokenize AI Agents or AI Models</p>
          </div>
          <div class="stat-card">
            <img src="@/assets/images/illustrations/marketplace.svg" alt="Trading" />
            <h4>Trading</h4>
            <p>Unlock opportunities in early-stage projects.</p>
          </div>
 
        </div>
        <div class="pump-info">
          <h3>Initial Agent Offering + Initial Model Offering</h3>
          <ul>
            <li>On the AON platform, AI Models drive infinite AI Agent interactions, creating boundless business opportunities</li>
            <li>Both AI Agents and AI Models with wide application value can be commercialized through tokenization</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="community-section">
      <h2>Join Our Community</h2>
      <div class="social-links">
        <a v-for="(social, index) in socials" 
           :key="index"
           :href="social.link"
           target="_blank"
           rel="noopener noreferrer">
          <img :src="social.icon" :alt="social.name">
          {{ social.name }}
        </a>
      </div>
    </section>

    <div class="brand-logo">
      <img src="@/assets/images/home-logo.png" alt="Strategic Partners" />
    </div>

    <footer>
      <p>&copy; {{ currentYear }} AGI Open Network. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Card1 from '@/assets/images/card-1.svg'
import Card2 from '@/assets/images/card-2.svg'
import Card3 from '@/assets/images/card-3.svg'
import Card4 from '@/assets/images/card-4.svg'
import Card5 from '@/assets/images/card-5.svg'
import Card6 from '@/assets/images/card-6.svg'
import TwitterIcon from '@/assets/images/twitter.svg'
import DiscordIcon from '@/assets/images/discord.svg'
import MediumIcon from '@/assets/images/medium.svg'
import TelegramIcon from '@/assets/images/telegram.svg'

const router = useRouter()
const currentYear = computed(() => new Date().getFullYear())

const cards = ref([
  {
    title: 'Create',
    description: 'Build your own AI Agent with our intuitive platform, no coding required. Transform your ideas into reality.',
    image: Card1
  },
  {
    title: 'Deploy',
    description: 'One-click deployment to make your AI Agent accessible worldwide. Seamless integration with existing systems.',
    image: Card2
  },
  {
    title: 'Monetize',
    description: 'Turn your AI Agent into a revenue stream. Connect with users and earn through our pump mechanism.',
    image: Card3
  }
])

const features = ref([
  {
    title: 'Visual Builder',
    icon: Card1
  },
  {
    title: 'AI Models Hub',
    icon: Card2
  },
  {
    title: 'Agent Market',
    icon: Card3
  },
  {
    title: 'Token Economy',
    icon: Card4
  },
  {
    title: 'Analytics Dashboard',
    icon: Card5
  },
  {
    title: 'Community Hub',
    icon: Card6
  }
])

const socials = ref([
  {
    name: 'Twitter',
    icon: TwitterIcon,
    link: 'https://x.com/AGIOpenNetwork'
  },
  {
    name: 'Discord',
    icon: DiscordIcon,
    link: 'https://discord.gg/XQxfY8xx'
  },
  {
    name: 'Medium',
    icon: MediumIcon,
    link: 'https://medium.com/@aon_aonet'
  },
  {
    name: 'Telegram',
    icon: TelegramIcon,
    link: 'https://t.me/AGIOpenNetwork'
  }
])

const pumpStats = ref([
  {
    label: 'Total Agents',
    value: '1000'
  },
  {
    label: 'Total Pumps',
    value: '5000'
  },
  {
    label: 'Total Revenue',
    value: '$100000'
  }
])

const createAgent = () => {
  router.push('/create-agent')
}

const buildAidapp = () => {
  router.push('/tokenize-agent')
}
</script>

<style lang="scss" scoped>
.landing {
  position: relative;
  z-index: 2;
  padding-top: 120px;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #481696 0%, #8F85B8 100%);
}

.hero {
  position: relative;
  min-height: calc(75vh - 148px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 2% 30px;
  overflow: hidden;
  
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
  
  &-content {
    max-width: 1400px;
    width: 96%;
    position: relative;
    z-index: 2;
    backdrop-filter: blur(10px);
    padding: 24px 20px;
    border-radius: 20px;
    border: 1px solid rgba(232, 225, 245, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    margin-bottom: 24px;
    
    h1 {
      font-size: 56px;
      margin-bottom: 16px;
      font-weight: bold;
      background: linear-gradient(45deg, #E8E1F5, #FFFFFF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.2;
      padding: 0 20px;
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
      
      @media (max-width: 1200px) {
        font-size: 48px;
      }
      
      @media (max-width: 768px) {
        font-size: 36px;
        padding: 0;
      }
    }
    
    p {
      font-size: 24px;
      margin-bottom: 24px;
      color: #E8E1F5;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
      
      @media (max-width: 768px) {
        font-size: 18px;
        padding: 0 20px;
        margin-bottom: 20px;
      }
    }
  }
}

.cards-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding: 100px 5%;
  background: rgba(72, 22, 150, 0.1);
  backdrop-filter: blur(10px);
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  
  .card {
    background: rgba(232, 225, 245, 0.1);
    border: 1px solid rgba(143, 133, 184, 0.3);
    border-radius: 15px;
    padding: 30px;
    text-align: center;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    
    &:hover {
      transform: translateY(-5px);
      border-color: #481696;
      box-shadow: 0 8px 30px rgba(72, 22, 150, 0.2);
    }
    
    .card-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    
    h3 {
      font-size: 24px;
      margin-bottom: 15px;
      color: #FFFFFF;
    }
    
    p {
      color: #E8E1F5;
      line-height: 1.6;
    }
  }
}

.ai-agent-section, .agent-pump-section {
  padding: 100px 5%;
  background: rgba(72, 22, 150, 0.1);
  backdrop-filter: blur(10px);
  
  h2 {
    font-size: 36px;
    text-align: center;
    margin-bottom: 50px;
    background: linear-gradient(45deg, #E8E1F5, #FFFFFF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .agent-content, .pump-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 50px;
    max-width: 1200px;
    margin: 0 auto;
    align-items: center;
    
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }
  
  .agent-info, .pump-info {
    h3 {
      font-size: 28px;
      margin-bottom: 20px;
      color: #FFFFFF;
    }
    
    p {
      color: #E8E1F5;
      margin-bottom: 30px;
      font-size: 18px;
    }
    
    ul {
      list-style: none;
      padding: 0;
      
      li {
        color: #E8E1F5;
        margin-bottom: 15px;
        font-size: 16px;
        display: flex;
        align-items: center;
        
        &:before {
          content: "•";
          color: #8F85B8;
          font-size: 24px;
          margin-right: 10px;
        }
        
        @media (max-width: 1024px) {
          justify-content: center;
        }
      }
    }
  }
  
  .agent-showcase {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .agent-card {
    background: rgba(232, 225, 245, 0.1);
    border: 1px solid rgba(143, 133, 184, 0.3);
    border-radius: 15px;
    padding: 20px;
    text-align: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    
    &:hover {
      transform: translateY(-5px);
      border-color: #481696;
      box-shadow: 0 8px 30px rgba(72, 22, 150, 0.2);
    }
    
    img {
      width: 100%;
      max-width: 150px;
      margin-bottom: 15px;
    }
    
    h4 {
      color: #FFFFFF;
      margin-bottom: 10px;
      font-size: 18px;
    }
    
    p {
      color: #E8E1F5;
    }
  }
  
  .pump-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    max-width: 800px;
    margin: 0 auto;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .stat-card {
    background: rgba(232, 225, 245, 0.1);
    border: 1px solid rgba(143, 133, 184, 0.3);
    border-radius: 15px;
    padding: 30px;
    text-align: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    
    &:hover {
      transform: translateY(-5px);
      border-color: #481696;
      box-shadow: 0 8px 30px rgba(72, 22, 150, 0.2);
    }
    
    img {
      width: 50px;
      height: 50px;
      margin-bottom: 15px;
      transition: all 0.3s ease;
    }
    
    h4 {
      font-size: 32px;
      color: #FFFFFF;
      margin-bottom: 10px;
    }
    
    p {
      color: #E8E1F5;
      font-size: 16px;
    }
  }
}

.community-section {
  padding: 100px 5%;
  text-align: center;
  background: rgba(72, 22, 150, 0.1);
  backdrop-filter: blur(10px);
  max-width: 1200px;
  margin: 0 auto;
  
  h2 {
    font-size: 36px;
    margin-bottom: 40px;
    background: linear-gradient(45deg, #E8E1F5, #FFFFFF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .social-links {
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
    max-width: 800px;
    margin: 0 auto;
    
    a {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #E8E1F5;
      text-decoration: none;
      padding: 12px 24px;
      background: rgba(232, 225, 245, 0.1);
      border: 1px solid rgba(143, 133, 184, 0.3);
      border-radius: 12px;
      transition: all 0.3s ease;
      font-size: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      
      &:hover {
        background: rgba(232, 225, 245, 0.2);
        border-color: #481696;
        box-shadow: 0 8px 30px rgba(72, 22, 150, 0.2);
        color: #FFFFFF;
      }
      
      img {
        width: 24px;
        height: 24px;
      }
      
      @media (max-width: 768px) {
        width: 100%;
      }
    }
  }
}

.brand-logo {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1400px;
  padding: 0 20px;
  margin: 40px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  
  img {
    max-width: 1200px;
    width: 100%;
    height: auto;
    opacity: 0.9;
    filter: brightness(0.95);
    transition: all 0.3s ease;
    
    &:hover {
      opacity: 1;
      filter: brightness(1);
    }
    
    @media (max-width: 1200px) {
      max-width: 1000px;
    }
    
    @media (max-width: 768px) {
      max-width: 100%;
    }
  }
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    padding: 12px 30px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 500;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: 0.5s;
    }
    
    &:hover::before {
      left: 100%;
    }
    
    &-primary {
      background: #481696;
      color: #FFFFFF;
      border: none;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(72, 22, 150, 0.3);
      }
    }
    
    &-secondary {
      background: rgba(232, 225, 245, 0.1);
      color: #E8E1F5;
      border: 1px solid rgba(143, 133, 184, 0.3);
      
      &:hover {
        background: rgba(232, 225, 245, 0.2);
        transform: translateY(-2px);
        border-color: #481696;
        box-shadow: 0 8px 30px rgba(72, 22, 150, 0.2);
      }
    }
  }
}

footer {
  padding: 40px 5%;
  text-align: center;
  background: rgba(72, 22, 150, 0.2);
  color: #E8E1F5;
}
</style>
