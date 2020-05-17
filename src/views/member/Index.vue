<template>
  <div class="width-100-per height-100-per">
    <div class="width-100-per height-100-per bg-color-white padding-10-px">
      <div class="margin-bottom-10-px layout-side-n">
        <a-button @click="addMember" type="primary">
          <a-icon type="plus"/>
          新增
        </a-button>
        <div>
          <a-input-search
            style="width: 300px;"
            placeholder="请输入会员卡号"
            v-model="searchValue"
            enterButton
            @search="searchCard">
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
        :dataSource="memberData">
         <span slot="gender" slot-scope="gender">
          <a-tag v-for="tag in gender" color="blue" :key="tag">
            <template v-if="tag==='0'">
              <a-icon type='man'/> 男
            </template>
             <template v-else>
              <a-icon type='woman'/> 女
            </template>
          </a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <a-icon type="file-search" title="详情" @click="onViewClick(record.id)"/>&nbsp;
          <a-icon type="form" title="修改" @click="onEditClick(record.id)"/>&nbsp;
          <a-icon type="delete" title="删除" class="color-red" @click="onDeleteClick(record.id)"/>
        </span>
      </a-table>
    </div>
    <!--    新增会员表单-->
    <a-modal
      :title="modalTitle"
      :visible="memberVisible"
      @ok="okMember"
      @cancel="cancelMember"
      :centered="centered"
      :footer="footers">
      <template slot="footer">
        <a-button-group>
          <a-button key="back" icon="reload" @click="resetMember">重置</a-button>
          <template v-if="showSubmit">
            <a-button key="submit" icon="check" type="primary" @click="okMember">提交</a-button>
          </template>
          <template v-else>
            <a-button key="update" icon="check" type="primary" @click="updateMember">修改</a-button>
          </template>
        </a-button-group>
      </template>
      <a-form :form="form">
        <a-form-item label="姓名:" :label-col="{ span:7 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入会员姓名" :disabled="disabled" v-decorator="formRules.name"/>
        </a-form-item>
        <a-form-item label="性别:" :label-col="{ span:7 }" :wrapper-col="{ span: 12 }">
          <a-select placeholder="请选择" :disabled="disabled" v-decorator="formRules.gender">
            <a-select-option value="0">男</a-select-option>
            <a-select-option value="1">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="会员卡号:" :label-col="{ span:7 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入会员卡号" :disabled="disabled" v-decorator="formRules.cardNumber"/>
        </a-form-item>
        <a-form-item label="出生日期:" :label-col="{ span:7 }" :wrapper-col="{ span: 12 }">
          <a-date-picker class="width-100-per" :disabled="disabled" v-decorator="formRules.birthday"/>
        </a-form-item>
        <a-form-item label="身份证号:" :label-col="{ span:7 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入身份证号" :disabled="disabled" v-decorator="formRules.idCard"/>
        </a-form-item>
        <a-form-item label="积分:" :label-col="{ span:7 }" :wrapper-col="{ span: 12 }" initialValue="0">
          <a-input placeholder="请录入会员积分" :disabled="disabled" v-decorator="formRules.integral"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import moment from "moment"
  import {availableContentHeight} from "../../lib/utils"
  import {Table, Input, Tag, Divider, Icon, Button, Modal, Form, Select, DatePicker} from 'ant-design-vue'

  const columns = [
    {
      title: '会员卡号',
      dataIndex: 'cardNumber',
      key: 'cardNumber',
      width: '25%',
      scopedSlots: {customRender: 'cardNumber'},
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    }, {
      title: '性别',
      key: 'gender',
      dataIndex: 'gender',
      scopedSlots: {customRender: 'gender'},
      width: '25%',
    }, {
      title: '积分',
      dataIndex: 'integral',
      key: 'integral',
    }, {
      title: '操作',
      key: 'action',
      width: 95,
      scopedSlots: {customRender: 'action'},
    }];

  export default {
    name: "Index",
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
      ASelect: Select,
      ASelectOption: Select.Option,
      ADatePicker: DatePicker,
    },
    data() {
      return {
        columns,
        contentHight: 100,
        disabled: false,
        centered: true,
        memberVisible: false,
        showSubmit: true,
        footers: this.slot,
        loading: false,
        modalTitle: '',
        searchValue: '',
        dateFormat: 'YYYY-MM-DD',
        pagination: {
          showSizeChanger: true,
          defaultPageSize: 10,
          pageSizeOptions: ['2', '5', '10', '20', '50', '100'],
          showTotal: total => `共${total}条数据`
        },
        form: this.$form.createForm(this),
        formData: {
          id: '',
          name: '',
          gender: '',
          cardNumber: '',
          birthday: '',
          idCard: '',
          integral: 0,
        },
        formRules: {
          name: [
            'name',
            {rules: [{required: true, message: '请输入姓名'}]}
          ],
          gender: [
            'gender',
            {
              initialValue: '0',
              rules: [{required: true, message: '请选择性别'}]
            }
          ],
          cardNumber: [
            'cardNumber',
            {rules: [{required: true, message: '请录入卡号'}]}
          ],
          birthday: [
            'birthday',
            {
              initialValue: moment(new Date(), this.dateFormat),
              rules: [{required: true, message: '请输入出生日期'}]
            }
          ],
          idCard: [
            'idCard',
            {
              rules: [{
                required: true,
                message: '请输入身份证号'
              }, {
                pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                message: '格式错误'
              }]
            }
          ],
          integral: [
            'integral',
            {
              initialValue: '0',
              rules: [{pattern: /^(0|\+?[1-9][0-9]*)$/, message: '格式错误'}]
            }
          ]
        },
        memberData: []
      }
    },
    watch: {
      searchValue(val) {
        if (val === "") {
          this.emptySearch()
        }
      }
    },
    mounted() {
      this.contentHight = availableContentHeight(310);
      window.onresize = () => {
        this.contentHight = availableContentHeight(310);
      };
      this.showMember();
    },
    methods: {
      // 展示后端会员数据信息
      async showMember() {
        const that = this;
        that.loading = true;
        await that.$apollo.query({
          query: require('../../graphql/member/query/findAllMember.gql'),
          variables: {},
          fetchPolicy: 'no-cache'
        }).then(data => {
          that.memberData = [];
          that.memberData.push(...data.data.findAllMember);
          that.loading = false;
        }).catch(error => {
          console.log(error);
          that.loading = false;
        });
        console.log(that.memberData)
      },
      // 年龄计算
      // assembly(data) {
      //   let newDate = moment(new Date()).format(this.dateFormat).split('-')[0];
      //   data.map(((item) => {
      //     this.memberData.push(Object.assign({}, item, {age: newDate - item.birthday.split('-')[0]}));
      //   }))
      // },
      // 新增会员
      addMember() {
        this.modalTitle = '新增会员';
        this.memberVisible = true;
        this.footers = this.slot;
        this.showSubmit = true;
      },
      // 新增提交
      okMember() {
        const that = this;
        that.form.validateFieldsAndScroll((err, values) => {
          if (err) {
            that.$message.error("请录入完整的会员信息！")
          } else {
            let formData = {
              name: values.name,
              gender: values.gender,
              cardNumber: values.cardNumber,
              birthday: moment(values.birthday).format(this.dateFormat),
              idCard: values.idCard,
              integral: values.integral,
            };
            that.$apollo.mutate({
              mutation: require('../../graphql/member/mutation/saveMember.gql'),
              variables: {entity: formData}
            }).then((data) => {
              if (data.data.saveMember.code === "CODE_200") {
                that.$message.success("提交成功");
                that.showMember();
                that.memberVisible = false;
                that.resetMember();
              } else {
                that.$message.error(data.data.saveMember.message)
              }
            });
          }
        });
      },
      // 详情
      onViewClick(id) {
        const that = this;
        that.modalTitle = '会员详情';
        that.disabled = true;
        that.footers = null;
        that.$apollo.query({
          query: require('../../graphql/member/query/findMemberById.gql'),
          variables: {id: id},
          fetchPolicy: 'network-only'
        }).then(data => {
          const findMemberById = data.data.findMemberById;
          setTimeout(() => {
            that.form.setFieldsValue({
              name: findMemberById.name,
              birthday: moment(findMemberById.birthday),
              cardNumber: findMemberById.cardNumber,
              gender: findMemberById.gender,
              idCard: findMemberById.idCard,
              integral: findMemberById.integral,
            });
          }, 0);
          that.memberVisible = true;
        }).catch(error => {
          console.log(error)
        });
      },
      // 编辑
      onEditClick(id) {
        const that = this;
        that.modalTitle = '编辑会员';
        that.footers = this.slot;
        that.showSubmit = false;
        that.$apollo.query({
          query: require('../../graphql/member/query/findMemberById.gql'),
          variables: {id: id},
          fetchPolicy: 'network-only'
        }).then(data => {
          const findMemberById = data.data.findMemberById;
          setTimeout(() => {
            that.formData.id = id;
            that.form.setFieldsValue({
              name: findMemberById.name,
              birthday: moment(findMemberById.birthday),
              cardNumber: findMemberById.cardNumber,
              gender: findMemberById.gender,
              idCard: findMemberById.idCard,
              integral: findMemberById.integral,
            });
          }, 0);
          that.memberVisible = true;
        }).catch(error => {
          console.log(error)
        });
      },
      // 编辑提交
      updateMember() {
        const that = this;
        that.form.validateFieldsAndScroll((err, values) => {
          if (err) {
            that.$message.error("请输入正确信息！")
          } else {
            let formData = {
              id: that.formData.id,
              name: values.name,
              gender: values.gender,
              cardNumber: values.cardNumber,
              birthday: moment(values.birthday).format(this.dateFormat),
              idCard: values.idCard,
              integral: values.integral,
            };
            that.$apollo.mutate({
              mutation: require('../../graphql/member/mutation/saveMember.gql'),
              variables: {entity: formData}
            }).then(data => {
              if (data.data.saveMember.code === "CODE_200") {
                that.$message.success("修改成功");
                that.showMember();
                that.resetMember();
                that.memberVisible = false;
              } else {
                console.log(data.data.saveMember);
                that.$message.error(data.data.saveMember.message)
              }
            }).catch(error => {
              console.log(error)
            });
          }
        });
      },
      // 重置表单
      resetMember() {
        this.form.resetFields();
        this.form.id = '';
      },
      // 关闭弹框
      cancelMember() {
        const that = this;
        this.memberVisible = false;
        this.disabled = false;
        setTimeout(() => {
          that.resetMember()
        }, 200)
      },
      // 删除
      onDeleteClick(id) {
        const that = this;
        this.$confirm({
          title: "删除该会员",
          content: "是否删除该会员?",
          onOk() {
            that.$apollo.mutate({
              mutation: require('../../graphql/member/mutation/deleteMemberById.gql'),
              variables: {id: id}
            }).then(data => {
              if (data.data.deleteMemberById.code === "CODE_200") {
                that.$message.success("删除成功");
                that.showMember();
              }
            }).catch(error => {
              console.log(error)
            })
          },
          onCancel() {
          }
        })
      },
      // 搜索卡号
      searchCard() {
        const that = this;
        if (that.searchValue === "") {
          that.$message.warning("请输入要搜索的卡号")
        } else {
          that.loading = true;
          that.$apollo.query({
            query: require('../../graphql/member/query/findMemberByCardNumber.gql'),
            variables: {cardNumber: that.searchValue},
            fetchPolicy: 'no-cache'
          }).then(data => {
            that.memberData = [];
            that.memberData.push(...data.data.findMemberByCardNumber);
            that.loading = false;
          })
        }
      },
      // 清空搜索框
      emptySearch() {
        this.searchValue = "";
        this.showMember();
      },
      moment,
    }
  }
</script>

<style scoped>

</style>
