import axios from 'axios'

// 配置axios请求全局默认值
// axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 请求拦截器
axios.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么

  return config;
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error);
})

// 响应拦截器
axios.interceptors.response.use(function(response) {
  // 对响应数据做点什么

  return response;
}, function(error) {
  // 对响应错误做点什么
  return Promise.reject(error);
})

// 封装axios的get请求
let get = function(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, params)
    .then(response => {
      resolve(response.data);
    })
    .catch((error) => {
      console.group("请求失败：" + url);
      console.log("error：" + error);
      console.groupEnd();
      reject(error);
    })
  })
}

// 封装axios的post请求
let post = function(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
    .then(response => {
      resolve(response.data);
    })
    .catch((error) => {
      console.group("请求失败：" + url);
      console.log("error：" + error);
      console.groupEnd();
      reject(error);
    })
  })
}

export default {
  get: get,
  post: post,
}
