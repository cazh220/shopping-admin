<template>
  <div id="AppAccount">
    <div class="oh">
      <a-space class="fl" size="middle">
        <div>
          <span>手机号：</span>
          <div class="dib"><a-input v-model="filter.phone" placeholder="请输入手机号" allowClear /></div>
        </div>
        <a-button type="primary" :loading="tableLoading" @click="getTableList(1)">查询</a-button>
      </a-space>
      <a-space class="fr">
        <a-button type="primary" @click="addAccount">新增</a-button>
      </a-space>
    </div>
    <div class="oh w100b mt20">
      <a-space direction="vertical" style="width: 100%">
        <a-table size="middle" :data-source="dataSource" :pagination="false" :loading="tableLoading">
          <a-table-column title="账号" data-index="phone" align="center" :ellipsis="true" />
          <a-table-column title="名称" data-index="name" align="center" :ellipsis="true" />
          <a-table-column title="余额" data-index="money" align="center" :ellipsis="true" />
          <a-table-column title="地址" data-index="address" align="center" :ellipsis="true" />
          <a-table-column key="option" title="操作" data-index="option" align="center" :ellipsis="true">
            <template slot-scope="text, record">
              <a-button type="link" size="small" @click="option('edit', record)">编辑</a-button>
              <a-button v-if="!record.account_type" type="link" class="danger" size="small" @click="option('del', record)">删除账号</a-button>
            </template>
          </a-table-column>
        </a-table>
        <div class="flex-center mt30">
          <a-pagination v-model="filter.page" show-quick-jumper :default-current="1" :total="total" @change="getTableList()" />
        </div>
      </a-space>
    </div>

    <a-modal :title="accountTitle" :visible="accountVisible" :confirm-loading="confirmLoading" @ok="changeAccountOk" @cancel="changeAccountCancel" destroyOnClose :maskClosable="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4, offset: 1 }" :wrapper-col="{ span: 14, offset: 1 }">
        <a-form-model-item ref="phone" label="账号" prop="phone" has-feedback>
          <a-input v-model="form.phone" placeholder="请输入手机号" :disabled="phoneDisabled" />
        </a-form-model-item>
        <a-form-model-item ref="name" label="名称" prop="name" has-feedback>
          <a-input v-model="form.name" placeholder="请输入名称" />
        </a-form-model-item>
        <a-form-model-item ref="password" label="密码" prop="password" has-feedback>
          <a-input v-model="form.password" placeholder="请输入密码" :disabled="pwdDisabled" />
        </a-form-model-item>
        <a-form-model-item ref="money" label="余额" prop="money" has-feedback>
          <a-input v-model="form.money" placeholder="请输入余额" />
        </a-form-model-item>
        <a-form-model-item ref="address" label="地址" prop="address" has-feedback>
          <a-input v-model="form.address" placeholder="请输入地址" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "AppAccount",
  data() {
    return {
      tableLoading: false,
      filter: {
        phone: "",
        page: 1
      },
      form: {
        phone: "",
        name: "",
        password: "",
        money: 0,
        address: ""
      },
      rules: {
        phone: [{ required: true, validator: this.$validator.phone(), trigger: "change" }],
        password: [{ required: true, message: "请输入密码", trigger: "change" }]
      },
      phoneDisabled: false,
      pwdDisabled: false,
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
      this.$api.appAccountList(this.filter).then(res => {
        this.dataSource = res.data.list.map(item => {
          item.key = item.id
          return item
        })
        this.tableLoading = false
        this.total = res.data.totalRows
      })
    },

    // 新增账号
    addAccount() {
      this.form = {
        phone: "",
        name: "",
        money: 0,
        address: ""
      }
      this.accountTitle = "新增账号"
      this.accountVisible = true
      this.phoneDisabled =false
      this.pwdDisabled = false
    },

    // 账号操作
    option(type, item) {
      const that = this
      if (type === "edit") {
        that.phoneDisabled =true
        that.pwdDisabled = true
        this.$api.getAppAccount({ phone: item.phone }).then(res => {
          this.accountTitle = "编辑账号"
          this.accountVisible = true
          this.form.id = res.data.id
          this.form.phone = res.data.phone
          this.form.name = res.data.name
          this.form.password = res.data.password
          this.form.address = res.data.address
        })
      }

      if (type === "del") {
        this.$confirm({
          content: `确定删除账号：${item.phone} 吗？`,
          onOk() {
            that.$api.delAppAccount({ phone: item.phone }).then(res => {
              that.$message.success(res.message)
              that.getTableList()
            })
          }
        })
      }
    },

    // 确定新增/编辑账号
    changeAccountOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          ;(this.accountTitle === "新增账号" ? this.$api.postAppAccount(this.form) : this.$api.editAppAccount(this.form))
            .then(res => {
              this.$message.success(res.message)
              this.confirmLoading = false
              this.getTableList()
              this.accountVisible = false
            })
            .catch(() => {
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
// #AppAccount {
// }
</style>
