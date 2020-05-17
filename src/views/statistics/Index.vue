<template>
  <div class="width-100-per height-100-per layout-column">
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card :hoverable=true :loading=cardLoading>
          <a-statistic
            title="当月销售总额"
            :value="totalSale"
            :precision="2"
            :valueStyle="{color: '#3f8600'}"
            style="margin-right: 50px"
          >
            <template slot="prefix">
              <a-icon type="dollar"/>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card :hoverable=true :loading=cardLoading>
          <a-statistic
            title="当月畅销药物"
            :precision="2"
            :valueStyle="{color: '#fbab00'}"
            style="margin-right: 50px"
          >
            <template slot="formatter">
              <span>{{durgTrophy}}</span>
            </template>
            <template slot="prefix">
              <a-icon type="trophy"/>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card :hoverable=true :loading=cardLoading>
          <template v-if="saleRatio>0">
            <a-statistic
              title="上月涨跌幅"
              :value="saleRatio"
              :precision="2"
              suffix="%"
              :valueStyle="{color: '#cf1322'}"
              style="margin-right: 50px"
            >
              <template slot="prefix">
                <a-icon type="arrow-up"/>
              </template>
            </a-statistic>
          </template>
          <template v-else>
            <a-statistic
              title="上月涨跌幅"
              :value="saleRatio"
              :precision="2"
              suffix="%"
              :valueStyle="{color: '#0dcf0d'}"
              style="margin-right: 50px"
            >
              <template slot="prefix">
                <a-icon type="arrow-down"/>
              </template>
            </a-statistic>
          </template>
        </a-card>
      </a-col>
    </a-row>
    <div class="bg-color-white width-100-per layout-column padding-10-px" style="height: calc(100% - 119px)">
      <div class="layout-right-top">
        <div class="width-100-per layout-side">
          <div>
            <span>年</span>&nbsp;&nbsp;
            <a-select :defaultValue="defaultYear" @change="changeYear" style="width: 100px">
              <template v-for="(i,index) in 10">
                <template v-if="defaultYear-index>2017">
                  <a-select-option :key="index" :value="defaultYear-index">{{defaultYear-index}}</a-select-option>
                </template>
              </template>
            </a-select>&nbsp;&nbsp;
            <span>月</span>&nbsp;&nbsp;
            <a-select v-model="defaultMonth" @change="changeMonth" style="width: 100px">
              <a-select-option v-for="i in 12" :key="i" :value="i">{{i}}</a-select-option>
            </a-select>
          </div>
          <div>
            <a-button-group>
              <a-button value="a" @click="clickBt1" type="primary" :ghost="bt1">
                <a-icon type="line-chart"/>
                药物销售额
              </a-button>
              <a-button value="b" @click="clickBt2" type="primary" :ghost="bt2">
                <a-icon type="bar-chart"/>
                药物销量
              </a-button>
              <a-button value="c" @click="clickBt3" type="primary" :ghost="bt3">
                <a-icon type="pie-chart"/>
                药物分布
              </a-button>
            </a-button-group>
          </div>
        </div>
      </div>
      <div class="width-100-per" style="height: calc(100% - 42px); overflow: hidden">
        <div v-show="showChart1" id="chart1"></div>
        <div v-show="showChart2" id="chart2"></div>
        <div v-show="showChart3" id="chart3"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from "moment"
  import G2 from '@antv/g2'
  import {Row, Col, Card, Statistic, Icon, Button, Select} from 'ant-design-vue'
  import {availableContentHeight} from "../../lib/utils";

  export default {
    name: "Index",
    components: {
      ARow: Row,
      ACol: Col,
      ACard: Card,
      AStatistic: Statistic,
      AIcon: Icon,
      ASelect: Select,
      ASelectOption: Select.Option,
      AButton: Button,
      AButtonGroup: Button.Group,
    },
    data() {
      return {
        contentHight: 100,
        cardLoading: false,
        showChart1: true,
        showChart2: true,
        showChart3: true,
        bt1: false,
        bt2: true,
        bt3: true,
        defaultYear: new Date().getFullYear(),
        defaultMonth: new Date().getMonth() + 1,
        defaultDay: new Date().getDate(),
        year: '',
        month: '',
        soldData: [],
        totalSale: 0,
        afterTotalSale: 0,
        durgTrophy: '',
        dateFormat: 'YYYY-MM',
        xArr: [],
        sxData: [],
        typeTotalSale: 0,
        // saleRatio: 0,
      }
    },
    watch: {
      xArr() {
        document.getElementById("chart1").innerHTML = "";
        document.getElementById("chart2").innerHTML = "";
        this.zx();
        this.zz();
      },
      soldData() {
        document.getElementById("chart1").innerHTML = "";
        document.getElementById("chart2").innerHTML = "";
        document.getElementById("chart3").innerHTML = "";
        this.zx();
        this.zz();
        this.sx();
      }
    },
    computed: {
      saleRatio: {
        get: function () {
          if (this.totalSale === 0 && this.afterTotalSale === 0) {
            return 0
          } else {
            return ((this.totalSale - this.afterTotalSale) / this.totalSale) * 100
          }
        },
        set: function (newValue) {
          console.log(newValue)
        }
      }
    },
    mounted() {
      this.contentHight = availableContentHeight(320);
      window.onresize = () => {
        this.contentHight = availableContentHeight(320);
      };
      this.initDefaultDate();
      // this.showChart2 = false;
      // this.showChart3 = false;
    },
    methods: {
      // 获取指定月份天数
      mGetDate(year, month) {
        let d = new Date(year, month, 0);
        return d.getDate();
      },
      // 计算当月销售总额
      saleTotal(data) {
        const that = this;
        if (data.length === 0) {
          that.totalSale = 0;
          that.durgTrophy = '暂无';
          return
        }
        let saleList = [];
        let result = {};
        let data1 = [];
        that.totalSale = 0;
        for (let i = 0; i < data.length; i++) {
          if (data[i].saleNumber > 0) {
            saleList.push({
              name: data[i].durg.name,
              totalPrice: data[i].saleNumber * Number(data[i].durg.price),
              sale: data[i].saleNumber
            });
          }
        }
        // 计算销售总额
        saleList.forEach(v => that.totalSale += v.totalPrice);
        // 找出同类销售物并计算销售总量
        saleList.forEach(v => {
          if (result[v.name]) {
            result[v.name] += v.sale
          } else {
            result[v.name] = v.sale
          }
        });
        for (let r in result) {
          data1.push({
            name: r,
            saleNumber: result[r]
          })
        }
        data1.sort(function (a, b) {
          return b.saleNumber - a.saleNumber
        });
        that.durgTrophy = data1[0].name;
      },
      // 初始进来默认查询当月记录
      initDefaultDate() {
        const that = this;
        let year = that.defaultYear;
        let month = that.defaultMonth;
        that.xArr = [];
        // 计算当月天数
        let dayTotal = that.mGetDate(year, month);
        for (let d = 1; d <= dayTotal; d++) {
          that.xArr.push(String(d))
        }
        // 组装当月和下月日期
        if (month === 12) {
          that.findSoltByTime(String(year) + '-' + String(month), String((year + 1)) + '-01');
          return
        }
        let defaultYear = String(year);
        let afterMonth = (month + 1) < 10 ? "0" + (month + 1) : String((month + 1));
        let defaultDate = moment(new Date()).format(that.dateFormat);
        let afterDate = defaultYear + '-' + afterMonth;
        this.findSoltByTime(defaultDate, afterDate);
        this.findSoltByAfterTime(defaultDate, afterDate);
      },
      // 按年月查询销售记录
      async findSoltByTime(from, to) {
        const that = this;
        that.$apollo.query({
          query: require('../../graphql/sale/findAllSoldNoteByUpdateTimeBetween.gql'),
          variables: {from: from, to: to},
          fetchPolicy: 'no-cache'
        }).then(data => {
          const findAllSoldNote = data.data.findAllSoldNoteByUpdateTimeBetween;
          that.soldData = [];
          that.sxData = [];
          that.typeTotalSale = 0;
          that.soldData = findAllSoldNote;
          that.saleTotal(that.soldData);
          if (that.soldData.length === 0) {
            that.sxData = [];
            return
          }
          for (let f of that.soldData) {
            if (f.saleNumber > 0) {
              that.$apollo.query({
                query: require('../../graphql/drugs/query/findDurgTypeById.gql'),
                variables: {id: f.durg.typeId},
                fetchPolicy: 'no-cache'
              }).then(data => {
                const findDurgTypeById = data.data.findDurgTypeById;
                that.sxData.push({
                  type: findDurgTypeById.name,
                  sale: f.saleNumber,
                });
                that.typeTotalSale += f.saleNumber
              })
            }
          }
        })
      },
      // 计算上月销售总额
      findSoltByAfterTime(from, to) {
        const that = this;
        let newFrom = '';
        let newTo = from;
        if (from.split('-')[1] === '01') {
          newFrom = (Number(from.split('-')[0]) - 1) + '-12';
        } else {
          let newFromMoth = Number(from.split('-')[1]) - 1;
          newFrom = from.split('-')[0] + '-' + (newFromMoth < 10 ? '0' + newFromMoth : newFromMoth);
        }
        that.$apollo.query({
          query: require('../../graphql/sale/findAllSoldNoteByUpdateTimeBetween.gql'),
          variables: {from: newFrom, to: newTo},
          fetchPolicy: 'no-cache'
        }).then(data => {
          const findAllSoldNote = data.data.findAllSoldNoteByUpdateTimeBetween;
          that.afterTotalSale = 0;
          that.saleRatio = 0;
          for (let i = 0; i < findAllSoldNote.length; i++) {
            if (findAllSoldNote[i].saleNumber > 0) {
              that.afterTotalSale += findAllSoldNote[i].saleNumber * Number(findAllSoldNote[i].durg.price)
            }
          }
          // if (that.totalSale === 0 && that.afterTotalSale === 0) {
          //   that.saleRatio = 0;
          //   return
          // }
          // that.saleRatio = ((that.totalSale - that.afterTotalSale) / that.totalSale) * 100;
        });
      },
      // 药物销售额
      clickBt1() {
        this.showChart1 = true;
        this.showChart2 = false;
        this.showChart3 = false;
        this.bt1 = false;
        this.bt2 = true;
        this.bt3 = true;
      },
      // 药物销量
      clickBt2() {
        this.showChart1 = false;
        this.showChart2 = true;
        this.showChart3 = false;
        this.bt1 = true;
        this.bt2 = false;
        this.bt3 = true;
      },
      // 药物分布
      clickBt3() {
        this.showChart1 = false;
        this.showChart2 = false;
        this.showChart3 = true;
        this.bt1 = true;
        this.bt2 = true;
        this.bt3 = false;
      },
      // 选择年
      changeYear(e) {
        const that = this;
        this.year = e;
        that.xArr = [];
        // 计算当月天数
        let dayTotal = that.mGetDate(Number(that.year), that.month == '' ? that.defaultMonth : Number(that.month));
        for (let d = 1; d <= dayTotal; d++) {
          that.xArr.push(String(d))
        }
        // 计算选择年月的销量
        let nowMonth = that.month == '' ? '0' + that.defaultMonth : that.month
        let lastMonth = Number(nowMonth) + 1;
        if (nowMonth == 12) {
          that.findSoltByTime(that.year + '-' + nowMonth, (Number(that.year) + 1) + '-01');
          that.findSoltByAfterTime(that.year + '-' + nowMonth, (Number(that.year) + 1) + '-01');
          return
        }
        that.findSoltByTime(that.year + '-' + nowMonth, that.year + '-' + (lastMonth < 10 ? '0' + lastMonth : lastMonth + 1));
        that.findSoltByAfterTime(that.year + '-' + nowMonth, that.year + '-' + (lastMonth < 10 ? '0' + lastMonth : lastMonth + 1));
      },
      // 选择月
      changeMonth(e) {
        const that = this;
        that.month = e;
        if (that.month < 10) {
          that.month = "0" + e;
        }
        that.xArr = [];
        // 计算当月天数
        let dayTotal = that.mGetDate(that.year == '' ? that.defaultYear : Number(that.year), Number(that.month));
        for (let d = 1; d <= dayTotal; d++) {
          that.xArr.push(String(d))
        }
        // 计算选择年月的销量
        let nowYear = that.year == '' ? that.defaultYear : that.year;
        let lastMonth = Number(that.month) + 1;
        if (that.month == 12) {
          that.findSoltByTime(nowYear + '-' + that.month, (Number(nowYear) + 1) + '-01');
          that.findSoltByAfterTime(nowYear + '-' + that.month, (Number(nowYear) + 1) + '-01');
          return
        }
        that.findSoltByTime(nowYear + '-' + that.month, nowYear + '-' + (lastMonth < 10 ? '0' + lastMonth : lastMonth + 1))
        that.findSoltByAfterTime(nowYear + '-' + that.month, nowYear + '-' + (lastMonth < 10 ? '0' + lastMonth : lastMonth + 1))
      },
      // 折线图
      zx() {
        const that = this;
        let data = [];
        const chart = new G2.Chart({
          container: 'chart1',
          forceFit: true,
          height: that.contentHight,
          padding: 'auto'
        });
        // 设置图的数据源
        chart.source(data);
        // 列定义
        chart.scale({
          value: {
            min: 0,
            alias: '销售额(元)'
          },
          day: {
            type: 'cat',
            values: that.xArr,
            alias: '日期',
          }
        });
        chart
          .line()
          .position('day*value')
          .tooltip('day*value');
        chart.point().position('day*value')
          .size(4)
          .shape('circle')
          .style({
            stroke: '#fff',
            lineWidth: 1
          });
        chart.render();
        let newData = [];
        setTimeout(function () {
          let saleList = [];
          let result = {};
          for (let f of that.soldData) {
            if (f.saleNumber > 0) {
              saleList.push({
                updateTime: f.updateTime.substring(8, 10),
                sale: f.saleNumber * Number(f.durg.price)
              })
            }
          }
          saleList.forEach(item => {
            if (result[item.updateTime]) {
              result[item.updateTime] += item.sale
            } else {
              result[item.updateTime] = item.sale
            }
          });
          for (let r in result) {
            newData.push({
              day: Number(r) - 1,
              value: Number(result[r].toFixed(2))
            })
          }
          chart.changeData(newData);
        }, 1000)
      },
      // 柱状图
      zz() {
        const that = this;
        let data = [];
        const chart = new G2.Chart({
          container: 'chart2',
          forceFit: true,
          height: that.contentHight,
          padding: 'auto'
        });
        chart.source(data);
        chart.scale({
          value: {
            tickInterval: 20,
            alias: '销量'
          },
          day: {
            type: 'cat',
            values: that.xArr,
            alias: '日期',
          }
        });
        chart.interval().position('day*value');
        chart.render();
        let newData = [];
        setTimeout(function () {
          let saleList = [];
          let result = {};
          for (let f of that.soldData) {
            if (f.saleNumber > 0) {
              saleList.push({
                updateTime: f.updateTime.substring(8, 10),
                sale: f.saleNumber
              })
            }
          }
          saleList.forEach(item => {
            if (result[item.updateTime]) {
              result[item.updateTime] += item.sale
            } else {
              result[item.updateTime] = item.sale
            }
          });
          for (let r in result) {
            newData.push({
              day: Number(r) - 1,
              value: result[r]
            })
          }
          chart.changeData(newData);
        }, 1000)
      },
      // 扇形图
      sx() {
        const that = this;
        let data = [];
        const chart = new G2.Chart({
          container: 'chart3',
          forceFit: true,
          height: that.contentHight,
          padding: 'auto'
        });
        chart.source(data, {
          percent: {
            formatter: val => {
              val = (val * 100) + '%';
              return val;
            }
          }
        });
        chart.coord('theta', {
          radius: 0.75
        });
        chart.tooltip({
          showTitle: false,
          itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        });
        chart.intervalStack()
          .position('percent')
          .color('type')
          .label('percent', {
            formatter: (val, item) => {
              return item.point.type + ': ' + val;
            }
          })
          .tooltip('type*percent', (type, percent) => {
            percent = percent * 100 + '%';
            return {
              name: type,
              value: percent
            };
          })
          .style({
            lineWidth: 1,
            stroke: '#fff'
          });
        chart.render();
        let newData = [];
        setTimeout(function () {
          let result = {};
          if (that.sxData.length === 0) {
            data = [
              {type: '暂无数据', percent: 1}
            ]
          }
          that.sxData.forEach(item => {
            if (result[item.type]) {
              result[item.type] += item.sale
            } else {
              result[item.type] = item.sale
            }
          });
          for (let r in result) {
            newData.push({
              type: r,
              percent: Number((result[r] / that.typeTotalSale).toFixed(2)),
            })
          }
          chart.changeData(newData);
        }, 1000)
      },
      moment,
    }
  }
</script>

<style scoped>
  .layout-column {
    display: flex;
    flex-direction: column;
    justify-content: space-between
  }
</style>
