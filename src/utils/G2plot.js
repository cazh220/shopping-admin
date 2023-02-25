import { Column } from "@antv/g2plot"
const G2 = {
  initOrderChartColumn(that, data, boxName) {
    let options = {
      data,
      xField: "date",
      yField: "nums",
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false
        }
      },
      yAxis: {
        // max: 10,
        // min: 0,
      },
      maxColumnWidth: 20,
      seriesField: "name",
      isGroup: "true",
      columnStyle: { radius: [20, 20, 20, 20] },
      meta: {
        nums: {
          alias: "比率",
          formatter: value => {
            return value
          }
        },
        name: {
          alias: "名称"
        }
      }
    }
    if (that[boxName]) {
      that[boxName].update(options)
    } else {
      that[boxName] = new Column(boxName, options)
      that[boxName].render()
    }
  }
}
export default G2
