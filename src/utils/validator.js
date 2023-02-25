// 表单校验函数
const validator = {
  // 重新校验  再次打开对话框时需要重新校验
  resetFields(that, name = "ruleForm") {
    if (that.$refs[name]) {
      that.$refs[name].resetFields()
    }
  },

  // 手机号校验
  phone() {
    return (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"))
      } else {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error("请输入正确的手机号"))
        } else {
          callback()
        }
      }
    }
  },

  // 账号校验
  account() {
    return (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"))
      } else {
        if (!/^\w+$/.test(value)) {
          callback(new Error("账号仅支持英文、数字、下划线"))
        } else {
          callback()
        }
      }
    }
  }
}
export default validator
