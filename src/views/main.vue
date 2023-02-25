<template>
  <a-layout id="main" style="height: 100%;">
    <a-layout-header class="header">
      <a-space :size="25">
        <!-- <img src="../assets/logo.png" class="logo" /> -->
        <span class="title">{{ projectTitle }}</span>
        <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="() => (collapsed = !collapsed)" />
      </a-space>
      <a-space :size="25" class="fr">
        <a-avatar style="backgroundColor:#31C27C" icon="user" />
        <a-dropdown :trigger="['click']">
          <a class="ant-dropdown-link white" @click="e => e.preventDefault()">欢迎您 ! {{ userName }} <a-icon type="down" /> </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;" @click="passwordVisible = true">修改密码</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" @click="loginOut">退出登录</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>

        <a-modal title="修改密码" :visible="passwordVisible" :confirm-loading="confirmLoading" @ok="changePasswordOk" @cancel="changePasswordCancel">
          <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 6, offset: 1 }" :wrapper-col="{ span: 14, offset: 1 }">
            <a-form-model-item ref="repassword" label="新的密码" prop="repassword" allowClear has-feedback>
              <a-input v-model="form.repassword" type="password" autocomplete="off" placeholder="请输入新密码" />
            </a-form-model-item>
            <a-form-model-item ref="confirm_password" label="确认密码" prop="confirm_password" allowClear has-feedback>
              <a-input v-model="form.confirm_password" type="password" autocomplete="off" placeholder="请输入新密码" />
            </a-form-model-item>
          </a-form-model>
        </a-modal>
      </a-space>
    </a-layout-header>

    <a-layout>
      <a-layout-sider v-model="collapsed" :trigger="null" collapsible id="sider">
        <a-menu :selectedKeys="selectedKeys" mode="inline" theme="dark" :defaultOpenKeys="openKeys" :open-keys="openKeys" @click="clickItem" @openChange="menuOpen">
          <template v-for="item in menu">
            <a-sub-menu v-if="item.children && item.children.length > 0" :key="item.key">
              <span slot="title">
                <img :src="item.icon" class="icon anticon" />
                <span>{{ item.title }}</span>
              </span>
              <template v-for="sitem in item.children">
                <a-sub-menu v-if="sitem.children && sitem.children.length > 0" :key="sitem.key">
                  <span slot="title">{{ sitem.title }}</span>
                  <a-menu-item v-for="ssitem in sitem.children" :key="ssitem.key">{{ ssitem.title }}</a-menu-item>
                </a-sub-menu>
                <a-menu-item v-else :key="sitem.key"> {{ sitem.title }} </a-menu-item>
              </template>
            </a-sub-menu>
            <a-menu-item v-else :key="item.key">
              <img :src="item.icon" class="icon anticon" />
              <span>{{ item.title }}</span>
            </a-menu-item>
          </template>
        </a-menu>
      </a-layout-sider>

      <a-layout class="content">
        <a-layout-content class="clearfix h100b">
          <keep-alive>
            <router-view class="view" v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view class="view" v-if="!$route.meta.keepAlive"></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  name: "Main",
  components: {},
  data() {
    return {
      projectTitle: "购物平台管理系统",
      routes: {}, // vue路由对象
      userName: "", // 用户名
      selectedKeys: [],
      openKeys: [],
      collapsed: false,
      userInfo: {},
      menu: [
        {
          key: "Home",
          title: "首页",
          icon: require("@/assets/icons/index-2.png")
        },
        {
          key: "Account",
          title: "账号管理",
          icon: require("@/assets/icons/quanxianguanli.png"),
          children: [
            { key: "AdminList", title: "后台账号" },
            { key: "UserList", title: "小程序账号" }
          ]
        },
        {
          key: "Resident",
          title: "商品管理",
          icon: require("@/assets/icons/juminguanli.png"),
          children: [
            { key: "GoodsList", title: "商品列表" },
            { key: "CategoryList", title: "品类管理" }
          ]
        },
        {
          key: "OrderList",
          title: "订单列表",
          icon: require("@/assets/icons/fenleiguanli.png")
        }
      ],
      passwordVisible: false,
      confirmLoading: false,
      form: {
        id: "",
        password: "",
        repassword: "",
        confirm_password: ""
      },
      rules: {
        password: [{ required: true, message: "请输入当前密码", trigger: "change" }],
        repassword: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请输入新的密码"))
              } else {
                if (this.form.confirm_password !== "") {
                  this.$refs.ruleForm.validateField("confirm_password")
                }
                callback()
              }
            },
            trigger: "change"
          }
        ],
        confirm_password: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入新的密码"))
              } else if (value !== this.form.repassword) {
                callback(new Error("两次密码不一致!"))
              } else {
                callback()
              }
            },
            trigger: "change"
          }
        ]
      }
    }
  },

  created() {
    this.handleMenu()
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || "未登录"
    console.log(userInfo, "userInfo")
    if (userInfo !== "未登录") {
      this.userName = userInfo.account
    } else {
      this.$router.push({ name: "Login" })
    }
  },

  methods: {
    // 刚进入页面处理选中的导航栏
    handleMenu() {
      const routeName = this.$route.name
      this.$route.matched.forEach(item => {
        if (item.name !== routeName) {
          this.openKeys.push(item.name)
        }
      })
      this.selectedKeys = [routeName]
    },
    // 展开导航菜单
    menuOpen(openKeys) {
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1)
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },

    // 选择导航二级菜单
    clickItem(v) {
      this.selectedKeys = [v.key]
      this.$router.push({ name: v.key })
    },

    // 修改密码确定
    changePasswordOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.form.repassword != this.form.confirm_password) {
            this.$message.warn("密码不一致")
          }

          this.$api.resetPassword({ account: this.userName, password: this.form.repassword }).then(res => {
            this.$message.success(res.message)
            this.passwordVisible = false
            this.clearForm()
            this.loginOut()
          })
        } else {
          return false
        }
      })
    },

    // 取消修改密码
    changePasswordCancel() {
      this.passwordVisible = false
    },

    // 清空表单
    clearForm() {
      this.form.password = ""
      this.form.repassword = ""
      this.form.confirm_password = ""
      this.$validator.resetFields(this)
    },

    // 登出
    loginOut() {
      // 这里简单只处理了下，如果正式实用的话，需要与后端接口交互，设计后台缓存、数据等处理
      localStorage.removeItem("userInfo")
      this.$message.success("退出成功")
      this.$router.push({ name: "Login" })
    }
  },
  computed: {
    rootSubmenuKeys: function() {
      return this.menu.map(item => {
        return item.key
      })
    }
  }
}
</script>

<style lang="less">
#main {
  .icon {
    height: 15px;
    margin-right: 10px;
    vertical-align: text-top;
  }
  .ant-layout-header {
    padding: 0 25px;
    background-color: #222222;
  }
  .logo {
    height: 31px;
    margin: 16px 0 16px 0;
  }
  .title {
    color: #fff;
    font-size: 20px;
    vertical-align: middle;
  }
  .trigger {
    color: #fff;
    font-size: 20px;
    vertical-align: middle;
  }

  .content {
    display: inline-block;
    overflow: auto;
    height: 100%;
  }
  .view {
    background-color: #fff;
    padding: 30px;
    // margin: 10px;
    min-height: 90%;
  }
}
</style>
