import Vue from "vue"
import VueRouter from "vue-router"
import { message } from "ant-design-vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/login",
    name: "Login",
    meta: { title: "登录" },
    component: () => import("@/views/login.vue")
  },
  {
    path: "/",
    name: "Main",
    meta: { title: "首页" },
    component: () => import("@/views/main.vue"),
    children: [
      {
        path: "/home",
        name: "Home",
        meta: { title: "首页" },
        component: () => import("@/views/home/home.vue")
      },
      {
        path: "/adminlist",
        name: "AdminList",
        meta: { title: "管理员列表 " },
        component: () => import("@/views/account/background-account.vue")
      },
      {
        path: "/userlist",
        name: "UserList",
        meta: { title: "用户列表 " },
        component: () => import("@/views/account/app-account.vue")
      },
      {
        path: "orderlist",
        name: "OrderList",
        meta: { title: "订单列表" },
        props: route => ({ query: route.query }),
        component: () => import("@/views/order/list.vue")
      }
    ]
  },
  {
    path: "/goods",
    name: "Goods",
    meta: { title: "商品管理" },
    component: () => import("@/views/main.vue"),
    children: [
      {
        path: "goodslist",
        name: "GoodsList",
        meta: { title: "商品列表" },
        props: route => ({ query: route.query }),
        component: () => import("@/views/goods/goods.vue")
      },
      {
        path: "categorylist",
        name: "CategoryList",
        meta: { title: "品类列表" },
        props: route => ({ query: route.query }),
        component: () => import("@/views/goods/category.vue")
      }
    ]
  }
]

const router = new VueRouter({
  mode: "history",
  routes
})

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default router
