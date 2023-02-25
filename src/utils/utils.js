// 公共方法
const utils = {
  // 深拷贝
  deepCopy: obj => {
    if (!obj) return
    let newObj
    try {
      newObj = obj.constructor && obj.constructor === Array ? [] : {}
      newObj.constructor = obj.constructor
    } catch (e) {
      newObj = []
    }
    if (typeof obj !== "object") {
      return
    } else {
      for (let prop in obj) {
        if (!obj[prop] || obj[prop].constructor === RegExp || obj[prop].constructor === Date) {
          newObj[prop] = obj[prop]
        } else if (typeof obj[prop] === "object") {
          // 递归
          newObj[prop] = utils.deepCopy(obj[prop])
        } else {
          newObj[prop] = obj[prop]
        }
      }
    }
    return newObj
  },

  // 图片编码
  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  },

  // 图片上传前校验
  beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
    if (!isJpgOrPng) {
      this.$message.error("只能上传jpeg/png格式的图片!")
    }
    const isLt2M = file.size / 1024 / 1024 < 4
    if (!isLt2M) {
      this.$message.error("图片应小于 4MB!")
    }
    return isJpgOrPng && isLt2M
  },

  // 中国标准时间转为常规日期格式   Thu Mar 07 2019 00:00:00 GMT+0800 (中国标准时间) => 2019-03-07 00:00:00
  forMatDate(date) {
    function formatTen(num) {
      return num > 9 ? num + "" : "0" + num
    }
    const d = new Date(date)
    return d.getFullYear() + "-" + formatTen(d.getMonth() + 1) + "-" + formatTen(d.getDate()) + " " + formatTen(d.getHours()) + ":" + formatTen(d.getMinutes()) + ":" + formatTen(d.getSeconds())
  },

  // 日期转为中国标准时间  2019-03-07 00:00:00 => Thu Mar 07 2019 00:00:00 GMT+0800 (中国标准时间)
  parserDate(date) {
    let t = Date.parse(date)
    if (!isNaN(t)) {
      return new Date(Date.parse(date.replace(/-/g, "/")))
    }
  },

  // 数组分割为指定长度的数组
  sliceArrFn(array, size) {
    let result = []
    for (let x = 0; x < Math.ceil(array.length / size); x++) {
      let start = x * size
      let end = start + size
      result.push(array.slice(start, end))
    }
    return result
  }
}
export default utils
