<template>
    <div id="BackgroundCategories">
      <div class="oh">
        <a-space class="fr">
          <a-button type="primary" @click="addCategory">新增</a-button>
        </a-space>
      </div>
      <div class="oh w100b mt20">
        <a-space direction="vertical" style="width: 100%">
          <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
            <a-table-column title="ID" data-index="id" align="center" :ellipsis="true" />
            <a-table-column title="名称" data-index="name" align="center" :ellipsis="true" />
            <a-table-column title="创建时间" data-index="create_time" align="center" :ellipsis="true" />
            <a-table-column key="option" title="操作" data-index="option" align="center" :ellipsis="true">
              <template slot-scope="text, record">
                <a-button type="link" size="small" @click="option('edit', record)">编辑</a-button>
                <a-button type="link" class="danger" size="small" @click="option('del', record)">删除</a-button>
              </template>
            </a-table-column>
          </a-table>
          <div class="flex-center mt30">
            <a-pagination v-model="filter.page" show-quick-jumper :default-current="1" hideOnSinglePage :total="total" @change="getTableList()" />
          </div>
        </a-space>
      </div>
  
      <a-modal :title="categoryTitle" :visible="categoryVisible" :confirm-loading="confirmLoading" @ok="changeCategoryOk" @cancel="changeCategoryCancel" destroyOnClose :maskClosable="false">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 14, offset: 1 }">
          <a-form-model-item ref="name" label="名称" prop="name" has-feedback>
            <a-input v-model="form.name" placeholder="请输入名称" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </template>
  
  <script>
  export default {
    name: "BackgroundCategories",
    data() {
      return {
        tableLoading: false,
        filter: {
          page: 1
        },
        form: {
          name: ""
        },
        rules: {
          name: [{ required: true, trigger: "change" }],
        },
        categoryTitle: "新增品类",
        categoryVisible: false, // 新增/编辑弹窗
        confirmLoading: false, // 新增/编辑弹窗 加载状态
        total: 0,
        dataSource: []
      }
    },
    created() {
      this.getTableList(1)
    },
    methods: {
      getTableList(page) {
        if (page) this.filter.page = page
        this.tableLoading = true
        this.$api
          .categoryList(this.filter)
          .then(res => {
            this.dataSource = res.data.list.map(item => {
              item.key = item.id
              return item
            })
            this.tableLoading = false
            this.total = res.data.totalRows
          })
          .catch(err => {
            this.tableLoading = false
          })
      },
  
      // 新增品类
      addCategory() {
        this.form = {
          name: "",
        }
        this.categoryTitle = "新增品类"
        this.categoryVisible = true
      },
  
      // 账号操作
      option(type, item) {
        if (type === "edit") {
            this.categoryTitle = "编辑品类"
            this.categoryVisible = true
            this.form.id = item.id
            this.form.name = item.name
        }
  
        if (type === "del") {
          let that = this
          this.$confirm({
            content: `确定删除品类：${item.name} 吗？`,
            onOk() {
              that.$api.categoryDel({ id: item.id }).then(res => {
                that.$message.success(res.message)
                that.getTableList()
              })
            }
          })
        }
      },
      // 确定新增
      changeCategoryOk() {console.log(this.form, this.categoryTitle)
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.confirmLoading = true
            if (this.categoryTitle == "编辑品类") {console.log(123)
                this.$api.categoryEdit(this.form).then(res => {
                this.$message.success(res.message)
                this.confirmLoading = false
                this.getTableList()
                this.categoryVisible = false
              }).catch(() => {
                this.confirmLoading = false
              })
            } else {
                this.$api.categoryAdd(this.form).then(res => {
                this.$message.success(res.message)
                this.confirmLoading = false
                this.getTableList()
                this.categoryVisible = false
              }).catch(() => {
                this.confirmLoading = false
              })
            }
            
          }
        })
      },
  
      // 取消 新增/编辑
      changeCategoryCancel() {
        this.categoryVisible = false
      }
    }
  }
  </script>
  
  <style lang="less">
  #BackgroundCategories {
    .danger {
      color: #ff4d4f;
    }
  }
  .dynamic-action-button {
    position: absolute;
    top: -6px;
    right: -50px;
    font-size: 20px;
    .anticon {
      vertical-align: -0.125em !important;
    }
  }
  </style>
  