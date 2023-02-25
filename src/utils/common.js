// 项目组件公共函数
const com = {
  // 选择器过滤函数
  filterOption(input, option) {
    return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  },

  // 上传文件地址
  uploadUrl() {
    return process.env.VUE_APP_UPLOAD_URL + "/api/upload"
  },
  // 显示图片地址的 前缀
  showUpload() {
    return process.env.VUE_APP_BASE_URL + "/"
  },

  /* 
    获取品类列表
    第一个参数传入this
    第二个参数为this对象里需要赋值数据的数组名
  */
  getCategorySelectList(that, name, data = {}) {
    that.$api.categoryAll(data).then(res => {
      that[name] = res.data.list.map(item => {
        item.label = item.name
        item.value = item.id
        return item
      })
    })
  }
}
export default com
