import axios from "axios"
import { message } from "ant-design-vue"
import router from "../router/index.js"
message.config({ duration: 3, maxCount: 3 })

// 配置环境
// axios.defaults.baseURL = ""
if (process.env.NODE_ENV !== "development") {
  axios.defaults.baseURL = process.env.VUE_APP_BASE_URL
}
//超时
axios.defaults.timeout = 5000
//post请求头
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8" //urlencoded 不能少一个末尾的d
//请求拦截器
axios.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.error(error)
  }
)

//响应拦截器
axios.interceptors.response.use(
  // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
  // 否则的话抛出错误
  response => {
    if (response.data.code === 200) {
      return Promise.resolve(response)
    } else {
      if (response.data.code === -1) {
        router.push({ name: "Login" })
        message.error("请先登录")
      } else {
        message.error(response.data.msg || "请求失败")
        return Promise.reject(response)
      }
    }
  },
  // 服务器状态码不是2开头的的情况
  // 这里可以跟你们的后台开发人员协商好统一的错误状态码
  // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
  // 下面列举几个常见的操作，其他需求可自行扩展
  error => {
    //状态码非200的情形
    if (error.response.status) {
      switch (error.response.status) {
        case 404:
          message.error("请求的页面不存在")
          break
        default:
          message.error(error.response.data)
      }
      return Promise.reject(error.response)
    }
  }
)

//GET请求 参数：params
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

//POST请求  参数：params
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

//上传请求  参数：formData
export function upload(url, data) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

//封装patch请求  参数:params
export function patch(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .patch(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

//封装put请求 参数:params
export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios
      .put(url, data)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

//封装delete请求  参数:params
export function del(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, { data })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
