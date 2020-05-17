<template>
  <div class="width-100-per height-100-per padding-10-px">
    <div ref="topButton" class="margin-bottom-10-px layout-side-n">
      <a-button @click="addDrugs" type="primary">
        <a-icon type="plus"/>
        新增
      </a-button>
      <div>
        <a-input-search
          style="width: 300px;"
          placeholder="请输入药品名称"
          v-model="searchValue"
          enterButton
          @search="searchName">
          <a-icon
            v-show="searchValue"
            slot="suffix"
            type="close-circle"
            style="margin-right: 10px;cursor: pointer"
            @click="emptySearch"
          />
        </a-input-search>
      </div>
    </div>
    <!--      会员表格-->
    <a-table
      :scroll="{ y: contentHight }"
      :rowKey="record => record.id"
      :pagination="pagination"
      :loading="loading"
      :columns="columns"
      :dataSource="drugsData">
         <span slot="price" slot-scope="price">
          <a-tag color="blue">
            <template>￥{{price}}</template>
          </a-tag>
        </span>
      <span slot="action" slot-scope="text, record">
        <a-icon type="file-search" title="详情" @click="onViewClick(record.id)"/>&nbsp;
        <a-icon type="form" title="修改" @click="onEditClick(record.id)"/>&nbsp;
        <a-icon type="delete" title="删除" class="color-red" @click="onDeleteClick(record.id)"/>
      </span>
    </a-table>
    <!--    新增药品表单-->
    <a-modal
      :title="modalTitle"
      :visible="drugsVisible"
      @ok="okDrugs"
      @cancel="cancelDrugs"
      :centered="centered"
      :footer="footers">
      <template slot="footer">
        <a-button-group>
          <a-button key="back" icon="reload" @click="resetDrugs">重置</a-button>
          <template v-if="showSubmit">
            <a-button key="submit" icon="check" type="primary" @click="okDrugs">提交</a-button>
          </template>
          <template v-else>
            <a-button key="update" icon="check" type="primary" @click="updateDrugs">修改</a-button>
          </template>
        </a-button-group>
      </template>
      <a-form :form="form">
        <a-form-item label="名称:" :label-col="{ span:7 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入药品名称" :disabled="disabled" v-decorator="formRules.name"/>
        </a-form-item>
        <a-form-item label="价格:" :label-col="{ span:7 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入价格" :disabled="disabled" v-decorator="formRules.price"/>
        </a-form-item>
        <a-form-item label="库存:" :label-col="{ span:7 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请录入库存" :disabled="disabled" v-decorator="formRules.stock"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>

</template>

