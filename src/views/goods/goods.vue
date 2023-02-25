<template>
  <div id="GoodsList">
    <a-space class="fl" size="middle">
        <div>
          <span>商品名称：</span>
          <div class="dib"><a-input v-model="filter.name" placeholder="请输入商品名称" allowClear /></div>
        </div>
        <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">查询</a-button>
      </a-space>
    <a-space class="fr">
      <a-button type="primary" icon="plus-circle" @click="add">新增</a-button>
    </a-space>
    <a-space direction="vertical" style="width: 100%">
      <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
        <a-table-column title="ID" data-index="id" align="center" :ellipsis="true" />
        <a-table-column title="品类" data-index="category_name" align="center" :ellipsis="true" />
        <a-table-column title="物品名称" data-index="name" align="center" :ellipsis="true" />
        <a-table-column key="pic" title="物品图片" data-index="pic" align="center">
          <template slot-scope="pic">
            <img class="img" @click="showPicture(pic)" :src="pic ? $com.showUpload() + pic : ''" />
          </template>
        </a-table-column>
        <a-table-column title="价格" data-index="price" align="center" :ellipsis="true" />
        <!-- <a-table-column title="状态" data-index="state_txt" align="center" :ellipsis="true" /> -->
        <a-table-column key="state" title="状态" data-index="state" align="center" :ellipsis="true">
          <template slot-scope="text, record">
            <a-popconfirm
              v-if="dataSource.length"
              :title="record.state ? '确定上架吗？' : '确定下架吗？'"
              okText="确定"
              cancelText="取消"
              :maskClosable="false"
              @confirm="() => ChangeGoodsState(record)"
              @cancel="record.state = !record.state"
            >
              <a-switch v-model="record.state" checked-children="上架" un-checked-children="下架" />
            </a-popconfirm>
          </template>
        </a-table-column>
        <a-table-column title="操作" data-index="option" align="center" :ellipsis="true">
          <template slot-scope="text, record">
            <a-button type="link" size="small" @click="edit(record.key)">编辑</a-button>
            <a-button type="link" size="small" @click="del(record.key)">删除</a-button>
          </template>
        </a-table-column>
      </a-table>
      <div class="flex-center mt30">
        <a-pagination v-model="page" show-quick-jumper :default-current="1" :total="total" hideOnSinglePage @change="getTableList()" />
      </div>
    </a-space>
    <!-- 新增编辑弹窗 -->
    <a-modal :title="modelTitle" :visible="visible" :confirm-loading="confirmLoading" destroyOnClose @ok="handleOk" @cancel="visible = false" :maskClosable="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 18, offset: 1 }">
        <a-form-model-item ref="category_id" label="商品品类：" prop="category_id" has-feedback>
          <a-select v-model="form.category_id" :options="categoryList" placeholder="请选择商品品类" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="name" label="商品名称：" prop="name" has-feedback>
          <a-input v-model="form.name" placeholder="请输入商品名称" allowClear />
        </a-form-model-item>
        <a-form-model-item ref="pic" label="商品图片" prop="pic" class="flex-center">
          <a-upload
            name="pic"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :action="$com.uploadUrl()"
            :before-upload="$utils.beforeUpload"
            @change="handleChange"
            @preview="handlePreview"
          >
            <img v-if="form.pic" :src="$com.showUpload() + form.pic" alt="pic" class="upImg" />
            <div v-else>
              <a-icon :type="imgLoading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传图片</div>
            </div> 
          </a-upload>
        </a-form-model-item>
        <a-form-model-item label="商品数量"><a-input-number v-model="form.num" :step="1"/><span class="ant-form-text"></span></a-form-model-item>
        <a-form-model-item label="现金价格"><a-input-number v-model="form.price" :step="0.01" /><span class="ant-form-text"> / 元</span></a-form-model-item>
        <a-form-model-item label="商品描述"><a-textarea v-model="form.desc" placeholder="请输入商品描述" :rows="4"/></a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal :visible="previewVisible" :width="500" :footer="null" @cancel="previewVisible = false">
      <div class="p20"><img alt="example" class="w100b" :src="previewImage" /></div>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "GoodsList",
  data() {
    return {
      filter: {
        name: ""
      },
      dataSource: [], // 物品列表
      categoryList: [], // 品类列表
      tableLoading: false,
      total: 1,
      page: 1,
      previewVisible: false,
      modelTitle: "新增物品",
      visible: false, //弹窗显示
      confirmLoading: false,
      form: {
        category_id: undefined,
        name: "",
        pic: "",
        price: 0,
        num: 0,
        desc: ""
      },
      previewImage: "",
      imgLoading: false,
      imageUrl: "", //  二进制图片流
      value: [],
      rules: {
        category_id: [{ required: true, message: "请选择商品品类", trigger: "blur" }],
        name: [{ required: true, message: "请输入商品名称", trigger: "change" }],
        pic: [{ required: true, trigger: "blur" }]
      }
    }
  },
  created() {
    this.$com.getCategorySelectList(this, "categoryList") // 品类列表
    this.getTableList()
  },
  methods: {
    // 获取物品列表
    getTableList() {
      this.tableLoading = true
      this.$api.goodsList({ page: this.page, name: this.filter.name, state: 0 }).then(res => {
        this.dataSource = res.data.list.map(item => {
          item.key = item.id
          item.price = item.price.toFixed(2)
          item.state = item.state == 1 ? true : false
          // item.state_txt = item.state == 1 ? '上架' : '下架'
          return item
        })
        this.tableLoading = false
        this.total = res.data.totalRows
      })
    },

    // 新增
    add() {
      this.resetForm()
      this.visible = true
      this.modelTitle = "新增商品"
    },

    // 编辑
    edit(id) {
      this.resetForm()
      this.visible = true
      this.modelTitle = "编辑物品"
      this.$api.detailGoods({ id }).then(res => {
        this.form.category_id = res.data.category_id
        this.form.name = res.data.name
        this.form.price = res.data.price
        this.form.num = res.data.num
        this.form.desc = res.data.desc
        this.form.id = res.data.id
        if (res.data.pic) this.form.pic = res.data.pic
      })
    },

    resetForm() {
      this.form = {
        category_id: undefined,
        name: "",
        pic: "",
        price: 0,
        num: 0,
        desc: ""
      }
    },

    // 弹窗确定
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          ;(this.modelTitle === "新增商品" ? this.$api.addGoods(this.form) : this.$api.editGoods(this.form))
            .then(res => {
              this.confirmLoading = false
              this.$message.success(res.message)
              this.visible = false
              this.getTableList()
            })
            .catch(err => {
              this.confirmLoading = false
            })
        }
      })
    },

    // 列表查看图片
    showPicture(picture_url = "") {
      this.previewImage = this.$com.showUpload() + picture_url
      this.previewVisible = true
    },

    // 图片预览
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.$utils.getBase64(file.originFileObj)
      }
      this.previewImage = file.url || this.$com.showUpload() + file.response.data.pic_url
      this.previewVisible = true
    },

    // 图片change
    handleChange(info) {
      if (info.file.status === "uploading") {
        this.imgLoading = true
        return
      }
      if (info.file.status === "done") {
        this.form.pic = info.file.response.data.pic
        this.imgLoading = false
      } else {
        this.form.pic = ""
      }
    },

    // 删除物品
    del(id) {
      let that = this
      this.$confirm({
        content: `确定删除该物品吗？`,
        onOk() {
          that.$api.stateGoods({ id: id, state: -1 }).then(res => {
            that.getTableList()
            that.$message.success(res.message)
          })
        }
      })
    },

    // 切换开关
    ChangeGoodsState(record) {
      this.$api
        .stateGoods({ id: record.key, state: record.state ? 1 : 0 })
        .then(res => {
          this.$message.success(res.message)
          this.getTableList()
        })
        .catch(err => {
          record.state = !record.state
        })
    }
  }
}
</script>

<style lang="less">
#GoodsList {
  .img {
    height: 24px;
  }
}
.upImg {
  width: 100px;
  height: 100px;
}
</style>
