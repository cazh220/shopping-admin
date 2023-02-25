// 后台账号接口
import { get, post, put, del } from "../http"

export default {
  orderList: params => post("/api/order/list", params), // 订单列表
  orderState: params => post("/api/order/state", params), // 订单状态修改
  orderCount: params => post("/api/order/count", params), // 订单统计
  dataCount: params => post("/api/total", params) //统计
}
