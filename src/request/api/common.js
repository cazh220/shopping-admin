// 公共接口
import { get, post, put } from "../http"

export default {
  login: params => post("/admin/login", params), // 登录
  loginOut: params => get("/api/admin/v1/logout", params), // 登出

  getCommunityAllList: params => get("/api/admin/v1/plot/name/all", params), // 获取所有的小区
  getCommunityChartList: params => get("/api/admin/v1/plot/name", params), // 获取小区一张图 小区下拉列表
  getCommunityChart: params => get("/api/admin/v1/plot/picture/show", params), // 获取小区一张图小区点列表
  getCommunityChartDetail: params => get("/api/admin/v1/plot/picture/info", params), // 获取小区一张图小区点详情

  getAreaList: params => get("/api/admin/v1/area/get", params) // 获取省市区列表
}
