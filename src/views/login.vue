<template>
  <div class="login">
    <div class="lg">
      <div class="lg-title flex-between center">
        <span class="lg-title-text">{{ projectTitle }}</span>
      </div>
      <div class="lg-content">
        <div class="lg-content-title">平台登录</div>
        <a-form id="components-form-demo-normal-login" :form="form" @submit="handleSubmit">
          <a-form-item>
            <a-input v-decorator="['account', { rules: [{ required: true, message: '请输入用户名!' }] }]" placeholder="用户名：">
              <img src="../assets/zhanghu.png" slot="prefix" style="color: rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input v-decorator="['password', { rules: [{ required: true, message: '请输入密码!' }] }]" type="password" placeholder="密码：">
              <img src="../assets/mima.png" slot="prefix" style="color: rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" class="login-form-button mt30"> 登录 </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  components: {},
  data() {
    return {
      projectTitle: "购物管理后台"
    }
  },
  beforeCreate() {
    // 创建表单实例
    this.form = this.$form.createForm(this, { name: "login-form" })
  },
  methods: {
    // 登录
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$router.push({ name: "Home" })
          this.$api.adminLogin({ account: values.account, password: values.password }).then(res => {
            const userInfo = {
              account: values.account
            }
            localStorage.setItem("userInfo", JSON.stringify(userInfo))
            this.$router.push({ name: "Home" })
          })
        }
      })
    }
  }
}
</script>

<style>
.login {
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url("../assets/bg/login_bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}
.lg {
  width: 450px;
  height: 600px;
  position: absolute;
  right: 50%;
  top: 45%;
  margin-top: -300px;
  margin-right: -225px;
}
.logo {
  width: 45px;
}
.lg-title {
  height: 150px;
  width: 100%;
}
.lg-title-text {
  color: #fff;
  font-size: 34px;
  /* letter-spacing: 20px; */
  /* margin-right: -20px; */
}
.center {
  justify-content: center;
}
.lg-content {
  width: 450px;
  height: 450px;
  background-color: #0e1035;
  background-color: rgba(0, 0, 0, 0.45);
  border-radius: 10px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  padding: 50px;
}
.lg-content-title {
  height: 100px;
  width: 100%;
  font-size: 30px;
  color: #fff;
  text-align: center;
}
.login-form-button {
  width: 100%;
}
img {
  width: 15px;
}
</style>
