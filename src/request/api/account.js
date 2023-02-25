// 后台账号接口
import { get, post, put, del } from "../http"

export default {
  accountList: params => post("/api/admin/list", params), // 获取账号列表
  addAccount: params => post("/api/admin/add", params), // 新增账号
  resetPassword: params => post("/api/admin/edit", params), // 账号密码恢复
  delAccount: params => post("/api/admin/del", params), // 删除账号
  adminLogin: params => post("/api/admin/login", params), // 后台登录

  // 小程序账号
  appAccountList: params => post("/api/user/list", params), // 获取账号列表
  postAppAccount: params => post("/api/user/add", params), // 新增账号
  getAppAccount: params => post("/api/user/detail", params), // 获取账号详情
  editAppAccount: params => post("/api/user/edit", params), // 编辑账号
  delAppAccount: params => post("/api/user/del", params) // 删除账号
}
