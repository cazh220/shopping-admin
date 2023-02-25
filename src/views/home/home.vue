<template>
  <div id="Home">
    <div>
      <a-space class="facility-title">
        <div class="facility-title-box"></div>
        <div class="facility-title-text">数据概览</div>
      </a-space>
      <div class="gutter-row">
        <a-card class="gutter-box" hoverable :bordered="true" v-for="(item, index) in dataTotal" :key="index">
          <img class="icon" :src="item.icon" />
          <div class="dib guttet-content">
            <div class="gutter-title">{{ item.name }}</div>
            <div>
              <span class="gutter-left-text">{{ item.num }}</span>
              <span class="gutter-right-text">{{ item.unit }}</span>
            </div>
          </div>
        </a-card>
      </div>
    </div>

    <div>
      <a-space class="facility-title">
        <div class="facility-title-box"></div>
        <div class="facility-title-text">订单统计</div>
      </a-space>
      <div>
        <div id="bar"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      dataSource: [],
      tableLoading: false,
      page: 1,
      total: 0,
      dataTotal: [
        { name: "用户数量：", num: 0, unit: "人", icon: require("@/assets/icons/registrations_1.png") },
        { name: "商品数量：", num: 0, unit: "个", icon: require("@/assets/icons/registrations_2.png") },
        { name: "订单总数：", num: 0, unit: "个", icon: require("@/assets/icons/registrations_3.png") },
        { name: "昨日订单数：", num: 0, unit: "个", icon: require("@/assets/icons/registrations_4.png") }
      ]
    }
  },
  mounted() {
    this.getData()
    this.getStatisticsData()
  },
  methods: {
    // 查询所有数据
    getData() {
      this.$api
        .dataCount()
        .then(res => {
          this.dataTotal[0].num = res.data.list[0]
          this.dataTotal[1].num = res.data.list[2]
          this.dataTotal[2].num = res.data.list[1]
          this.dataTotal[3].num = res.data.list[3]
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    // 获取统计数据
    getStatisticsData() {
      this.$api
        .orderCount()
        .then(res => {
          this.$G2.initOrderChartColumn(this, res.data.list, "bar")
        })
        .catch(() => {
          this.tableLoading = false
        })
    }
  }
}
</script>

<style lang="less">
#Home {
  .facility-title {
    margin-left: 0px;
  }
  .ant-card-body {
    padding: 20px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .gutter-box {
    padding: 5px;
    border-radius: 5px;
    width: 20%;
    margin-right: 10px;
    .gutter-title {
      white-space: nowrap;
      font-size: 20px;
    }
    .gutter-left-text {
      font-size: 30px;
      color: #31c27c;
    }
    .gutter-right-text {
      font-size: 16px;
      margin-left: 10px;
    }
    .ant-card-body {
      display: flex;
      flex-wrap: nowrap;
    }
  }
  .gutter-box:last-child {
    margin-right: 0;
  }
  .guttet-content {
    height: 76px;
    margin-left: 10px;
  }
  .icon {
    width: 76px;
    height: 76px;
  }
  .gutter-row {
    display: flex;
    justify-content: space-between;
  }
}
</style>
