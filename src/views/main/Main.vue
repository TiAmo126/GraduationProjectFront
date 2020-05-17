<template>
  <div class="width-100-per height-100-per">
    <a-row :gutter="16">
      <a-col :span="7">
        <a-card :hoverable=true :loading=cardLoading style="border-radius: 9px">
          <div class="width-100-per layout-side" style="height: 200px">
            <div class="width-40-per height-100-per">
              <img :src="formData.avatarBase" class="width-100-per height-100-per">
            </div>
            <div class="height-100-per"
                 style="width: 56%;display: flex;flex-direction: column;justify-content: space-between">
              <span>员工账号：{{formData.cardNumber}}</span>
              <span>姓名：{{formData.name}}</span>
              <span>性别：{{formData.gender === '0' ? '男' : '女'}}</span>
              <span>身份：{{formData.role === '0' ? '管理员' : '店员'}}</span>
              <span>出生日期：{{formData.birthday}}</span>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="17">
        <div class="width-100-per layout-side-n padding-10-px bg-color-white" style="border-radius: 9px;height: 248px;">
          <div class="height-100-per" style="width: calc(100% - 228px)" id="chart1"></div>
          <div class="height-100-per" style="width: 228px" id="chart2"></div>
        </div>
      </a-col>
    </a-row>
    <a-row id="bang-card" :gutter="16" class="margin-top-10-px">
      <a-col :span="8">
        <a-card :hoverable=true :loading=cardLoading style="border-radius: 9px">
          <a-list :dataSource="dataList1">
            <a-list-item slot="renderItem" slot-scope="item,index">
              <a-list-item-meta :description="item.name">
                <img :src="user" style="height: 20px"  slot="avatar">
