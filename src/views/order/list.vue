<template>
  <div>
    <div class="oh">
      <a-space class="fl" size="middle">
        <div>
          <span>订单号：</span>
          <div class="dib"><a-input v-model="filter.order_no" placeholder="请输入订单号" allowClear /></div>
        </div>
        <a-button type="primary" :loading="tableLoading" @click="getOrderList(1)">查询</a-button>
      </a-space>
    </div>
    <div style="height: 20px"></div>
    <a-table :columns="columns" :data-source="dataSource" :pagination="false">
      <template slot="action" slot-scope="record">
        <a class="action" href="javascript:;" @click="onSend(record)" v-if="record.state == 0">发货</a>
        <a class="action" href="javascript:;" @click="onDelete(record)" v-if="record.state == 0">取消</a>
      </template>

      <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <a-table
          :columns="columnsGoods"
          :data-source="record.goods"
          :rowKey="
            (record, index) => {
              return index
            }
          "
          :pagination="false"
        >
        </a-table>
      </p>
    </a-table>
    <div class="flex-center mt30"> 
      <a-pagination v-model="page" show-quick-jumper :default-current="1" hideOnSinglePage :total="total" @change="getOrderList()" />
    </div>
  </div>
</template>
<script>
const columns = [
  { title: "ID", dataIndex: "id", key: "id" },
  { title: "订单号", dataIndex: "order_no", key: "order_no" },
  { title: "总金额", dataIndex: "amount", key: "amount" },
  { title: "订单状态", dataIndex: "state_txt", key: "state_txt" },
  { title: "用户", dataIndex: "user_name", key: "user_name" },
  { title: "地址", dataIndex: "address", key: "address" },
  { title: "操作", dataIndex: "", key: "x", scopedSlots: { customRender: "action" } }
]

const columnsGoods = [
  { title: "商品名称", dataIndex: "goods_name", key: "goods_name" },
  { title: "品类", dataIndex: "category_name", key: "category_name" },
  { title: "单价", dataIndex: "price", key: "price" },
  { title: "数量", dataIndex: "num", key: "num" }
]

export default {
  data() {
    return {
      filter: {
        order_no: ""
      },
      tableLoading: false,
      columns,
      columnsGoods,
      dataSource: [],
      dataGoodsSource: [],
      page: 1,
      total: 0
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    getOrderList() {
      this.tableLoading = true
      this.$api.orderList({ page: this.page, order_no: this.filter.order_no, user_id: 0, state: -2 }).then(res => {
        this.dataSource = res.data.list.map(item => {
          item.key = item.id
          if (item.state == 1) {
            item.state_txt = "已发货"
          } else if (item.state == -1) {
            item.state_txt = "已取消"
          } else {
            item.state_txt = "待发货"
          }
          this.dataGoodsSource = item.goods
          return item
        })
        this.tableLoading = false
        this.total = res.data.totalRows
      })
    },
    onSend(record) {
      let that = this
      this.$confirm({
        content: `确定发货吗？`,
        onOk() {
          that.$api.orderState({ id: record.id, state: 1 }).then(res => {
            that.getOrderList()
            that.$message.success(res.message)
          })
        }
      })
    },
    onDelete(record) {
      let that = this
      this.$confirm({
        content: `确定删除该订单吗？`,
        onOk() {
          that.$api.orderState({ id: record.id, state: -1 }).then(res => {
            that.getOrderList()
            that.$message.success(res.message)
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.action {
  margin: 0 10px;
}
</style>
