import './search.scss'
import '@/assets/js/common'
import axiosAjax from '@/apis/axios-ajax'
import ApiPath from '@/apis/api-path'

new Vue({
  el: '#search',
  data() {
    return {
      searchInput: '',
      hotSearchList: [],
      historySearchList: [],
      searchList: [],
      placeholder: ''
    }
  },
  methods: {
    pageInit() {
      if(this.$cookies.get('searchList')) {
        this.historySearchList = JSON.parse(this.$cookies.get('searchList'))
      }
    },
    getSearchBoxContent() {
      axiosAjax.post(ApiPath.search.getDataInfo, {})
        .then(res => {
          console.log(res)
          this.hotSearchList = res.data
          this.placeholder = this.hotSearchList[0].title
        })
    },
    search: _.debounce(function () {
      if(this.searchInput === '')
        return false
      axiosAjax.post(ApiPath.search.getSearchInfo, {
        keyword: this.searchInput
      })
      .then(res => {
        console.log(res)
        this.searchList = res.data
        this.searchList.forEach(item => {
          item.title = `<span class="keyword">${this.searchInput}</span>` + item.title.slice(item.title.indexOf(this.searchInput)+this.searchInput.length)
        })
      })
    }, 500),
    userEnterSearch() {
      console.log(this.$cookies.get('searchList'))
      let list = []
      this.historySearchList = this.$cookies.get('searchList')
      if(this.historySearchList) {
        list = JSON.parse(this.historySearchList)
        if(list.length >= 10)
          list.shift()
      }
      list.push(this.searchInput)
      // 存储cookies
      this.$cookies.set("searchList", JSON.stringify(list), "7d");
      // 页面跳转
      location.href = `/search.html?keyword=${this.searchInput}`
    },
    clearHistorySearch() {
      // 清空历史搜索列表cookies
      this.$cookies.remove("searchList")
      // 清空列表
      this.historySearchList = []
    }
  },
  watch: {
    searchInput: function () {
      this.searchList = []
    }
  },
  created() {
    this.pageInit()
    this.getSearchBoxContent()
  }
})