<script>
  import {Table, Input, Tag, Divider, Icon, Button, Modal, Form} from 'ant-design-vue'
  import {availableContentHeight} from "../../lib/utils"

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    }, {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      width: '25%',
    }, {
      title: '价格',
      key: 'price',
      dataIndex: 'price',
      scopedSlots: {customRender: 'price'},
    }, {
      title: '操作',
      key: 'action',
      width: 95,
      scopedSlots: {customRender: 'action'},
    }];

  export default {
    name: "Drugs",
    components: {
      AInput: Input,
      AInputSearch: Input.Search,
      ATable: Table,
      ATag: Tag,
      // ADivider: Divider,
      AButton: Button,
      AButtonGroup: Button.Group,
      AIcon: Icon,
      AModal: Modal,
      AForm: Form,
      AFormItem: Form.Item,
    },
    data() {
      return {
        columns,
        // 左侧传来的分类id
        contentHight:100,
        leftTypeId: '',
        disabled: false,
        centered: true,
        drugsVisible: false,
        showSubmit: true,
        footers: this.slot,
        loading: false,
        modalTitle: '',
        searchValue: '',
        drugsData: [],
        formData: {
          id:'',
          typeId:'',
        },
        pagination: {
          showSizeChanger: true,
          defaultPageSize: 10,
          pageSizeOptions: ['2', '5', '10', '20', '50', '100'],
          showTotal: total => `共${total}条数据`
        },
        form: this.$form.createForm(this),
        formRules: {
          name: [
            'name',
            {rules: [{required: true, message: '请输入药品名称'}]}
          ],
          price: [
            'price',
            {
              initialValue: 1.0,
              rules: [{required: true, message: '请输入价格'},
                {pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, message: '格式错误'}]
            }
          ],
          stock: [
            'stock',
            {
              initialValue: 0,
              rules: [{required: true, message: '请录入库存'},
                {pattern: /^(0|\+?[1-9][0-9]*)$/, message: '格式错误'}]
            }
          ]
        },
      }
    },
    computed: {

    },
    watch: {
      searchValue(val) {
        if (val === "") {
          this.emptySearch()
        }
      },
      $route(to, from) {
        this.leftTypeId = to.query.id === undefined ? "1" : to.query.id;
        this.showDrugs();
      },
    },
    mounted() {
      this.contentHight = availableContentHeight(310);
      window.onresize = () => {
        this.contentHight = availableContentHeight(310);
      };
      this.showDrugs();
    },
    methods: {
      // 展示对应的分类下的药品信息
      async showDrugs() {
        const that = this;
        that.loading = true;
        that.$apollo.query({
          query: require('../../graphql/drugs/query/findDurgByTypeId.gql'),
          variables: {id: that.leftTypeId === "1" ? null : that.leftTypeId},
          fetchPolicy: 'no-cache'
        }).then(data => {
          that.drugsData = [];
          that.drugsData = data.data.findDurgByTypeId;
          that.loading = false;
        }).catch(error => {
          console.log(error)
        })
      },
      // 搜索药品名
      searchName() {
        const that = this;
        if (that.searchValue === "") {
          that.$message.warning("请输入要搜索的药品名")
        } else {
          that.loading = true;
          that.$apollo.query({
            query: require('../../graphql/drugs/query/findDurgByName.gql'),
            variables: {name:that.searchValue},
            fetchPolicy: 'no-cache',
          }).then(data => {
            const findDurgByName = data.data.findDurgByName;
            that.drugsData = [];
            that.drugsData = findDurgByName;
            that.loading = false;
          })
        }
      },
      // 重置表单
      resetDrugs() {
        const that = this;
        setTimeout(function () {
          that.form.resetFields();
        },200);
      },
      // 详情
      onViewClick(id) {
        const that = this;
        that.modalTitle = '药品详情';
        that.disabled = true;
        that.footers = null;
        that.$apollo.query({
          query: require('../../graphql/drugs/query/findDurgById.gql'),
          variables: {id: id},
          fetchPolicy: 'network-only'
        }).then(data => {
          const findDurgById = data.data.findDurgById;
          setTimeout(() => {
            that.form.setFieldsValue({
              name:findDurgById.name,
              price: findDurgById.price,
              stock: findDurgById.stock,
            });
          }, 0);
          that.drugsVisible = true;
        }).catch(error => {
          console.log(error)
        });
      },
      // 新增药品
      addDrugs() {
        const that = this;
        if (that.leftTypeId === "1" || that.leftTypeId === "") {
          that.$message.error("请选择药品分类（总览下不可添加）");
          return;
        }
        that.modalTitle = '新增药品';
        that.drugsVisible = true;
        that.footers = this.slot;
        that.showSubmit = true;
      },
      // 新增提交
      okDrugs() {
        const that = this;
        that.form.validateFieldsAndScroll((err, values) => {
          if (err) {
            that.$message.error("请填写完整信息！")
          } else {
            let formData = {
              name: values.name,
              typeId: that.leftTypeId,
              price: values.price,
              stock: values.stock,
            };
            that.$apollo.mutate({
              mutation: require('../../graphql/drugs/mutation/saveDurg.gql'),
              variables: {entity: formData}
            }).then(data => {
              if (data.data.saveDurg.code === "CODE_200") {
                that.$message.success("提交成功");
                that.drugsVisible = false;
                that.showDrugs();
                that.resetDrugs();
              } else {
                that.$message.success("提交失败");
              }
            });
          }
        });
      },
      // 编辑
      onEditClick(id) {
        const that = this;
        that.modalTitle = '编辑药品';
        that.footers = that.slot;
        that.showSubmit = false;
        that.$apollo.query({
          query: require('../../graphql/drugs/query/findDurgById.gql'),
          variables: {id: id},
          fetchPolicy: 'network-only'
        }).then(data => {
          const findDurgById = data.data.findDurgById;
          setTimeout(() => {
            that.formData.id = findDurgById.id;
            that.formData.typeId = findDurgById.typeId;
            that.form.setFieldsValue({
              name:findDurgById.name,
              price: findDurgById.price,
              stock: findDurgById.stock,
            });
          }, 0);
          that.drugsVisible = true;
        }).catch(error => {
          console.log(error)
        });
      },
      // 编辑提交
      updateDrugs() {
        const that = this;
        that.form.validateFieldsAndScroll((err, values) => {
          if (err) {
            that.$message.error("请输入正确信息！")
          } else {
            let formData = {
              id: that.formData.id,
              typeId: that.formData.typeId,
              name:values.name,
              price: values.price,
              stock: values.stock,
            };
            that.$apollo.mutate({
              mutation: require('../../graphql/drugs/mutation/updateDurg.gql'),
              variables: {entity: formData}
            }).then(data => {
              if (data.data.updateDurg.code === "CODE_200") {
                that.$message.success("提交成功");
                that.showDrugs();
                that.drugsVisible = false;
                that.resetDrugs();
              } else {
                that.$message.error("提交失败")
              }
            }).catch(error => {
              console.log(error)
            });
          }
        });
      },
      // 删除
      onDeleteClick(id) {
        const that = this;
        this.$confirm({
          title: "删除此药品",
          content: "是否删除此药品?",
          onOk() {
            that.$apollo.mutate({
              mutation: require('../../graphql/drugs/mutation/deleteDurg.gql'),
              variables: {id: id}
            }).then(data => {
              if (data.data.deleteDurg.code === "CODE_200") {
                that.$message.success("删除成功");
                that.showDrugs();
              }
            }).catch(error => {
              console.log(error)
            })
          },
          onCancel() {
          }
        })
      },
      // 关闭弹框
      cancelDrugs() {
        const that = this;
        this.drugsVisible = false;
        this.disabled = false;
        setTimeout(() => {
          that.resetDrugs();
        },200)
      },
      // 清空搜索框
      emptySearch() {
        this.searchValue = "";
        this.showDrugs();
      },
    }
  }
</script>

<style scoped>

</style>
