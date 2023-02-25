// 后台账号接口
import { get, post, put, del } from "../http"

export default {
  categoryList: params => post("/api/category/list", params), // 品类列表
  categoryAdd: params => post("/api/category/add", params), // 品类添加
  categoryEdit: params => post("/api/category/edit", params), // 品类编辑
  categoryDel: params => post("/api/category/del", params), // 品类删除
  categoryAll: params => post("/api/category/all", params), // 获取品类下拉列表

  goodsList: params => post("/api/goods/list", params), // 商品列表
  addGoods: params => post("/api/goods/add", params), // 商品添加
  editGoods: params => post("/api/goods/edit", params), // 商品编辑
  detailGoods: params => post("/api/goods/detail", params), // 商品详情
  stateGoods: params => post("/api/goods/state", params) // 商品状态修改
}
