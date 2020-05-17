<template>
  <div class="width-100-per height-100-per bg-color-white padding-10-px overflow-auto">
    <div class="upload" @click="exportList" title="导出记录">
      <a-icon type="upload" style="line-height: 50px;font-size: 24px;color: #FFFFFF"></a-icon>
    </div>
    <a-list
      itemLayout="horizontal"
      :dataSource="saleData"
      :bordered="bordered"
      :loading="loading">
      <a-list-item slot="renderItem" slot-scope="item">
        <template v-if="item.saleNumber > 0">
          <a-list-item-meta :description="`${item.durg.name}售出${item.saleNumber}份。`">
            <span slot="title">{{item.updateTime}}</span>
          </a-list-item-meta>
          <a-icon style="font-size: 24px;color: darkgreen" type="smile"/>
        </template>
        <template v-else>
          <a-list-item-meta :description="`${item.durg.name}补货${-(item.saleNumber)}份。`">
            <span slot="title">{{item.updateTime}}</span>
          </a-list-item-meta>
          <a-icon style="font-size: 24px;color: #ff0400" type="smile"/>
        </template>

      </a-list-item>
    </a-list>
  </div>
</template>

<script>
  import moment from 'moment'
  import {List, Icon, Button} from "ant-design-vue"

  export default {
    name: "Index",
    components: {
      AList: List,
      AListItem: List.Item,
      AListItemMeta: List.Item.Meta,
      AIcon: Icon,
      // AButton: Button,
    },
    data() {
      return {
        loading: false,
        bordered: true,
        saleData: [],
      }
    },
    mounted() {
      this.showSale()
    },
    methods: {
      moment,
      // 展示所有销量记录
      showSale() {
        const that = this;
        that.loading = true;
        that.$apollo.query({
          query: require('../../graphql/sale/findAllSoldNote.gql'),
          variables: {page: {page: 0}},
          fetchPolicy: 'no-cache'
        }).then(data => {
          const findAllSoldNote = data.data.findAllSoldNote;
          that.saleData = findAllSoldNote;
          that.loading = false;
        })
      },
      //组装Excel数据
      assembleExcelData(obj) {
        const that = this;
        let list = [];
        for (let o of obj) {
          list.push({
            dateTime: that.moment(o.updateTime).format('YYYY-MM-DD'),
            durgName: o.durg.name,
            durgPrice: o.durg.price,
            saleNumber: o.saleNumber > 0 ? '+' + o.saleNumber : o.saleNumber
          })
        }
        return list;
      },
      //导出记录
      exportList() {
        const that = this;
        require.ensure([], () => {
          const {export_json_to_excel} = require('../../lib/excel/Export2Excel');
          let list = that.assembleExcelData(that.saleData);
          const saleExcelData = list.map(
            v => ['dateTime', 'durgName', 'durgPrice', 'saleNumber'].map(
              j => v[j]
            ));
          export_json_to_excel(['时间', '药品名', '药品价格', '卖出(+)/补货(-)'], saleExcelData, '销售记录表')
        })
      },
    }
  }
</script>

<style scoped>
  .upload {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #409dff;
    text-align: center;
    position: absolute;
    bottom: 45px;
    left: 50%;
    z-index: 99999;
    cursor: pointer;
  }

  .upload:hover {
    background: #ff8231;
  }
</style>
