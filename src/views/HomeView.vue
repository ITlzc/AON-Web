<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
</script>

<template>
  <div>
    <section class="section1 container">
      <div class="content">
        <div class="section1_left">
          <div class="p1">
            <p :style="locale === 'en' ? 'font-size: 4.01vw' : ''">{{ $t('section1_p1') }}</p>
            <p :style="locale === 'en' ? 'font-size: 4.01vw' : ''">{{ $t('section1_p2') }}</p>
          </div>

          <!-- <p class="p2">THE BEST WAY TO QUICKLY BUILD AND SHARE WEB3 AI APPS</p> -->
          <p class="p3">
            {{ $t('section1_p3') }}
          </p>
          <div class="btns">
            <a href="https://aonet.ai/" target="_blank" rel="noopener noreferrer">
              <button>{{ $t('section1_useAIAPI') }}</button>
            </a>
            <!-- <button class="blackBtn">D'AI Store</button> -->
          </div>
        </div>

        <img class='section1_right' src="@/assets/images/section1_right.png" alt="" />
      </div>

      <div class="section1_bt_text">
        <p>{{ $t('section1_Vision') }}</p>
        <p>{{ $t('section1_Mission') }}</p>
      </div>
    </section>

    <section class="section2 container">
      <div class="content partners">
        <p>{{ $t('section2_partners') }}</p>
        <div class="partners_logos">
          <img src="@/assets/images/partnersLogo1.png" alt="">
          <img src="@/assets/images/partnersLogo2.png" alt="">
          <img src="@/assets/images/partnersLogo3.png" alt="">
          <img src="@/assets/images/partnersLogo4.png" alt="">
          <img src="@/assets/images/partnersLogo5.png" alt="">
          <img src="@/assets/images/partnersLogo6.png" alt="">
          <img src="@/assets/images/partnersLogo7.png" alt="">
        </div>
      </div>
    </section>

    <section class="section3 container">
      <div class="content stateSystem">
        <p :style="{'font-size': locale === 'en' ? '2.66vw' : '4.17vw', textTransform: 'uppercase'}">{{ $t('section3_tit') }}</p>
        <div class="items">
          <div class="item">
            <img src="@/assets/images/stateSystem1.png" alt="">

            <p class="section3_item1_tit">{{ $t('section3_item1_tit') }}</p>
            <p>{{ $t('section3_item1_con') }}</p>
          </div>

          <div class="item">
            <img src="@/assets/images/stateSystem2.png" alt="">

            <p>{{ $t('section3_item2_tit') }} </p>
            <p>{{ $t('section3_item2_con') }}</p>
          </div>

          <div class="item">
            <img src="@/assets/images/stateSystem3.png" alt="">

            <p>{{ $t('section3_item3_tit') }} </p>
            <p>{{ $t('section3_item3_con') }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section4">
      <div class="container">
        <div class="content advantage">
          <div class="top_tit">
            <p :style="{'font-size': locale === 'en' ? '2.66vw' : '4.17vw'}">{{ $t('section4_tit') }}</p>
            <!-- <div class="more">查看更多</div> -->
          </div>
          <div class="items">
            <div class="item">
              <img src="@/assets/images/advantage1.png" class="advantage_img" alt="">
              <img src="@/assets/images/advantage1_h5.png" class="advantage_h5Img" alt="">
              <div>
                <img class="icon" src="@/assets/images/section4_icon1.png" alt="">
                <p :style="{'font-size': locale === 'en' ? '1.41vw' : '1.82vw', 'text-align': locale === 'en' ? 'center' : 'left'}">{{ $t('section4_p1') }}</p>
              </div>
            </div>

            <div class="item">
              <img src="@/assets/images/advantage2.png" class="advantage_img" alt="">
              <img src="@/assets/images/advantage2_h5.png" class="advantage_h5Img" alt="">

              <div>
                <img class="icon" src="@/assets/images/section4_icon2.png" alt="">
                <p :style="{'font-size': locale === 'en' ? '1.41vw' : '1.82vw', 'text-align': locale === 'en' ? 'center' : 'left'}">{{ $t('section4_p2') }}</p>
              </div>
            </div>

            <div class="item">
              <img src="@/assets/images/advantage3.png" class="advantage_img" alt="">
              <img src="@/assets/images/advantage3_h5.png" class="advantage_h5Img" alt="">

              <div>
                <img class="icon" src="@/assets/images/section4_icon3.png" alt="">
                <p :style="{'font-size': locale === 'en' ? '1.41vw' : '1.82vw', 'text-align': locale === 'en' ? 'center' : 'left'}">{{ $t('section4_p3') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="bgs">
        <img class="bg" src="@/assets/images/section4_bg.png" alt="">
        <!-- <img class="icon" src="@/assets/images/section4_icon.png" alt=""> -->
      </div>
    </section>

    <section class="section5 ">
      <div class="container">
        <div class="content open_model">
          <div class="top_tit">
            <div class="leftTex">
              <p>{{ $t('section5_tit') }}</p>
              <p :style="`margin-top: ${locale === 'en' && '0'}`">{{ $t('section5_sub_tit') }}</p>
            </div>
            <!-- <div class="more">查看更多</div> -->
          </div>
          <div class="items">
            <div class="item">
              <img class="bgImg" src="@/assets/images/openModel1.png" alt="">
              <div class="item_text">
                <p>Stable-Diffusion</p>
                <img class="rightIcon" src="@/assets/images/rightIcon.png" alt="">
              </div>
            </div>

            <div class="item">
              <img class="bgImg" src="@/assets/images/openModel2.png" alt="">
              <div class="item_text">
                <p>Face-To-Many</p>
                <img class="rightIcon" src="@/assets/images/rightIcon.png" alt="">
              </div>
            </div>

            <div class="item">
              <img class="bgImg" src="@/assets/images/openModel3.png" alt="">
              <div class="item_text">
                <p>Llama3</p>
                <img class="rightIcon" src="@/assets/images/rightIcon.png" alt="">
              </div>
            </div>

            <div class="item">
              <img class="bgImg" src="@/assets/images/openModel4.png" alt="">
              <div class="item_text">
                <p>Incredibly-Fast-Whisper</p>
                <img class="rightIcon" src="@/assets/images/rightIcon.png" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bgs">
        <img class="bg" src="@/assets/images/section5_bg.png" alt="">
      </div>
    </section>

    <section class="section6">
      <div class="container dAppStore">
        <div class="top_tit">
          <div class="leftTex">
            <p>{{ $t('section6_tit') }}</p>
            <p :style="`margin-top: ${locale === 'en' && '0'}`">{{ $t('section6_sub_tit') }}</p>
          </div>
        </div>
      </div>
      <div class="dAppStore_con">
        <div class="logo">
          <img src="@/assets/images/logo.png" alt="" />
        </div>
        <img class="dAppStore_bg" src="@/assets/images/dAppStore_bg.png" alt="">
      </div>

      <!-- <div class="useBtn">快速使用</div> -->
    </section>

    <section class="section7">
      <div class="container">
        <div class="top_tit">
          <div class="leftTex">
            <p>{{ $t('section7_tit') }}</p>
            <p :style="`margin-top: ${locale === 'en' && '0'}`">{{ $t('section7_sub_tit') }}</p>
          </div>
        </div>

        <div class="items">
          <div class="item">
            <div class="item_top">
              <img src="@/assets/images/section7Icon1.png" alt="">
              <p class="p1">{{ $t('section7_item1_tit') }}</p>
              <p :style="locale === 'en' && 'text-align: center'">{{ $t('section7_item1_con') }}</p>
            </div>
            <!-- <div class="more">阅读更多</div> -->
          </div>

          <div class="item">
            <div class="item_top">
              <img src="@/assets/images/section7Icon1.png" alt="">
              <p class="p1">{{ $t('section7_item2_tit') }}</p>
              <p :style="locale === 'en' && 'text-align: center'">{{ $t('section7_item2_con') }} </p>
            </div>

            <!-- <div class="more">阅读更多</div> -->
          </div>

          <div class="item">
            <div class="item_top">
              <img src="@/assets/images/section7Icon1.png" alt="">
              <p class="p1">{{ $t('section7_item3_tit') }}</p>
              <p :style="locale === 'en' && 'text-align: center'">{{ $t('section7_item3_con') }}</p>
            </div>

            <!-- <div class="more">阅读更多</div> -->
          </div>
        </div>
      </div>
    </section>

    <section class="section8 container">
      <div class="content joinUs">
        <div class="top_tit">
          <p :style="{'font-size': locale === 'en' ? '2.66vw' : '4.17vw'}">{{ $t('section8_tit') }}</p>
        </div>

        <div class="joinUs_con">
          <div class="joinUs_con_between">
            <div class="joinUs_con_item">
              <img src="@/assets/images/section8Icon1.png" alt="">
            </div>

            <div class="joinUs_con_item" style="padding: 0 2.34vw">
              <p class="joinUs_con_item_text" v-if="locale === 'zh'">现在开始学习如何构建创新的<span
                  style="color: #14F195;">AI</span>应用。</p>
              <p class="joinUs_con_item_text" style="text-align: center" v-else>Begin your journey in building innovative <span
                  style="color: #14F195;">AI</span> applications today.</p>

            </div>
          </div>

          <div class="joinUs_con_middle">
            <img src="@/assets/images/section8Icon2.png" alt="">
          </div>

          <div class="joinUs_con_between">
            <div class="joinUs_con_item section8_goExperience" :style="locale === 'en' && 'padding: 0 3.91vw'">
              <p class="joinUs_con_item_text" v-if="locale === 'zh'">快速体验大量的 <span style="color: #E3ED7C;">AI
                  DApps</span>吧</p>
              <p class="joinUs_con_item_text" style="text-align: center" v-else>Quickly experience a large number of <span
                  style="color: #E3ED7C;">AI DApps</span></p>
            </div>

            <div class="joinUs_con_item">
              <img src="@/assets/images/section8Icon3.png" alt="">
            </div>
          </div>

        </div>
      </div>
    </section>

    <footer>
      <div class="container footer_con">
        <div class="footer_left">
          <div class="logo">
            <img src="@/assets/images/logo.png" alt="" />
          </div>
          <p>{{ $t('foot_foundation') }}</p>
        </div>

        <div class="footer_right">
          <a href="https://discord.gg/XQxfY8xx" target="_blank" rel="noopener noreferrer"><img
              src="@/assets/images/discord.svg" alt=""></a>
          <a href="https://t.me/AGIOpenNetwork" target="_blank" rel="noopener noreferrer"><img
              src="@/assets/images/foot_tg.png" alt=""></a>
          <a href="https://medium.com/@aon_aonet" target="_blank" rel="noopener noreferrer"><img
              src="@/assets/images/foot_m.png" alt=""></a>
        </div>
      </div>
    </footer>
  </div>

</template>


<style src="../assets/homeView.css" scoped></style>