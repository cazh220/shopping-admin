// 公共接口
import { get, post, put } from "../http"

export default {
  getHomeData: params => get("/api/admin/v1/plot/user/participate/report/index", params) // 获取首页
}
