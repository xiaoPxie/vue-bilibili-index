import './index.scss'
import 'swiper/css/swiper.min.css'
import VueProgressiveImage from 'vue-progressive-image'
import '@/assets/js/common'
import Swiper from "swiper"

import axiosAjax from '@/apis/axios-ajax'
import axios from 'axios'
import ApiPath from '@/apis/api-path'
import {numberFormat} from '@/assets/js/utils'

//  图片懒加载
// Vue.use(VueLazyload, {
//   preLoad: 1.3, // 预加载页面高度比 默认1.3
//   error: './static/images/loading.svg',
//   loading: './static/images/loading.svg',
//   attempt: 3  // 当加载失败时，尝试再次加载的次数 默认3
// })

//  图片渐进式加载
Vue.use(VueProgressiveImage)

const vm = new Vue({
  el: '#index',
  data() {
    return {
      bannerSwiper: {},
      hotSearchList: [],
      navInfoList: [],
      navActiveIndex: 0,
      bannerInfoList: [],
      bannerActiveIndex: 0,
      showAllNav: false,
      dataInfoList: [],
      msgText: '正在获取数据，请稍等...'
    }
  },
  methods: {
    getSearchBoxContent() {
      axiosAjax.post(ApiPath.search.getDataInfo, {})
      .then(res => {
        console.log(res)
        this.hotSearchList = res.data
      }).catch(reason => {
        console.log("请求失败：" + reason);
      })
    },
    getNavInfo() {
      axiosAjax.post(ApiPath.index.getNavInfo, {})
      .then(res => {
        console.log(res)
        this.navInfoList = res.data.data
        this.navActiveIndex = this.navInfoList[0].id
        // 等待dom创建完成后，再创建swiper组件
        this.$nextTick(() => {
          new Swiper('.nav-swiper-container', {
            slidesPerView: "auto",
            freeMode: true,
          })
        })
      }).catch(reason => {
        console.log("请求失败：" + reason);
      })
    },
    getBannerInfo() {
      axiosAjax.post(ApiPath.index.getBannerInfo, {})
      .then(res => {
        console.log(res)
        this.bannerInfoList = res.data
        // 等待dom创建完成后，再创建swiper组件
        this.$nextTick(() => {
          this.bannerSwiper = new Swiper('.banner-swiper-container', {
            // spaceBetween: 10, // 10
            centeredSlides: true, // true
            loop: true,
            speed: 500,
            autoplay: {
              delay: 2500,
              disableOnInteraction: false,
            },
            pagination: {
              el: '.banner-swiper-pagination',
            },
            lazy: {
              loadPrevNext: true,
            },
            on: {
              slideChangeTransitionEnd: function(){
                vm.$data.bannerActiveIndex = this.activeIndex
                console.log(this.activeIndex);//切换结束时，告诉我现在是第几个slide
              },
            },
          })
        })
      }).catch(reason => {
        console.log("请求失败：" + reason);
      })
    },
    getDataInfo() {
      axiosAjax.post(ApiPath.index.getDataInfo, {
        page: 1, row: 16
      }).then(res => {
        console.log(res)
        this.dataInfoList.push(...res.data)
      }).catch(reason => {
        console.log("请求失败：" + reason);
        this.msgText = '加载失败！ 点击重新获取数据'
      })
    },
    numberFormat: numberFormat,
    scrollFetchData: _.throttle(function () {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop,  // 窗口滚动高度
        windowHeight = document.documentElement.clientHeight || document.body.clientHeight,    // 可视区域高度
        scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight   // body页面整体高度
      if (scrollTop + windowHeight > (scrollHeight * 0.85)) {
        this.msgText = '正在获取数据，请稍等...'
        this.getDataInfo()
      }
    }, 1000)
  },
  created() {
    this.getDataInfo()
    this.getNavInfo()
    this.getBannerInfo()
    this.getSearchBoxContent()
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.showAllNav = false
      this.scrollFetchData()
    }, false)
  }
})