<!--                <a-avatar icon="user" slot="avatar"></a-avatar>-->
              </a-list-item-meta>
              <img v-if="index+1===1" :src="jin">
              <img v-else-if="index+1===2" :src="yin">
              <img v-else-if="index+1===3" :src="tong">
              <img v-else :src="jiang" style="height: 20px">
            </a-list-item>
            <div slot="header" class="card-font">
              <img :src="bangLH" style="height: 32px;margin-right: 10px">
              会员积分排名
              <a-tooltip>
                <template slot="title">
                  <div style="font-size: 12px">
                    会员积分前五名
                  </div>
                </template>
                <a-icon type="question-circle"/>
              </a-tooltip>
            </div>
          </a-list>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card :hoverable=true :loading=cardLoading style="border-radius: 9px">
          <a-list :dataSource="dataList2">
            <a-list-item slot="renderItem" slot-scope="item,index">
              <a-list-item-meta :description="item.name">
                <img :src="drug" style="height: 20px"  slot="avatar">
              </a-list-item-meta>
              <img v-if="index+1===1" :src="jin">
              <img v-else-if="index+1===2" :src="yin">
              <img v-else-if="index+1===3" :src="tong">
              <img v-else :src="jiang" style="height: 20px">
            </a-list-item>
            <div slot="header" class="card-font">
              <img :src="bangXX" style="height: 32px;margin-right: 10px">
              药品销量排名
              <a-tooltip>
                <template slot="title">
                  <div style="font-size: 12px">
                    药品销量前五名
                  </div>
                </template>
                <a-icon type="question-circle"/>
              </a-tooltip>
            </div>
          </a-list>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card :hoverable=true :loading=cardLoading style="border-radius: 9px">
          <a-list :dataSource="dataList3">
            <a-list-item slot="renderItem" slot-scope="item,index">
              <a-list-item-meta :description="item.name">
                <img :src="drug" style="height: 20px"  slot="avatar">
              </a-list-item-meta>
              <img v-if="index+1===1" :src="jin">
              <img v-else-if="index+1===2" :src="yin">
              <img v-else-if="index+1===3" :src="tong">
              <img v-else :src="jiang" style="height: 20px">
            </a-list-item>
            <div slot="header" class="card-font">
              <img :src="bangJB" style="height: 32px;margin-right: 10px">
              药品销售额排名
              <a-tooltip>
                <template slot="title">
                  <div style="font-size: 12px">
                    药品销售额前五名
                  </div>
                </template>
                <a-icon type="question-circle"/>
              </a-tooltip>
            </div>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import G2 from '@antv/g2'
  import {Row, Col, Card, List, Avatar, Tooltip, Icon} from "ant-design-vue"

  export default {
    name: "Main",
    components: {
      ARow: Row,
      ACol: Col,
      ACard: Card,
      AIcon: Icon,
      // AAvatar: Avatar,
      ATooltip: Tooltip,
      AList: List,
      AListItem: List.Item,
      AListItemMeta: List.Item.Meta,
    },
    data() {
      return {
        chartData1: [],
        chartData2: [],
        cardLoading: false,
        formData: null,
        bangLH: require('../../assets/img/bang_lh.png'),
        bangXX: require('../../assets/img/bang_xx.png'),
        bangJB: require('../../assets/img/bang_jb.png'),
        jin: require('../../assets/img/jin.png'),
        yin: require('../../assets/img/yin.png'),
        tong: require('../../assets/img/tong.png'),
        jiang: require('../../assets/img/jiang.png'),
        user: require('../../assets/img/user.png'),
        drug: require('../../assets/img/drug.png'),
        dataList1: [],
        dataList2: [],
        dataList3: [],
      }
    },
    created() {
      this.formData = JSON.parse(this.$store.getters.currentUser);
    },
    watch: {
      chartData1() {
        this.initChart1();
      },
      chartData2() {
        this.initChart2();
      },
    },
    mounted() {
      this.initNowYearSale();
      this.initMember();
      this.initDurgSale();
      // this.initChart1();
      // this.initChart2();
    },
    methods: {
      // 组装今年的销售额
      initNowYearSale() {
        const that = this;
        let nowYear = new Date().getFullYear();
        let lastYear = String(Number(nowYear) + 1);
        that.$apollo.query({
          query: require('../../graphql/sale/findAllSoldNoteByUpdateTimeBetween.gql'),
          variables: {from: nowYear, to: lastYear},
          fetchPolicy: 'no-cache'
        }).then(async data => {
          let findAllSoldNoteByUpdateTimeBetween = data.data.findAllSoldNoteByUpdateTimeBetween;
          let saleList = [];
          let typeList = [];
          let data1 = [];
          let data2 = [];
          let result = {};
          let result2 = {};
          let typeTotalSale = 0;
          // 组装图表1数据
          for (let f of findAllSoldNoteByUpdateTimeBetween) {
            if (f.saleNumber > 0) {
              saleList.push({
                updateTime: f.updateTime.split('-')[1],
                sale: f.saleNumber * Number(f.durg.price)
              });
              that.$apollo.query({
                query: require('../../graphql/drugs/query/findDurgTypeById.gql'),
                variables: {id: f.durg.typeId},
                fetchPolicy: 'no-cache'
              }).then(data => {
                const findDurgTypeById = data.data.findDurgTypeById;
                // 组装图表2的数据
                typeList.push({
                  type: findDurgTypeById.name,
                  sale: f.saleNumber,
                });
                typeTotalSale += f.saleNumber
              })
            }
          }
          // 组装图表2数据
          await setTimeout(() => {
            typeList.forEach(item => {
              if (result2[item.type]) {
                result2[item.type] += item.sale
              } else {
                result2[item.type] = item.sale
              }
            });
            for (let r in result2) {
              data2.push({
                type: r,
                percent: Number((result2[r] / typeTotalSale).toFixed(2)),
                count: result2[r]
              })
            }
            that.chartData2 = data2;
          }, 500);
          // 组装图表1数据
          saleList.forEach(item => {
            if (result[item.updateTime]) {
              result[item.updateTime] += item.sale
            } else {
              result[item.updateTime] = item.sale
            }
          });
          for (let r in result) {
            data1.push({
              month: Number(r) - 1,
              value: Number(result[r].toFixed(2))
            })
          }
          that.chartData1 = data1;
        });
      },
      // 初始化会员排名
      initMember() {
        const that = this;
        that.cardLoading = true;
        that.$apollo.query({
          query: require('../../graphql/member/query/findAllMember.gql'),
          variables: {},
          fetchPolicy: 'no-cache'
        }).then(data => {
          const findAllMember = data.data.findAllMember;
          let data1 = [];
          data1.push(...findAllMember);
          data1.sort(function (a, b) {
            return b.integral - a.integral
          });
          that.dataList1 = data1.slice(0, 5);
          that.cardLoading = false;
        }).catch(err => {
          console.log(err)
        })
      },
      // 初始化药物销量排名
      initDurgSale() {
        const that = this;
        that.cardLoading = true;
        that.$apollo.query({
          query: require('../../graphql/sale/findAllSoldNote.gql'),
          variables: {page: {page: 0}},
          fetchPolicy: 'no-cache'
        }).then(data => {
          const findAllSoldNote = data.data.findAllSoldNote;
          let saleList = [];
          let data2 = [];
          let data3 = [];
          let result = {};
          let result2 = {};
          for (let f of findAllSoldNote) {
            if (f.saleNumber > 0) {
              saleList.push({
                name: f.durg.name,
                saleNumber: f.saleNumber,
                saleTotal: f.saleNumber * Number(f.durg.price)
              })
            }
          }
          // 找出同类销量
          saleList.forEach(item => {
            if (result[item.name]) {
              result[item.name] += item.saleNumber;
            } else {
              result[item.name] = item.saleNumber;
            }
          });
          for (let d in result) {
            data2.push({
              name: d,
              saleNumber: result[d]
            })
          }
          data2.sort(function (a, b) {
            return b.saleNumber - a.saleNumber
          });
          that.dataList2 = data2.slice(0, 5);
          // 找出同类销售额
          saleList.forEach(item => {
            if (result2[item.name]) {
              result2[item.name] += item.saleTotal;
            } else {
              result2[item.name] = item.saleTotal;
            }
          });
          for (let d in result2) {
            data3.push({
              name: d,
              saleTotal: result2[d]
            })
          }
          data3.sort(function (a, b) {
            return b.saleTotal - a.saleTotal
          });
          that.dataList3 = data3.slice(0, 5);
          that.cardLoading = false;
        }).catch(err => {
          console.log(err)
        })
      },
      // 初始化图表1
      initChart1() {
        let chart = new G2.Chart({
          container: 'chart1',
          forceFit: true,
          height: 228,
          padding: 'auto'
        });
        chart.source(this.chartData1);
        chart.scale({
          value: {
            min: 0,
            alias: '销售额(元)'
          },
          month: {
            type: 'cat',
            values: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            alias: '月份'
          }
        });
        chart.axis('value', {
          title: {
            position: 'end',
            textStyle: {
              textAlign: 'end', // 文本对齐方向，可取值为： start middle end
              fill: '#000000', // 文本的颜色
              fontSize: '12', // 文本大小
            },
          }
        });
        chart.tooltip({
          showTitle: false,
          crosshairs: {
            type: 'line'
          }
        });
        chart
          .line()
          .position('month*value')
          .tooltip('month*value');
        chart.point().position('month*value')
          .size(4)
          .shape('circle')
          .style({
            stroke: '#fff',
            lineWidth: 1
          });
        chart.render();
      },
      // 初始化图表2
      initChart2() {
        let chart = new G2.Chart({
          container: 'chart2',
          forceFit: true,
          height: 228,
          padding: 'auto'
        });
        chart.source(this.chartData2, {
          percent: {
            formatter: val => {
              val = (val * 100) + '%';
              return val;
            }
          }
        });
        chart.coord('theta');
        chart.tooltip({
          showTitle: false
        });
        chart.intervalStack()
          .position('percent')
          .color('type')
          .label('type', {
            offset: -40,
            // autoRotate: false,
            textStyle: {
              textAlign: 'center',
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, .45)',
              fill: '#fff'
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
      }
    }
  }
</script>

<style>
  #bang-card .ant-card-body {
    padding: 12px 24px !important;
  }

  .ant-list-header {
    padding: 0 0 8px 0 !important;
  }

  #bang-card .card-font {
    line-height: 32px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    font-weight: bolder;
  }
</style>
