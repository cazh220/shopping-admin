<template>
  <div id="BackgroundAccount">
    <div class="oh">
      <a-space class="fr">
        <a-button type="primary" @click="addAccount">新增</a-button>
      </a-space>
    </div>
    <div class="oh w100b mt20">
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
          <a-table-column title="ID" data-index="id" align="center" :ellipsis="true" />
          <a-table-column title="账号" data-index="account" align="center" :ellipsis="true" />
          <a-table-column title="上次登录时间" data-index="last_login_time" align="center" :ellipsis="true" />
          <a-table-column title="创建时间" data-index="create_time" align="center" :ellipsis="true" />
          <a-table-column key="option" title="操作" data-index="option" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              <a-button type="link" size="small" @click="option('reset', record)">重置密码</a-button>
              <a-button type="link" class="danger" size="small" @click="option('del', record)">删除账号</a-button>
            </template>
          </a-table-column>
        </a-table>
        <div class="flex-center mt30">
          <a-pagination v-model="filter.page" show-quick-jumper :default-current="1" hideOnSinglePage :total="total" @change="getTableList()" />
        </div>
      </a-space>
    </div>

    <a-modal :title="accountTitle" :visible="accountVisible" :confirm-loading="confirmLoading" @ok="changeAccountOk" @cancel="changeAccountCancel" destroyOnClose :maskClosable="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 14, offset: 1 }">
        <a-form-model-item ref="account" label="账号" prop="account" has-feedback>
          <a-input v-model="form.account" placeholder="请输入账号" />
        </a-form-model-item>
        <a-form-model-item label="初始密码">
          <span>12345678</span>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "BackgroundAccount",
  data() {
    return {
      tableLoading: false,
      filter: {
        page: 1
      },
      form: {
        account: ""
      },
      rules: {
        account: [{ required: true, validator: this.$validator.account(), trigger: "change" }],
      },
      accountTitle: "新增账号",
      accountVisible: false, // 新增/编辑账号弹窗
      confirmLoading: false, // 新增/编辑账号弹窗 加载状态
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
        .accountList(this.filter)
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

    // 新增账号
    addAccount() {
      this.form = {
        account: "",
        password: 123456
      }
      this.accountTitle = "新增账号"
      this.accountVisible = true
    },

    // 账号操作
    option(type, item) {
      const that = this
      if (type === "reset") {
        this.$confirm({
          content: `确定恢复账号：${item.account} 的密码为初始密码吗？`,
          onOk() {
            that.$api.resetPassword({ account: item.account, password: 123456 }).then(res => {
              that.$message.success("成功")
            })
          }
        })
      }

      if (type === "del") {
        this.$confirm({
          content: `确定删除账号：${item.account} 吗？`,
          onOk() {
            that.$api.delAccount({ account: item.account }).then(res => {
              that.$message.success(res.message)
              that.getTableList()
            })
          }
        })
      }
    },

    // 切换开关
    ChangeAccountState(record) {
      this.$api
        .ChangeAccountState({ id: record.key, admin_type: record.admin_type ? 1 : 0 })
        .then(res => {
          this.$message.success(res.msg)
        })
        .catch(err => {
          record.admin_type = !record.admin_type
        })
    },
    // 确定新增
    changeAccountOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          this.$api.addAccount(this.form).then(res => {
              this.$message.success(res.message)
              this.confirmLoading = false
              this.getTableList()
              this.accountVisible = false
            }).catch(() => {
              this.confirmLoading = false
            })
        }
      })
    },

    // 取消 新增/编辑账号
    changeAccountCancel() {
      this.accountVisible = false
    }
  }
}
</script>

<style lang="less">
#BackgroundAccount {
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
